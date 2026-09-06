import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95 py-16">
      <div className="mx-auto grid gap-12 px-6 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:items-start lg:gap-8 xl:max-w-7xl">
        <div className="space-y-5">
          <p className="text-2xl font-semibold text-white">Silent Psycode</p>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            A student book marketplace for buying, selling and discovering second-hand books.
          </p>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300">
            <p className="font-medium text-white">Need support?</p>
            <p className="mt-2">Reach out at <a href="mailto:silentpsycode@gmail.com" className="text-sky-300 hover:text-sky-200">silentpsycode@gmail.com</a></p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Marketplace</p>
            <nav className="mt-5 space-y-3 text-sm text-slate-400">
              <Link href="/books" className="block transition hover:text-white">Browse books</Link>
              <Link href="/#categories" className="block transition hover:text-white">Categories</Link>
              <Link href="/#faq" className="block transition hover:text-white">FAQ</Link>
            </nav>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Company</p>
            <nav className="mt-5 space-y-3 text-sm text-slate-400">
              <Link href="/#features" className="block transition hover:text-white">About</Link>
              <Link href="/sell" className="block transition hover:text-white">Start selling</Link>
              <Link href="mailto:silentpsycode@gmail.com" className="block transition hover:text-white">Contact</Link>
            </nav>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Your account</p>
          <p className="text-sm leading-7 text-slate-400">
            Manage your listings, favorites and profile settings from one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-500/30 hover:bg-slate-900">My dashboard</Link>
            <Link href="/settings" className="rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-500/30 hover:bg-slate-900">Settings</Link>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
        © 2026 Silent Psycode. All rights reserved.
      </div>
    </footer>
  );
}