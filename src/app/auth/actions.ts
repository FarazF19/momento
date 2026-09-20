"use server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { appOrigin } from "@/lib/app-origin";

function message(value: string): never { redirect("/login?message=" + encodeURIComponent(value)); }
export async function authenticate(form: FormData) {
  const client = await supabaseServer();
  if (!client) message("Account access is opening soon. You can explore example ad spaces in the meantime.");
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const mode = String(form.get("mode"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length > 128) message("Enter a valid email and password.");
  if (mode === "signup") {
    if (password.length < 12) message("Choose a password with at least 12 characters.");
    const role = form.get("role");
    const name = String(form.get("name") || "").trim().slice(0, 100);
    if (!name || (role !== "brand" && role !== "creator")) message("Enter your name and choose a creator or brand account.");
    const origin = appOrigin();
    const { data, error } = await client.auth.signUp({
      email, password, options: { data: { name, role }, emailRedirectTo: new URL("/auth/callback", origin).toString() },
    });
    if (error) message("Could not create the account. Check the details or try again later.");
    if (data.session) redirect("/dashboard");
    message("Check your email to confirm your account, then sign in. If you already have an account, sign in instead.");
  }
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) message("Sign-in failed. Check your details and confirm your email before trying again.");
  redirect("/dashboard");
}
export async function signOut() {
  const client = await supabaseServer();
  if (client) await client.auth.signOut();
  redirect("/");
}
export async function requestPasswordReset(form: FormData) {
  const client = await supabaseServer();
  const email = String(form.get("email") || "").trim();
  if (!client) message("Account recovery is temporarily unavailable.");
  await client.auth.resetPasswordForEmail(email, { redirectTo: new URL("/auth/callback?next=/auth/reset", appOrigin()).toString() });
  message("If an account exists for this email, a password reset link will arrive shortly.");
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
