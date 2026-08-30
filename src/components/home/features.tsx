"use client";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";

const features = [
  {
    title: "Buy, sell and discover",
    description: "A premium book marketplace built for book lovers who want modern browsing, fair pricing, and seamless checkout.",
  },
  {
    title: "Curated collections",
    description: "Explore collections chosen by experts, authors, and trendsetters for faster discovery and higher-quality reads.",
  },
  {
    title: "Personalized recommendations",
    description: "Find books matched to your interests with smart browsing and curated featured lists.",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <SectionTitle
        eyebrow="Why Choose Us"
        title="A premium experience for modern readers."
        description="Book discovery, buying and community all wrapped in a dark, luxurious marketplace experience."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            whileHover={{ y: -3 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.75)] transition-transform duration-300 ease-out"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-2xl text-sky-300">
              ✓
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

