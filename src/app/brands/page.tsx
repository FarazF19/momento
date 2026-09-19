import Link from "next/link";
import { Header } from "@/components/header";
export const dynamic = "force-dynamic";

export default function BrandsPage() {
  return <><Header /><main className="audience-page shell">
    <div className="eyebrow"><span /> Momento for brands</div>
    <h1>Your brand.<br />Out in the <em>real world.</em></h1>
    <p className="audience-lede">A laptop at a coworking space. A hoodie around the city. A backpack on its next trip. Rent the ad space on the things creators already wear and carry.</p>
    <div className="hero-actions"><Link href="/discover" className="button button-primary button-large">Find your first ad space</Link><Link href="/login?mode=signup&role=brand" className="button button-outline button-large">Create a brand account</Link></div>
    <div className="audience-grid"><article><span>01 / Find your fit</span><h2>Choose where you show up.</h2><p>Compare the creator, item, location, dates, and exact ad surface. Start with one placement.</p></article><article><span>02 / Make your offer</span><h2>Your budget. A clear brief.</h2><p>Propose a price for the full period and tell the creator what you want displayed. They review and accept or decline.</p></article><article><span>03 / Agree the details</span><h2>Know what you’re getting.</h2><p>Confirm artwork, production, visibility, and photo evidence before a campaign begins. Track your offers in Dashboard.</p></article></div>
    <section className="audience-note"><h2>Ad space, not a content package.</h2><p>You’re renting a defined surface—not buying the item, guaranteed impressions, or an automatic social post. Those expectations stay clear from the first offer.</p><p>Early marketplace preview: paid checkout is not enabled yet. Do not begin paid work before payment is confirmed.</p></section>
  </main></>;
}
