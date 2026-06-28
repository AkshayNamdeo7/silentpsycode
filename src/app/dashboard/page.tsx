"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/button";

const cards = [
  {
    title: "Total earnings",
    value: "₹18,360",
    description: "Revenue from recent book sales and promotions.",
  },
  {
    title: "Active listings",
    value: "8",
    description: "Books currently available for buyers.",
  },
  {
    title: "Buyer requests",
    value: "12",
    description: "New purchase inquiries waiting for review.",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Your publisher dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Manage your listings, preview activity, and keep your book marketplace in premium shape.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button className="w-full sm:w-auto">Sell a Book</Button>
            <Button variant="secondary" className="w-full sm:w-auto">
              View analytics
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-7 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)]"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{card.title}</p>
            <p className="mt-5 text-4xl font-semibold text-white">{card.value}</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">{card.description}</p>
          </motion.article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/90 p-8 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)]">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">My Books</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Your shelf is ready for premium listings.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            You haven’t added any books yet. Start selling your first title to appear in the marketplace and connect with readers instantly.
          </p>
          <Button className="mt-8">Add your first book</Button>
        </div>
      </section>
    </div>
  );
}
