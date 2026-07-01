export default function BookSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)]"
    >
      <div className="h-56 rounded-[1.75rem] bg-slate-900" />
      <div className="mt-5 space-y-3">
        <div className="h-5 w-3/4 rounded-full bg-slate-900" />
        <div className="h-4 w-1/2 rounded-full bg-slate-900" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-4 rounded-full bg-slate-900" />
          <div className="h-4 rounded-full bg-slate-900" />
        </div>
      </div>
    </div>
  );
}
