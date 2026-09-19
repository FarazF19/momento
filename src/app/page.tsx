import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { moments } from "@/lib/moments";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> The marketplace for sponsorable moments</div>
            <h1>Buy attention<br />before it <em>happens.</em></h1>
            <p className="hero-lede">Creators list where they’re going and what they’ll make. Brands book the moments that fit.</p>
            <div className="hero-actions">
              <Link href="/discover" className="button button-primary button-large">Explore moments <ArrowIcon /></Link>
              <Link href="/list" className="button button-outline button-large">List a moment</Link>
            </div>
            <div className="trust-row">
              <span><CheckIcon /> Clear deliverables</span>
              <span><CheckIcon /> Direct offers</span>
              <span><CheckIcon /> Creator-approved</span>
            </div>
          </div>
          <div className="hero-feature">
            <div className="hero-note hero-note-top">NEXT UP <b>London</b></div>
            <MomentCard moment={moments[2]} featured />
            <div className="hero-note hero-note-bottom">OPEN TO<br /><b>OFFERS</b></div>
          </div>
        </section>

        <section className="ticker" aria-label="Marketplace benefits">
          <div>REAL PLACES <span>✦</span> REAL PEOPLE <span>✦</span> BRAND PARTNERSHIPS <span>✦</span> WHAT HAPPENS NEXT <span>✦</span></div>
        </section>

        <section className="moments-section shell">
          <div className="section-heading">
            <div>
              <div className="eyebrow"><span /> Happening next</div>
              <h2>Find your next<br />cultural moment.</h2>
            </div>
            <div className="section-copy">
              <p>Browse upcoming places, events, and creator-led opportunities without chasing replies across five platforms.</p>
              <Link href="/discover" className="underlined-link">View all moments <ArrowIcon /></Link>
            </div>
          </div>
          <div className="moment-grid home-grid">
            {moments.slice(0, 3).map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="shell">
            <div className="eyebrow light"><span /> One simple marketplace</div>
            <div className="how-heading">
              <h2>From calendar<br />to campaign.</h2>
              <p>The awkward sponsorship hunt becomes a clear, bookable exchange.</p>
            </div>
            <div className="steps-grid">
              <article><b>01</b><h3>Creators list the moment</h3><p>Share the event, audience, deliverables, timing, and starting price.</p></article>
              <article><b>02</b><h3>Brands find the fit</h3><p>Search by event, audience, location, category, or budget.</p></article>
              <article><b>03</b><h3>Both sides approve</h3><p>Book listed inventory or make an offer. Every booking is confirmed with the creator.</p></article>
            </div>
          </div>
        </section>

        <section className="brand-section shell" id="for-brands">
          <div className="brand-poster"><span>BRAND<br />MEETS<br />MOMENT</span><i>✦</i></div>
          <div className="brand-copy">
            <div className="eyebrow"><span /> For brands</div>
            <h2>Stop renting reach.<br />Enter the story.</h2>
            <p>Find creators who are already heading somewhere relevant, then sponsor exactly what your campaign needs.</p>
            <ul>
              <li><CheckIcon /> Know the deliverable before you reach out</li>
              <li><CheckIcon /> See audience context and timing together</li>
              <li><CheckIcon /> Pay securely or make a direct offer</li>
            </ul>
            <Link href="/discover" className="button button-dark button-large">Browse opportunities <ArrowIcon /></Link>
          </div>
        </section>

        <section className="final-cta shell">
          <div><span className="eyebrow"><span /> Your next campaign is already going somewhere</span><h2>Get there first.</h2></div>
          <div className="final-actions">
            <Link href="/discover" className="button button-primary button-large">Explore moments <ArrowIcon /></Link>
            <Link href="/list" className="button button-outline button-large">List yours</Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div><strong>MOMENTO</strong><p>Real people. Real places. Better partnerships.</p></div>
          <div><Link href="/discover">Explore</Link><Link href="/list">For creators</Link><a href="mailto:hello@momento.market">Contact</a></div>
          <small>© 2026 Momento. MVP preview.</small>
        </div>
      </footer>
    </>
  );
}
