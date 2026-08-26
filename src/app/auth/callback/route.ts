import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const upstreamError = searchParams.get("error");
  const upstreamErrorCode = searchParams.get("error_code");
  const upstreamDescription = searchParams.get("error_description");

  if (upstreamError) {
    console.error(
      "[auth/callback] provider error:",
      upstreamError,
      upstreamErrorCode ?? "",
      upstreamDescription ?? ""
    );
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
    }

    if (!error && data.user) {
      const fullName = data.user.user_metadata?.full_name ?? "Student Seller";
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existing) {
        await supabase
          .from("profiles")
          .insert({ id: data.user.id, full_name: fullName })
          .then(() => {}, () => {});
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", "auth_callback_error");
  if (upstreamDescription) {
    loginUrl.searchParams.set("detail", upstreamDescription);
  }
  return NextResponse.redirect(loginUrl);
}
