"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChartBar, BookOpen, ShoppingBag, Settings } from "lucide-react";
import Button from "@/components/ui/button";
import MetricCard from "@/components/dashboard/metric-card";
import BookCard from "@/components/dashboard/book-card";
import EmptyState from "@/components/dashboard/empty-state";
import { getMyBooks, deleteBook, type BookRecord } from "@/lib/books";

export default function DashboardPage() {
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, drafts: 0, sold: 0 });
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Dashboard | Silent Psycode";
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadBooks() {
      try {
        const response = await getMyBooks();
        if (!cancelled) {
          setBooks(response.books ?? []);
          setCounts(response.counts ?? { total: 0, active: 0, drafts: 0, sold: 0 });
        }
      } catch {
        if (!cancelled) {
          setBooks([]);
          setCounts({ total: 0, active: 0, drafts: 0, sold: 0 });
        }
      }
      if (!cancelled) setLoadingBooks(false);
    }

    loadBooks();
    return () => { cancelled = true; };
  }, []);

  const metrics = [
    {
      label: "Total listings",
      value: counts.total.toString(),
      description: "Every book you have published or started.",
      icon: <ChartBar className="h-5 w-5" />,
    },
    {
      label: "Live books",
      value: counts.active.toString(),
      description: "Listings visible to buyers right now.",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      label: "Drafts",
      value: counts.drafts.toString(),
      description: "Books saved as drafts for later publishing.",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      <section id="overview" className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl text-balance">
              Your seller dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Publish new listings, keep existing ones updated, and review how your books are performing in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/sell">Sell a Book</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/settings">Manage profile</Link>
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

      <section id="listings" className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">My books</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Your listings</h2>
          </div>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/sell">Add new listing</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4">
          {loadingBooks ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 text-slate-400">
              Loading your books...
            </div>
          ) : books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book.id}
                title={book.title}
                author={book.author}
                price={`₹${book.selling_price}`}
                status={book.status}
                badge={book.status === "draft" ? "Draft" : book.status === "sold" ? "Sold" : "Live"}
                details={`${book.category} · ${new Date(book.created_at).toLocaleDateString()}`}
                action={
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="secondary" className="px-4 py-2 text-sm">
                      <Link href={`/books/${book.id}`}>Preview</Link>
                    </Button>
                    <Button asChild variant="secondary" className="px-4 py-2 text-sm">
                      <Link href={`/sell?id=${book.id}`}>Edit</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-4 py-2 text-sm text-red-400 hover:text-red-300"
                      onClick={async () => {
                        if (!window.confirm("Delete this listing?")) return;
                        setDeletingId(book.id);
                        const result = await deleteBook(book.id);
                        if (!result.success) {
                          setDeletingId(null);
                          return;
                        }
                        const response = await getMyBooks();
                        setBooks(response.books ?? []);
                        setCounts(response.counts ?? { total: 0, active: 0, drafts: 0, sold: 0 });
                        setDeletingId(null);
                      }}
                      disabled={deletingId === book.id}
                    >
                      {deletingId === book.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                }
              />
            ))
          ) : (
            <EmptyState
              title="No books yet"
              description="Your published books will appear here once you create your first listing. Start selling to populate your dashboard."
              action={
                <Button asChild variant="secondary" className="px-5 py-3">
                  <Link href="/sell">Publish your first book</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Account</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Keep your seller info up to date</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Your display name, city and contact number appear on your seller page and throughout your listings. Update them anytime from Settings.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Open settings
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}