"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import Button from "@/components/ui/button";
import OAuthButton from "@/components/auth/oauth-button";
import PasswordToggleInput from "@/components/auth/password-toggle-input";
import Input from "@/components/ui/input";
import { signInWithEmail } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Enter your password.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const result = await signInWithEmail(email, password);
      setStatusMessage(result.message ?? "Login request accepted.");
      setSubmitted(result.success);

      if (result.success) {
        const redirectTo = searchParams?.get("redirect") ?? "/dashboard";
        router.push(redirectTo);
      }
    } else {
      setStatusMessage(null);
      setSubmitted(false);
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
          title="Sign in"
          subtitle="Welcome back to Silent Psycode"
          footer={
            <p className="mt-6 text-center text-sm text-slate-400">
              New here?{' '}
              <Link href="/register" className="text-sky-300 hover:text-sky-200">
                Create an account
              </Link>
            </p>
          }
        >
          <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-slate-400">
            Securely access your dashboard, manage listings, and discover premium student reads.
          </p>

          <div className="mt-8 space-y-4">
            <OAuthButton label="Continue with Google" icon={Mail} />

            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <span className="relative inline-flex justify-center bg-slate-950 px-4 text-sm text-slate-400">
                or use your email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-sky-300 hover:text-sky-200">
                    Forgot password?
                  </Link>
                </div>
                <PasswordToggleInput
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={setPassword}
                  error={errors.password}
                />
              </div>

              <Button type="submit" className="w-full">
                Continue
              </Button>

              {statusMessage ? (
                <p className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {statusMessage}
                </p>
              ) : null}
            </form>
          </div>
        </AuthCard>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
