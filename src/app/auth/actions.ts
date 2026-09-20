"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { appOrigin, authCallbackUrl, safeNext } from "@/lib/app-origin";

function loginUrl(params: Record<string, string>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  return "/login?" + query.toString();
}

function message(value: string, extra: Record<string, string> = {}): never {
  redirect(loginUrl({ message: value, ...extra }));
}

function verifyNotice(email: string, next: string): never {
  redirect(loginUrl({
    notice: "verify",
    email,
    next,
    message: "Open the confirmation email, then sign in with the same password.",
  }));
}

async function redirectOrigin() {
  const fallback = appOrigin();
  try {
    const headerStore = await headers();
    const host = (headerStore.get("x-forwarded-host") || headerStore.get("host") || "").split(",")[0].trim().toLowerCase();
    const proto = (headerStore.get("x-forwarded-proto") || (process.env.NODE_ENV === "development" ? "http" : "https")).split(",")[0].trim();
    if (!host) return fallback;
    const origin = new URL(`${proto}://${host}`).origin;
    const allowed = new Set([fallback, "http://localhost:3000", "http://127.0.0.1:3000"]);
    return allowed.has(origin) ? origin : fallback;
  } catch {
    return fallback;
  }
}

function publicAuthError(error: { message?: string; code?: string } | null) {
  if (!error) return "";
  const text = error.message || "";
  const code = error.code || "";
  if (code === "email_address_invalid" || /invalid/i.test(text) && /email/i.test(text)) {
    return "That email address is not accepted. Use a real inbox you can open.";
  }
  if (code === "over_email_send_rate_limit" || /rate limit/i.test(text)) {
    return "Confirmation emails are rate-limited right now. Wait a minute, or continue on this development machine without the inbox.";
  }
  if (/already registered|already been registered/i.test(text)) {
    return "An account already exists for this email. Sign in instead.";
  }
  if (/redirect/i.test(text)) {
    return "Confirmation could not be sent because this site’s callback URL is not allowed in Supabase Auth.";
  }
  return "";
}

async function createConfirmedUserLocally(email: string, password: string, name: string, role: string) {
  if (process.env.NODE_ENV !== "development") return false;
  const admin = adminClient();
  if (!admin) return false;
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  });
  if (!error) return true;
  if (/already/i.test(error.message || "")) return confirmEmailLocally(email);
  return false;
}

async function confirmEmailLocally(email: string) {
  if (process.env.NODE_ENV !== "development") return false;
  const admin = adminClient();
  if (!admin) return false;
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return false;
  const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
  if (!user) return false;
  const { error: updateError } = await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
  return !updateError;
}

async function signInAndGo(
  client: NonNullable<Awaited<ReturnType<typeof supabaseServer>>>,
  email: string,
  password: string,
  next: string,
) {
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    const needsEmail = error.code === "email_not_confirmed" || /confirm/i.test(error.message || "");
    if (needsEmail && await confirmEmailLocally(email)) {
      const retry = await client.auth.signInWithPassword({ email, password });
      if (!retry.error) redirect(next);
    }
    if (needsEmail) verifyNotice(email, next);
    message("Those details did not match. If you just created an account, confirm the email first, then sign in.", { next, email });
  }
  redirect(next);
}

export async function authenticate(form: FormData) {
  const client = await supabaseServer();
  if (!client) message("Account access is not configured yet. You can still browse example campaigns.");
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const mode = String(form.get("mode"));
  const next = safeNext(String(form.get("next") || ""));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length > 128) {
    message("Enter a valid email and password.", { next, mode: mode === "signup" ? "signup" : "" });
  }
  if (mode === "signup") {
    if (password.length < 12) message("Choose a password with at least 12 characters.", { next, mode: "signup" });
    const role = form.get("role");
    const name = String(form.get("name") || "").trim().slice(0, 100);
    if (!name || (role !== "brand" && role !== "creator")) {
      message("Enter your name and choose a creator or brand account.", { next, mode: "signup" });
    }
    const origin = await redirectOrigin();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { name, role }, emailRedirectTo: authCallbackUrl(origin, next) },
    });
    if (error) {
      const created = await createConfirmedUserLocally(email, password, name, String(role));
      if (created) await signInAndGo(client, email, password, next);
      message(publicAuthError(error) || "We could not create the account. Check the details or try again in a moment.", { mode: "signup", next, email });
    }
    if (data.user && (data.user.identities?.length ?? 1) === 0) {
      message("An account already exists for this email. Sign in instead.", { next, email });
    }
    if (data.session) redirect(next);
    if (await confirmEmailLocally(email)) await signInAndGo(client, email, password, next);
    verifyNotice(email, next);
  }
  await signInAndGo(client, email, password, next);
}

export async function signOut() {
  const client = await supabaseServer();
  if (client) await client.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(form: FormData) {
  const client = await supabaseServer();
  const email = String(form.get("email") || "").trim();
  const next = safeNext(String(form.get("next") || ""));
  if (!client) message("Account recovery is temporarily unavailable.", { next });
  const origin = await redirectOrigin();
  await client.auth.resetPasswordForEmail(email, { redirectTo: authCallbackUrl(origin, "/auth/reset") });
  message("If an account exists for this email, a password reset link will arrive shortly.", { next, email });
}

export async function resetPassword(form: FormData) {
  const client = await supabaseServer();
  const password = String(form.get("password") || "");
  if (!client || password.length < 12 || password.length > 128) message("Choose a password between 12 and 128 characters.");
  const { data: { user } } = await client.auth.getUser();
  if (!user) message("Your reset link expired. Request a new one.");
  const { error } = await client.auth.updateUser({ password });
  if (error) message("Password could not be updated. Request a new reset link.");
  await client.auth.signOut({ scope: "global" });
  message("Password updated. Sign in with your new password.");
}

export async function resendConfirmation(form: FormData) {
  const client = await supabaseServer();
  const email = String(form.get("email") || "").trim();
  const next = safeNext(String(form.get("next") || ""));
  if (!client || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) message("Enter the email you used to sign up.", { next });
  const origin = await redirectOrigin();
  const { error } = await client.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: authCallbackUrl(origin, next) },
  });
  if (error) {
    if (await confirmEmailLocally(email)) {
      message("Your email is confirmed. Sign in with your password to continue.", { email, next });
    }
    message(publicAuthError(error) || "We could not resend the email. Wait a minute, check spam, then try again.", { notice: "verify", email, next });
  }
  if (await confirmEmailLocally(email)) {
    message("Your email is confirmed. Sign in with your password to continue.", { email, next });
  }
  verifyNotice(email, next);
}
