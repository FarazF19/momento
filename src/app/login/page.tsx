import Link from "next/link";
import { Header } from "@/components/header";
import { authenticate, requestPasswordReset, resendConfirmation } from "@/app/auth/actions";
import { authConfigured, currentAccount } from "@/lib/supabase/server";
import { safeNext } from "@/lib/app-origin";
import { redirect } from "next/navigation";

export default async function Login({ searchParams }: { searchParams: Promise<{ mode?: string; message?: string; role?: string; notice?: string; email?: string; next?: string }> }) {
  const { mode, message, role, notice, email, next: nextParam } = await searchParams;
  const next = safeNext(nextParam);
  if (await currentAccount()) redirect(next);
  const signup = mode === "signup";
  const enabled = authConfigured();
  const verify = notice === "verify";
  const switchHref = signup
    ? `/login?next=${encodeURIComponent(next)}`
    : `/login?mode=signup&role=creator&next=${encodeURIComponent(next)}`;

  return (
    <>
      <Header />
      <main className="account-page shell">
        <section className="account-card">
          <div className="eyebrow"><span /> {signup ? "Create an account" : verify ? "Confirm your email" : "Sign in"}</div>
          <h1>{signup ? "Join Momento." : verify ? "Confirm your inbox." : "Welcome back."}</h1>
          <p>
            {signup
              ? "Create a creator or brand account. After your email is confirmed, we will take you to the next step — listing slots or browsing campaigns."
              : verify
                ? "A confirmation link was sent to your inbox. Open it, then sign in with the same password. Check spam and promotions if it is not in the primary inbox."
                : "Sign in to manage listings, offers, and your campaign page."}
          </p>
          {!enabled && (
            <p className="sample-disclaimer">
              Account access is not configured yet. <Link href="/discover">Browse example campaigns</Link> in the meantime.
            </p>
          )}
          {verify && (
            <aside className="verify-banner" role="status">
              <strong>Confirm the email to sign in.</strong>
              <p>
                Look for a message from Momento{email ? <> at <b>{email}</b></> : ""}. If nothing arrives within a few minutes, resend below and check spam. On this development machine, resending can confirm the address so you can continue without the inbox.
              </p>
              <form action={resendConfirmation} className="verify-resend">
                <input type="hidden" name="email" value={email || ""} />
                <input type="hidden" name="next" value={next} />
                <button className="button button-outline" type="submit" disabled={!email}>Resend confirmation email</button>
              </form>
            </aside>
          )}
          {message && !verify && (/confirm|email first|inbox/i.test(message)
            ? <aside className="verify-banner" role="status"><strong>Confirm the email to sign in.</strong><p>{message}</p></aside>
            : <p className="form-message" role="status">{message}</p>)}
          <form action={authenticate} className="account-form">
            <input type="hidden" name="mode" value={signup ? "signup" : "login"} />
            <input type="hidden" name="next" value={next} />
            {signup && (
              <>
                <fieldset className="role-choice">
                  <legend>I am joining as</legend>
                  <label>
                    <input type="radio" name="role" value="creator" defaultChecked={role !== "brand"} />
                    <span>
                      <strong>A creator</strong>
                      <small>List numbered ad slots on clothing, kits, or event outfits.</small>
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="role" value="brand" defaultChecked={role === "brand"} />
                    <span>
                      <strong>A brand</strong>
                      <small>Browse campaigns and send offers on this site.</small>
                    </span>
                  </label>
                </fieldset>
                <label>Your name or company<input name="name" autoComplete="name" required maxLength={100} /></label>
              </>
            )}
            <label>Email<input name="email" type="email" autoComplete="email" required defaultValue={email || ""} /></label>
            <label>
              Password
              <input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 12 : 1} maxLength={128} required />
            </label>
            {signup && <small>Use at least 12 characters. We send a confirmation link before you can sign in.</small>}
            <button disabled={!enabled} className="button button-primary" type="submit">{signup ? "Create account" : "Sign in"}</button>
            {!signup && <small>New here? Create an account first. Unconfirmed addresses cannot sign in yet.</small>}
          </form>
          <p>
            {signup ? "Already have an account?" : "Need an account?"}{" "}
            <Link className="underlined-link" href={switchHref}>{signup ? "Sign in" : "Create an account"}</Link>
          </p>
          {!signup && (
            <details>
              <summary>Forgot your password?</summary>
              <form action={requestPasswordReset} className="account-form">
                <input type="hidden" name="next" value={next} />
                <label>Account email<input type="email" name="email" required defaultValue={email || ""} /></label>
                <button disabled={!enabled} className="button button-outline">Send reset link</button>
              </form>
            </details>
          )}
        </section>
      </main>
    </>
  );
}
