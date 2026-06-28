"use client";

import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        "w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
