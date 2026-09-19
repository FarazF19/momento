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
        <p className="card-surface">{moment.surface}</p>
        <div className="placement-facts"><span>{moment.dimensions}</span><span>{moment.duration}</span></div>
        <div className="creator-row">
          <span className="avatar" style={{ background: moment.color }}>{moment.creator.avatar}</span>
          <div><b>{moment.creator.name}</b><small>{moment.creator.niche}</small></div>
        </div>
        <div className="card-footer">
          <div className="listing-price"><b>{formatPrice(startingPrice)}</b><small>asking · full period</small></div>
          <Link href={`/placements/${moment.slug}`} className="card-bid-link" aria-label={`View ${moment.title}`}>{moment.isDemo ? "View example" : "View & offer"} <ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
