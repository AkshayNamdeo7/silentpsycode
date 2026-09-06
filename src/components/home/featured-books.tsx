"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import BookCard from "@/components/marketplace/book-card";
import { fetchBooks, type BookWithImages } from "@/lib/books";

export default function FeaturedBooks() {
  const [books, setBooks] = useState<BookWithImages[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBooks({})
      .then(({ books: fetched }) => {
        if (!cancelled) {
          setBooks(fetched.slice(0, 3));
          setReady(true);
        }
      })
      .catch(() => setReady(true));
    return () => { cancelled = true; };
  }, []);

  if (ready && books.length === 0) {
    return null;
  }

  return (
    <section id="books" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Featured books</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Latest books from student sellers.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Freshly listed books across categories, priced by the sellers themselves.
          </p>
          <Button asChild variant="secondary" className="sm:w-auto">
            <Link href="/books">Browse all books</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <BookCard book={book} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}