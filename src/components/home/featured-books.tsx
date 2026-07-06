"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";

export default function FeaturedBooks() {
  const books = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      price: "₹499",
      tag: "Best Seller",
      description: "Small changes, remarkable results — a modern business and habit classic.",
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: "₹399",
      tag: "Staff Pick",
      description: "A timeless story of discovery and the power of following your dreams.",
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      price: "₹599",
      tag: "Top Finance",
      description: "A bold guide to financial literacy and life-changing money mindset.",
    },
  ];

  return (
    <section id="books" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Featured books</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Discover handpicked reads with premium value.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          Browse our top curated books across genres, selected for curious readers and ambitious minds.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {books.map((book, index) => (
          <motion.article
            key={book.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)] transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-sky-300">
                {book.tag}
              </span>
              <span className="text-sm font-semibold text-slate-400">{book.price}</span>
            </div>

            <div className="mt-10 flex h-48 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-5xl text-white shadow-inner">
              📚
            </div>

            <h3 className="mt-8 text-2xl font-semibold text-white">{book.title}</h3>
            <p className="mt-3 text-sm text-slate-400">{book.author}</p>
            <p className="mt-6 text-sm leading-7 text-slate-300">{book.description}</p>

            <Button asChild className="mt-8 w-full justify-center"><Link href="/books">View details</Link></Button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
