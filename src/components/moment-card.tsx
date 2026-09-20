import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon, PinIcon } from "./icons";
import { CreatorPortrait } from "./creator-portrait";

export function MomentCard({ moment, featured = false }: { moment: Moment; featured?: boolean }) {
  const price = Math.min(...moment.inventory.map(item => item.price));
  return <article className={`people-card${featured ? " people-card-featured" : ""}`}>
    <Link className="people-photo" href={`/placements/${moment.slug}`} aria-label={`Meet ${moment.creator.name}`}>
      <CreatorPortrait moment={moment} />
      <span className="people-label">{moment.isDemo ? "Example creator" : "Creator listing"}</span>
      <span className="people-location"><PinIcon /> {moment.city}</span>
    </Link>
    <div className="people-body">
      <div className="people-name"><Link href={`/placements/${moment.slug}`}><h3>{moment.creator.name}</h3></Link><span aria-hidden="true">↗</span></div>
      <p className="people-niche">{moment.creator.niche}</p>
      <p className="people-audience">{moment.creator.followers} followers <span>· {moment.isDemo ? "Illustrative" : "Self-reported"}</span></p>
      <div className="people-plan"><span>Up next · {moment.dates}</span><p>{moment.itinerary.split(";")[0].split(". ")[0].replace(/\.$/, "")}</p></div>
      <div className="people-space"><span>{moment.category === "Travel" ? "Bag space on a trip" : `${moment.category} ad space`}</span><span>{moment.isDemo ? moment.duration : "See dates"}</span></div>
      <div className="people-footer"><div><strong>{formatPrice(price)}</strong><small>asking · full placement</small></div><Link href={`/placements/${moment.slug}`}>Meet {moment.creator.name.split(" ")[0]} <ArrowIcon /></Link></div>
    </div>
  </article>;
}
