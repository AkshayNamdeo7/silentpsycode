import Link from "next/link";
import Button from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Silent Psycode</p>
          <p className="text-xs text-slate-500">Premium book marketplace</p>
        </div>

        <div className="flex items-center gap-4">
          <a href="#books" className="text-sm text-slate-300 transition hover:text-white">
            Books
          </a>
          <a href="#faq" className="text-sm text-slate-300 transition hover:text-white">
            FAQ
          </a>
          <Button size="sm" className="rounded-full" asChild>
            <Link href="/sell">Sell Books</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
