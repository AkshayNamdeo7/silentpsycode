"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

const categories = [
  "Engineering",
  "Medical",
  "UPSC",
  "JEE",
  "NEET",
  "School",
  "Novels",
];

const stats = [
  {
    label: "Verified Sellers",
    description: "All sellers are vetted to keep every book trusted.",
  },
  {
    label: "Affordable Prices",
    description: "Student-friendly savings on every used textbook.",
  },
  {
    label: "Fast Listing",
    description: "Sell books quickly with a smooth, modern workflow.",
  },
  {
    label: "Secure Marketplace",
    description: "Your transactions and listings are protected end-to-end.",
  },
];

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/books?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/books");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#050816] px-6 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-24"
    >
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-sky-500/15 via-transparent to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_60px_140px_-80px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%)]" />
          <div className="relative space-y-10">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">
                Trusted student marketplace
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
                Buy & Sell Second-Hand Books at Student-Friendly Prices
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
                Save up to 70% by buying used books or earn money by selling books you no longer need.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              className="mx-auto max-w-3xl"
            >
              <form onSubmit={handleSearch} className="rounded-full border border-white/10 bg-slate-900/90 px-5 py-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)] sm:px-6">
                <label htmlFor="search" className="sr-only">
                  Search by book name, author, subject or ISBN
                </label>
                <input
                  id="search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by book name, author, subject or ISBN..."
                  className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                />
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
              className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Button asChild className="w-full sm:w-auto px-8 py-4 text-base">
                <Link href="/books">Buy Books</Link>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto px-8 py-4 text-base">
                <Link href="/sell">Sell Your Books</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
              className="mx-auto max-w-3xl"
            >
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-300/30 hover:bg-slate-900/80"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.8)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                      ✓
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{stat.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{stat.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
