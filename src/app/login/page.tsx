import Link from "next/link";
import { Header } from "@/components/header";
import { authenticate, requestPasswordReset, resendConfirmation } from "@/app/auth/actions";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { DisabledSubmit, OutlineSubmitButton, SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authConfigured, currentAccount } from "@/lib/supabase/server";
import { industries } from "@/lib/moments";
import { safeNext } from "@/lib/app-origin";
import { redirect } from "next/navigation";

const niches = industries.filter((item) => item !== "All");

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
        <Card className="account-card login-card">
          <CardHeader className="login-card-header">
            <Badge variant="secondary" className="login-badge">{signup ? "Create an account" : verify ? "Confirm your email" : "Sign in"}</Badge>
            <h1>{signup ? "Join Momento." : verify ? "Confirm your inbox." : "Welcome back."}</h1>
            <CardDescription className="login-lede">
              {signup
                ? "Continue with Google — we take your name and email. Or use a password. Creators verify a social profile with 10,000+ followers before publishing. Brands verify their business before making offers."
                : verify
                  ? "A confirmation link was sent to your inbox. Open it, then sign in with the same password. Check spam and promotions if it is not in the primary inbox."
                  : "Continue with Google, or sign in with email."}
            </CardDescription>
          </CardHeader>
          <CardContent className="login-card-body">
            {!enabled && (
              <p className="sample-disclaimer">
                Account access is not configured yet. <Link href="/discover">Browse example campaigns</Link> in the meantime.
              </p>
            )}
            {verify && (
              <aside className="verify-banner" role="status">
                <strong>Confirm the email to sign in.</strong>
                <p>
                  Look for a message from Momento{email ? <> at <b>{email}</b></> : ""}. If nothing arrives within a few minutes, resend below and check spam. Open the newest confirmation email if you requested more than one.
                </p>
                <form action={resendConfirmation} className="verify-resend">
                  <input type="hidden" name="email" value={email || ""} />
                  <input type="hidden" name="next" value={next} />
                  <OutlineSubmitButton disabled={!email}>Resend confirmation email</OutlineSubmitButton>
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
                <fieldset className="role-choice">
                  <legend>I am joining as</legend>
                  <label>
                    <input type="radio" name="role" value="creator" defaultChecked={role !== "brand"} />
                    <span>
                      <strong>A creator</strong>
                      <small>Offer space on what you wear or carry. 10K+ followers on one platform required to publish.</small>
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
              )}
              {!verify && (
                <>
                  <GoogleAuthButton
                    enabled={enabled}
                    next={next}
                    signup={signup}
                    role={role === "brand" ? "brand" : "creator"}
                  />
                  <div className="auth-divider">
                    <Separator />
                    <span>or use email</span>
                    <Separator />
                  </div>
                </>
              )}
              {signup && (
                <>
                  <div className="auth-field">
                    <Label htmlFor="login-name">Your name or company</Label>
                    <Input id="login-name" name="name" autoComplete="name" required maxLength={100} className="auth-input" />
                  </div>
                  <div className="auth-field">
                    <Label htmlFor="login-handle">Handle <small>(optional)</small></Label>
                    <Input id="login-handle" name="handle" autoComplete="username" maxLength={32} placeholder="@you" className="auth-input" />
                  </div>
                  <div className="auth-field">
                    <Label htmlFor="login-niche">Niche</Label>
                    <select id="login-niche" name="niche" defaultValue="Lifestyle" className="auth-input">
                      {niches.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="auth-field">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" autoComplete="email" required defaultValue={email || ""} className="auth-input" />
              </div>
              <div className="auth-field">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete={signup ? "new-password" : "current-password"}
                  minLength={signup ? 8 : 1}
                  maxLength={128}
                  required
                  className="auth-input"
                />
              </div>
              {signup && <small>Use at least 8 characters. Google is faster if you have it.</small>}
              {enabled
                ? <SubmitButton idle={signup ? "Create account" : "Sign in"} pending={signup ? "Creating account…" : "Signing in…"} />
                : <DisabledSubmit>{signup ? "Create account" : "Sign in"}</DisabledSubmit>}
              {!signup && <small>New here? Create an account first. Unconfirmed addresses cannot sign in yet.</small>}
            </form>
          </CardContent>
          <CardFooter className="login-card-footer">
            <p>
              {signup ? "Already have an account?" : "Need an account?"}{" "}
              <Link className="underlined-link" href={switchHref}>{signup ? "Sign in" : "Create an account"}</Link>
            </p>
            {!signup && (
              <details>
                <summary>Forgot your password?</summary>
                <form action={requestPasswordReset} className="account-form">
                  <input type="hidden" name="next" value={next} />
                  <div className="auth-field">
                    <Label htmlFor="reset-email">Account email</Label>
                    <Input id="reset-email" type="email" name="email" required defaultValue={email || ""} className="auth-input" />
                  </div>
                  <OutlineSubmitButton disabled={!enabled}>Send reset link</OutlineSubmitButton>
                </form>
              </details>
            )}
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

