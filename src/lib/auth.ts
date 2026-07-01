import { isSupabaseClientConfigured, supabase } from "@/lib/supabase";
import { clearAuthCookie, setAuthCookie } from "@/lib/supabase/middleware";
import { ensureUserProfile } from "@/lib/profiles";

export type AuthResult = {
  success: boolean;
  message: string;
  needsConfirmation?: boolean;
};

const DEMO_USERS_STORAGE_KEY = "silentpsy-demo-users";
const DEMO_SESSION_STORAGE_KEY = "silentpsy-demo-session";

type DemoUser = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  created_at: string;
};

type DemoSession = {
  id: string;
  email: string;
  full_name: string;
};

export type AuthContext = {
  userId: string | null;
  email: string | null;
  fullName: string | null;
  isDemo: boolean;
};

function readDemoUsers(): Record<string, DemoUser> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(DEMO_USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DemoUser>) : {};
  } catch {
    return {};
  }
}

function writeDemoUsers(users: Record<string, DemoUser>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_USERS_STORAGE_KEY, JSON.stringify(users));
}

function readDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

function writeDemoSession(session: DemoSession | null) {
  if (typeof window === "undefined") return;

  if (session) {
    window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session));
    setAuthCookie();
  } else {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    clearAuthCookie();
  }
}

export async function getCurrentAuthContext(): Promise<AuthContext> {
  const demoSession = readDemoSession();
  if (demoSession) {
    return {
      userId: demoSession.id,
      email: demoSession.email,
      fullName: demoSession.full_name,
      isDemo: true,
    };
  }

  if (!isSupabaseClientConfigured) {
    return { userId: null, email: null, fullName: null, isDemo: false };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return { userId: null, email: null, fullName: null, isDemo: false };
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? null,
    fullName: session.user.user_metadata?.full_name ?? null,
    isDemo: false,
  };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseClientConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

    if (!error && data.session) {
      const userId = data.session.user.id;
      const fullName = data.session.user.user_metadata?.full_name ?? "Student Seller";
      const profileResult = await ensureUserProfile(userId, fullName);
      if (!profileResult.success) {
        return { success: false, message: profileResult.message ?? "Unable to create profile record." };
      }

      setAuthCookie();
      return { success: true, message: "Signed in successfully." };
    }
  }

  const demoUsers = readDemoUsers();
  const demoUser = demoUsers[normalizedEmail];
  if (demoUser && demoUser.password === password) {
    writeDemoSession({ id: demoUser.id, email: demoUser.email, full_name: demoUser.full_name });
    return { success: true, message: "Signed in successfully." };
  }

  return { success: false, message: "Invalid email or password." };
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  const demoUsers = readDemoUsers();
  if (demoUsers[normalizedEmail]) {
    return { success: false, message: "An account with that email already exists." };
  }

  if (isSupabaseClientConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
        },
      },
    });

    if (!error && data.session) {
      const userId = data.session.user.id;
      const profileResult = await ensureUserProfile(userId, trimmedName);
      if (!profileResult.success) {
        return { success: false, message: profileResult.message };
      }

      setAuthCookie();
      return {
        success: true,
        message: "Account created and signed in.",
        needsConfirmation: false,
      };
    }
  }

  const demoUser: DemoUser = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password,
    full_name: trimmedName || "Student Seller",
    created_at: new Date().toISOString(),
  };

  demoUsers[normalizedEmail] = demoUser;
  writeDemoUsers(demoUsers);
  writeDemoSession({ id: demoUser.id, email: demoUser.email, full_name: demoUser.full_name });

  return {
    success: true,
    message: "Account created and signed in.",
    needsConfirmation: false,
  };
}

export async function sendPasswordResetEmail(email: string): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseClientConfigured) {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
    });

    if (!error) {
      return {
        success: true,
        message: "Password reset email sent. Check your inbox.",
      };
    }
  }

  const demoUsers = readDemoUsers();
  if (demoUsers[normalizedEmail]) {
    return {
      success: true,
      message: "Password reset link prepared for this demo account.",
    };
  }

  return {
    success: false,
    message: "No demo account was found for that email.",
  };
}

export async function signOut() {
  if (isSupabaseClientConfigured) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      writeDemoSession(null);
      return { success: false, message: error.message };
    }
  }

  writeDemoSession(null);
  return { success: true, message: "Signed out successfully." };
}
