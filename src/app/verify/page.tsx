import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { currentAccount } from "@/lib/supabase/server";
import { startVerification, submitVerification } from "./actions";
export const dynamic = "force-dynamic";
export default async function Verify({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const account = await currentAccount(); if (!account) redirect("/login");
  const creator = account.profile.role === "creator";
  const { message } = await searchParams;
  const { data: application, error } = await account.client.from("verification_applications").select("*").eq("user_id",account.user.id).maybeSingle();
  const p = application?.payload || {};
  const editable = application && ["draft","needs_changes"].includes(application.status);
  return <><Header /><main className="verification-page shell"><Link className="underlined-link" href="/dashboard">← Dashboard</Link>
    <div className="eyebrow"><span /> {creator ? "Creator" : "Brand"} application</div>
    <h1>{creator ? "Let’s meet the person behind the profile." : "Let’s put a face to your brand."}</h1>
    <p className="verification-lede">{creator ? "Show us your public social profile and the places you could take a brand. You’ll need at least 10,000 followers on one Instagram, TikTok, or X account." : "Show us your business and the campaign you have in mind. Independent businesses are welcome."}</p>
    <p>Email confirmed ✓ · <Link href="/trust" className="underlined-link">Read the admission criteria</Link></p>
    {message && <p className="form-message" role="status">{message}</p>}
    {error ? <p role="alert">We couldn’t load your application. Please try again shortly.</p> : !application ? <section className="verification-panel"><h2>Start with ownership.</h2><p>We’ll create a unique code for your application. Put it in your public {creator ? "social bio" : "business website or business social bio"} so a reviewer can confirm you control that page. Keep it visible until review is complete.</p><form action={startVerification}><button className="button button-primary">Start my application</button></form></section> : <>
      <div className="verification-status"><strong>{({draft:"Ready to apply",pending:"Awaiting review",approved:"Marketplace approved",needs_changes:"A few changes needed"} as Record<string,string>)[application.status]}</strong><p>{application.review_note || (application.status === "pending" ? "Your application is saved. A reviewer will check your ownership code, activity, and fit. Approval is not automatic." : "Complete the steps below to request review.")}</p>{application.reviewed_at && <small>Reviewed {new Date(application.reviewed_at).toLocaleDateString("en-GB")}</small>}</div>
      {application.status === "approved" && <Link className="button button-primary" href={creator ? "/list" : "/discover"}>{creator ? "Create my first listing" : "Find a creator"}</Link>}
      {editable && <form action={submitVerification} className="verification-panel verification-form">
        <h2>01. Confirm it’s yours</h2><p>Add this exact code to your {creator ? "social profile bio" : "business website or business social bio"}. This is a public ownership marker, not a password.</p><code className="ownership-code">{application.ownership_code}</code>
        {creator && <label>Platform<select name="platform" defaultValue={p.platform || "instagram"}><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="x">X / Twitter</option></select></label>}
        <label>{creator ? "Public social profile URL" : "Business website or public business social profile"}<input name="profileUrl" type="url" required maxLength={2000} defaultValue={p.profileUrl} placeholder={creator ? "https://www.instagram.com/yourhandle/" : "https://yourbrand.com"} /></label>
        <h2>02. Tell us about {creator ? "yourself" : "your business"}</h2>
        {creator ? <><label>Current followers<input name="followers" type="number" required min="10000" max="2147483647" defaultValue={p.followers} /><small>At least 10,000 on this account. Counts across platforms cannot be combined.</small></label><label>Your portrait URL<input name="portraitUrl" type="url" required maxLength={2000} defaultValue={p.portraitUrl} placeholder="https://…/your-photo.jpg" /><small>Use a photo you own. This may appear on your public creator cards after approval.</small></label></> : <label>Business name<input name="businessName" required minLength={2} maxLength={150} defaultValue={p.businessName} /></label>}
        <label>{creator ? "Where would you take a brand?" : "What do you sell, and what would you advertise?"}<textarea name="summary" required minLength={30} maxLength={1500} rows={5} defaultValue={p.summary} placeholder={creator ? "Your niche, city, regular outings, available ad spaces, and a realistic plan for photo proof." : "Your product, target audience, planned artwork, placement ideas, and approximate budget."} /></label>
        <h2>03. Before you submit</h2>
        {creator ? <><label className="check-label"><input name="accountAge" type="checkbox" value="yes" required defaultChecked={p.accountAge === "yes"} /> My public account has at least 90 days of history.</label><label className="check-label"><input name="recentPosts" type="checkbox" value="yes" required defaultChecked={p.recentPosts === "yes"} /> I have at least 3 original posts in the last 60 days.</label></> : <label className="check-label"><input name="authority" type="checkbox" value="yes" required defaultChecked={p.authority === "yes"} /> I’m authorized to represent this business and use the proposed branding.</label>}
        <label className="check-label"><input name="adult" type="checkbox" value="yes" required defaultChecked={p.adult === "yes"} /> I am at least 18.</label><label className="check-label"><input name="accurate" type="checkbox" value="yes" required defaultChecked={p.accurate === "yes"} /> These details are accurate, and I have added my ownership code.</label>
        <p className="sample-disclaimer">Only reviewers and you can access this application. Don’t submit passwords, identity documents, home addresses, or payment details. A marketplace review is not payment-provider identity verification.</p>
        <button className="button button-primary" type="submit">Submit for review</button>
      </form>}
    </>}
  </main></>;
}
