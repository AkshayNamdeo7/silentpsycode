"use client";

import clsx from "clsx";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        "min-h-[120px] w-full rounded-[1.75rem] border border-white/10 bg-slate-950/90 px-4 py-4 text-white placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20",
        className
      )}
      {...props}
    />
  );
}
