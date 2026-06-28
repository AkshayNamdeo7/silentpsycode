interface ActivityCardProps {
  title: string;
  description: string;
  time: string;
}

export default function ActivityCard({ title, description, time }: ActivityCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-4 shadow-[0_25px_55px_-35px_rgba(15,23,42,0.75)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">{time}</span>
      </div>
    </div>
  );
}
