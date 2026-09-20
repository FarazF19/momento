import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { LandingFx } from "@/components/landing-fx";
import {
  LandingCompare,
  LandingHow,
  LandingInclude,
  LandingProof,
  LandingTheme,
  SurfaceExplorer,
} from "@/components/surface-explorer";
import { LandingCta, LandingFaq, LandingHeroActions, LandingTrust, SlotEstimator } from "@/components/slot-estimator";
import { ProofTicker } from "@/components/proof-ticker";
import { moments } from "@/lib/moments";

export const revalidate = 300;

export default async function Home() {
  const examples = moments.filter((item) => item.bodyKind);
  const featured = examples[0];
  const catalog = examples.slice(0, 2);
  const listHref = "/login?mode=signup&role=creator&next=/studio";
  const browseHref = "/discover";

  return (
    <>
      <Header />
      <LandingFx />
      <LandingTheme>
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Physical ads on real people</div>
            <h1>Sell ad space on your body &amp; clothes<br /><em>at real events.</em></h1>
            <p className="hero-lede">
              Number the zones on what you wear. Brands send offers here. Dated photos of the wear stay on the same page.
            </p>
            <LandingHeroActions listHref={listHref} browseHref={browseHref} />
            <LandingTrust />
          </div>
          {featured && (
            <div className="hero-feature">
              <figure className="hero-stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.photoUrl} alt="" fetchPriority="high" decoding="async" />
                <figcaption>
                  <span className="hero-stage-kicker">{featured.creator.name} · {featured.city}</span>
                  <strong>{featured.slots?.length ?? featured.inventory.length} numbered slots</strong>
                  <p>{featured.raisedLabel}</p>
                </figcaption>
              </figure>
            </div>
          )}
        </section>

        <ProofTicker />

        <section className="how-now shell" id="how-it-works">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> How it works</div>
            <h2>List. Offer. Wear.</h2>
            <p>Three steps. One URL. The deal stays on this site.</p>
          </div>
          <LandingHow />
        </section>

        <section className="surfaces-now shell" id="surfaces">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> The inventory</div>
            <h2>Click a number. That is the ad.</h2>
            <p>Chest, sleeve, dress, jersey — not a follower count, not a banner.</p>
          </div>
          <div className="reveal">
            <SurfaceExplorer />
          </div>
        </section>

        <section className="include-now shell">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> What you sell</div>
            <h2>A square. A date. A photo.</h2>
            <p>That is a slot — fabric, a window of days, and proof on the same page.</p>
          </div>
          <LandingInclude />
        </section>

        <section className="moments-section shell" id="campaigns">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> The format</div>
            <h2>This is what a listing looks like.</h2>
            <p>Marc Lou’s HYROX kit and Vanshu’s TOKEN2049 dress. Your page works the same way, on this site.</p>
          </div>
          <div className="campaign-grid reveal-stagger">
            {catalog.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        </section>

        <section className="compare-now shell">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> Why this exists</div>
            <h2>A post disappears. A slot is in the room.</h2>
            <p>Brands can already buy a story. Here they buy a square they can point at.</p>
          </div>
          <LandingCompare />
        </section>

        <section className="proof-now shell">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> After the event</div>
            <h2>The page stays useful.</h2>
            <p>Artwork, wear, and photos live on one campaign URL.</p>
          </div>
          <LandingProof />
        </section>

        <section className="split-audience shell" id="for-who">
          <article className="reveal">
            <div className="eyebrow"><span /> For creators</div>
            <h2>Walking into an event? Number the kit.</h2>
            <p>Race, conference, or a week of city days. You set the price. You approve every brand.</p>
            <ul>
              <li><CheckIcon /> No follower minimum</li>
              <li><CheckIcon /> You keep the clothes</li>
              <li><CheckIcon /> Offers land in your dashboard</li>
              <li><CheckIcon /> Photo proof stays on your page</li>
            </ul>
            <LandingCta href={listHref} tone="primary">List your slots</LandingCta>
          </article>
          <article className="reveal">
            <div className="eyebrow"><span /> For brands</div>
            <h2>Buy a zone you can point to.</h2>
            <p>Not a banner. A numbered spot on someone in the room — chest, arm, dress, jersey.</p>
            <ul>
              <li><CheckIcon /> One price per numbered slot</li>
              <li><CheckIcon /> Offers stay on Momento</li>
              <li><CheckIcon /> Artwork approved before it is worn</li>
              <li><CheckIcon /> Dated photos required on the page</li>
            </ul>
            <LandingCta href={browseHref} tone="dark">Browse open slots</LandingCta>
          </article>
        </section>

        <section className="speed-now shell">
          <div className="speed-now-copy reveal">
            <div className="eyebrow"><span /> Time</div>
            <h2>A live page in under five minutes.</h2>
            <p>Account, event, photo, slots, price. Preview as you type. Publish. Share the link.</p>
            <LandingCta href={listHref} tone="primary" size="lg">Start a listing <ArrowIcon /></LandingCta>
          </div>
          <div className="reveal">
            <SlotEstimator />
          </div>
        </section>

        <section className="faq-section shell">
          <div className="landing-heading reveal">
            <h2>Common questions</h2>
          </div>
          <LandingFaq />
        </section>

        <section className="final-cta shell">
          <div className="reveal">
            <span className="eyebrow"><span /> Start today</span>
            <h2>List your slots.</h2>
          </div>
          <div className="final-actions reveal">
            <LandingCta href={listHref} tone="primary" size="lg">List your slots <ArrowIcon /></LandingCta>
            <LandingCta href={browseHref} tone="outline" size="lg">Browse open slots</LandingCta>
          </div>
        </section>
      </main>
      </LandingTheme>
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
