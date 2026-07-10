"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let subscription: { unsubscribe: () => void } | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    async function handleCallback() {
      try {
        const { supabase, isSupabaseClientConfigured } = await import("@/lib/supabase/client");

        if (!isSupabaseClientConfigured) {
          if (active) setError("Supabase is not configured.");
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const next = searchParams?.get("next") || "/dashboard";
          if (active) router.replace(next);
          return;
        }

        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (newSession && active) {
            const next = searchParams?.get("next") || "/dashboard";
            router.replace(next);
          }
        });
        subscription = sub;

        timeout = setTimeout(() => {
          if (active) {
            setError("Authentication timed out. Please try signing in again.");
            sub.unsubscribe();
          }
        }, 10000);
      } catch {
        if (active) setError("An error occurred during authentication.");
      }
    }

    void handleCallback();

    return () => {
      active = false;
      if (timeout) clearTimeout(timeout);
      if (subscription) subscription.unsubscribe();
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-center shadow-[0_40px_120px_-80px_rgba(14,165,233,0.3)]">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-300/80">Authentication error</p>
          <p className="mt-4 text-lg text-slate-200">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-sky-300 border-t-transparent" />
        <p className="text-sm text-slate-400">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}
