import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient =
  typeof window !== "undefined" && isConfigured
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : ({} as SupabaseClient);

export const isSupabaseClientConfigured = isConfigured;
