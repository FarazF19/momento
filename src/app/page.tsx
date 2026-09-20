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
            <div className="eyebrow"><span /> Real people. Real-world advertising.</div>
            <h1>Your brand.<br /><em>Their next adventure.</em></h1>
            <p className="hero-lede">Meet creators who can take your brand into everyday life. Book space on their hoodie, laptop, or bag—at a café, around the city, or on their next trip.</p>
            <div className="hero-actions">
              <Link href="/discover" className="button button-primary button-large">Find a creator <ArrowIcon /></Link>
              <Link href="/creators" className="button button-outline button-large">I’m a creator</Link>
            </div>
            <div className="trust-row">
              <span><CheckIcon /> Choose your creator</span>
              <span><CheckIcon /> Make your offer</span>
              <span><CheckIcon /> Agree the details</span>
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
              <h2>Meet the people.<br />Picture your brand.</h2>
            </div>
            <div className="section-copy">
              <p>{placements.length ? "Find a creator whose everyday fits your brand. See where they’re headed, what space they offer, and what it costs." : "From café regulars to frequent flyers, imagine who could carry your brand next. These fictional profiles show how a placement works."}</p>
              <Link href="/discover" className="underlined-link">Explore the marketplace <ArrowIcon /></Link>
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
              <h2>A creator you like.<br />A placement you agree on.</h2>
              <p>Creators share their plans and available space. Find your fit. Together, you decide how the brand shows up.</p>
            </div>
            <div className="steps-grid">
              <article><b>01</b><h3>Show where you’re going</h3><p>Creators add their plans, photos, available ad space, and price. A hoodie around town? A laptop at a coworking space? Start there.</p></article>
              <article><b>02</b><h3>Find your fit</h3><p>Brands choose a creator and send a brief with an offer. Creators choose the brands they want to work with.</p></article>
              <article><b>03</b><h3>Bring the brand along</h3><p>Agree the artwork, dates, and photo proof before starting. The creator wears or carries the placement as planned.</p></article>
            </div>
          </div>
        </section>

        <section className="brand-section shell" id="for-brands">
          <div className="brand-poster"><span>SMALL<br />SPACE.<br />REAL LIFE.</span><i>✦</i></div>
          <div className="brand-copy">
            <div className="eyebrow"><span /> For brands</div>
            <h2>Go where your<br />customers go.</h2>
            <p>The coworking crowd. The weekend travellers. The local café regulars. Find a creator who spends time in your world, and give your brand a place in theirs.</p>
            <ul>
              <li><CheckIcon /> Choose the creator, place, and dates</li>
              <li><CheckIcon /> Know where your logo will appear</li>
              <li><CheckIcon /> Agree a price and the photos you’ll receive</li>
            </ul>
            <Link href="/discover" className="button button-primary button-large">Meet your next creator <ArrowIcon /></Link>
          </div>
        </section>

        <section className="faq-section shell">
          <h2>Before your first placement.</h2>
          <details><summary>Am I renting the item or advertising space?</summary><p>You rent a defined advertising surface for agreed dates: a hoodie patch, laptop sticker, or bag panel. The creator keeps their item and wears or carries your branding.</p></details>
          <details><summary>Who sets the price?</summary><p>Creators publish an asking price for the full placement period. Brands propose an offer with their requirements. The creator chooses whether to accept.</p></details>
          <details><summary>Does a travel placement include flights or social posts?</summary><p>A travel listing describes where the creator will carry your ad. Flights, trip expenses, and social posts are only included if the placement terms explicitly say so.</p></details>
          <details><summary>How do we know what was delivered?</summary><p>Each listing defines visibility and completion evidence, such as dated placement photos. Agree the artwork, delivery responsibilities, dates, and proof before starting.</p></details>
        </section>
        <section className="final-cta shell">
          <div><span className="eyebrow"><span /> For creators and brands going places</span><h2>Who’s coming<br />along?</h2></div>
          <div className="final-actions">
            <Link href="/discover" className="button button-primary button-large">Find a creator <ArrowIcon /></Link>
            <Link href="/list" className="button button-outline button-large">Offer my ad space</Link>
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
