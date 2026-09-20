import Link from "next/link";
import { Header } from "@/components/header";
import { authenticate, requestPasswordReset } from "@/app/auth/actions";
import { authConfigured, currentAccount } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function Login({ searchParams }: { searchParams: Promise<{ mode?: string; message?: string; role?: string }> }) {
  const { mode, message, role } = await searchParams;
  if (await currentAccount()) redirect("/dashboard");
  const signup = mode === "signup";
  const enabled = authConfigured();
  return <><Header /><main className="account-page shell"><section className="account-card">
    <div className="eyebrow"><span /> {signup ? "Join Momento" : "Welcome back"}</div>
    <h1>{signup ? "What brings you here?" : "Welcome back."}</h1>
    <p>{signup ? "Choose your side of the marketplace. We’ll guide you to your first listing or brand offer." : "Sign in to pick up where you left off. Your next steps, listings, and offers are waiting."}</p>
    {!enabled && <p className="sample-disclaimer">Account access is opening soon. <Link href="/discover">Explore example placements</Link> while we prepare the marketplace.</p>}
    {message && <p className="form-message" role="status">{message}</p>}
    <form action={authenticate} className="account-form">
      <input type="hidden" name="mode" value={signup ? "signup" : "login"} />
      {signup && <><fieldset className="role-choice"><legend>I want to…</legend><label><input type="radio" name="role" value="creator" defaultChecked={role !== "brand"} /><span><strong>Offer my ad space</strong><small>I’m a creator. I choose the item, price, and brands.</small></span></label><label><input type="radio" name="role" value="brand" defaultChecked={role === "brand"} /><span><strong>Get my brand out there</strong><small>I’m a brand. I find a space and make an offer.</small></span></label></fieldset><label>Your name or company<input name="name" autoComplete="name" required maxLength={100} /></label></>}
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 12 : 1} maxLength={128} required /></label>
      {signup && <small>Use at least 12 characters. Verify your email to open your dashboard.</small>}
      <button disabled={!enabled} className="button button-primary" type="submit">{signup ? "Create my account" : "Sign in"}</button>
    </form>
    <p>{signup ? "Already a member?" : "New here?"} <Link className="underlined-link" href={signup ? "/login" : "/login?mode=signup"}>{signup ? "Sign in" : "Create an account"}</Link></p>
    {!signup && <details><summary>Forgot your password?</summary><form action={requestPasswordReset} className="account-form"><label>Account email<input type="email" name="email" required /></label><button disabled={!enabled} className="button button-outline">Send reset link</button></form></details>}
  </section></main></>;
}
