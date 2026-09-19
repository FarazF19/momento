import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon, PinIcon } from "./icons";

import { PlacementArt } from "./placement-art";

export function MomentCard({ moment, featured = false }: { moment: Moment; featured?: boolean }) {
  const startingPrice = Math.min(...moment.inventory.map((item) => item.price));

  return (
    <article className={featured ? "moment-card moment-card-featured" : "moment-card"}>
      <Link href={`/placements/${moment.slug}`} className="card-image-link" aria-label={`View ${moment.title}`}>
        <div
          className="moment-image"
          style={{
            backgroundColor: moment.color,

          }}
        >
          <PlacementArt category={moment.category} photoUrl={moment.photoUrl} title={moment.title} />
          <div className="date-ticket" style={{ background: moment.accent }}>
            <span>{moment.month}</span>
            <b>{Number(moment.startDate.slice(8, 10))}</b>
          </div>
          <span className="category-chip">{moment.category}</span>
          {moment.isDemo && <span className="sample-chip">Example</span>}
        </div>
      </Link>
      <div className="moment-card-body">
        <div className="card-location"><PinIcon /> {moment.city}, {moment.country}</div>
        <Link href={`/placements/${moment.slug}`}><h3>{moment.title}</h3></Link>
        <p>{moment.tagline}</p>
        <div className="creator-row">
          <span className="avatar" style={{ background: moment.color }}>{moment.creator.avatar}</span>
          <div><b>{moment.creator.name}</b><small>{moment.creator.niche}</small></div>
          <div className="price-block"><small>{moment.isDemo ? "Example asking price" : "Asking price"}</small><b>{formatPrice(startingPrice)}</b></div>
        </div>
        <div className="card-footer">
          <span>{moment.duration} · View ad space</span>
          <Link href={`/placements/${moment.slug}`} aria-label={`View ${moment.title}`}><ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
