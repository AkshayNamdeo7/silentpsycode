export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/95 py-16">
      <div className="mx-auto grid gap-12 px-6 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr] lg:items-start lg:gap-8 xl:max-w-7xl">
        <div className="space-y-5">
          <p className="text-2xl font-semibold text-white">Silent Psycode</p>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            A premium book marketplace for readers who want beautifully curated discovery, fast buying and thoughtful recommendations.
          </p>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 text-sm text-slate-300">
            <p className="font-medium text-white">Need support?</p>
            <p className="mt-2">Reach out at <a href="mailto:hello@silentpsycode.com" className="text-sky-300 hover:text-sky-200">hello@silentpsycode.com</a></p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Marketplace</p>
            <nav className="mt-5 space-y-3 text-sm text-slate-400">
              <a href="#categories" className="block transition hover:text-white">Categories</a>
              <a href="#books" className="block transition hover:text-white">Featured Books</a>
              <a href="#faq" className="block transition hover:text-white">FAQ</a>
            </nav>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Company</p>
            <nav className="mt-5 space-y-3 text-sm text-slate-400">
              <a href="#" className="block transition hover:text-white">About</a>
              <a href="#" className="block transition hover:text-white">Careers</a>
              <a href="#" className="block transition hover:text-white">Contact</a>
            </nav>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Stay connected</p>
          <p className="text-sm leading-7 text-slate-400">Subscribe for updates on premium drops, author moments, and marketplace exclusives.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-500/30 hover:bg-slate-900">Newsletter</a>
            <a href="#" className="rounded-full border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-500/30 hover:bg-slate-900">Start selling</a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
        © 2026 Silent Psycode. All rights reserved.
      </div>
    </footer>
  );
}
