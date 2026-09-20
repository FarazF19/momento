import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { currentAccount } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { decideOffer } from "./actions";
import { formatPrice } from "@/lib/moments";
import { GettingStarted } from "@/components/getting-started";
export const dynamic = "force-dynamic";
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const account = await currentAccount();
  if (!account) redirect("/login");
  const creator = account.profile.role === "creator";
  const { message } = await searchParams;
  const { data: verification, error: verificationError } = await account.client.from("verification_applications").select("status").eq("user_id", account.user.id).maybeSingle();
  const { data: reviewer } = await account.client.rpc("is_marketplace_reviewer");
  const { data: offers, error: offersError } = await account.client.from("offers").select("*").order("created_at", { ascending: false }).limit(100);
  const { data: listings, error: listingsError } = creator ? await account.client.from("placements").select("id, title, status, asking_price_minor").eq("creator_id", account.user.id).order("created_at", { ascending: false }) : { data: [], error: null };
  return <><Header /><main className="dashboard-page shell">
    <div className="dashboard-heading"><div><div className="eyebrow"><span /> {creator ? "Creator" : "Brand"} workspace</div><h1>Hello, {account.profile.name}.</h1><p>{creator ? "Your ad spaces and incoming brand offers." : "Your offers and agreed placements."}</p></div><form action={signOut}><button className="button button-outline">Sign out</button></form></div>
    <section className="verification-status"><h2>{verification?.status === "approved" ? "Marketplace approved" : "Complete your marketplace application"}</h2><p>{verificationError ? "Application status is temporarily unavailable." : verification?.status === "approved" ? "You’re ready to " + (creator ? "publish placements." : "send offers to creators.") : verification?.status === "pending" ? "Your application is awaiting review. You can browse while we check your details." : "Confirm ownership and tell us about " + (creator ? "your social profile before publishing." : "your business before sending offers.")}</p><Link className="underlined-link" href="/verify">{verification?.status === "approved" ? "View approval" : "Open application"} →</Link>{reviewer && <p><Link className="underlined-link" href="/review">Review member applications →</Link></p>}</section>
    {!offersError && !listingsError && <GettingStarted creator={creator} listed={Boolean(listings?.length)} offered={Boolean(offers?.length)} accepted={Boolean(offers?.some(offer => offer.status === "accepted"))} />}
    {message && <p role="status" className="form-message">{message}</p>}
    {(offersError || listingsError) && <p role="alert">We couldn’t load your workspace. Please try again shortly.</p>}
    {creator && <section><h2>Your placements</h2>{!listings?.length && !listingsError && <p>No listings yet. Start with one item and one clearly defined ad space.</p>}<div className="dashboard-list">{listings?.map((listing) => <article key={listing.id}><h3>{listing.title}</h3><p>{formatPrice(listing.asking_price_minor / 100)} · {listing.status === "paused" ? "Reserved after offer acceptance" : "Published"}</p>{listing.status === "published" && <Link className="underlined-link" href={"/placements/" + listing.id}>View placement</Link>}</article>)}</div></section>}
    <section id="offers"><h2>{creator ? "Incoming offers" : "Your offers"}</h2>{!offers?.length && !offersError && <p>{creator ? "When a brand makes an offer, its brief and price appear here." : "Open a live listing and send your first offer. Track the creator’s response here."}</p>}
      <div className="dashboard-list">{offers?.map((offer) => <article key={offer.id}>
        <div className="dashboard-heading"><h3>{offer.placement_snapshot.title}</h3><b>{formatPrice(offer.amount_minor / 100)}</b></div>
        <p>{offer.brand_name} · {offer.status}</p><p>{offer.proposal}</p>
        <details><summary>Agreed placement details</summary><p>{offer.placement_snapshot.details.surface} · {offer.placement_snapshot.details.dimensions}</p><p>{offer.placement_snapshot.start_date} – {offer.placement_snapshot.end_date}</p><p>{offer.placement_snapshot.details.visibility}</p><p>Proof: {offer.placement_snapshot.details.proof}</p><p>Production: {offer.placement_snapshot.details.production}</p><p>Exclusivity: {offer.placement_snapshot.details.exclusivity}</p></details>
        {offer.status === "accepted" && <p className="sample-disclaimer">Terms accepted; this placement is reserved. Payment collection is not enabled yet. Do not start paid work until checkout and payment confirmation are available.</p>}
        {offer.status === "pending" && <form action={decideOffer} className="offer-actions"><input type="hidden" name="offerId" value={offer.id} />{creator ? <><button className="button button-primary" name="decision" value="accepted">Accept & reserve</button><button className="button button-outline" name="decision" value="declined">Decline</button></> : <button className="button button-outline" name="decision" value="withdrawn">Withdraw offer</button>}</form>}
      </article>)}</div>
    </section>
  </main></>;
}
