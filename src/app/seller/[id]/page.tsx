"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, BookOpen, ShoppingBag, Building2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import BookCard from "@/components/marketplace/book-card";
import EmptyState from "@/components/marketplace/empty-state";
import Button from "@/components/ui/button";
import { fetchSellerProfile, type SellerProfileDetail } from "@/lib/profiles";

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<SellerProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const result = await fetchSellerProfile(resolvedParams.id);
      if (cancelled) return;

      if (result.error || !result.profile) {
        setError(result.error ?? "Seller not found.");
        setLoading(false);
        return;
      }

      setProfile(result.profile);
      document.title = `${result.profile.full_name} | Seller Profile`;
      setLoading(false);
    }

    void load();
    return () => { cancelled = true; };
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="h-20 w-20 rounded-full bg-slate-900" />
              <div className="space-y-3">
                <div className="h-5 w-48 rounded-full bg-slate-900" />
                <div className="h-4 w-32 rounded-full bg-slate-900" />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-[1.75rem] bg-slate-900" />
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 rounded-[2rem] bg-slate-900" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#050816] text-white">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            title="Seller unavailable"
            description={error ?? "This seller profile may have been removed or is temporarily unavailable."}
            action={<Button onClick={() => router.push("/books")}>Browse books</Button>}
          />
        </div>
      </main>
    );
  }

  const initials = profile.full_name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : null;

  const location = [profile.city, profile.college].filter(Boolean).join(" · ");

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)] sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/15 text-2xl font-semibold text-sky-300">
                  {initials}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Seller profile</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl text-balance">
                {profile.full_name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                {joinDate ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Joined {joinDate}
                  </span>
                ) : null}
                {location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Student seller{profile.college ? ` at ${profile.college}` : ""}{profile.city ? ` in ${profile.city}` : ""}. Browse their active listings below.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Active listings</p>
                <p className="mt-3 text-3xl font-semibold text-white">{profile.active_book_count}</p>
              </div>
              <div className="rounded-3xl bg-sky-500/10 p-3 text-sky-300">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Books sold</p>
                <p className="mt-3 text-3xl font-semibold text-white">{profile.sold_book_count}</p>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 p-3 text-emerald-300">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">College</p>
                <p className="mt-3 text-sm font-semibold text-white truncate">{profile.college || "Not specified"}</p>
              </div>
              <div className="rounded-3xl bg-amber-500/10 p-3 text-amber-300">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">Listings</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {profile.active_book_count > 0 ? `Books by ${profile.full_name}` : "No active listings"}
            </h2>
          </div>

          {profile.books.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {profile.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No listings"
              description={`${profile.full_name} hasn't published any books yet. Check back later.`}
              action={<Button asChild><Link href="/books">Browse all books</Link></Button>}
            />
          )}
        </div>
      </div>
    </main>
  );
}
