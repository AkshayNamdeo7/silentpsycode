import { NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "silentpsycode_session";
const protectedRoutePrefixes = ["/dashboard", "/sell"];

export function setAuthCookie() {
  if (typeof document === "undefined") return;
  const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_COOKIE_NAME}=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict${secureFlag}`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict${secureFlag}`;
}

export function requiresAuth(request: NextRequest): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return undefined;
  }

  if (request.cookies.get(AUTH_COOKIE_NAME)?.value) {
    return undefined;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(redirectUrl);
}
