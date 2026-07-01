"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Tag } from "lucide-react";
import type { BookWithImages } from "@/lib/books";
import FavoriteButton from "./favorite-button";
import ShareButton from "./share-button";
import Button from "@/components/ui/button";

interface BookCardProps {
  book: BookWithImages;
}

function formatPrice(value: number | string) {
  const price = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(price) ? `₹${price.toLocaleString("en-IN")}` : "₹0";
}

export default function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = book.images?.[0]?.image_url;
  const sellerName = book.seller_name || book.seller?.full_name || "Student Seller";
  const price = formatPrice(book.selling_price);

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.9)] transition duration-300 hover:-translate-y-1 hover:border-sky-400/20">
      <div className="relative">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900">
          {imageUrl && !imageError ? (
            <div className="relative h-72 w-full">
              <Image
                src={imageUrl}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center bg-slate-900 text-slate-500">No image available</div>
          )}

          <div className="absolute inset-x-0 top-4 flex items-start justify-between px-4">
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-[11px] uppercase tracking-[0.32em] text-sky-300">
              {book.condition ?? "Used"}
            </span>
            <div className="flex items-center gap-2">
              <FavoriteButton bookId={book.id} />
              <ShareButton url={`/books/${book.id}`} />
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <Tag className="h-3.5 w-3.5" /> {book.category || "General"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <MapPin className="h-3.5 w-3.5" /> {book.city || "Campus"}
            </span>
          </div>

          <Link href={`/books/${book.id}`} className="block" aria-label={`View details for ${book.title}`}>
            <h3 className="text-xl font-semibold text-white transition group-hover:text-sky-300">
              {book.title}
            </h3>
            <p className="mt-2 text-sm text-slate-400">by {book.author}</p>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Seller</p>
              <p className="text-sm font-semibold text-white">{sellerName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Price</p>
              <p className="text-xl font-semibold text-white">{price}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button asChild className="w-full">
              <Link href={`/books/${book.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
