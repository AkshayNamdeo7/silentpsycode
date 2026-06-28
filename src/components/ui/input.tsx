"use client";

import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20",
        className
      )}
      {...props}
    />
  );
}
