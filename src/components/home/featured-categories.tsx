"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";
import { fetchCategoryCounts } from "@/lib/books";

const categories = [
  { name: "Engineering", icon: "📐" },
  { name: "Medical", icon: "🩺" },
  { name: "UPSC", icon: "🏛️" },
  { name: "JEE", icon: "🧮" },
  { name: "NEET", icon: "🧬" },
  { name: "School", icon: "🎒" },
  { name: "Novels", icon: "📚" },
];

export default function FeaturedCategories() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCategoryCounts(categories.map((category) => category.name))
      .then((result) => {
        if (!cancelled) setCounts(result);
      })
      .catch(() => setCounts(null));
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Featured Categories"
        title="Browse by the category you need."
        description="Jump straight into the category that matters for your course or your shelf."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => {
          const count = counts?.[category.name];
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <Link
                href={`/books?category=${encodeURIComponent(category.name)}`}
                className="block rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-300 ease-out sm:p-8"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-2xl">
                  {category.icon}
                </div>
                {typeof count === "number" ? (
                  <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-400">
                    {count.toLocaleString("en-IN")} titles
                  </p>
                ) : null}
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {category.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Explore live listings in {category.name}.
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}