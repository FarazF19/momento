import Link from "next/link";
import { Header } from "@/components/header";
import { CheckIcon } from "@/components/icons";
import { industries } from "@/lib/moments";

export const dynamic = "force-dynamic";

export default function BrandsPage() {
  return (
    <>
      <Header />
      <main className="audience-page shell">
        <div className="eyebrow"><span /> For brands</div>
        <h1>Your audience is out there.<br /><em>Show up with a creator.</em></h1>
        <p className="audience-lede">Find creators heading to events your customers care about. Sponsor a placement on their outfit, laptop, or bag, with the dates and photo requirements agreed upfront.</p>
        <div className="hero-actions">
          <Link href="/discover" className="button button-primary button-large">Find creators</Link>
          <Link href="/login?mode=signup&role=brand&next=/discover" className="button button-outline button-large">Create a brand account</Link>
        </div>
        <div className="stat-strip">
          <span><b>Your business</b><small>ownership checked</small></span>
          <span><b>{industries.length - 1}</b><small>niches to filter</small></span>
          <span><b>1 price</b><small>per slot, written down</small></span>
          <span><b>Photos</b><small>agreed before you pay</small></span>
        </div>

        <div className="audience-grid">
          <article><span>01 / Verify</span><h2>Prove the brand.</h2><p>One code on your site or public page. The check runs automatically. Independent businesses are welcome.</p></article>
          <article><span>02 / Choose a person</span><h2>Then choose the slot.</h2><p>Filter by niche. Every listing shows the zone, size, city, dates, and asking price.</p></article>
          <article><span>03 / Agree the proof</span><h2>Know what comes back.</h2><p>Artwork, visibility, and dated photos are in the terms before anything is worn.</p></article>
        </div>

        <div className="value-split">
          <article>
            <h2>Where a logo sits</h2>
            <ul>
              <li><CheckIcon /> A numbered chest or sleeve on race day</li>
              <li><CheckIcon /> A dress spot on an event floor</li>
              <li><CheckIcon /> A hoodie chest through a week of city days</li>
              <li><CheckIcon /> A kit you can identify in a photo</li>
            </ul>
          </article>
          <article className="accent">
            <h2>Clear terms</h2>
            <ul>
              <li><CheckIcon /> One price for the slot and the dates</li>
              <li><CheckIcon /> Creator profile ownership and 10K+ audience checked</li>
              <li><CheckIcon /> Visibility and photo proof written first</li>
              <li><CheckIcon /> Agree on exclusivity before accepting</li>
            </ul>
          </article>
        </div>

        <section className="audience-faq">
          <h2>Brand questions</h2>
          <details><summary>Am I buying impressions?</summary><p>No. You rent a physical zone for agreed dates. Followers are context, not a CPM guarantee.</p></details>
          <details><summary>Who prints the mark?</summary><p>The listing says. Usually the brand supplies a patch, sticker, or file. The creator approves it before wearing it.</p></details>
          <details><summary>Can a small local business join?</summary><p>Yes. A website or public business page is enough to verify.</p></details>
          <details><summary>When do payments happen?</summary><p>Paid checkout is not on yet. An accepted offer only reserves terms.</p></details>
        </section>

        <section className="audience-cta">
          <div><h2>Choose a person,<br />then a slot.</h2><p>Find creators and send an offer when the zone is right.</p></div>
          <Link href="/discover" className="button button-primary button-large">Find creators</Link>
        </section>
      </main>
    </>
  );
}

