"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 p-8 shadow-[0_0_120px_-40px_rgba(14,165,233,0.2)] sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-400/80">Stay in the loop</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Get premium book drops and marketplace updates.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Join our newsletter for curated deals, author drops, and first access to exclusive releases.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubscribe}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.7)]"
          >
            <label className="text-sm font-medium text-slate-300" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
            />
            {subscribed ? (
              <p className="text-sm text-emerald-400">Thanks for subscribing!</p>
            ) : (
              <Button type="submit" className="w-full">Subscribe now</Button>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

