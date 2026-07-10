"use client";

import { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseClientConfigured) {
        setError("Supabase is not configured. Add your environment variables to enable sign in.");
        return;
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (oauthError) {
        console.error(oauthError);
        setError("Failed to start Google sign in. Please try again.");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="secondary"
        className="w-full gap-3 rounded-full px-5 py-4 text-sm font-semibold sm:text-base"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <Icon className="h-5 w-5" />
        {loading ? "Connecting..." : label}
      </Button>
      {error ? <p className="mt-2 text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
