"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Button from "@/components/ui/button";
import { fetchBookById, type BookWithImages } from "@/lib/books";

const STORAGE_KEY = "silentpsy-wishlist";

export default function FavoritesPage() {
  const [bookIds, setBookIds] = useState<string[]>([]);
  const [books, setBooks] = useState<BookWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Favorites | Silent Psycode";
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
        setBookIds(stored);

        if (stored.length === 0) {
          setLoading(false);
          return;
        }

        const results = await Promise.allSettled(stored.map((id) => fetchBookById(id)));
        const fetchedBooks: BookWithImages[] = [];
        for (const result of results) {
          if (result.status === "fulfilled" && result.value.book) {
            fetchedBooks.push(result.value.book);
          }
        }
        setBooks(fetchedBooks);
      } catch {
        setBooks([]);
      }
      setLoading(false);
    };

    void loadFavorites();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
              <Heart className="inline h-4 w-4 mr-1" />
              Wishlist
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Your favorite books
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Books you have saved for later — browse, share, or contact sellers directly.
            </p>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-center text-slate-400">
          Loading your wishlist...
        </div>
      ) : bookIds.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/90 p-10 text-center text-slate-400">
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Empty wishlist</p>
          <p className="mt-4 text-xl font-semibold text-white">No saved books yet</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Start browsing the marketplace and tap the heart icon to save books you love.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/books">Browse books</Link>
            </Button>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/90 p-10 text-center text-slate-400">
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Unavailable</p>
          <p className="mt-4 text-xl font-semibold text-white">Some books are no longer available</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            The books in your wishlist may have been removed by their sellers.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/books">Discover more</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <div key={book.id} className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.9)]">
              <Link href={`/books/${book.id}`} className="block">
                <h3 className="text-lg font-semibold text-white transition hover:text-sky-300">{book.title}</h3>
              </Link>
              <p className="mt-2 text-sm text-slate-400">by {book.author}</p>
              <p className="mt-4 text-xl font-semibold text-white">
                ₹{book.selling_price.toLocaleString("en-IN")}
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild size="sm">
                  <Link href={`/books/${book.id}`}>View details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
