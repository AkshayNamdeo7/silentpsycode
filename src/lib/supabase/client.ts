import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const SB_SESSION_COOKIE = "sb_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function writeSessionCookie(sessionJson: string | null) {
  if (typeof document === "undefined") return;
  if (!sessionJson) {
    document.cookie = `${SB_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  try {
    const session = JSON.parse(sessionJson);
    if (!session?.access_token) {
      document.cookie = `${SB_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
      return;
    }
    const payload = JSON.stringify({ t: session.access_token, e: session.expires_at });
    document.cookie = `${SB_SESSION_COOKIE}=${encodeURIComponent(payload)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    document.cookie = `${SB_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}

function createDualStorage(): Storage {
  return {
    getItem(key: string) {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    },
    setItem(key: string, value: string) {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, value);
      writeSessionCookie(value);
    },
    removeItem(key: string) {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
      writeSessionCookie(null);
    },
    clear() {
      if (typeof window === "undefined") return;
      window.localStorage.clear();
      writeSessionCookie(null);
    },
    get length() {
      if (typeof window === "undefined") return 0;
      return window.localStorage.length;
    },
    key(index: number) {
      if (typeof window === "undefined") return null;
      return window.localStorage.key(index);
    },
  };
}

export const supabase: SupabaseClient =
  typeof window !== "undefined" && isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          storageKey: "sb-auth",
          storage: createDualStorage(),
          autoRefreshToken: true,
        },
      })
    : ({} as SupabaseClient);

export const isSupabaseClientConfigured = isConfigured;
