import { supabase } from "@/lib/supabase";
import { clearAuthCookie, setAuthCookie } from "@/lib/supabase/middleware";
import { ensureUserProfile } from "@/lib/profiles";

export type AuthResult = {
  success: boolean;
  message: string;
};

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: error.message };
  }

  if (!data.session) {
    return { success: false, message: "Unable to establish session." };
  }

  const userId = data.session.user.id;
  const fullName = data.session.user.user_metadata?.full_name ?? "Student Seller";
  const profileResult = await ensureUserProfile(userId, fullName);
  if (!profileResult.success) {
    return { success: false, message: profileResult.message ?? "Unable to create profile record." };
  }

  setAuthCookie();

  return { success: true, message: "Signed in successfully." };
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.session) {
    const userId = data.session.user.id;
    const profileResult = await ensureUserProfile(userId, name);
    if (!profileResult.success) {
      return { success: false, message: profileResult.message };
    }

    setAuthCookie();
  }

  return {
    success: true,
    message: data.session ? "Account created and signed in." : "Account created. Check your email to confirm your address.",
  };
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Password reset email sent. Check your inbox.",
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  clearAuthCookie();
  return { success: !error, message: error?.message ?? "Signed out successfully." };
}
