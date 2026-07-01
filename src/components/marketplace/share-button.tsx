"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import clsx from "clsx";

interface ShareButtonProps {
  url: string;
  className?: string;
}

export default function ShareButton({ url, className }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const resolvedUrl = typeof window === "undefined" ? url : new URL(url, window.location.origin).toString();

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Book listing", url: resolvedUrl });
        setShared(true);
      } catch {
        setShared(false);
      }
      return;
    }

    if (typeof navigator !== "undefined" && "clipboard" in navigator) {
      try {
        const clipboard = (navigator as any).clipboard;
        await clipboard.writeText(resolvedUrl);
        setShared(true);
      } catch {
        setShared(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        handleShare();
      }}
      className={clsx(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/90 text-white transition hover:border-sky-400/30 hover:text-sky-300",
        className
      )}
      aria-label="Share listing"
      title={shared ? "Link copied" : "Share listing"}
    >
      {shared ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
    </button>
  );
}
