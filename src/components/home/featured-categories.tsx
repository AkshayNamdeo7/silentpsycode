"use client";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";

const categories = [
  { name: "Engineering", books: "2.1K", icon: "📐" },
  { name: "Medical", books: "1.8K", icon: "🩺" },
  { name: "UPSC", books: "940", icon: "🏛️" },
  { name: "Novels", books: "1.5K", icon: "📚" },
];

export default function FeaturedCategories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="Featured Categories"
        title="Discover curated reading paths for every mood."
        description="Explore premium categories crafted for ambitious learners, casual readers, and story lovers alike."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <motion.article
            key={category.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-300 ease-out sm:p-8"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-2xl">
              {category.icon}
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-400">
              {category.books} titles
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              {category.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Premium handpicked books and bestselling collections for focused reading.
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
