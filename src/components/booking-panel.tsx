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
      setMessage("Preview only. No offer was sent, no personal details were saved, and no payment was taken. A live listing will need creator review and agreed terms before checkout.");
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
      setMessage("Offer sent to the creator. Follow its status in your dashboard. No payment has been taken.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit offer.");
    } finally { setSubmitting(false); }
  }

  return (
    <aside className="booking-card">
      <div className="booking-card-top"><span>AD SPACE · {moment.category.toUpperCase()}</span><b>{moment.duration}</b></div>
      <h2>Make it your space.</h2>
      <p>{moment.surface} · {moment.dimensions}</p>
      <div className="selected-summary">
        <div className="summary-item"><span>Dates</span><b>{moment.dates}</b></div>
        <div className="summary-item"><span>Location</span><b>{moment.city}</b></div>
        <div className="summary-item"><span>Completion evidence</span><b>As listed in terms</b></div>
      </div>
      <div className="booking-total"><span>{moment.isDemo ? "Example asking price" : "Asking price"}</span><b>{formatPrice(price)}</b></div>
      <p>For the full placement period. Item ownership stays with the creator. Artwork and delivery responsibilities are listed above.</p>
      <button type="button" className="button button-primary booking-button" onClick={() => { setMessage(""); setOpen(true); }}>{moment.isDemo ? "Preview a brand offer" : "Make an offer"} <ArrowIcon /></button>
      <p className="sample-disclaimer">{moment.isDemo ? "Fictional listing. Try the offer form without sending a bid or paying." : "No charge to make an offer. Final terms must be agreed before payment."}</p>
      <dialog ref={dialog} className="booking-modal" onClose={() => setOpen(false)} aria-labelledby="booking-title">
          <button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close offer form"><CloseIcon /></button>
          <div className="eyebrow"><span /> {moment.isDemo ? "Interactive example · not sent" : "Brand offer"}</div>
          <h2 id="booking-title">Bid on the space.</h2>
          <p>{moment.surface} for {moment.duration}. Propose a price and describe your brand and intended placement.</p>
          <form onSubmit={submit}>
            {!moment.isDemo && <p>Your brand needs marketplace approval to send an offer. <Link className="underlined-link" href="/login?mode=signup&role=brand">Create an account</Link> or <Link className="underlined-link" href="/verify">check your application</Link>.</p>}
            <label><span>Your offer for the full period (USD)</span><input name="offerAmount" type="number" min="1" max="100000" step="0.01" required defaultValue={price} /></label>
            <label><span>Brand, artwork, and placement requirements</span><textarea name="campaign" required minLength={10} maxLength={1500} rows={4} placeholder="What should appear on the patch or sticker? Confirm dates, shipping, visibility, and any changes you want to propose." /></label>
            {message && <div className="form-message" role="status">{message}</div>}
            {sent ? <Link className="button button-primary" href="/dashboard">View my offer</Link> : <button className="button button-primary button-large full-button" disabled={submitting} type="submit">{submitting ? "Sending…" : moment.isDemo ? "Preview offer — no payment" : "Send offer"}</button>}
          </form>
      </dialog>
    </aside>
  );
}
