import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requiresAuth } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return (await requiresAuth(request)) ?? NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sell"],
};
