"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { campaignIdFromPrompt } from "@/lib/campaign-prompt";
import { ArrowIcon } from "./icons";

const samples = [
  "I'm running a city marathon in Berlin on May 3. 6 slots on my kit from $200 to $800.",
  "Wearing a black dress at a product launch in London. 8 spots, $250 to $900.",
  "Chest and sleeves on my hoodie for a week of studio days in Lisbon. 5 slots at $150.",
];

export const CAMPAIGN_STORE = "momento-campaign-prompt";
export const CAMPAIGN_NAME_STORE = "momento-campaign-name";

export function PromptBuilder({ signedIn = false, dark = false, creatorName = "" }: { signedIn?: boolean; dark?: boolean; creatorName?: string }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(CAMPAIGN_STORE);
    if (saved) setPrompt(saved);
  }, []);

  function go(next = prompt) {
    const text = next.trim();
    if (text.length < 12) {
      setError("Write one sentence: who you are, the event, how many slots, and a price range.");
      return;
    }
    setError("");
    setBusy(true);
    sessionStorage.setItem(CAMPAIGN_STORE, text);
    if (creatorName) sessionStorage.setItem(CAMPAIGN_NAME_STORE, creatorName);
    if (!signedIn) {
      router.push("/login?mode=signup&role=creator&next=/studio");
      return;
    }
    router.push(`/campaigns/${campaignIdFromPrompt(text)}`);
  }

  return (
    <form className={`prompt-box${dark ? " is-dark" : ""}`} onSubmit={(event) => { event.preventDefault(); go(); }}>
      <label htmlFor="campaign-prompt">Describe your campaign</label>
      <textarea
        id="campaign-prompt"
        name="prompt"
        rows={4}
        maxLength={280}
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="I’m running a city marathon in Berlin. 6 slots on my kit, $200–$800."
      />
      <div className="prompt-examples">
        {samples.map((sample) => (
          <button key={sample} type="button" onClick={() => { setPrompt(sample); setError(""); }}>
            {sample}
          </button>
        ))}
      </div>
      {error && <p className="form-message error" role="alert">{error}</p>}
      <button className="button button-primary button-large" type="submit" disabled={busy}>
        {busy ? (signedIn ? "Opening your page…" : "Continue…") : signedIn ? "Preview my page" : "Create an account to continue"} <ArrowIcon />
      </button>
      <p className="prompt-note">
        {signedIn
          ? "We map your slots onto a Momento page. Brands offer here — the page will not reuse another creator’s photos."
          : "Sign in or create an account first. We then help you build your own campaign page."}
      </p>
    </form>
  );
}
