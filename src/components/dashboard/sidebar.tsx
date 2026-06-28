"use client";

import Link from "next/link";
import { BookOpen, Home, LayoutDashboard, Users, Settings, X } from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard#overview" },
  { label: "My Books", icon: BookOpen, href: "/dashboard#listings" },
  { label: "Orders", icon: Home, href: "/dashboard#orders" },
  { label: "Community", icon: Users, href: "/dashboard#community" },
  { label: "Settings", icon: Settings, href: "/dashboard#settings" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs transform overflow-y-auto border-r border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950 transition duration-300 ease-out lg:static lg:translate-x-0 lg:max-w-none lg:border-none lg:bg-transparent lg:p-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between lg:hidden">
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-slate-200 shadow-sm shadow-slate-950/20">
            Menu
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-slate-950/90 text-slate-200 transition hover:bg-slate-900"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.65)] lg:mt-0">
          <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Account balance</p>
            <p className="mt-3 text-3xl font-semibold text-white">₹12,480</p>
            <p className="mt-2 text-sm text-slate-400">Available for payout</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-3xl border border-transparent px-4 py-3 text-sm text-slate-300 transition hover:border-sky-500/20 hover:bg-slate-900/80 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick action</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Sell a Book
            </Link>
          </div>
        </div>
      </aside>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
