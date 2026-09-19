import Link from "next/link";
import { Header } from "@/components/header";
import { authenticate, requestPasswordReset } from "@/app/auth/actions";
import { authConfigured } from "@/lib/supabase/server";
export default async function Login({ searchParams }: { searchParams: Promise<{ mode?: string; message?: string; role?: string }> }) {
  const { mode, message, role } = await searchParams;
  const signup = mode === "signup";
  const enabled = authConfigured();
  return <><Header /><main className="account-page shell"><section className="account-card">
    <div className="eyebrow"><span /> {signup ? "Join Momento" : "Welcome back"}</div>
    <h1>{signup ? "A small space.\nA new opportunity." : "Your marketplace,\nall in one place."}</h1>
    <p>{signup ? "Creators list everyday ad space. Brands find the right fit and make an offer." : "Sign in to manage your placements and offers."}</p>
    {!enabled && <p className="sample-disclaimer">Account access is opening soon. <Link href="/discover">Explore example placements</Link> while we prepare the marketplace.</p>}
    {message && <p className="form-message" role="status">{message}</p>}
    <form action={authenticate} className="account-form">
      <input type="hidden" name="mode" value={signup ? "signup" : "login"} />
      {signup && <><label>Your name or company<input name="name" autoComplete="name" required maxLength={100} /></label><label>I’m here as a<select name="role" defaultValue={role === "brand" ? "brand" : "creator"}><option value="creator">Creator — list my ad space</option><option value="brand">Brand — find placements</option></select></label></>}
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Password<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={12} maxLength={128} required /></label>
      <small>Use at least 12 characters. We’ll ask you to verify your email.</small>
      <button disabled={!enabled} className="button button-primary" type="submit">{signup ? "Create account" : "Sign in"}</button>
    </form>
    <p>{signup ? "Already a member?" : "New here?"} <Link className="underlined-link" href={signup ? "/login" : "/login?mode=signup"}>{signup ? "Sign in" : "Create an account"}</Link></p>
    {!signup && <details><summary>Forgot your password?</summary><form action={requestPasswordReset} className="account-form"><label>Account email<input type="email" name="email" required /></label><button disabled={!enabled} className="button button-outline">Send reset link</button></form></details>}
  </section></main></>;
}
