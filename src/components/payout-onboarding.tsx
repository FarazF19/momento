"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowIcon, CheckIcon } from "./icons";
import type { PayoutMethod } from "@/lib/payments/tazapay";

const countries = [
  ["US", "United States", "USD"], ["GB", "United Kingdom", "GBP"], ["PK", "Pakistan", "PKR"],
  ["AE", "United Arab Emirates", "AED"], ["CA", "Canada", "CAD"], ["AU", "Australia", "AUD"],
  ["DE", "Germany", "EUR"], ["FR", "France", "EUR"], ["IN", "India", "INR"], ["SG", "Singapore", "SGD"],
];

function label(field: string) {
  return field.replace(/^address\./, "").replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PayoutOnboarding({ listingId, token }: { listingId: string; token: string }) {
  const [country, setCountry] = useState("US");
  const [currency, setCurrency] = useState("USD");
  const [kind, setKind] = useState("individual");
  const [methods, setMethods] = useState<PayoutMethod[]>([]);
  const [methodIndex, setMethodIndex] = useState(0);
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  const method = methods[methodIndex];
  const fields = useMemo(() => method ? [...new Set([
    ...method.required_bank_fields,
    ...method.required_bank_codes,
    ...method.required_beneficiary_fields,
  ])] : [], [method]);

  async function loadMethods() {
    setLoading(true); setMessage(""); setMethods([]);
    try {
      const response = await fetch(`/api/payouts/metadata?country=${country}&currency=${currency}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load payout options");
      const available = (result.payoutMethods as PayoutMethod[]).filter((item) => item.beneficiary_type.includes(kind as "individual" | "business"));
      if (!available.length) throw new Error("No self-serve payout route is available for this country and currency.");
      setMethods(available); setMethodIndex(0); setNetwork(available[0].fund_transfer_networks[0]?.name || "");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not load payout options"); }
    finally { setLoading(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!method) return;
    setLoading(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map((field) => [field, String(form.get(field) || "")]));
    values.name = String(form.get("name") || "");
    try {
      const response = await fetch("/api/payouts/onboard", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, token, beneficiaryType: kind, country, currency, payoutType: method.payout_type, fundTransferNetwork: network, values }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not finish payout setup");
      setReady(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not finish payout setup"); }
    finally { setLoading(false); }
  }

  if (!listingId || !token) return <main className="onboarding-page shell"><div className="onboarding-card"><h1>Invalid onboarding link.</h1><p>Return to the creator form and submit your moment again.</p><Link className="button button-dark" href="/list">List a moment</Link></div></main>;
  if (ready) return <main className="onboarding-page shell"><div className="onboarding-card complete"><div className="status-mark paid"><CheckIcon /></div><div className="eyebrow"><span /> Payouts ready</div><h1>You’re ready to get paid.</h1><p>Your payout destination was accepted by the provider. We did not store your bank details. Once a paid campaign is approved, payout is created automatically.</p><Link className="button button-primary button-large" href="/discover">Explore Momento <ArrowIcon /></Link></div></main>;

  return (
    <main className="onboarding-page shell">
      <section className="onboarding-copy"><div className="eyebrow"><span /> Secure payout setup</div><h1>Get paid<br />without the admin.</h1><p>Choose your payout country and enter the fields required by the provider. Your banking details go directly to Tazapay and are never stored by Momento.</p><div className="creator-benefits"><span><CheckIcon /> Self-serve setup</span><span><CheckIcon /> Country-specific bank fields</span><span><CheckIcon /> Automatic payout after approval</span></div></section>
      <form className="onboarding-card" onSubmit={submit}>
        <div className="form-section-title"><span>01</span><div><h2>Payout route</h2><p>We load the provider’s current requirements.</p></div></div>
        <div className="form-grid two">
          <label><span>Creator type</span><select value={kind} onChange={(event) => { setKind(event.target.value); setMethods([]); }}><option value="individual">Individual</option><option value="business">Business</option></select></label>
          <label><span>Bank country</span><select value={country} onChange={(event) => { const selected = countries.find((item) => item[0] === event.target.value)!; setCountry(selected[0]); setCurrency(selected[2]); setMethods([]); }}>{countries.map(([code, name]) => <option value={code} key={code}>{name}</option>)}</select></label>
          <label><span>Payout currency</span><input value={currency} onChange={(event) => { setCurrency(event.target.value.toUpperCase().slice(0, 3)); setMethods([]); }} maxLength={3} /></label>
          <button type="button" className="button button-outline align-end" onClick={loadMethods} disabled={loading}>{loading ? "Loading…" : "Load payout options"}</button>
        </div>
        {methods.length > 0 && <>
          <div className="form-divider" />
          <div className="form-grid two">
            <label><span>Payout method</span><select value={methodIndex} onChange={(event) => { const index = Number(event.target.value); setMethodIndex(index); setNetwork(methods[index].fund_transfer_networks[0]?.name || ""); }}>{methods.map((item, index) => <option value={index} key={`${item.payout_type}-${index}`}>{item.payout_type === "local" ? "Local bank transfer" : "SWIFT transfer"}</option>)}</select></label>
            {method?.fund_transfer_networks.length > 0 && <label><span>Transfer network</span><select value={network} onChange={(event) => setNetwork(event.target.value)}>{method.fund_transfer_networks.map((item) => <option key={item.name} value={item.name}>{item.name.toUpperCase()}{item.delivery_time ? ` · ${item.delivery_time}` : ""}</option>)}</select></label>}
            <label className="wide"><span>Account holder name</span><input name="name" required autoComplete="name" /></label>
            {fields.map((field) => <label className={field === "account_number" ? "wide" : ""} key={field}><span>{label(field)}</span><input name={field} required autoComplete="off" type={field === "account_number" ? "password" : "text"} /></label>)}
          </div>
          <div className="bank-privacy"><CheckIcon /><span><b>Bank details are pass-through only.</b>They are sent to Tazapay over TLS and are not written to the Momento database.</span></div>
          {message && <div className="form-message error">{message}</div>}
          <button className="button button-primary button-large full-button" disabled={loading} type="submit">{loading ? "Securing payout profile…" : "Finish payout setup"} {!loading && <ArrowIcon />}</button>
        </>}
        {message && !methods.length && <div className="form-message error">{message}</div>}
      </form>
    </main>
  );
}
