"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Heart, LayoutDashboard, LogOut, Menu, PlusCircle, Settings, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/button";
import { getCurrentAuthContext, signOut } from "@/lib/auth";
import { isSupabaseClientConfigured, supabase } from "@/lib/supabase";

type SessionUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type Session = {
  user: SessionUser;
};

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const authContext = await getCurrentAuthContext();
      if (!active) return;

      if (authContext.userId) {
        setSession({
          user: {
            id: authContext.userId,
            email: authContext.email ?? undefined,
            user_metadata: {
              full_name: authContext.fullName ?? undefined,
            },
          },
        });
      } else {
        setSession(null);
      }
    };

    void loadSession();

    const authListener = isSupabaseClientConfigured
      ? supabase.auth.onAuthStateChange((_event, currentSession) => {
          if (currentSession) {
            setSession({
              user: {
                id: currentSession.user.id,
                email: currentSession.user.email ?? undefined,
                user_metadata: currentSession.user.user_metadata,
              },
            });
          } else {
            setSession(null);
          }
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      active = false;
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const initials = useMemo(() => {
    const fullName = (session?.user?.user_metadata?.full_name as string | undefined) ?? "Student";
    return fullName
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [session]);

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0">
          <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Silent Psycode</p>
          <p className="text-xs text-slate-500">Premium book marketplace</p>
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/books" className="text-sm text-slate-300 transition hover:text-white">
            Books
          </Link>
          <Link href="/#faq" className="text-sm text-slate-300 transition hover:text-white">
            FAQ
          </Link>

          {session ? (
            <div className="relative" ref={desktopMenuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-sm text-white transition hover:bg-slate-800"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-300">
                  {initials}
                </span>
                <span className="hidden xl:block">{session.user?.email?.split("@")?.[0] ?? "Student"}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {menuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-3 w-56 rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]"
                >
                  <div className="space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}>
                      <LayoutDashboard className="h-4 w-4 text-sky-300" />
                      Dashboard
                    </Link>
                    <Link href="/dashboard#listings" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}>
                      <BookOpen className="h-4 w-4 text-sky-300" />
                      My Books
                    </Link>
                    <Link href="/dashboard/favorites" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}>
                      <Heart className="h-4 w-4 text-sky-300" />
                      Favorites
                    </Link>
                    <Link href="/sell" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}>
                      <PlusCircle className="h-4 w-4 text-sky-300" />
                      Sell Book
                    </Link>
                    <Link href="/dashboard#settings" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}>
                      <Settings className="h-4 w-4 text-sky-300" />
                      Settings
                    </Link>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-rose-200 transition hover:bg-slate-900">
                      <LogOut className="h-4 w-4 text-rose-300" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button size="sm" variant="secondary" className="rounded-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="rounded-full" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {session ? (
            <>
              <Link
                href="/sell"
                className="rounded-full bg-sky-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-400"
              >
                Sell
              </Link>
              <div className="relative" ref={mobileMenuRef}>
                <button type="button" onClick={() => setMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-sm font-semibold text-sky-300">
                  {initials}
                </button>
                {menuOpen ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-3 w-52 rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]">
                    <div className="space-y-1">
                      <Link href="/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}><LayoutDashboard className="h-4 w-4 text-sky-300" />Dashboard</Link>
                      <Link href="/dashboard#listings" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}><BookOpen className="h-4 w-4 text-sky-300" />My Books</Link>
                      <Link href="/sell" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}><PlusCircle className="h-4 w-4 text-sky-300" />Sell Book</Link>
                      <Link href="/dashboard/favorites" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}><Heart className="h-4 w-4 text-sky-300" />Favorites</Link>
                      <Link href="/dashboard#settings" className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-900" onClick={() => setMenuOpen(false)}><Settings className="h-4 w-4 text-sky-300" />Settings</Link>
                      <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-rose-200 transition hover:bg-slate-900"><LogOut className="h-4 w-4 text-rose-300" />Logout</button>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </>
          ) : (
            <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-slate-200">
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
      </nav>

      {mobileMenuOpen && !session ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/books" className="text-sm text-slate-300 transition hover:text-white" onClick={() => setMobileMenuOpen(false)}>Books</Link>
            <Link href="/#faq" className="text-sm text-slate-300 transition hover:text-white" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-center text-sm text-slate-200" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link href="/register" className="rounded-full bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-slate-950" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
