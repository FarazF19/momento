import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { currentAccount } from "@/lib/supabase/server";
import { creatorPlatforms } from "@/lib/verification";
import { startVerification, submitVerification } from "./actions";
export const dynamic = "force-dynamic";

const STATUS_TITLES: Record<string, string> = {
  draft: "One step from the marketplace",
  pending: "Checking your page…",
  approved: "You’re verified",
  needs_changes: "One quick fix",
};

export default async function Verify({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const account = await currentAccount(); if (!account) redirect("/login");
  const creator = account.profile.role === "creator";
  const { message } = await searchParams;
  const { data: application, error } = await account.client.from("verification_applications").select("*").eq("user_id", account.user.id).maybeSingle();
  const p = application?.payload || {};
  const editable = application && ["draft", "needs_changes"].includes(application.status);
  const approved = application?.status === "approved";
  return <><Header /><main className="verification-page shell"><Link className="underlined-link" href="/dashboard">← Dashboard</Link>
    <div className="eyebrow"><span /> {creator ? "Creator" : "Brand"} verification</div>
    <h1>{creator ? <>Link your profile.<br />Confirm it’s yours.</> : <>Link your business.<br />Confirm it’s yours.</>}</h1>
    <p className="verification-lede">{creator ? "You need at least 10,000 followers on one public Instagram, TikTok, or X profile. Add your code to its bio so we can confirm ownership and read the audience count. Counts across accounts are not combined." : "Add your code to your website or public business page so we can check you control it. Confirm you are authorized to represent the business."}</p>
    <p>Email confirmed ✓ · <Link href="/trust" className="underlined-link">How verification works</Link></p>
    {message && <p className="form-message" role="status">{message}</p>}
    {error ? <p role="alert">We couldn’t load your application. Please try again shortly.</p> : !application ? (
      <section className="verification-panel reveal-pop">
        <h2>Start with your code.</h2>
        <p>We’ll generate a unique code for you. Drop it into your public {creator ? "social bio" : "website or business social bio"} so our automatic check can confirm the page is yours. It’s a public marker, never a password — and you can remove it right after you’re verified.</p>
        <form action={startVerification}><button className="button button-primary button-large">Get my code</button></form>
      </section>
    ) : <>
      <div className={approved ? "verification-status status-approved" : "verification-status"}>
        <strong>{STATUS_TITLES[application.status]}</strong>
        <p>{application.review_note || (application.status === "pending" ? "Your application is in. Refresh to see your result once the check is complete." : "Three quick steps below and you’re in.")}</p>
        {application.reviewed_at && <small>Decision at {new Date(application.reviewed_at).toLocaleTimeString("en-GB")} · {new Date(application.reviewed_at).toLocaleDateString("en-GB")}</small>}
      </div>
      {approved && <section className="verification-panel identity-card">
        {p.fetchedPhoto && <img className="identity-photo" src={p.fetchedPhoto} alt="" width={72} height={72} />}
        <div>
          <h2>{creator ? p.fetchedName || account.profile.name : p.businessName || account.profile.name}</h2>
          <p>
            {creator ? creatorPlatforms[p.platform]?.label || "Profile" : p.businessName || "Business"} verified
            {p.fetchedFollowers ? ` · ${Number(p.fetchedFollowers).toLocaleString("en-US")} followers (read from your live profile)` : ""}
          </p>
          <Link className="button button-primary" href={creator ? "/list" : "/discover"}>{creator ? "Publish my first ad space" : "Find your first creator"}</Link>
        </div>
      </section>}
      {editable && <form action={submitVerification} className="verification-panel verification-form">
        <h2>01 · Put your code in your {creator ? "bio" : "page"}</h2>
        <p>Copy this exact code into your public {creator ? "social profile bio" : "website footer, homepage, or business social bio"}. Keep it there until you see “You’re verified”.</p>
        <code className="ownership-code">{application.ownership_code}</code>
        <h2>02 · Paste your link</h2>
        {creator && <label>Platform<select name="platform" defaultValue={p.platform || "instagram"}>{Object.entries(creatorPlatforms).map(([value, { label }]) => <option key={value} value={value}>{label}</option>)}</select></label>}
        <label>{creator ? "Your public profile URL" : "Your website or public business page"}<input name="profileUrl" type="url" required maxLength={2000} defaultValue={p.profileUrl} placeholder={creator ? "https://www.tiktok.com/@yourhandle" : "https://yourbrand.com"} />{creator && <small>We’ll read your public name, photo, and follower count from this page — nothing to type, nothing private.</small>}</label>
        {!creator && <label>Business name<input name="businessName" required minLength={2} maxLength={150} defaultValue={p.businessName} /></label>}
        <label>{creator ? "Where would you take a brand?" : "What would you advertise?"}<textarea name="summary" required minLength={30} maxLength={1500} rows={4} defaultValue={p.summary} placeholder={creator ? "Your city, the places you go each week, and the items you’d offer — hoodie, laptop, bag…" : "Your product, who it’s for, and the kind of placements you’re interested in."} /></label>
        <h2>03 · Confirm and verify</h2>
        {!creator && <label className="check-label"><input name="authority" type="checkbox" value="yes" required defaultChecked={p.authority === "yes"} /> I’m authorized to represent this business and use the proposed branding.</label>}
        <label className="check-label"><input name="adult" type="checkbox" value="yes" required defaultChecked={p.adult === "yes"} /> I am at least 18.</label>
        <label className="check-label"><input name="accurate" type="checkbox" value="yes" required defaultChecked={p.accurate === "yes"} /> These details are accurate, and my code is live on the page above.</label>
        <p className="sample-disclaimer">Only you (and Momento reviewers, if ever needed) can see this application. Never submit passwords, ID documents, or payment details — we only look at your public page. Marketplace verification is separate from payment-provider identity checks.</p>
        <button className="button button-primary button-large" type="submit">Check my profile</button>
      </form>}
    </>}
  </main></>;
}

