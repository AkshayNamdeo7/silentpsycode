"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, ChartBar, ShoppingBag, Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import MetricCard from "@/components/dashboard/metric-card";
import BookCard from "@/components/dashboard/book-card";
import ActivityCard from "@/components/dashboard/activity-card";
import EmptyState from "@/components/dashboard/empty-state";

const metrics = [
  {
    label: "Total earnings",
    value: "₹18,360",
    description: "Revenue from recent book sales, paid out and ready for transfer.",
    icon: <ChartBar className="h-5 w-5" />,
  },
  {
    label: "Active listings",
    value: "8",
    description: "Books currently live in the marketplace for buyers to browse.",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    label: "Buyer requests",
    value: "12",
    description: "Open inquiries from readers interested in your titles.",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
];

const books = [
  {
    title: "The Quiet Library",
    author: "Nina Verma",
    price: "₹499",
    status: "Live",
    badge: "Best seller",
    details: "24 copies sold · 4.9 rating",
  },
  {
    title: "Midnight Pages",
    author: "Rohan Desai",
    price: "₹399",
    status: "Live",
    badge: "Trending",
    details: "18 copies sold · 4.8 rating",
  },
  {
    title: "Ink & Inquiry",
    author: "Meera Khan",
    price: "₹299",
    status: "Draft",
    badge: "Edit needed",
    details: "4 copies sold · 4.6 rating",
  },
];

const activity = [
  {
    title: "New review received",
    description: 'A reader rated "Ink & Inquiry" 5 stars and left a glowing comment.',
    time: "3h ago",
  },
  {
    title: "Listing updated",
    description: 'Pricing for "Midnight Pages" was refreshed to match current promotions.',
    time: "Yesterday",
  },
  {
    title: "Payout processed",
    description: "A payout of ₹3,250 has been scheduled for your bank account.",
    time: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section id="overview" className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Premium seller dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Manage listings, review buyer activity, and keep your marketplace presence polished with one streamlined control center.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="w-full sm:w-auto">
            <Link href="/sell">Sell a Book</Link>
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto">
            View analytics
          </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </section>

      <section id="listings" className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Active listings</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Your live book shelf</h2>
            </div>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/sell">Add new listing</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {books.map((book) => (
              <BookCard
                key={book.title}
                title={book.title}
                author={book.author}
                price={book.price}
                status={book.status}
                badge={book.badge}
                details={book.details}
                action={
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" className="px-4 py-2 text-sm">
                      Edit
                    </Button>
                    <Button className="px-4 py-2 text-sm">
                      Preview
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Listing health</p>
            <p className="mt-4 text-3xl font-semibold text-white">8 live titles</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Keep your catalog fresh and responsive with consistent pricing, cover updates, and featured placement.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Promotion</p>
                <p className="mt-3 text-xl font-semibold text-white">Featured release</p>
              </div>
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Your newest release is ranking high this week. Publish a related guide or special edition to increase engagement.
            </p>
          </div>
        </div>
      </section>

      <section id="orders" className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Recent orders</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Latest buyer activity</h2>
            </div>
            <Button variant="secondary" className="w-full sm:w-auto">
              View all orders
            </Button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-white">Order #2048</p>
                <p className="mt-2 text-sm text-slate-400">Priya Sharma purchased "The Quiet Library".</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">₹649</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Today</p>
              </div>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-white">Order #2039</p>
                <p className="mt-2 text-sm text-slate-400">Riya Singh requested a signed copy of "Midnight Pages".</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">₹499</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <EmptyState
            title="Community pulse"
            description="No unread messages or requests at the moment. Keep your storefront active for more buyer engagement."
            action={
              <Button variant="secondary" className="px-5 py-3">
                Share latest release
              </Button>
            }
          />
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_25px_65px_-40px_rgba(15,23,42,0.75)]">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Payout status</p>
            <p className="mt-4 text-3xl font-semibold text-white">Scheduled</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Your next payout of ₹5,400 is estimated to arrive within 3 business days.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-3 text-sm text-slate-200">
              <ArrowUpRight className="h-4 w-4 text-sky-300" />
              Payout tracking enabled
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Seller activity</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">What happened recently</h2>
          </div>
          <Button variant="secondary" className="w-full sm:w-auto">
            Review activity
          </Button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {activity.map((item) => (
            <ActivityCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section id="settings" className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Account settings</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Storefront preferences</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Update your profile, manage payout preferences, and keep your seller identity polished for every buyer interaction.
            </p>
          </div>
          <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Payout method</p>
                <p className="mt-2 text-sm text-slate-400">Bank transfer ending in 3941</p>
              </div>
              <Button variant="ghost" className="px-4 py-2 text-sm">
                Update
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Notifications</p>
                <p className="mt-2 text-sm text-slate-400">Enabled for buyer requests and order alerts</p>
              </div>
              <Button variant="ghost" className="px-4 py-2 text-sm">
                Manage
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
