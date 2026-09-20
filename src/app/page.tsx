import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { LandingMotion } from "@/components/landing-motion";
import { moments, industries } from "@/lib/moments";
import { publishedPlacements } from "@/lib/marketplace";
import { currentAccount } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ placements }, account] = await Promise.all([publishedPlacements(), currentAccount()]);
  const campaigns = moments.filter((item) => item.bodyKind);
  const featured = campaigns[0];
  const niches = industries.filter((item) => item !== "All");
  const buildHref = account?.profile.role === "creator"
    ? "/studio"
    : account?.profile.role === "brand"
      ? "/discover"
      : "/login?mode=signup&role=creator&next=/studio";

  return (
    <>
      <Header />
      <LandingMotion />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Physical advertising marketplace</div>
            <h1>Ad space on<br /><em>what people wear.</em></h1>
            <p className="hero-lede">
              Momento is a marketplace for numbered advertising slots on clothing, race kits, and event outfits.
              Creators publish a campaign page here. Brands browse, offer, and stay on this site.
            </p>
            <div className="hero-actions">
              <Link href={buildHref} className="button button-primary button-large">Build my page <ArrowIcon /></Link>
              <Link href="/discover" className="button button-outline button-large">Browse campaigns</Link>
            </div>
            <div className="trust-row">
              <span><CheckIcon /> Creator or brand accounts</span>
              <span><CheckIcon /> Campaigns hosted on Momento</span>
              <span><CheckIcon /> Verification in about a minute</span>
            </div>
          </div>
          {featured && (
            <div className="hero-feature">
              <figure className="hero-stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.photoUrl} alt="" />
                <figcaption>
                  <span className="hero-stage-kicker">Example campaign · {featured.city}</span>
                  <strong>{featured.creator.name}</strong>
                  <p>{featured.surface} · {featured.raisedLabel}</p>
                </figcaption>
                <div className="hero-note hero-note-top"><b>{featured.slots?.length ?? featured.inventory.length}</b> priced zones</div>
                <div className="hero-note hero-note-bottom"><b>On Momento</b> Brands offer here</div>
              </figure>
              <p className="hero-caption">Public example used to show the page structure. Your campaign uses your details, not this photo.</p>
            </div>
          )}
        </section>

        <section className="ticker" aria-label="Placement types">
          <div className="ticker-track">
            <span>CHEST · SLEEVE · THIGH · DRESS FRONT · RACE KIT · EVENT DAY · CREATOR PAGES · BRAND OFFERS · </span>
            <span>CHEST · SLEEVE · THIGH · DRESS FRONT · RACE KIT · EVENT DAY · CREATOR PAGES · BRAND OFFERS · </span>
          </div>
        </section>

        <section className="moments-section shell" id="campaigns">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow"><span /> How a campaign looks</div>
              <h2>A person.<br />Numbered slots.</h2>
            </div>
            <p className="section-copy">These are public examples rendered on Momento so you can see the format. Hover a card for the slot map. Open the page without leaving this site.</p>
          </div>
          <div className="campaign-grid">
            {campaigns.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        </section>

        {placements.length > 0 && (
          <section className="moments-section shell">
            <div className="section-heading reveal">
              <div>
                <div className="eyebrow"><span /> Open now</div>
                <h2>Live listings.</h2>
              </div>
              <p className="section-copy">Creators who have already published. Same page format: person, slots, and an offer box.</p>
            </div>
            <div className="moment-grid home-grid">
              {placements.slice(0, 6).map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
            </div>
          </section>
        )}

        <section className="how-section" id="how-it-works">
          <div className="shell">
            <div className="how-heading reveal">
              <div>
                <div className="eyebrow light"><span /> For creators</div>
                <h2>From account to live page.</h2>
              </div>
              <p>Create an account, describe the slots you want to sell, and publish a campaign that brands can book on Momento.</p>
            </div>
            <div className="steps-grid steps-four">
              <article className="reveal"><b>01</b><h3>Create an account</h3><p>Sign up as a creator and confirm your email. New members start here before a page is built.</p></article>
              <article className="reveal"><b>02</b><h3>Describe the campaign</h3><p>Who you are, the event or city, how many slots, and a price range.</p></article>
              <article className="reveal"><b>03</b><h3>Review your page</h3><p>We map the zones onto a Momento URL with terms and an offer box.</p></article>
              <article className="reveal"><b>04</b><h3>Approve brands</h3><p>Offers arrive in your dashboard. You choose who appears on each slot.</p></article>
            </div>
          </div>
        </section>

        <section className="brand-path shell" id="for-brands">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow"><span /> For brands</div>
              <h2>Book a zone<br />on a real person.</h2>
            </div>
            <p className="section-copy">You are not buying a digital banner. You are renting a physical slot on clothing worn at an event or in a city.</p>
          </div>
          <div className="brand-path-grid">
            <article className="reveal"><b>01</b><h3>Browse campaigns</h3><p>Filter by niche and city. Every listing shows the person, the zone, and the asking price.</p></article>
            <article className="reveal"><b>02</b><h3>Send an offer</h3><p>Choose a numbered slot and submit a brief and price. The conversation stays on Momento.</p></article>
            <article className="reveal"><b>03</b><h3>Receive photo proof</h3><p>Artwork is approved first. Dated placement photos return on the same campaign page.</p></article>
          </div>
          <div className="section-soft-cta reveal">
            <Link href="/discover" className="button button-dark button-large">Browse campaigns <ArrowIcon /></Link>
            <Link href="/login?mode=signup&role=brand&next=/discover" className="button button-outline button-large">Create a brand account</Link>
          </div>
        </section>

        <section className="split-audience shell" id="for-who">
          <article className="reveal">
            <div className="eyebrow"><span /> Creators</div>
            <h2>List your slots. Keep the clothes.</h2>
            <p>If you already walk into rooms that brands want to reach, number the zones, set a price, and approve every partner.</p>
            <ul>
              <li><CheckIcon /> Your own campaign page after you sign in</li>
              <li><CheckIcon /> No follower minimum</li>
              <li><CheckIcon /> Verification in about a minute</li>
              <li><CheckIcon /> Offers managed in your dashboard</li>
            </ul>
            <Link href={buildHref} className="button button-primary">Build my page</Link>
          </article>
          <article className="reveal">
            <div className="eyebrow"><span /> Brands</div>
            <h2>Buy a zone you can point to.</h2>
            <p>A chest at a race. A dress on an event floor. You know the face, the city, and which photo comes back.</p>
            <ul>
              <li><CheckIcon /> One price per numbered slot</li>
              <li><CheckIcon /> Offers stay on Momento</li>
              <li><CheckIcon /> Proof agreed before payment</li>
              <li><CheckIcon /> Independent businesses welcome</li>
            </ul>
            <Link href="/discover" className="button button-dark">See open slots</Link>
          </article>
        </section>

        <section className="niche-section shell">
          <div className="section-heading reveal">
            <div>
              <div className="eyebrow"><span /> Niches brands shop</div>
              <h2>Find the room you sell into.</h2>
            </div>
            <p className="section-copy">Creators pick one niche. Brands filter by it. A fitness kit and a fashion dress do not sit in the same list.</p>
          </div>
          <div className="niche-grid">
            {niches.map((item) => (
              <Link key={item} href="/discover" className="niche-chip">{item}</Link>
            ))}
          </div>
        </section>

        <section className="proof-strip shell">
          <div className="proof-grid">
            <article className="reveal"><b>Account first</b><p>Build my page starts with sign-in or sign-up, then the builder.</p></article>
            <article className="reveal"><b>Your page</b><p>Generated campaigns use your details — not another creator’s photos.</p></article>
            <article className="reveal"><b>One brand</b><p>Each numbered zone is exclusive for the dates you set.</p></article>
            <article className="reveal"><b>Photo proof</b><p>Placement photos live on the campaign page, not in a private thread.</p></article>
          </div>
        </section>

        <section className="faq-section shell">
          <h2 className="reveal">Common questions</h2>
          <details><summary>What happens when I click Build my page?</summary><p>If you are new, you create a creator account and confirm your email. After you sign in, we take you to the builder so you can describe your campaign and preview your page.</p></details>
          <details><summary>Do I need my own website?</summary><p>No. The campaign URL is hosted on Momento. Brands open it, choose a slot, and send an offer here.</p></details>
          <details><summary>Are the example campaigns mine if I copy them?</summary><p>No. Marc Lou and Vanshu are public examples of the format. Your page is generated from your own description and does not reuse their photos.</p></details>
          <details><summary>Is this an impressions product?</summary><p>No. You rent a physical zone for agreed dates. Audience size is context, never a CPM guarantee.</p></details>
          <details><summary>When do payments happen?</summary><p>Checkout is not live in this preview. An accepted offer reserves terms until payment is available.</p></details>
        </section>

        <section className="final-cta shell">
          <div className="reveal">
            <span className="eyebrow"><span /> Creators list. Brands offer.</span>
            <h2>Start with<br />an account.</h2>
          </div>
          <div className="final-actions reveal">
            <Link href={buildHref} className="button button-primary button-large">Build my page <ArrowIcon /></Link>
            <Link href="/login?mode=signup&role=brand&next=/discover" className="button button-outline button-large">Join as a brand</Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div><strong>MOMENTO</strong><p>Numbered ad slots on clothing, hosted on this site.</p></div>
          <div><Link href="/discover">Explore</Link><Link href="/creators">Creators</Link><Link href="/brands">Brands</Link><Link href={buildHref}>Build my page</Link></div>
          <small>© 2026 Momento. Marketplace preview.</small>
        </div>
      </footer>
    </>
  );
}
