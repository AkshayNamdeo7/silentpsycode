"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchMarketplaceStats } from "@/lib/books";

export default function Stats() {
  const [stats, setStats] = useState<{ value: string; label: string; accent: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchMarketplaceStats()
      .then((result) => {
        if (cancelled || !result) return;
        const list = [
          {
            value: result.bookCount.toLocaleString("en-IN"),
            label: "Live book listings",
            accent: "bg-sky-500/10 text-sky-300",
          },
          {
            value: result.cityCount.toLocaleString("en-IN"),
            label: "Cities with listings",
            accent: "bg-fuchsia-500/10 text-fuchsia-300",
          },
          {
            value: result.categoryCount.toLocaleString("en-IN"),
            label: "Categories",
            accent: "bg-emerald-500/10 text-emerald-300",
          },
        ];
        const hasData = result.bookCount > 0 || result.cityCount > 0 || result.categoryCount > 0;
        setStats(hasData ? list : []);
      })
      .catch(() => setStats([]));
    return () => { cancelled = true; };
  }, []);

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.65)] transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-10"
          >
            <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${stat.accent}`}>
              {stat.label}
            </div>
            <p className="mt-6 text-5xl font-semibold text-white sm:text-6xl">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}