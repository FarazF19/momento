import Link from "next/link";
import { Header } from "@/components/header";
export const dynamic = "force-dynamic";

export default function CreatorsPage() {
  return <><Header /><main className="audience-page shell">
    <div className="eyebrow"><span /> Momento for creators</div>
    <h1>Going places?<br /><em>Bring a brand along.</em></h1>
    <p className="audience-lede">Turn space on your hoodie, laptop, or bag into a brand opportunity. Share where you’re going, set your price, and choose who comes along.</p>
    <div className="hero-actions"><Link href="/list" className="button button-primary button-large">Create my first listing</Link><Link href="/discover" className="button button-outline button-large">See placement examples</Link></div>
    <div className="audience-grid"><article><span>01 / Define the space</span><h2>Start with what you own.</h2><p>Add a photo, the available surface and size, where you’ll take it, and when. Set an asking price for the full period.</p></article><article><span>02 / Choose your brand</span><h2>Every offer is your call.</h2><p>Review brand briefs and prices in your Dashboard. Accept the right fit or decline—your listing isn’t a highest-bidder-wins auction.</p></article><article><span>03 / Make it clear</span><h2>Agree before you wear.</h2><p>Decide who supplies the artwork, who produces the placement, and what photos will demonstrate delivery.</p></article></div>
    <section className="audience-note"><h2>Your item stays yours.</h2><p>No shipping your laptop to a stranger. No renting out your wardrobe. Only the agreed advertising space is offered to a brand.</p><p>Early marketplace preview: payment collection and payouts are not enabled yet. Do not start paid work before payment is confirmed.</p></section>
  </main></>;
}
