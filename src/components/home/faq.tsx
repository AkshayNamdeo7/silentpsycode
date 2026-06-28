"use client";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";

const faqs = [
  {
    question: "How fast can I receive my books?",
    answer: "Most orders ship within 24 hours, and digital titles are delivered instantly after checkout.",
  },
  {
    question: "Can I sell my used books here?",
    answer: "Yes. Our marketplace supports easy listings for used and collectible books with transparent pricing.",
  },
  {
    question: "Do you offer recommendations?",
    answer: "Absolutely — our curated collections and trending recommendations help you find the right book quickly.",
  },
];

export default function FAQ() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <SectionTitle
        eyebrow="FAQ"
        title="Questions answered for premium book lovers."
        description="Everything you need to know about browsing, buying, selling and discovering exceptional reads."
      />

      <div className="mt-12 space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.65)]"
          >
            <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

