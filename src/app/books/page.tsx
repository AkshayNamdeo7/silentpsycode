"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import SectionTitle from "@/components/common/section-title";
import BookFilters from "@/components/marketplace/book-filters";
import BookCard from "@/components/marketplace/book-card";
import BookSkeleton from "@/components/marketplace/book-skeleton";
import EmptyState from "@/components/marketplace/empty-state";
import { fetchBooks, type BookFilters as FilterType, type BookWithImages } from "@/lib/books";
import Button from "@/components/ui/button";
import Link from "next/link";

const defaultFilters: FilterType = {
  search: "",
  category: undefined,
  condition: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  college: undefined,
  city: undefined,
  sort: "newest",
};

function BooksPageContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterType>(() => {
    const initialSearch = searchParams?.get("search") ?? "";
    return { ...defaultFilters, search: initialSearch };
  });
  const [books, setBooks] = useState<BookWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Browse Books | Silent Psycode";
  }, []);

  const loadBooks = useCallback(async (currentFilters: FilterType) => {
    setLoading(true);
    setError(null);
    const { books: fetchedBooks, error: fetchError } = await fetchBooks(currentFilters);
    if (fetchError) {
      setError(fetchError.message || "Failed to load books.");
      setBooks([]);
    } else {
      setBooks(fetchedBooks);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      void loadBooks(filters);
    }, 0);
    return () => clearTimeout(handler);
  }, [filters, loadBooks]);

  const sectionDescription = useMemo(() => {
    if (error) return "We hit a problem while loading books. Try again or refine your filters.";
    if (loading) return "Fetching the latest student book listings for your campus.";
    return `${books.length} live books available for your next read.`;
  }, [books.length, error, loading]);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Book marketplace"
          title="Browse books from verified student sellers"
          description={sectionDescription}
        />

        <div className="mt-12 grid gap-8 xl:grid-cols-[320px_1fr]">
          <BookFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />

          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Live listings</p>
                <p className="mt-2 text-lg text-slate-300">Find your next read with search, filters, and premium book discovery.</p>
              </div>
              <Link href="/sell" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">Sell a book</Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <BookSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-slate-200">
                <p className="text-lg font-semibold text-white">Unable to load books</p>
                <p className="mt-3 text-sm text-slate-400">{error}</p>
                <Button className="mt-6" onClick={() => void loadBooks(filters)}>
                  Retry
                </Button>
              </div>
            ) : books.length === 0 ? (
              <EmptyState
                title="No books found"
                description="Try changing search terms, categories, or city filters to uncover more listings."
                action={<Button asChild><Link href="/sell">Become a seller</Link></Button>}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function BrowseBooksPage() {
  return (
    <Suspense fallback={null}>
      <BooksPageContent />
    </Suspense>
  );
}
