import { ReactNode } from "react";

interface BookCardProps {
  title: string;
  author: string;
  price: string;
  status: string;
  badge: string;
  details: string;
  action?: ReactNode;
}

export default function BookCard({ title, author, price, status, badge, details, action }: BookCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.75)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm text-slate-400">{author}</p>
        </div>
        <span className="rounded-full bg-slate-900/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
          {badge}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{details}</p>
          <p className="mt-3 text-lg font-semibold text-white">{price}</p>
        </div>
        <span className="rounded-3xl bg-slate-900/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-300">
          {status}
        </span>
      </div>

      {action ? <div className="mt-6">{action}</div> : null}
    </article>
  );
}
