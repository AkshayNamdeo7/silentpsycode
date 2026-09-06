"use client";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/section-title";

const faqs = [
  {
    question: "How do I buy a book?",
    answer: "Browse the marketplace, open a listing you like, and use the Call or Email buttons to contact the seller directly and arrange delivery or pickup.",
  },
  {
    question: "How do I sell my books?",
    answer: "Sign in, go to Sell a Book, add photos and details, set a price and publish. Buyers contact you using the details on your listing.",
  },
  {
    question: "Do you handle payments or delivery?",
    answer: "No. Silent Psycode simply connects buyers and sellers. Agree on payment and handover yourselves, and keep safety in mind when meeting.",
  },
  {
    question: "How are books listed?",
    answer: "Every listing is published by the seller with a condition tag, price and city, and can be removed at any time from the dashboard.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-20">
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

