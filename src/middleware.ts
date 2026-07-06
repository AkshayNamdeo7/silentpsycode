import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requiresAuth } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return requiresAuth(request) ?? NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sell"],
};
