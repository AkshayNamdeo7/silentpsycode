"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import clsx from "clsx";
import { sendPasswordResetEmail } from "@/lib/auth";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = "Reset Password | Silent Psycode";
  }, []);

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState(true);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const result = await sendPasswordResetEmail(email);
      setStatusMessage(result.message ?? "Password reset request accepted.");
      setStatusSuccess(result.success ?? false);
    } else {
      setStatusMessage(null);
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
          title="Reset password"
          subtitle="Recover your account"
          footer={
            <p className="mt-6 text-center text-sm text-slate-400">
              Remembered your password?{' '}
              <Link href="/login" className="text-sky-300 hover:text-sky-200">
                Sign in
              </Link>
            </p>
          }
        >
          <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-slate-400">
            Enter your email address and we’ll send a secure password reset link to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email ? <p className="text-sm text-rose-400">{errors.email}</p> : null}
            </div>

            <Button type="submit" className="w-full">
              Send reset link
            </Button>

            {statusMessage ? (
              <p className={clsx("rounded-3xl border px-4 py-3 text-sm", statusSuccess ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200" : "border-rose-500/20 bg-rose-500/10 text-rose-200")}>
                {statusMessage}
              </p>
            ) : null}
          </form>
        </AuthCard>
      </motion.div>
    </main>
  );
}
