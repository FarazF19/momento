import Link from "next/link";
import type { Moment } from "@/lib/moments";
import { formatPrice } from "@/lib/moments";
import { ArrowIcon, CheckIcon } from "./icons";
import { CampaignCard } from "./campaign-card";

export function MomentCard({ moment }: { moment: Moment; featured?: boolean }) {
  if (moment.bodyKind) return <CampaignCard moment={moment} />;
  const price = Math.min(...moment.inventory.map((item) => item.price));
  const photo = moment.creator.portraitUrl || moment.photoUrl;
  return (
    <article className="campaign-card">
      <Link className="campaign-photo" href={`/placements/${moment.slug}`} aria-label={`${moment.surface} on ${moment.creator.name}`}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" />
        ) : (
          <span className="campaign-initials" style={{ background: moment.color }}>{moment.creator.avatar}</span>
        )}
        <span className="space-zone">{moment.category}</span>
      </Link>
      <div className="campaign-meta">
        <p className="space-kicker">{moment.dimensions} · {moment.duration}</p>
        <h3><Link href={`/placements/${moment.slug}`}>{moment.surface}</Link></h3>
        <p className="space-where">{moment.city} — {moment.tagline}</p>
        <div className="space-who">
          <b>{moment.creator.name}</b>
          <span>{moment.creator.handle}{!moment.isDemo && moment.creator.audienceSource === "live profile" ? " · live profile" : ""}</span>
          {!moment.isDemo && <span className="space-verified"><CheckIcon /> Verified</span>}
        </div>
        <div className="campaign-meta-row">
          <div><strong>{formatPrice(price)}</strong><small>for the full {moment.duration}</small></div>
          <Link className="space-cta" href={`/placements/${moment.slug}`}>See this space <ArrowIcon /></Link>
        </div>
      </div>
    </article>
  );
}
