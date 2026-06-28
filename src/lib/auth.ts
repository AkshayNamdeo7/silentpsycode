import { supabase } from "@/lib/supabase";

export type AuthResult = {
  success: boolean;
  message?: string;
};

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) {
    return { success: false, message: "Supabase client not configured." };
  }

  return Promise.resolve({ success: true, message: "Authentication UI only. Backend integration pending." });
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  if (!supabase) {
    return { success: false, message: "Supabase client not configured." };
  }

  return Promise.resolve({ success: true, message: "Registration UI only. Backend integration pending." });
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  if (!supabase) {
    return { success: false, message: "Supabase client not configured." };
  }

  return Promise.resolve({ success: true, message: "Password reset UI only. Backend integration pending." });
}
