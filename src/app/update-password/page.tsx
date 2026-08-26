"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import Button from "@/components/ui/button";
import PasswordToggleInput from "@/components/auth/password-toggle-input";
import clsx from "clsx";
import { supabase, isSupabaseClientConfigured } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Update Password | Silent Psycode";

    async function handleRecovery() {
      if (!isSupabaseClientConfigured) {
        setStatusMessage("Supabase is not configured.");
        setStatusSuccess(false);
        setReady(true);
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          window.history.replaceState(null, "", "/update-password");
          setReady(true);
          return;
        }
      }

      const hash = window.location.hash;
      if (hash && hash.length >= 2) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            setReady(true);
            return;
          }
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setReady(true);
        return;
      }

      setStatusMessage("Invalid reset link. Please request a new one.");
      setStatusSuccess(false);
      setReady(true);
    }

    void handleRecovery();
  }, []);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!password.trim()) {
      nextErrors.password = "Enter a new password.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatusMessage(error.message);
      setStatusSuccess(false);
    } else {
      await supabase.auth.signOut();
      setStatusMessage("Password updated. Redirecting to sign in...");
      setStatusSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-xl"
      >
        <AuthCard
          title="Update password"
          subtitle="Create a new password"
          footer={
            <p className="mt-6 text-center text-sm text-slate-400">
              Remembered your password?{" "}
              <Link href="/login" className="text-sky-300 hover:text-sky-200">
                Sign in
              </Link>
            </p>
          }
        >
          {!ready ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-300 border-t-transparent" />
            </div>
          ) : statusSuccess && statusMessage?.includes("Redirecting") ? (
            <p className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {statusMessage}
            </p>
          ) : !statusSuccess && statusMessage ? (
            <div className="space-y-6">
              <p className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {statusMessage}
              </p>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request a new reset link</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <PasswordToggleInput
                id="password"
                label="New password"
                placeholder="Choose a strong password"
                value={password}
                onChange={setPassword}
                error={errors.password}
              />

              <PasswordToggleInput
                id="confirmPassword"
                label="Confirm password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={errors.confirmPassword}
              />

              <Button type="submit" className="w-full">
                Update password
              </Button>

              {statusMessage ? (
                <p
                  className={clsx(
                    "rounded-3xl border px-4 py-3 text-sm",
                    statusSuccess
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-200"
                  )}
                >
                  {statusMessage}
                </p>
              ) : null}
            </form>
          )}
        </AuthCard>
      </motion.div>
    </main>
  );
}
