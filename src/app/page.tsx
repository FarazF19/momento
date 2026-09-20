import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { LandingFx } from "@/components/landing-fx";
import { LandingHow, LandingTheme } from "@/components/surface-explorer";
import { LandingCta, LandingFaq, LandingHeroActions, LandingTrust } from "@/components/slot-estimator";
import { HeroPlacement } from "@/components/hero-placement";
import { publishedPlacements } from "@/lib/marketplace";
import { moments } from "@/lib/moments";
export const revalidate = 60;
export default async function Home() {
  const { placements, unavailable } = await publishedPlacements(2500);
  const listHref = "/login?mode=signup&role=creator&next=/studio";
  return <><Header /><LandingFx /><LandingTheme><main>
    <section className="hero shell launch-hero"><div className="hero-copy">
      <div className="eyebrow"><span /> Creator sponsorships, out in the world</div>
      <h1>Sponsor what creators wear.<br /><em>Where it matters.</em></h1>
      <p className="hero-lede">Put your brand on a creator’s outfit, laptop, or bag at their next event. Choose the person, agree on the placement, and get photo proof.</p>
      <LandingHeroActions listHref={listHref} browseHref="/discover" /><LandingTrust />
      <p className="launch-stage-note">Early access · Create listings and discuss offers. Payments are not live yet.</p>
    </div><div className="hero-feature"><HeroPlacement /></div></section>
    <section className="moments-section shell launch-listings" id="campaigns"><div className="landing-heading"><div className="eyebrow"><span /> Meet the creators</div><h2>A person you’d pick.<br />A place your brand fits.</h2><p>Explore their niche, upcoming plans, placement details, and asking price.</p></div>
      {placements.length ? <><div className="campaign-grid">{placements.slice(0, 3).map(moment => <MomentCard key={moment.slug} moment={moment} />)}</div><Link className="underlined-link" href="/discover">Explore all creators →</Link></> : <div className="launch-empty"><div><span className="eyebrow">{unavailable ? "Listings unavailable" : "Founding creators"}</span><h3>{unavailable ? "We couldn’t load creator listings." : "Going somewhere worth showing up?"}</h3><p>{unavailable ? "Please try the marketplace again shortly." : "We’re welcoming our first creators. Have 10,000+ followers on Instagram, TikTok, or X and an upcoming event? Create your profile and tell brands where you’re headed."}</p></div><LandingCta href={unavailable ? "/discover" : listHref}>{unavailable ? "Try the marketplace" : "Become a founding creator"}<ArrowIcon /></LandingCta></div>}
    </section>
    <section className="how-now shell" id="how-it-works"><div className="landing-heading reveal"><div className="eyebrow"><span /> How it works</div><h2>Choose the creator.<br />Agree on the details.</h2><p>Start with a person and a real plan. Keep the offer and deliverables together.</p></div><LandingHow /></section>
    <section className="split-audience shell" id="for-who">
      <article className="reveal"><div className="eyebrow"><span /> For creators</div><h2>Your plans.<br />A new way to earn.</h2><p>You’re already going. Give a brand a place on what you wear or carry, on terms you choose.</p><ul><li><CheckIcon /> 10,000+ followers on one supported platform</li><li><CheckIcon /> Your price, your dates, your choice of brands</li><li><CheckIcon /> You keep your clothes and belongings</li></ul><LandingCta href={listHref}>Create your creator profile</LandingCta></article>
      <article className="reveal"><div className="eyebrow"><span /> For brands</div><h2>Find your people.<br />Show up with them.</h2><p>Find a creator heading to the conference, race, or community your customers care about.</p><ul><li><CheckIcon /> See the person, social profile, and event</li><li><CheckIcon /> Agree on size, dates, artwork, and photo proof</li><li><CheckIcon /> Send an offer for the placement that fits</li></ul><LandingCta href="/discover" tone="outline">Find creators</LandingCta></article>
    </section>
    <section className="moments-section shell launch-examples"><div className="landing-heading reveal"><div className="eyebrow"><span /> Explore the format</div><h2>Picture your next collaboration.</h2><p>These sample pages illustrate physical sponsorships. They are not available listings, Momento customers, or evidence of revenue earned here.</p></div><div className="campaign-grid reveal-stagger">{moments.slice(0, 2).map(moment => <MomentCard key={moment.slug} moment={moment} />)}</div></section>
    <section className="launch-terms shell"><div><span className="eyebrow">Before any paid campaign</span><h2>Know exactly what’s agreed.</h2></div><div><p><strong>One written brief:</strong> placement size, event dates, total price, who prints and ships the branding, artwork approval, and when photos are due.</p><p><strong>Clear expectations:</strong> photos document the placement. Followers and event attendance do not guarantee views or sales.</p><p><strong>Current payment status:</strong> checkout and creator payouts are not enabled. Offers are expressions of interest; do not pay or start paid work through this preview.</p><Link href="/trust" className="underlined-link">Read verification and payment details →</Link></div></section>
    <section className="faq-section shell"><div className="landing-heading reveal"><h2>A few things to know.</h2></div><LandingFaq /></section>
    <section className="final-cta shell"><div><span className="eyebrow"><span /> Founding creators welcome</span><h2>Make your next event<br />a brand opportunity.</h2></div><div className="final-actions"><LandingCta href={listHref} size="lg">Create your profile <ArrowIcon /></LandingCta><LandingCta href="/brands" tone="outline" size="lg">I’m a brand</LandingCta></div></section>
  </main></LandingTheme><footer className="site-footer"><div className="shell footer-inner"><div><strong>MOMENTO</strong><p>Your brand. Their next adventure.</p></div><div><Link href="/discover">Find creators</Link><Link href="/creators">For creators</Link><Link href="/brands">For brands</Link><Link href="/trust">Verification &amp; payments</Link></div><small>© 2026 Momento</small></div></footer></>;
}
