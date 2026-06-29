"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, Search, Bell } from "lucide-react";
import { signOut } from "@/lib/auth";

interface TopNavProps {
  onToggleSidebar: () => void;
}

export default function TopNav({ onToggleSidebar }: TopNavProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    router.push("/");
  };

  return (
    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/90 text-slate-200 transition hover:bg-slate-900 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="rounded-3xl border border-white/10 bg-slate-950/95 px-4 py-3 text-slate-200 shadow-sm shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Dashboard</p>
          <p className="text-sm font-semibold text-white">My workspace</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
        <div className="hidden items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-200 sm:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search books, orders, authors..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <button className="hidden rounded-3xl border border-white/10 bg-slate-950/90 p-3 text-slate-200 transition hover:bg-slate-900 sm:inline-flex">
          <Bell className="h-4 w-4" />
        </button>

        <Link
          href="/sell"
          className="hidden rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 sm:inline-flex"
        >
          Sell a Book
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 shadow-sm shadow-slate-950/20 transition hover:bg-slate-900"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">A</span>
            <div className="hidden min-w-[120px] text-left sm:block">
              <p className="text-sm font-semibold text-white">Arjun</p>
              <p className="text-xs text-slate-400">Seller</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {profileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 z-20 mt-3 w-56 rounded-[1.75rem] border border-white/10 bg-slate-950/95 p-4 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-2">
                <button className="w-full rounded-3xl px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900">
                  Profile
                </button>
                <button className="w-full rounded-3xl px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900">
                  Billing
                </button>
                <button
                  className="w-full rounded-3xl px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-900"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
