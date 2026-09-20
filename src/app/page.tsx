import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { PlacementShowcase } from "@/components/placement-showcase";
import { moments } from "@/lib/moments";
import { publishedPlacements } from "@/lib/marketplace";
export const dynamic = "force-dynamic";

export default async function Home() {
  const { placements } = await publishedPlacements();
  const featured = placements.length ? placements.slice(0, 4) : moments.slice(0, 4);
  return (
    <>
      <Header />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> The real-world creator ad marketplace</div>
            <h1>Good brands.<br /><em>Going places.</em></h1>
            <p className="hero-lede">Put your brand on the clothes, laptops, and bags creators already wear and carry. Rent a defined ad space—not another social post.</p>
            <div className="hero-actions">
              <Link href="/discover" className="button button-primary button-large">Explore ad spaces <ArrowIcon /></Link>
              <Link href="/creators" className="button button-outline button-large">I’m a creator</Link>
            </div>
            <div className="trust-row">
              <span><CheckIcon /> Defined ad space</span>
              <span><CheckIcon /> Brands make offers</span>
              <span><CheckIcon /> Creator-approved</span>
            </div>
          </div>
          <div className="hero-feature">
            <PlacementShowcase />
          </div>
        </section>

        <section className="ticker" aria-label="Marketplace benefits">
          <div>CLOTHES <span>✦</span> LAPTOPS <span>✦</span> BAGS <span>✦</span> TRAVEL <span>✦</span></div>
        </section>

        <section className="moments-section shell">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span /> {placements.length ? "Explore the marketplace" : "See the possibilities"}</div>
              <h2>Everyday items.<br />Available ad space.</h2>
            </div>
            <div className="section-copy">
              <p>{placements.length ? "Ad spaces listed by creators. Compare the surface, dates, and asking price, then make your offer." : "A hoodie chest patch. A laptop sticker. A backpack on a trip. These fictional examples show exactly what a brand could rent."}</p>
              <Link href="/discover" className="underlined-link">Browse all ad spaces <ArrowIcon /></Link>
            </div>
          </div>
          <div className="moment-grid home-grid">
            {featured.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="shell">
            <div className="eyebrow light"><span /> One simple marketplace</div>
            <div className="how-heading">
              <h2>List it. Agree it.<br />Wear it out.</h2>
              <p>Brands rent the advertising space—not the item. Creators keep wearing, carrying, and using their own things.</p>
            </div>
            <div className="steps-grid">
              <article><b>01</b><h3>Creators list their space</h3><p>Show the item, mark the ad area, and set the dates, locations, and asking price.</p></article>
              <article><b>02</b><h3>Brands make an offer</h3><p>Choose a placement and propose a price. Agree the design, visibility, and proof before payment.</p></article>
              <article><b>03</b><h3>Creators show the proof</h3><p>Wear or carry the approved placement for the agreed period, then submit photo proof for review.</p></article>
            </div>
          </div>
        </section>

        <section className="brand-section shell" id="for-brands">
          <div className="brand-poster"><span>SMALL<br />SPACE.<br />REAL LIFE.</span><i>✦</i></div>
          <div className="brand-copy">
            <div className="eyebrow"><span /> For brands</div>
            <h2>Be part of<br />their everyday.</h2>
            <p>Start with a place your audience spends time. Find a creator going there, then rent a clearly defined space on what they wear or carry.</p>
            <ul>
              <li><CheckIcon /> See the exact surface, size, and duration</li>
              <li><CheckIcon /> Agree visibility and photo proof upfront</li>
              <li><CheckIcon /> Creator approves the brand and terms</li>
            </ul>
            <Link href="/discover" className="button button-primary button-large">Find an ad space <ArrowIcon /></Link>
          </div>
        </section>

        <section className="faq-section shell">
          <h2>A few things, made clear.</h2>
          <details><summary>Am I renting the item or advertising space?</summary><p>You rent a defined advertising surface for agreed dates: a hoodie patch, laptop sticker, or bag panel. The creator keeps their item and wears or carries your branding.</p></details>
          <details><summary>Who sets the price?</summary><p>Creators publish an asking price for the full placement period. Brands propose an offer with their requirements. The creator chooses whether to accept.</p></details>
          <details><summary>Does a travel placement include flights or social posts?</summary><p>A travel listing describes where the creator will carry your ad. Flights, trip expenses, and social posts are only included if the placement terms explicitly say so.</p></details>
          <details><summary>How do we know what was delivered?</summary><p>Each listing defines visibility and completion evidence, such as dated placement photos. Agree the artwork, delivery responsibilities, dates, and proof before starting.</p></details>
        </section>
        <section className="final-cta shell">
          <div><span className="eyebrow"><span /> Have a hoodie, laptop, bag, or upcoming trip?</span><h2>Make space.</h2></div>
          <div className="final-actions">
            <Link href="/discover" className="button button-primary button-large">Explore ad spaces <ArrowIcon /></Link>
            <Link href="/list" className="button button-outline button-large">List yours</Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div><strong>MOMENTO</strong><p>Your brand. Their everyday.</p></div>
          <div><Link href="/discover">Explore</Link><Link href="/list">For creators</Link></div>
          <small>© 2026 Momento. MVP preview.</small>
        </div>
      </footer>
    </>
  );
}
