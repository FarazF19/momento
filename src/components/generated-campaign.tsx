"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CampaignView } from "./campaign-view";
import { CAMPAIGN_NAME_STORE, CAMPAIGN_STORE } from "./prompt-builder";
import { CAMPAIGN_DRAFT_STORE, draftToMoment, parseDraft } from "@/lib/campaign-draft";
import { generateCampaign } from "@/lib/campaign-prompt";

function readKey(key: string) {
  return () => sessionStorage.getItem(key) ?? "";
}

export function GeneratedCampaign() {
  const rawDraft = useSyncExternalStore(() => () => {}, readKey(CAMPAIGN_DRAFT_STORE), () => null);
  const rawPrompt = useSyncExternalStore(() => () => {}, readKey(CAMPAIGN_STORE), () => "");
  const rawName = useSyncExternalStore(() => () => {}, readKey(CAMPAIGN_NAME_STORE), () => "");

  const { moment, error } = useMemo(() => {
    try {
      const draft = parseDraft(rawDraft);
      if (draft) return { moment: draftToMoment(draft), error: "" };
      if (rawDraft === null) return { moment: null, error: "" };
      return { moment: generateCampaign(rawPrompt, rawName ? { name: rawName } : undefined), error: "" };
    } catch (err) {
      return { moment: null, error: err instanceof Error ? err.message : "Could not build that page." };
    }
  }, [rawDraft, rawPrompt, rawName]);

  if (moment) return <CampaignView moment={moment} generated />;
  return (
    <main className="campaign-page shell">
      <h1>{error ? "We need your description again." : "Building your page…"}</h1>
      {error && <p className="form-message error">{error}</p>}
      <Link href="/studio" className="button button-outline">Return to the builder</Link>
    </main>
  );
}
