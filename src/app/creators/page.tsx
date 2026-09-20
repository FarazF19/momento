import Link from "next/link";
import { Header } from "@/components/header";
import { CheckIcon } from "@/components/icons";
import { industries } from "@/lib/moments";
import { currentAccount } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const account = await currentAccount();
  const buildHref = account?.profile.role === "creator" ? "/studio" : "/login?mode=signup&role=creator&next=/studio";

  return (
    <>
      <Header />
      <main className="audience-page shell">
        <div className="eyebrow"><span /> For creators</div>
        <h1>List numbered slots<br /><em>on what you wear.</em></h1>
        <p className="audience-lede">Create an account, describe your campaign, and publish a Momento page with priced zones. Brands send offers here. You keep the clothes.</p>
        <div className="hero-actions">
          <Link href={buildHref} className="button button-primary button-large">Build my page</Link>
          <Link href="/#campaigns" className="button button-outline button-large">See example campaigns</Link>
        </div>
        <div className="stat-strip">
          <span><b>~1 min</b><small>automatic verification</small></span>
          <span><b>0</b><small>follower minimum</small></span>
          <span><b>You</b><small>approve every brand</small></span>
          <span><b>Yours</b><small>the garment stays with you</small></span>
        </div>

        <div className="audience-grid">
          <article><span>01 / Create an account</span><h2>Sign in first.</h2><p>New creators start with sign-up and email confirmation. After that, the builder helps you map your slots.</p></article>
          <article><span>02 / Number the zones</span><h2>Chest. Sleeve. Dress front.</h2><p>Describe the event, mark each slot, and set a price. Pick a niche so the right brands can find you.</p></article>
          <article><span>03 / Wear the artwork</span><h2>Every offer is your call.</h2><p>Accept the brand, wear the mark on the dates you wrote, and upload dated photos to the same page.</p></article>
        </div>

        <div className="value-split">
          <article>
            <h2>What people list</h2>
            <ul>
              <li><CheckIcon /> Race-kit zones — chest, arms, thighs</li>
              <li><CheckIcon /> A dress mapped into numbered spots</li>
              <li><CheckIcon /> A hoodie chest on a week of outings</li>
              <li><CheckIcon /> An event-day kit with a start and an end</li>
            </ul>
          </article>
          <article className="accent">
            <h2>You stay in control</h2>
            <ul>
              <li><CheckIcon /> You set the price on each slot</li>
              <li><CheckIcon /> You approve the artwork first</li>
              <li><CheckIcon /> Dates and photo proof are written up front</li>
              <li><CheckIcon /> Nothing ships except the patch or print you agreed to wear</li>
            </ul>
          </article>
        </div>

        <section className="audience-faq">
          <h2>Creator questions</h2>
          <details><summary>Do I need a large following?</summary><p>No. Brands buy the zone and the room you walk into. Audience size is shown as context from your live profile.</p></details>
          <details><summary>What niches can I list under?</summary><p>{industries.filter((item) => item !== "All").join(", ")}.</p></details>
          <details><summary>Do I have to post on social media?</summary><p>No. A slot is physical. Posts are only included if you write them into the listing.</p></details>
          <details><summary>When do I get paid?</summary><p>Checkout is not live in this preview. Do not start paid work until payment confirmation exists.</p></details>
        </section>

        <section className="audience-cta">
          <div><h2>Create an account,<br />then build your page.</h2><p>Verification takes about a minute after you confirm your email.</p></div>
          <Link href={buildHref} className="button button-primary button-large">Build my page</Link>
        </section>
      </main>
    </>
  );
}
