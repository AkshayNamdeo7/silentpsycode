import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/90 p-10 text-center text-slate-400 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.75)]">
      <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">{title}</p>
      <p className="mt-4 text-xl font-semibold text-white">No items found</p>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-7 text-slate-400">{description}</p>
      <div className="mt-8 flex justify-center">{action}</div>
    </div>
  );
}
