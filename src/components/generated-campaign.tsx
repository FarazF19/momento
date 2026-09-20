"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CampaignView } from "./campaign-view";
import { CAMPAIGN_NAME_STORE, CAMPAIGN_STORE } from "./prompt-builder";
import { CAMPAIGN_DRAFT_STORE, draftToMoment, parseDraft } from "@/lib/campaign-draft";
import { generateCampaign } from "@/lib/campaign-prompt";
import type { Moment } from "@/lib/moments";

export function GeneratedCampaign() {
  const { id } = useParams<{ id: string }>();
  const [moment, setMoment] = useState<Moment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const draft = parseDraft(sessionStorage.getItem(CAMPAIGN_DRAFT_STORE));
      if (draft) {
        setMoment(draftToMoment(draft));
        return;
      }
      const prompt = sessionStorage.getItem(CAMPAIGN_STORE) || "";
      const name = sessionStorage.getItem(CAMPAIGN_NAME_STORE) || "";
      setMoment(generateCampaign(prompt, name ? { name } : undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build that page.");
    }
  }, [id]);

  if (moment) return <CampaignView moment={moment} generated />;
  return (
    <main className="campaign-page shell">
      <h1>{error ? "We need your description again." : "Building your page…"}</h1>
      {error && <p className="form-message error">{error}</p>}
      <Link href="/studio" className="button button-outline">Return to the builder</Link>
    </main>
  );
}
