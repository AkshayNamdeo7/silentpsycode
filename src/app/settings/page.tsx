"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, LogOut, KeyRound, UserRound, ShieldCheck, Check, AlertTriangle } from "lucide-react";
import { getCurrentAuthContext, signOut, signInWithEmail, sendPasswordResetEmail } from "@/lib/auth";
import { fetchUserProfile, updateUserProfile } from "@/lib/profiles";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import PasswordToggleInput from "@/components/auth/password-toggle-input";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ success: boolean; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Settings | Silent Psycode";
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const authContext = await getCurrentAuthContext();
      if (cancelled) return;

      if (!authContext.userId) {
        setLoading(false);
        return;
      }

      setUserId(authContext.userId);
      setEmail(authContext.email ?? "");
      setFullName(authContext.fullName ?? "");

      const profile = await fetchUserProfile(authContext.userId);
      if (cancelled) return;

      if (profile) {
        setFullName(profile.full_name ?? authContext.fullName ?? "");
        setCity(profile.city ?? "");
        setPhone(profile.phone ?? "");
        setMemberSince(
          profile.created_at
            ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
            : null
        );
      }

      setLoading(false);
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) return;

    setProfileMessage(null);
    if (!fullName.trim()) {
      setProfileMessage({ success: false, text: "Please enter your display name." });
      return;
    }

    setProfileSaving(true);
    const result = await updateUserProfile(userId, { full_name: fullName, city, phone });
    setProfileMessage({ success: result.success, text: result.message });
    setProfileSaving(false);
  };

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage(null);

    if (!email) {
      setPasswordError("Unable to verify your account.");
      return;
    }
    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (confirmPassword !== newPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordError(null);
    setPasswordSaving(true);

    const verify = await signInWithEmail(email, currentPassword);
    if (!verify.success) {
      setPasswordMessage({ success: false, text: "Current password is incorrect." });
      setPasswordSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMessage({ success: false, text: error.message });
    } else {
      setPasswordMessage({
        success: true,
        text: "Password updated. Use your new password the next time you sign in.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPasswordSaving(false);
  };

  const handleSendResetLink = async () => {
    setResetMessage(null);
    if (!email) return;
    const result = await sendPasswordResetEmail(email);
    setResetMessage(result.success ? "Reset link sent. Check your inbox." : result.message);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 text-slate-400">
        Loading your settings...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.7)]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Manage your account</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Update the profile details buyers see, secure your sign-in, and control the info connected to your listings.
          </p>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]"
      >
        <div className="space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Profile information</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Details buyers can see</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="fullName">
                  Display name
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="city">
                  City
                </label>
                <Input
                  id="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="City where your books are"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="phone">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Contact number"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                Saved to your profile and shown on your seller page and listings.
              </p>
              <Button type="submit" disabled={profileSaving} className="w-full sm:w-auto">
                {profileSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>

            {profileMessage ? (
              <div
                className={`mt-6 flex items-start gap-3 rounded-[1.5rem] border px-5 py-4 text-sm ${
                  profileMessage.success
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                    : "border-rose-500/25 bg-rose-500/10 text-rose-200"
                }`}
              >
                {profileMessage.success ? (
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
                {profileMessage.text}
              </div>
            ) : null}
          </form>

          <form
            onSubmit={handleChangePassword}
            className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Security</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Change password</h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-400">
              Your current password is verified before the change is applied.
            </p>

            <div className="mt-6 space-y-6">
              <PasswordToggleInput
                id="currentPassword"
                label="Current password"
                placeholder="Your current password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <PasswordToggleInput
                  id="newPassword"
                  label="New password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={setNewPassword}
                />
                <PasswordToggleInput
                  id="confirmPassword"
                  label="Confirm new password"
                  placeholder="Repeat the new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>
            </div>

            {passwordError ? <p className="mt-4 text-sm text-rose-400">{passwordError}</p> : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-400">
                Can&apos;t remember your password?{" "}
                <button
                  type="button"
                  onClick={handleSendResetLink}
                  className="text-sky-300 underline-offset-4 hover:underline"
                >
                  Send a reset link
                </button>
                {resetMessage ? (
                  <span className="ml-1 text-slate-300">{resetMessage}</span>
                ) : null}
              </div>
              <Button type="submit" variant="secondary" disabled={passwordSaving} className="w-full sm:w-auto">
                {passwordSaving ? "Updating..." : "Update password"}
              </Button>
            </div>

            {passwordMessage ? (
              <div
                className={`mt-6 flex items-start gap-3 rounded-[1.5rem] border px-5 py-4 text-sm ${
                  passwordMessage.success
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                    : "border-rose-500/25 bg-rose-500/10 text-rose-200"
                }`}
              >
                {passwordMessage.success ? (
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
                {passwordMessage.text}
              </div>
            ) : null}
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Account</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Account information</h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Email address</p>
                <p className="mt-2 flex items-center gap-2 break-all text-sm font-semibold text-white">
                  <Mail className="h-4 w-4 flex-shrink-0 text-sky-300" />
                  {email || "Not available"}
                </p>
                <p className="mt-2 text-sm text-slate-400">Used to sign in and receive reset links.</p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Member since</p>
                <p className="mt-2 text-sm font-semibold text-white">{memberSince ?? "Not available"}</p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Signed in as</p>
                <p className="mt-2 text-sm font-semibold text-white">{fullName || "You"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-rose-500/20 bg-slate-950/95 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.75)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-300">
                <LogOut className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Session</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Sign out</h2>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-slate-400">
              Sign out of this device. You can sign back in anytime with your email and password.
            </p>
            <Button variant="ghost" className="mt-6 w-full border border-white/10 text-rose-200 hover:bg-rose-500/10" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}