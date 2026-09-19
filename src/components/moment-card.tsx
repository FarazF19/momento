import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon, BookmarkIcon, PinIcon } from "./icons";

export function MomentCard({ moment, featured = false }: { moment: Moment; featured?: boolean }) {
  const startingPrice = Math.min(...moment.inventory.map((item) => item.price));

  return (
    <article className={featured ? "moment-card moment-card-featured" : "moment-card"}>
      <Link href={`/moments/${moment.slug}`} className="card-image-link" aria-label={`View ${moment.event}`}>
        <div
          className="moment-image"
          style={{
            backgroundColor: moment.color,
            backgroundImage: `linear-gradient(180deg, rgba(8,9,10,.02), rgba(8,9,10,.48)), url(${moment.image})`,
          }}
        >
          <div className="date-ticket" style={{ background: moment.accent }}>
            <span>{moment.month}</span>
            <b>{moment.dates.match(/\d+/)?.[0]}</b>
          </div>
          <span className="category-chip">{moment.category}</span>
          <button className="save-button" type="button" aria-label="Save moment"><BookmarkIcon /></button>
        </div>
      </Link>
      <div className="moment-card-body">
        <div className="card-location"><PinIcon /> {moment.city}, {moment.country}</div>
        <Link href={`/moments/${moment.slug}`}><h3>{moment.event}</h3></Link>
        <p>{moment.tagline}</p>
        <div className="creator-row">
          <span className="avatar" style={{ background: moment.color }}>{moment.creator.avatar}</span>
          <div><b>{moment.creator.name}</b><small>{moment.creator.niche}</small></div>
          <div className="price-block"><small>From</small><b>{formatPrice(startingPrice)}</b></div>
        </div>
        <div className="card-footer">
          <span>{moment.inventory.length} opportunities</span>
          <Link href={`/moments/${moment.slug}`} aria-label={`View ${moment.event}`}><ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
