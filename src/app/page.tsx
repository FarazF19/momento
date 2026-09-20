import Link from "next/link";
import { Header } from "@/components/header";
import { MomentCard } from "@/components/moment-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { LandingFx } from "@/components/landing-fx";
import { SurfaceExplorer } from "@/components/surface-explorer";
import { SlotEstimator } from "@/components/slot-estimator";
import { moments } from "@/lib/moments";

export const revalidate = 300;

const ticker = ["Chest", "Sleeve", "Dress", "Race kit", "Jersey", "Thigh", "Back", "Hem", "Collar", "Arm"];

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

        <div className="slot-ticker" aria-hidden="true">
          <div className="slot-ticker-track">
            {[...ticker, ...ticker].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="how-now shell" id="how-it-works">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> Three steps</div>
            <h2>How it works</h2>
            <p>List the zones. Take the offer. Wear it and prove it on the same page.</p>
          </div>
          <div className="how-now-grid reveal-stagger">
            <article>
              <b>1</b>
              <h3>Creator lists the slots</h3>
              <p>Chest, sleeve, jersey, dress — numbered, priced, and tied to a real event or city.</p>
            </article>
            <article>
              <b>2</b>
              <h3>Brand sends an offer</h3>
              <p>Pick one zone. Send a brief and a price. The conversation stays on Momento.</p>
            </article>
            <article>
              <b>3</b>
              <h3>Wear it. Prove it.</h3>
              <p>The creator approves the artwork, wears the mark, and uploads dated photos to the same page.</p>
            </article>
          </div>
        </section>

        <section className="surfaces-now shell" id="surfaces">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> The inventory</div>
            <h2>Numbered zones on real things.</h2>
            <p>Pick a surface. Hover a number. That is the ad unit — not a follower count, not a banner.</p>
          </div>
          <div className="reveal">
            <SurfaceExplorer />
          </div>
        </section>

        <section className="include-now shell">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> What is in a slot</div>
            <h2>One price. One zone. Clear terms.</h2>
          </div>
          <div className="include-grid reveal-stagger">
            <article>
              <span>01</span>
              <h3>The wear</h3>
              <p>The mark is on the numbered zone for the event dates you list. The clothes stay with the creator.</p>
            </article>
            <article>
              <span>02</span>
              <h3>The proof</h3>
              <p>Dated photos go on the same campaign page. Brands do not have to chase a DM for evidence.</p>
            </article>
            <article>
              <span>03</span>
              <h3>The exclusivity</h3>
              <p>One brand per numbered slot. Another logo does not sit on the same square of fabric.</p>
            </article>
            <article>
              <span>04</span>
              <h3>The conversation</h3>
              <p>Offers, acceptance, and artwork approval stay on Momento. No outbound hop to another site.</p>
            </article>
          </div>
        </section>

        <section className="moments-section shell" id="campaigns">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> Campaigns</div>
            <h2>This is the format.</h2>
            <p>Marc Lou’s HYROX kit and Vanshu’s TOKEN2049 dress show how numbered slots look on a real person. Listings you publish work the same way, on this site.</p>
          </div>
          <div className="campaign-grid reveal-stagger">
            {catalog.map((moment) => <MomentCard key={moment.slug} moment={moment} />)}
          </div>
        </section>

        <section className="compare-now shell">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> Why this exists</div>
            <h2>Not another sponsored post.</h2>
            <p>A brand can already buy a story. Here they buy a square they can point at in a room.</p>
          </div>
          <div className="compare-table reveal">
            <div className="compare-col">
              <h3>Influencer post</h3>
              <ul>
                <li>Lives in a feed for a day</li>
                <li>Reach is a screenshot</li>
                <li>Hard to say where the logo sat</li>
                <li>Proof is a link that dies</li>
              </ul>
            </div>
            <div className="compare-col is-on">
              <h3>Numbered slot</h3>
              <ul>
                <li>Worn in a real room, on a real date</li>
                <li>One zone, one price</li>
                <li>Chest, sleeve, dress — you can name it</li>
                <li>Dated photos stay on the campaign page</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="proof-now shell">
          <div className="landing-heading reveal">
            <div className="eyebrow"><span /> After the event</div>
            <h2>The page does not go quiet.</h2>
          </div>
          <ol className="proof-line reveal-stagger">
            <li>
              <b>Before</b>
              <p>Brand sends artwork. Creator approves it. The slot is reserved on the same page.</p>
            </li>
            <li>
              <b>During</b>
              <p>The mark is worn for the dates on the listing — race, conference, city week.</p>
            </li>
            <li>
              <b>After</b>
              <p>Dated photos upload to the campaign. Anyone with the link can see the proof.</p>
            </li>
          </ol>
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

        <section className="speed-now shell">
          <div className="speed-now-copy reveal">
            <div className="eyebrow"><span /> Time</div>
            <h2>Live campaign page in under five minutes.</h2>
            <p>Account, event, photo, number of slots, price. Preview while you fill. Publish. Share the link.</p>
            <Link href={listHref} className="button button-primary button-large">Start a listing <ArrowIcon /></Link>
          </div>
          <div className="reveal">
            <SlotEstimator />
          </div>
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
