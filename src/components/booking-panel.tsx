"use client";

import { useMemo, useState } from "react";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon, CheckIcon, CloseIcon } from "./icons";

type BookingMode = "book" | "offer";

export function BookingPanel({ moment }: { moment: Moment }) {
  const [selected, setSelected] = useState<string[]>([moment.inventory[0].id]);
  const [mode, setMode] = useState<BookingMode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const items = useMemo(() => moment.inventory.filter((item) => selected.includes(item.id)), [moment.inventory, selected]);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      momentSlug: moment.slug,
      inventoryIds: selected,
      mode,
      brandName: String(form.get("brandName") || ""),
      email: String(form.get("email") || ""),
      brandCountry: String(form.get("brandCountry") || ""),
      campaign: String(form.get("campaign") || ""),
      offerAmount: mode === "offer" ? Number(form.get("offerAmount")) : undefined,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create booking");
      if (result.checkoutUrl) window.location.assign(result.checkoutUrl);
      else {
        setMessage(mode === "offer" ? "Offer saved. The creator can now review it." : "Booking created.");
        setSubmitting(false);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="detail-inventory">
        <div className="inventory-heading"><div><span className="eyebrow"><span /> Sponsorship inventory</span><h2>Choose what you need.</h2></div><p>Select one or combine a few. Every package has a defined output and delivery window.</p></div>
        <div className="inventory-list">
          {moment.inventory.map((item) => {
            const checked = selected.includes(item.id);
            return (
              <button key={item.id} className={checked ? "inventory-item selected" : "inventory-item"} type="button" onClick={() => toggle(item.id)}>
                <span className="inventory-check">{checked && <CheckIcon />}</span>
                <span className="inventory-main"><b>{item.name}</b><small>{item.description}</small></span>
                <span><small>Timing</small><b>{item.timing}</b></span>
                <span><small>Est. reach</small><b>{item.reach}</b></span>
                <span className="inventory-price"><small>{item.remaining} left</small><b>{formatPrice(item.price)}</b></span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="booking-card">
        <div className="booking-card-top"><span>SPONSOR</span><b>{moment.month}</b></div>
        <h2>Sponsor this moment</h2>
        <p>Book {moment.creator.name}’s coverage of {moment.event}.</p>
        <div className="selected-summary">
          <div className="summary-label"><span>Selected inventory</span><b>{items.length} {items.length === 1 ? "item" : "items"}</b></div>
          {items.map((item) => <div className="summary-item" key={item.id}><span>{item.name}</span><b>{formatPrice(item.price)}</b></div>)}
        </div>
        <div className="booking-total"><span>Total</span><b>{formatPrice(total)}</b></div>
        <button disabled={!selected.length} type="button" className="button button-primary booking-button" onClick={() => setMode("book")}>Continue to checkout <ArrowIcon /></button>
        <button disabled={!selected.length} type="button" className="button button-outline booking-button" onClick={() => setMode("offer")}>Make an offer</button>
        <div className="payment-note"><CheckIcon /><span><b>Protected booking</b>Payment is confirmed by webhook. Approved work triggers an automatic provider payout.</span></div>
      </aside>

      {mode && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMode(null); }}>
          <div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
            <button className="modal-close" type="button" onClick={() => setMode(null)} aria-label="Close"><CloseIcon /></button>
            <div className="eyebrow"><span /> {mode === "offer" ? "Make an offer" : "Brand checkout"}</div>
            <h2 id="booking-title">{mode === "offer" ? "Send a serious offer." : "Tell us who’s booking."}</h2>
            <p>{mode === "offer" ? "The creator can accept, decline, or counter before any payment is taken." : "You’ll review the final total on secure hosted checkout."}</p>
            <form onSubmit={submit}>
              <label><span>Brand name</span><input name="brandName" required placeholder="Acme Studio" /></label>
              <label><span>Work email</span><input name="email" type="email" required placeholder="you@company.com" /></label>
              <label><span>Billing country</span><select name="brandCountry" required defaultValue="US"><option value="US">United States</option><option value="GB">United Kingdom</option><option value="PK">Pakistan</option><option value="AE">United Arab Emirates</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="DE">Germany</option><option value="FR">France</option><option value="IN">India</option><option value="SG">Singapore</option></select></label>
              {mode === "offer" && <label><span>Total offer (USD)</span><input name="offerAmount" type="number" min="100" required defaultValue={Math.round(total * .85)} /></label>}
              <label><span>Campaign goal</span><textarea name="campaign" required rows={4} placeholder="What are you launching, and what should this partnership achieve?" /></label>
              {message && <div className="form-message">{message}</div>}
              <button className="button button-primary button-large full-button" disabled={submitting || !selected.length} type="submit">
                {submitting ? "Creating booking…" : mode === "offer" ? "Send offer" : `Pay ${formatPrice(total)}`} {!submitting && <ArrowIcon />}
              </button>
              <small className="form-legal">By continuing, you agree to Momento’s booking and cancellation terms.</small>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
