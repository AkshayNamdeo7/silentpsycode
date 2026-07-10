import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action: ReactNode;
  eyebrow?: string;
  heading?: string;
}

export default function EmptyState({ title, description, action, eyebrow, heading }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/90 p-8 text-center text-slate-400 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.75)] sm:p-10">
      <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">{eyebrow ?? title}</p>
      <p className="mt-4 text-2xl font-semibold text-white">{heading ?? title ?? "Nothing matched your search"}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
      <div className="mt-8 flex justify-center">{action}</div>
    </div>
  );
}
