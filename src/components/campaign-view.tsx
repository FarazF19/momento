import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { CampaignStage } from "./campaign-stage";
import { BookingPanel } from "./booking-panel";
import { CalendarIcon, PinIcon } from "./icons";

export function CampaignView({ moment, generated = false }: { moment: Moment; generated?: boolean }) {
  return (
    <main className="campaign-page shell">
      <div className="campaign-page-grid">
        <div className="campaign-page-stage">
          <div className="eyebrow"><span /> {generated ? "Your campaign" : moment.isDemo ? "Public format" : "Open for offers"}</div>
          <h1>{moment.creator.name}</h1>
          <p className="campaign-page-lede">{moment.title}</p>
          {moment.isDemo && !generated && (
            <p className="campaign-format-note">This sample illustrates the format. It is not a live listing or a Momento customer. Prices, dates, and sponsors shown are illustrative and not booking terms.</p>
          )}
          <div className="detail-meta">
            <span><CalendarIcon /> {moment.dates}</span>
            <span><PinIcon /> {moment.city}</span>
          </div>
          <div className="detail-slot-stage">
            <CampaignStage kind={moment.bodyKind || "body"} slots={moment.slots} photo={moment.photoUrl} />
          </div>
          <ul className="slot-list">
            {(moment.slots ?? []).map((slot, index) => (
              <li key={slot.id}>
                <i style={{ background: slot.color }} />
                <b>{slot.brand === "Open" ? `${String(index + 1).padStart(2, "0")} ${slot.name}` : slot.name}</b>
                <span>{slot.brand}</span>
                <strong>{formatPrice(slot.price)}</strong>
              </li>
            ))}
          </ul>
          <section className="campaign-page-terms">
            <p>{moment.tagline}</p>
            <p>{moment.visibility}</p>
            <p>{moment.proof}</p>
            {moment.creator.socialUrl && <a className="underlined-link" href={moment.creator.socialUrl} target="_blank" rel="noreferrer">View creator’s public profile ↗</a>}
          </section>
          {generated && (
            <div className="campaign-publish">
              <p>This is your campaign preview on Momento. Return to the studio to publish so brands can offer on these slots.</p>
              <Link href="/studio" className="button button-primary">Publish this page</Link>
              <Link href="/studio" className="button button-outline">Edit campaign</Link>
            </div>
          )}
        </div>
        <BookingPanel moment={moment} />
      </div>
    </main>
  );
}

