"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050816] px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-xl"
      >
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-[0_40px_120px_-80px_rgba(14,165,233,0.3)]">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Reset password</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Recover your account
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-slate-400">
              Enter your email address and we’ll send a secure password reset link to your inbox.
            </p>
          </div>

          <form className="mt-10 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="email">
                Email address
              </label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Remembered your password?{' '}
          <Link href="/login" className="text-sky-300 hover:text-sky-200">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
