import { supabase } from "@/lib/supabase";
import { isSupabaseClientConfigured } from "@/lib/supabase";
import type { BookWithImages } from "@/lib/books";

export interface ProfileRecord {
  id: string;
  full_name: string;
  phone?: string | null;
  college?: string | null;
  city?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface SellerProfileDetail {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string | null;
  college: string | null;
  city: string | null;
  phone: string | null;
  bio: string | null;
  active_book_count: number;
  sold_book_count: number;
  books: BookWithImages[];
}

export async function ensureUserProfile(id: string, full_name: string): Promise<{ success: boolean; message: string }> {
  if (!id) {
    return { success: false, message: "Missing user ID." };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { success: false, message: fetchError.message ?? "Failed to check profile existence." };
  }

  if (existing) {
    return { success: true, message: "Profile exists." };
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id,
    full_name: full_name || "Student Seller",
  });

  if (insertError) {
    return { success: false, message: insertError.message ?? "Failed to create profile." };
  }

  return { success: true, message: "Profile created." };
}

export async function fetchSellerProfile(sellerId: string): Promise<{ profile: SellerProfileDetail | null; error: string | null }> {
  if (!isSupabaseClientConfigured) {
    return { profile: null, error: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, created_at, college, city, phone, bio")
    .eq("id", sellerId)
    .maybeSingle();

  if (profileError || !profile) {
    return { profile: null, error: profileError?.message ?? "Seller not found." };
  }

  const [{ count: activeCount }, { count: soldCount }, { data: books }] = await Promise.all([
    supabase
      .from("books")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .eq("status", "active"),
    supabase
      .from("books")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .eq("status", "sold"),
    supabase
      .from("books")
      .select(
        `id,title,author,isbn,selling_price,original_price,condition,category,subject,description,college,city,created_at,seller_id,seller_name,images:book_images(image_url,display_order),seller:profiles(full_name,phone,college,city)`
      )
      .eq("seller_id", sellerId)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
  ]);

  return {
    profile: {
      id: profile.id,
      full_name: profile.full_name ?? "Student Seller",
      avatar_url: profile.avatar_url ?? null,
      created_at: profile.created_at ?? null,
      college: profile.college ?? null,
      city: profile.city ?? null,
      phone: profile.phone ?? null,
      bio: profile.bio ?? null,
      active_book_count: activeCount ?? 0,
      sold_book_count: soldCount ?? 0,
      books: ((books ?? []) as unknown as BookWithImages[]),
    },
    error: null,
  };
}
