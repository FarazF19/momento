"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { authCallbackUrl } from "@/lib/app-origin";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.46.35 2.83.96 4.04l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export function GoogleAuthButton({
  enabled,
  next,
  role = "creator",
  signup = false,
}: {
  enabled: boolean;
  next: string;
  role?: "creator" | "brand";
  signup?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setError("");
    const client = supabaseBrowser();
    if (!client) {
      setError("Account access is not configured yet.");
      return;
    }
    setBusy(true);
    const chosen = (document.querySelector("input[name=role]:checked") as HTMLInputElement | null)?.value;
    const nextRole = chosen === "brand" || chosen === "creator" ? chosen : role;
    const { error: oauthError } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: authCallbackUrl(window.location.origin, next, signup ? nextRole : undefined),
        queryParams: { prompt: "select_account" },
      },
    });
    if (oauthError) {
      setBusy(false);
      setError(
        /provider is not enabled|unsupported provider/i.test(oauthError.message)
          ? "Google sign-in is not enabled yet. Use email below."
          : oauthError.message || "Google sign-in could not start.",
      );
    }
  }

  return (
    <div className="google-auth">
      <button className="button button-google" type="button" disabled={!enabled || busy} onClick={start}>
        <GoogleMark />
        {busy ? "Opening Google…" : "Continue with Google"}
      </button>
      {error && <p className="form-message" role="alert">{error}</p>}
    </div>
  );
}
