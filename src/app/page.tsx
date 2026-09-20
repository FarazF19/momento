import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { LandingMotion } from "@/components/landing-motion";
import { moments } from "@/lib/moments";
import { publishedPlacements } from "@/lib/marketplace";
import { currentAccount } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ placements }, account] = await Promise.all([publishedPlacements(), currentAccount()]);
  const examples = moments.filter((item) => item.bodyKind);
  const featured = examples[0];
  const catalog = [...placements, ...examples.filter((item) => !placements.some((live) => live.slug === item.slug))].slice(0, 4);
  const listHref = account?.profile.role === "creator"
    ? "/studio"
    : "/login?mode=signup&role=creator&next=/studio";
  const browseHref = "/discover";

  return (
    <>
      <Header />
      <LandingMotion />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Physical ad marketplace</div>
            <h1>Sell ad space on your body &amp; clothes<br /><em>at real events.</em></h1>
            <p className="hero-lede">
              Creators publish a campaign with numbered zones — chest, arm, jersey, dress. Brands send offers on this site. Proof lives on the same page.
            </p>
            <div className="hero-actions">
              <Link href={listHref} className="button button-primary button-large">List your slots <ArrowIcon /></Link>
              <Link href={browseHref} className="button button-outline button-large">Browse open slots</Link>
            </div>
            <div className="trust-row">
              <span><CheckIcon /> Offers stay on Momento</span>
              <span><CheckIcon /> Photo proof required</span>
              <span><CheckIcon /> No follower minimum</span>
            </div>
          </div>
          {featured && (
            <div className="hero-feature">
              <figure className="hero-stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.photoUrl} alt="" />
                <figcaption>
                  <span className="hero-stage-kicker">{featured.creator.name} · {featured.city}</span>
                  <strong>{featured.slots?.length ?? featured.inventory.length} numbered slots</strong>
                  <p>{featured.raisedLabel}</p>
                </figcaption>
              </figure>
            </div>
          )}
        </section>

        <section className="how-now shell" id="how-it-works">
          <div className="landing-heading reveal">
            <h2>How it works</h2>
          </div>
          <div className="how-now-grid reveal-stagger">
            <article><b>1</b><h3>Creator lists the slots</h3><p>Chest, sleeve, jersey, dress — numbered, priced, and tied to a real event or city.</p></article>
            <article><b>2</b><h3>Brand sends an offer</h3><p>Pick one zone. Send a brief and a price. The conversation stays on Momento.</p></article>
            <article><b>3</b><h3>Wear it. Prove it.</h3><p>The creator approves the artwork, wears the mark, and uploads dated photos to the same page.</p></article>
          </div>
        </section>

        <section className="moments-section shell" id="campaigns">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> Campaigns</div>
            <h2>Open slots you can book.</h2>
            <p>A public campaign shows the person, the numbered zones, and the price. {placements.length > 0 ? "Live listings sit first." : "Marc Lou’s HYROX kit and Vanshu’s TOKEN2049 dress show the format — real listings work the same way."}</p>
          </div>
          <div className="campaign-grid reveal-stagger">
            {catalog.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        </section>

        <section className="split-audience shell" id="for-who">
          <article className="reveal">
            <div className="eyebrow"><span /> For creators</div>
            <h2>List your event. Sell the spots.</h2>
            <p>If you are walking into a race, a conference, or a week of city days, number the zones and set a price. You approve every brand.</p>
            <ul>
              <li><CheckIcon /> No follower minimum</li>
              <li><CheckIcon /> You keep the clothes</li>
              <li><CheckIcon /> Offers land in your dashboard</li>
              <li><CheckIcon /> Photo proof stays on your page</li>
            </ul>
            <Link href={listHref} className="button button-primary">List your slots</Link>
          </article>
          <article className="reveal">
            <div className="eyebrow"><span /> For brands</div>
            <h2>Buy a zone you can point to.</h2>
            <p>You are not buying a banner. You are renting a numbered spot on someone at an event — chest, arm, dress, jersey.</p>
            <ul>
              <li><CheckIcon /> One price per numbered slot</li>
              <li><CheckIcon /> Offers stay on Momento</li>
              <li><CheckIcon /> Artwork approved before it is worn</li>
              <li><CheckIcon /> Dated photos required on the page</li>
            </ul>
            <Link href={browseHref} className="button button-dark">Browse open slots</Link>
          </article>
        </section>

        <section className="faq-section shell">
          <div className="landing-heading reveal">
            <h2>What people ask first</h2>
          </div>
          <div className="reveal-stagger">
            <details>
              <summary>How does payment work?</summary>
              <p>An accepted offer reserves the slot and the terms. Checkout is not live in this preview, so no money is taken yet. Do not start paid work until payment is on.</p>
            </details>
            <details>
              <summary>What if the creator does not deliver proof?</summary>
              <p>Every listing writes the proof up front: dated photos uploaded to the same campaign page. If a creator does not deliver, the brand can decline to proceed and raise it from the dashboard. We do not hold funds until checkout is live.</p>
            </details>
            <details>
              <summary>Is this only for big influencers?</summary>
              <p>No. There is no follower minimum. Brands buy the zone and the room you walk into. Audience size is shown as context, never as a gate.</p>
            </details>
            <details>
              <summary>How do I list my slots?</summary>
              <p>Create a creator account, then describe the event, the number of spots, and a price range. We build the campaign page on Momento. Brands offer there.</p>
            </details>
            <details>
              <summary>Do I need my own website?</summary>
              <p>No. The campaign URL lives on Momento. Brands open it, pick a slot, and send an offer here.</p>
            </details>
          </div>
        </section>

        <section className="final-cta shell">
          <div className="reveal">
            <span className="eyebrow"><span /> Start today</span>
            <h2>List your slots.</h2>
          </div>
          <div className="final-actions reveal">
            <Link href={listHref} className="button button-primary button-large">List your slots <ArrowIcon /></Link>
            <Link href={browseHref} className="button button-outline button-large">Browse open slots</Link>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <div><strong>MOMENTO</strong><p>Numbered ad slots on real people. Offers and proof stay on this site.</p></div>
          <div><Link href="/discover">Browse slots</Link><Link href="/creators">Creators</Link><Link href="/brands">Brands</Link><Link href={listHref}>List your slots</Link></div>
          <small>© 2026 Momento</small>
        </div>
      </footer>
    </>
  );
}
