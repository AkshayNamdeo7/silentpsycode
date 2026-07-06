"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";
import Button from "@/components/ui/button";

const bestSellers = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    price: "₹350",
    badge: "Top Choice",
  },
  {
    title: "Digital Minimalism",
    author: "Cal Newport",
    price: "₹420",
    badge: "Editor’s Pick",
  },
  {
    title: "Think Again",
    author: "Adam Grant",
    price: "₹490",
    badge: "Must Read",
  },
];

export default function BestSellers() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Best Sellers"
        title="Readers are raving about these premium titles."
        description="High-impact best sellers across business, wellness, and fiction, curated for your next great read."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {bestSellers.map((book, index) => (
          <motion.article
            key={book.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)] transition-transform duration-300 ease-out"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-sky-400/80">
                  {book.badge}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  {book.title}
                </h3>
              </div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-xl text-sky-400">
                📘
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-300">
              {book.author} delivers an immersive and transformative reading experience for the modern reader.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-2xl font-bold text-white">{book.price}</span>
              <Button asChild size="sm" className="w-full sm:w-auto"><Link href="/books">Buy Now</Link></Button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

