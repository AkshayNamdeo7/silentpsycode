"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import FavoriteButton from "@/components/marketplace/favorite-button";
import ShareButton from "@/components/marketplace/share-button";
import BookSkeleton from "@/components/marketplace/book-skeleton";
import EmptyState from "@/components/marketplace/empty-state";
import { fetchBookById, type BookWithImages } from "@/lib/books";
import Button from "@/components/ui/button";

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [book, setBook] = useState<BookWithImages | null>(null);
  const [mainImageError, setMainImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      setError(null);

      const { book: fetchedBook, error: fetchError } = await fetchBookById(resolvedParams.id);
      if (fetchError || !fetchedBook) {
        setError(fetchError ? "Unable to load this book right now." : "Book not found.");
        setLoading(false);
        return;
      }

      setBook(fetchedBook);
      document.title = `${fetchedBook.title} | Silent Psycode`;
      setLoading(false);
    };

    void loadBook();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <BookSkeleton />
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            title="Book unavailable"
            description={error ?? "This listing may have been removed or is temporarily unavailable."}
            action={<Button onClick={() => router.push("/books")}>Back to browse</Button>}
          />
        </div>
      </main>
    );
  }

  const orderedImages = (book.images ?? []).slice().sort((a, b) => a.display_order - b.display_order);
  const mainImage = orderedImages[0]?.image_url;
  const additionalImages = orderedImages.slice(1);
  const sellerName = book.seller_name || "Student Seller";
  const price = `₹${book.selling_price.toLocaleString("en-IN")}`;
  const contactHref = book.seller_phone
    ? `tel:${book.seller_phone}`
    : book.contact_email
      ? `mailto:${book.contact_email}?subject=${encodeURIComponent("Inquiry about " + book.title)}&body=${encodeURIComponent(
          `Hi ${sellerName},\n\nI am interested in your listing for "${book.title}". Please get in touch with me with details on availability and pricing.\n\nThanks,`
        )}`
      : `mailto:?subject=${encodeURIComponent("Inquiry about " + book.title)}&body=${encodeURIComponent(
          `Hi ${sellerName},\n\nI am interested in your listing for "${book.title}". Please get in touch with me with details on availability and pricing.\n\nThanks,`
        )}`;
  const contactLabel = book.seller_phone ? "Call seller" : book.contact_email ? "Email seller" : "Contact seller";

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Book details</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">{book.title}</h1>
            <p className="mt-2 text-sm text-slate-400">{book.author}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => router.push("/books") }>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to browse
            </Button>
            <FavoriteButton bookId={book.id} />
            <ShareButton url={`/books/${book.id}`} />
          </div>
        </div>

        <div className="mt-10 grid gap-10 xl:grid-cols-[1.5fr_0.8fr]">
          <section className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
              {mainImage && !mainImageError ? (
                <img
                  src={mainImage}
                  alt={book.title}
                  className="h-64 w-full object-cover sm:h-[520px]"
                  loading="lazy"
                  onError={() => setMainImageError(true)}
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-slate-900 text-slate-500 sm:h-[520px]">No image available</div>
              )}
            </div>

            {additionalImages.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {additionalImages.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/90">
                    <img src={image.image_url} alt={book.title} className="h-48 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Price</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{price}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Seller</p>
                  <p className="mt-3 text-lg font-semibold text-white">{sellerName}</p>
                  <p className="mt-2 text-sm text-slate-400">{book.city ?? "City not specified"}</p>
                  <p className="mt-1 text-sm text-slate-400">{book.college ?? "College not specified"}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Condition</p>
                  <p className="mt-2 text-sm text-white">{book.condition || "Used"}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Category</p>
                  <p className="mt-2 text-sm text-white">{book.category || "General"}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Subject</p>
                  <p className="mt-2 text-sm text-white">{book.subject || "Not specified"}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Description</p>
                <p className="text-sm leading-7 text-slate-300">{book.description || "No description provided for this listing."}</p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.8)]">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Listing actions</p>
              <div className="mt-6 space-y-4">
                <Button asChild className="w-full">
                  <a href={contactHref}>{contactLabel}</a>
                </Button>
                <ShareButton url={`/books/${book.id}`} className="w-full" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.8)]">
              <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Listing info</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Listed on</p>
                  <p className="mt-2 text-sm text-white">{new Date(book.created_at).toLocaleDateString()}</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Original price</p>
                  <p className="mt-2 text-sm text-white">{book.original_price ? `₹${book.original_price.toLocaleString("en-IN")}` : "Not provided"}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
