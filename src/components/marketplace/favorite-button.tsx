"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";

interface FavoriteButtonProps {
  bookId: string;
  className?: string;
}

const STORAGE_KEY = "silentpsy-wishlist";

export default function FavoriteButton({ bookId, className }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      setFavorited(stored.includes(bookId));
    } catch {
      setFavorited(false);
    }
  }, [bookId]);

  const toggleFavorite = () => {
    if (typeof window === "undefined") return;

    setFavorited((current) => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
        const nextFavorites = current
          ? stored.filter((id) => id !== bookId)
          : [...stored.filter((id) => id !== bookId), bookId];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFavorites));
        return !current;
      } catch {
        return !current;
      }
    });
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        toggleFavorite();
      }}
      aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
      className={clsx(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 text-white transition hover:border-sky-400/30 hover:text-sky-300",
        favorited && "bg-sky-500/10 text-sky-300 border-sky-400/30",
        className
      )}
    >
      <Heart className="h-5 w-5" fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
