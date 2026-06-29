import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient =
  typeof window !== "undefined" && isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          storageKey: "supabase.auth.token",
          autoRefreshToken: true,
        },
      })
    : ({} as SupabaseClient);

export const isSupabaseClientConfigured = isConfigured;
