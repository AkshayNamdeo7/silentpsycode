import { isSupabaseClientConfigured, supabase } from "@/lib/supabase";
import { ensureUserProfile } from "@/lib/profiles";

export type AuthResult = {
  success: boolean;
  message: string;
  needsConfirmation?: boolean;
};

export type AuthContext = {
  userId: string | null;
  email: string | null;
  fullName: string | null;
};

export async function getCurrentAuthContext(): Promise<AuthContext> {
  if (!isSupabaseClientConfigured) {
    return { userId: null, email: null, fullName: null };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return { userId: null, email: null, fullName: null };
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    fullName: session.user.user_metadata?.full_name ?? null,
  };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isSupabaseClientConfigured) {
    return { success: false, message: "Supabase is not configured. Add your environment variables." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.session) {
    const userId = data.session.user.id;
    const fullName = data.session.user.user_metadata?.full_name ?? "Student Seller";
    await ensureUserProfile(userId, fullName).catch(() => {});
  }

  return { success: true, message: "Signed in successfully." };
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (!isSupabaseClientConfigured) {
    return { success: false, message: "Supabase is not configured. Add your environment variables." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: trimmedName,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.session) {
    const userId = data.session.user.id;
    await ensureUserProfile(userId, trimmedName).catch(() => {});
    return {
      success: true,
      message: "Account created and signed in.",
      needsConfirmation: false,
    };
  }

  if (data.user && !data.session) {
    return {
      success: true,
      message: "Check your email for a confirmation link to complete registration.",
      needsConfirmation: true,
    };
  }

  return { success: true, message: "Registration request accepted.", needsConfirmation: true };
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isSupabaseClientConfigured) {
    return { success: false, message: "Supabase is not configured. Add your environment variables." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
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

export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseClientConfigured) {
    return { success: false, message: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Signed out successfully." };
}
