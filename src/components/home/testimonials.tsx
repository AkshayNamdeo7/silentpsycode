"use client";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";

const testimonials = [
  {
    quote: "The most polished book marketplace I've used in years — fast, elegant and inspiring.",
    author: "Ananya Gupta",
    role: "Entrepreneur",
  },
  {
    quote: "A beautifully dark interface with very smart book discovery and flawless checkout.",
    author: "Rahul Mehta",
    role: "Product Designer",
  },
  {
    quote: "I found more premium reads in a single session than on any other platform.",
    author: "Simran Kaur",
    role: "Literary Curator",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Testimonials"
        title="Readers trust the marketplace for premium recommendations."
        description="High ratings from avid readers and creators who love the modern, high-end experience."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.author}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.75)]"
          >
            <p className="text-lg leading-8 text-slate-200">“{item.quote}”</p>
            <div className="mt-8">
              <p className="font-semibold text-white">{item.author}</p>
              <p className="mt-1 text-sm text-slate-400">{item.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

