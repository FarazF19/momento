"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon, CloseIcon } from "./icons";

export function BookingPanel({ moment }: { moment: Moment }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const price = moment.inventory[0].price;
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (moment.isDemo) {
      setMessage("Preview only. No offer was sent and no payment was taken. On a published page, the creator reviews the offer here.");
      return;
    }
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/marketplace/offers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          momentSlug: moment.slug,
          campaign: form.get("campaign"), offerAmount: Number(form.get("offerAmount")),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit offer.");
      setSent(true);
      setMessage("Offer sent to the creator. Follow it in your dashboard. No payment has been taken.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit offer.");
    } finally { setSubmitting(false); }
  }

  return (
    <aside className="booking-card">
      <div className="booking-card-top"><span>ON MOMENTO</span><b>{moment.duration}</b></div>
      <h2>Pick a slot.</h2>
      <p>{moment.surface}</p>
      <div className="selected-summary">
        <div className="summary-item"><span>Dates</span><b>{moment.dates}</b></div>
        <div className="summary-item"><span>City</span><b>{moment.city}</b></div>
        <div className="summary-item"><span>Proof</span><b>Photos on this page</b></div>
      </div>
      <div className="booking-total"><span>{moment.raisedLabel ? "Slot range" : "Asking price"}</span><b>{moment.raisedLabel || formatPrice(price)}</b></div>
      <p>Offers stay on Momento. The creator accepts or declines here.</p>
      <button type="button" className="button button-primary booking-button" onClick={() => { setMessage(""); setOpen(true); }}>
        {moment.isDemo ? "Preview an offer" : "Make an offer"} <ArrowIcon />
      </button>
      <p className="sample-disclaimer">{moment.isDemo ? "Example page. The form does not send a bid." : "No charge to offer. Terms are agreed before payment."}</p>
      <dialog ref={dialog} className="booking-modal" onClose={() => setOpen(false)} aria-labelledby="booking-title">
        <button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close offer form"><CloseIcon /></button>
        <div className="eyebrow"><span /> {moment.isDemo ? "Preview · not sent" : "Brand offer"}</div>
        <h2 id="booking-title">Offer on a slot.</h2>
        <p>Propose a price and say which zone you want. This stays on Momento.</p>
        <form onSubmit={submit}>
          {!moment.isDemo && <p>Verify the brand in about a minute, then send. <Link className="underlined-link" href="/login?mode=signup&role=brand">Create an account</Link></p>}
          <label><span>Your offer (USD)</span><input name="offerAmount" type="number" min="1" max="100000" step="0.01" required defaultValue={price} /></label>
          <label><span>Brand and which slot</span><textarea name="campaign" required minLength={10} maxLength={1500} rows={4} placeholder="Which numbered zone, and what should be printed there?" /></label>
          {message && <div className="form-message" role="status">{message}</div>}
          {sent ? <Link className="button button-primary" href="/dashboard">View my offer</Link> : <button className="button button-primary button-large full-button" disabled={submitting} type="submit">{submitting ? "Sending…" : moment.isDemo ? "Preview offer" : "Send offer"}</button>}
        </form>
      </dialog>
    </aside>
  );
}
