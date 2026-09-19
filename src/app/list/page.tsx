"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowIcon, CheckIcon } from "@/components/icons";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ListMomentPage() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit listing");
      setState("success");
      setMessage(`Listing ${result.reference} saved. Opening secure payout setup…`);
      if (result.onboardingUrl) window.location.assign(result.onboardingUrl);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <>
      <Header />
      <main className="list-page shell">
        <div className="listing-intro">
          <div className="eyebrow"><span /> For creators</div>
          <h1>Turn your next trip<br />into a partnership.</h1>
          <p>List one upcoming moment and one clear deliverable. We’ll make it easy for the right brand to understand—and book.</p>
          <div className="creator-benefits">
            <span><CheckIcon /> You set the inventory</span>
            <span><CheckIcon /> You approve every brand</span>
            <span><CheckIcon /> Automated payout tracking</span>
          </div>
          <div className="payout-explainer">
            <b>Payout setup</b>
            <p>After Momento approves your first listing, you’ll complete provider-hosted identity and bank verification. Payout details never pass through this form.</p>
          </div>
        </div>

        <form className="listing-form" onSubmit={submit}>
          <div className="form-section">
            <div className="form-section-title"><span>01</span><div><h2>About you</h2><p>Who will create the content?</p></div></div>
            <div className="form-grid two">
              <label><span>Creator name</span><input name="creatorName" required placeholder="Maya Chen" /></label>
              <label><span>Work email</span><input name="email" type="email" required placeholder="maya@studio.com" /></label>
              <label><span>Social handle</span><input name="handle" required placeholder="@mayacitynotes" /></label>
              <label><span>Main audience</span><input name="audience" required placeholder="Design & city culture" /></label>
              <label><span>Audience size</span><input name="followers" type="number" min="1000" required placeholder="125000" /></label>
              <label><span>Country of residence</span><input name="creatorCountry" required placeholder="United Kingdom" /></label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><span>02</span><div><h2>The moment</h2><p>Where are you going?</p></div></div>
            <div className="form-grid two">
              <label className="wide"><span>Event or trip</span><input name="event" required placeholder="London Design Festival" /></label>
              <label><span>City</span><input name="city" required placeholder="London" /></label>
              <label><span>Country</span><input name="country" required placeholder="United Kingdom" /></label>
              <label><span>Starts</span><input name="startDate" type="date" required /></label>
              <label><span>Ends</span><input name="endDate" type="date" required /></label>
              <label className="wide"><span>Why will your audience care?</span><textarea name="description" rows={4} required placeholder="What will you have access to, and what makes your perspective useful?" /></label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><span>03</span><div><h2>First offer</h2><p>Make one thing easy to buy.</p></div></div>
            <div className="form-grid two">
              <label className="wide"><span>Deliverable</span><input name="deliverable" required placeholder="Festival Reel + 3 Stories" /></label>
              <label><span>Starting price (USD)</span><input name="price" type="number" min="100" required placeholder="1800" /></label>
              <label><span>Estimated reach</span><input name="reach" required placeholder="40K–90K" /></label>
              <label className="wide"><span>What the brand receives</span><textarea name="deliverableDetails" rows={4} required placeholder="Mention format, usage rights, tags, links, and delivery timing." /></label>
            </div>
          </div>

          {message && <div className={state === "error" ? "form-message error" : "form-message success"}>{message}</div>}
          <button className="button button-primary button-large full-button" disabled={state === "loading"} type="submit">
            {state === "loading" ? "Submitting…" : "Submit moment for review"} {state !== "loading" && <ArrowIcon />}
          </button>
          <small className="form-legal">Submitting does not make the listing public. We review fit, clarity, and payout eligibility first.</small>
        </form>
      </main>
    </>
  );
}
