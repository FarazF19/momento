"use client";

import { categories, industries } from "@/lib/moments";
import { useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/icons";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ListingForm({ name, email, handle, followers }: { name: string; email: string; handle?: string; followers?: string }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit listing");
      setState("success");
      setMessage("Your ad space is published. Opening your listing…");
      window.location.assign(result.listingUrl);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <>
      <main className="list-page shell">
        <div className="listing-intro">
          <div className="eyebrow"><span /> For creators</div>
          <h1>Your body.<br />Numbered slots.</h1>
          <p>List a chest, a sleeve, a dress, or a race kit. Photo the person, mark the zones, set a price. You keep the clothes and pick the brands.</p>
          <div className="creator-benefits">
            <span><CheckIcon /> You define the ad space</span>
            <span><CheckIcon /> You approve every brand</span>
            <span><CheckIcon /> Clear dates, price, and proof</span>
          </div>
          <div className="payout-explainer">
            <b>You’re in control</b>
            <p>Your listing becomes public when you publish. Brands can propose an offer, and you decide whether to accept. Publishing does not start a paid placement.</p>
          </div>
        </div>

        <form className="listing-form" onSubmit={submit}>
          <div className="form-section">
            <div className="form-section-title"><span>01</span><div><h2>About you</h2><p>Who will wear or carry the placement?</p></div></div>
            <div className="form-grid two">
              <label><span>Creator name</span><input name="creatorName" value={name} readOnly /></label>
              <label><span>Account email (kept private)</span><input name="email" type="email" value={email} readOnly /></label>
              <label><span>Social handle</span><input name="handle" required defaultValue={handle} placeholder="@mayacitynotes" /></label>
              <label><span>Your niche</span><select name="industry" required defaultValue=""><option value="" disabled>Where does your audience live?</option>{industries.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><span>Main audience</span><input name="audience" required placeholder="Design & city culture" /></label>
              <label><span>{followers ? "Audience size (from your verified profile)" : "Audience size"}</span><input name="followers" type="number" min="1" required defaultValue={followers} readOnly={Boolean(followers)} placeholder="125000" /></label>
              <label><span>Country of residence</span><input name="creatorCountry" required placeholder="United Kingdom" /></label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><span>02</span><div><h2>Your ad space</h2><p>What can a brand put its name on?</p></div></div>
            <div className="form-grid two">
              <label><span>Placement category</span><select name="placementCategory" required defaultValue=""><option value="" disabled>Choose an item type</option>{categories.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><span>Item</span><input name="item" required maxLength={160} placeholder="Race kit, dress, hoodie…" /></label>
              <label className="wide"><span>Listing title</span><input name="event" required maxLength={180} placeholder="Chest + sleeve slots at my next event" /></label>
              <label><span>Exact advertising surface</span><input name="surface" required maxLength={200} placeholder="Left chest, dress mega spot, right sleeve…" /></label>
              <label><span>Available dimensions</span><input name="dimensions" required maxLength={100} placeholder="12 × 8 cm" /></label>
              <label className="wide"><span>Item photo link</span><input name="photoUrl" type="url" required placeholder="https://… (a shareable photo with the ad area marked)" /></label>
              <label><span>City</span><input name="city" required placeholder="London" /></label>
              <label><span>Country</span><input name="country" required placeholder="United Kingdom" /></label>
              <label><span>Starts</span><input name="startDate" type="date" required /></label>
              <label><span>Ends</span><input name="endDate" type="date" required /></label>
              <label className="wide"><span>Where will this item go?</span><textarea name="description" rows={4} required placeholder="Describe your route or trip, dates, and permitted locations. Do not share private addresses." /></label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><span>03</span><div><h2>Placement terms</h2><p>Make the space easy to understand and bid on.</p></div></div>
            <div className="form-grid two">
              <label className="wide"><span>Visibility commitment</span><input name="deliverable" required placeholder="Wear the patch for 3 hours/day over 7 days" /></label>
              <label><span>Asking price for the whole period (USD)</span><input name="price" type="number" min="1" step="0.01" max="100000" required placeholder="1800" /></label>
              <label><span>Exposure context (not guaranteed impressions)</span><input name="reach" required placeholder="12 coworking sessions; footfall not measured" /></label>
              <label className="wide"><span>Proof of completion</span><textarea name="deliverableDetails" rows={4} required placeholder="Specify dated photos, placement visibility, and when proof will be delivered. Social posts are not included unless separately agreed." /></label>
              <label className="wide"><span>Artwork, production, and delivery</span><textarea name="production" required rows={3} placeholder="Who supplies the patch or sticker? Who pays shipping? When must it arrive?" /></label>
              <label className="wide"><span>Exclusivity and restrictions</span><textarea name="exclusivity" required rows={3} placeholder="One advertiser on this surface? Restricted brands, venues, or designs?" /></label>
            </div>
          </div>

          {message && <div className={state === "error" ? "form-message error" : "form-message success"}>{message}</div>}
          <button className="button button-primary button-large full-button" disabled={state === "loading"} type="submit">
            {state === "loading" ? "Publishing…" : "Publish my ad space"} {state !== "loading" && <ArrowIcon />}
          </button>
          <small className="form-legal">Your item, location, profile, and placement terms will be public. Only publish placements you have permission to offer. Keep private addresses out of your description.</small>
        </form>
      </main>
    </>
  );
}
