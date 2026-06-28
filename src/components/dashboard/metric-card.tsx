import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
}

export default function MetricCard({ label, value, description, icon }: MetricCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-3xl bg-slate-900/90 p-3 text-sky-300">
          {icon}
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}
