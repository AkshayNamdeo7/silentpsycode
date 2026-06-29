import { supabase } from "@/lib/supabase";

export interface ProfileRecord {
  id: string;
  full_name: string;
  phone?: string | null;
  college?: string | null;
  city?: string | null;
  avatar_url?: string | null;
  created_at?: string;
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
