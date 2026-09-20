import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon } from "./icons";

export function MomentCard({ moment }: { moment: Moment; featured?: boolean }) {
  const href = `/placements/${moment.slug}`;
  const photo = moment.photoUrl || moment.creator.portraitUrl;
  const slots = moment.slots?.length || moment.inventory.length;
  const price = moment.raisedLabel || formatPrice(Math.min(...moment.inventory.map((item) => item.price)));

  return (
    <article className="campaign-card">
      <Link className="campaign-photo" href={href} aria-label={moment.title}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="campaign-initials" style={{ background: moment.color }}>{moment.creator.avatar}</span>
        )}
        <span className="space-zone">{slots} slots</span>
      </Link>
      <div className="campaign-meta">
        <p className="space-kicker">{moment.creator.niche}</p>
        <h3><Link href={href}>{moment.title}</Link></h3>
        <p className="space-where">{moment.tagline}</p>
        <div className="campaign-meta-row">
          <div><strong>{price}</strong><small>{moment.city}</small></div>
          <Link className="space-cta" href={href}>Open campaign <ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
