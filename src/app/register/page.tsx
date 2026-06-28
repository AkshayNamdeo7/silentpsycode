"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import Button from "@/components/ui/button";
import OAuthButton from "@/components/auth/oauth-button";
import PasswordToggleInput from "@/components/auth/password-toggle-input";
import Input from "@/components/ui/input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Enter your full name.";
    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password.trim()) {
      nextErrors.password = "Create a secure password.";
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
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
          title="Create account"
          subtitle="Join Silent Psycode"
          footer={
            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-sky-300 hover:text-sky-200">
                Sign in
              </Link>
            </p>
          }
        >
          <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-slate-400">
            Start managing your book collection, sell with confidence, and explore premium book recommendations.
          </p>

          <div className="mt-8 space-y-4">
            <OAuthButton label="Continue with Google" icon={Mail} />

            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              <span className="relative inline-flex justify-center bg-slate-950 px-4 text-sm text-slate-400">
                or sign up with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-200" htmlFor="name">
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                {errors.name ? <p className="text-sm text-rose-400">{errors.name}</p> : null}
              </div>

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
                <PasswordToggleInput
                  id="password"
                  label="Create password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={setPassword}
                  error={errors.password}
                />
              </div>

              <div className="space-y-3">
                <PasswordToggleInput
                  id="confirmPassword"
                  label="Confirm password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  error={errors.confirmPassword}
                />
              </div>

              <Button type="submit" className="w-full">
                Create account
              </Button>

              {submitted ? (
                <p className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Registration form is valid. Backend integration will be added later.
                </p>
              ) : null}
            </form>
          </div>
        </AuthCard>
      </motion.div>
    </main>
  );
}
