import { NextRequest, NextResponse } from "next/server";
import { SB_SESSION_COOKIE } from "@/lib/supabase/client";

const protectedRoutePrefixes = ["/dashboard", "/sell"];

function isValidSessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  try {
    const decoded = decodeURIComponent(cookieValue);
    const { t, e } = JSON.parse(decoded);
    if (!t || typeof e !== "number") return false;
    return e > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function requiresAuth(request: NextRequest): NextResponse | undefined {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return undefined;
  }

  const cookieValue = request.cookies.get(SB_SESSION_COOKIE)?.value;
  if (isValidSessionCookie(cookieValue)) {
    return undefined;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login";
  redirectUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(redirectUrl);
}
