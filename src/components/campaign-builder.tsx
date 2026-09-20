"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/moments";
import {
  CAMPAIGN_DRAFT_STORE,
  TEMPLATES,
  clampSlotCount,
  draftId,
  draftToMoment,
  listingFields,
  parseDraft,
  shareText,
  slotPrice,
  type CampaignDraft,
  type PlacementTemplate,
} from "@/lib/campaign-draft";
import { CampaignStage } from "./campaign-stage";
import { ArrowIcon } from "./icons";

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function starterDraft(creatorName: string, handle?: string, niche?: string): CampaignDraft {
  const start = todayISO();
  return {
    eventName: "",
    startDate: start,
    endDate: start,
    city: "",
    country: "",
    description: "",
    template: "body",
    slotCount: 6,
    photos: [],
    priceMode: "ask",
    price: 250,
    wornFullEvent: true,
    photoProof: true,
    exclusive: true,
    socialMention: false,
    restrictions: "",
    handle: handle || "",
    niche: niche || "Lifestyle",
    creatorName,
  };
}

async function resizePhoto(file: File): Promise<string> {
  const blobUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const node = new Image();
      node.onload = () => resolve(node);
      node.onerror = () => reject(new Error("Could not read that photo."));
      node.src = blobUrl;
    });
    const max = 900;
    const scale = Math.min(1, max / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not resize that photo.");
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function missingFields(draft: CampaignDraft) {
  if (!draft.eventName.trim()) return "Add the event name.";
  if (!draft.startDate) return "Choose a start date.";
  if (!draft.endDate) return "Choose an end date.";
  if (draft.endDate < draft.startDate) return "End date must be on or after the start.";
  if (!draft.city.trim()) return "Add the city.";
  if (!draft.country.trim()) return "Add the country.";
  if (draft.priceMode === "ask" && slotPrice(draft) < 1) return "Set an asking price per slot.";
  return "";
}

export function CampaignBuilder({
  creatorName,
  handle = "",
  niche = "",
  signedIn = false,
}: {
  creatorName: string;
  handle?: string;
  niche?: string;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<CampaignDraft>(() => starterDraft(creatorName, handle, niche));
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = parseDraft(sessionStorage.getItem(CAMPAIGN_DRAFT_STORE));
    if (saved) {
      setDraft({
        ...saved,
        creatorName: saved.creatorName || creatorName,
        handle: saved.handle || handle || saved.handle,
        niche: saved.niche || niche || "Lifestyle",
      });
    } else {
      setDraft(starterDraft(creatorName, handle, niche));
    }
    setReady(true);
  }, [creatorName, handle, niche]);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(CAMPAIGN_DRAFT_STORE, JSON.stringify(draft));
  }, [draft, ready]);

  const moment = useMemo(() => draftToMoment(draft), [draft]);
  const slots = moment.slots ?? [];

  function patch(update: Partial<CampaignDraft>) {
    setShareUrl("");
    setCopied(false);
    setMessage("");
    setDraft((current) => ({ ...current, ...update }));
  }

  function setStartDate(startDate: string) {
    setDraft((current) => ({
      ...current,
      startDate,
      endDate: !current.endDate || current.endDate === current.startDate ? startDate : current.endDate,
    }));
    setShareUrl("");
    setMessage("");
  }

  async function onPhotos(files: FileList | null) {
    if (!files?.length) return;
    const room = Math.max(0, 3 - draft.photos.length);
    const chosen = Array.from(files).slice(0, room);
    if (!chosen.length) {
      setMessage("You can add up to three photos.");
      return;
    }
    try {
      const next = [];
      for (const file of chosen) next.push(await resizePhoto(file));
      patch({ photos: [...draft.photos, ...next].slice(0, 3) });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add that photo.");
    }
  }

  function goLogin() {
    router.push("/login?mode=signup&role=creator&next=/studio");
  }

  function previewPage() {
    if (!signedIn) return goLogin();
    const error = missingFields(draft);
    if (error) {
      setMessage(error);
      return;
    }
    sessionStorage.setItem(CAMPAIGN_DRAFT_STORE, JSON.stringify(draft));
    router.push(`/campaigns/${draftId(draft)}`);
  }

  async function publish(event: React.FormEvent) {
    event.preventDefault();
    if (!signedIn) return goLogin();
    const error = missingFields(draft);
    if (error) {
      setMessage(error);
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingFields(draft)),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not publish this page.");
      const path = result.listingUrl || (result.reference ? `/placements/${result.reference}` : "");
      if (!path) throw new Error("Published, but no share link came back.");
      setShareUrl(new URL(path, window.location.origin).toString());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish this page.");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  return (
    <form className="studio-builder" onSubmit={publish}>
      <div className="studio-builder-fields">
        <header className="studio-builder-intro">
          <div className="eyebrow"><span /> Build your page</div>
          <h1>Your campaign.<br />On Momento.</h1>
          <p>Four short steps. The map updates as you type. Brands will offer on this page — not on someone else’s photos.</p>
        </header>

        <section className="form-section studio-section">
          <div className="form-section-title"><span>01</span><div><h2>Event</h2><p>Name, dates, and where it happens.</p></div></div>
          <div className="form-grid two">
            <label className="wide"><span>Event name</span><input value={draft.eventName} onChange={(event) => patch({ eventName: event.target.value })} maxLength={180} required placeholder="Berlin marathon, product launch…" /></label>
            <label><span>Starts</span><input type="date" value={draft.startDate} onChange={(event) => setStartDate(event.target.value)} required /></label>
            <label><span>Ends</span><input type="date" value={draft.endDate} min={draft.startDate} onChange={(event) => patch({ endDate: event.target.value })} required /></label>
            <label><span>City</span><input value={draft.city} onChange={(event) => patch({ city: event.target.value })} required placeholder="Berlin" /></label>
            <label><span>Country</span><input value={draft.country} onChange={(event) => patch({ country: event.target.value })} required placeholder="Germany" /></label>
            <label className="wide"><span>Description (optional)</span><textarea rows={3} value={draft.description || ""} onChange={(event) => patch({ description: event.target.value })} placeholder="What happens, who will see the slots, anything brands should know." /></label>
          </div>
        </section>

        <section className="form-section studio-section">
          <div className="form-section-title"><span>02</span><div><h2>Template</h2><p>Pick a map, then set 4–15 numbered zones.</p></div></div>
          <div className="studio-templates">
            {TEMPLATES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`studio-template${draft.template === item.id ? " is-on" : ""}`}
                onClick={() => patch({ template: item.id as PlacementTemplate })}
              >
                <b>{item.label}</b>
                <small>{item.category}</small>
              </button>
            ))}
          </div>
          <label className="studio-slots">
            <span>Slot count · {clampSlotCount(draft.slotCount)}</span>
            <input type="range" min={4} max={15} value={clampSlotCount(draft.slotCount)} onChange={(event) => patch({ slotCount: Number(event.target.value) })} />
          </label>
        </section>

        <section className="form-section studio-section">
          <div className="form-section-title"><span>03</span><div><h2>Photos</h2><p>Add 1–3 photos of you in the item. We resize them here.</p></div></div>
          <div className="studio-photos">
            {draft.photos.map((photo, index) => (
              <figure key={`${photo.slice(0, 24)}-${index}`} className="studio-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" />
                <button type="button" onClick={() => patch({ photos: draft.photos.filter((_, item) => item !== index) })}>Remove</button>
              </figure>
            ))}
            {draft.photos.length < 3 && (
              <label className="studio-upload">
                <span>{draft.photos.length ? "Add another" : "Upload a photo"}</span>
                <input type="file" accept="image/*" multiple onChange={(event) => { void onPhotos(event.target.files); event.target.value = ""; }} />
              </label>
            )}
          </div>
          <p className="studio-hint">No photo yet? The numbered map uses a generic placeholder — never another creator’s picture.</p>
        </section>

        <section className="form-section studio-section">
          <div className="form-section-title"><span>04</span><div><h2>Price & terms</h2><p>Ask a number, or let brands offer.</p></div></div>
          <div className="studio-price-modes">
            <button type="button" className={draft.priceMode === "ask" ? "is-on" : ""} onClick={() => patch({ priceMode: "ask" })}>Ask a price</button>
            <button type="button" className={draft.priceMode === "offer" ? "is-on" : ""} onClick={() => patch({ priceMode: "offer" })}>Let brands offer</button>
          </div>
          {draft.priceMode === "ask" && (
            <label><span>Price per slot (USD)</span><input type="number" min={1} max={100000} step="0.01" value={draft.price || ""} onChange={(event) => patch({ price: Number(event.target.value) })} required /></label>
          )}
          <div className="studio-checks">
            <label><input type="checkbox" checked={draft.wornFullEvent} onChange={(event) => patch({ wornFullEvent: event.target.checked })} /><span>Worn for the full event</span></label>
            <label><input type="checkbox" checked={draft.photoProof} onChange={(event) => patch({ photoProof: event.target.checked })} /><span>Photo proof on this page</span></label>
            <label><input type="checkbox" checked={draft.exclusive} onChange={(event) => patch({ exclusive: event.target.checked })} /><span>One brand per numbered slot</span></label>
            <label><input type="checkbox" checked={draft.socialMention} onChange={(event) => patch({ socialMention: event.target.checked })} /><span>Social mention (off unless agreed)</span></label>
          </div>
          <label className="wide"><span>Restrictions (optional)</span><textarea rows={2} value={draft.restrictions || ""} onChange={(event) => patch({ restrictions: event.target.value })} placeholder="No alcohol, no competing race brand…" /></label>
        </section>
      </div>

      <aside className="studio-builder-preview">
        <div className="studio-preview-card">
          <div className="studio-preview-stage">
            <CampaignStage kind={moment.bodyKind || "body"} slots={slots} photo={moment.photoUrl} template={draft.template} />
          </div>
          <div className="studio-preview-copy">
            <p className="studio-preview-kicker">{moment.city} · {moment.dates}</p>
            <strong>{moment.creator.name}</strong>
            <p>{moment.title}</p>
            <b>{moment.raisedLabel}</b>
          </div>
          <ul className="slot-list studio-preview-slots">
            {slots.map((slot, index) => (
              <li key={slot.id}>
                <i style={{ background: slot.color }} />
                <b>{String(index + 1).padStart(2, "0")} {slot.name}</b>
                <span>{slot.brand}</span>
                <strong>{formatPrice(slot.price)}</strong>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="studio-builder-actions">
        {shareUrl && (
          <div className="studio-share">
            <b>Your page is live.</b>
            <p>Share this link with brands:</p>
            <input readOnly value={shareUrl} />
            <div className="studio-share-row">
              <button type="button" className="button button-outline" onClick={() => void copyLink()}>{copied ? "Copied" : "Copy link"}</button>
              <a className="button button-dark" href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText(draft, shareUrl))}`} target="_blank" rel="noreferrer">Share on X</a>
            </div>
          </div>
        )}
        {message && <p className="form-message error" role="alert">{message}</p>}
        <button className="button button-primary button-large studio-publish" type="submit" disabled={busy}>
          {busy ? "Publishing…" : "Publish"} <ArrowIcon />
        </button>
        <button className="button button-outline" type="button" onClick={previewPage}>Preview full page</button>
      </div>
    </form>
  );
}
