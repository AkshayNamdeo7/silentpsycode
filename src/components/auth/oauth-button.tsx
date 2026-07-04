"use client";

import { LucideIcon } from "lucide-react";
import Button from "@/components/ui/button";
import { supabase, isSupabaseClientConfigured } from "@/lib/supabase/client";

interface OAuthButtonProps {
  label: string;
  icon: LucideIcon;
}

export default function OAuthButton({
  label,
  icon: Icon,
}: OAuthButtonProps) {
  const handleGoogleLogin = async () => {
    if (!isSupabaseClientConfigured) {
      alert(
        "Supabase is not configured. Please add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Button
      variant="secondary"
      className="w-full gap-3 rounded-full px-5 py-4 text-sm font-semibold sm:text-base"
      onClick={handleGoogleLogin}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Button>
  );
}