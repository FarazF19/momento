import { safePublicUrl } from "@/lib/verification";
import { CreatorPortrait } from "@/components/creator-portrait";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { BookingPanel } from "@/components/booking-panel";
import { CalendarIcon, PinIcon } from "@/components/icons";
import { getMoment } from "@/lib/moments";
import { publishedPlacement } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

export default async function MomentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moment = getMoment(slug) || await publishedPlacement(slug);
  if (!moment) notFound();

  return (
    <>
      <Header />
      <main className="detail-page shell">
        <div className="detail-layout">
          <div className="detail-content">
            <div className="detail-creator-photo">
              <CreatorPortrait moment={moment} />
              {moment.isDemo && <span className="sample-chip">Example creator · AI portrait</span>}
            </div>
            <section className="detail-intro">
              <div className="eyebrow"><span /> Meet your next brand partner</div>
              <h1 className="detail-title">{moment.creator.name}</h1>
              <div className="detail-meta"><span><CalendarIcon /> {moment.dates}</span><span><PinIcon /> {moment.city}, {moment.country}</span></div>
            </section>
            <section className="creator-profile">
              <div className="creator-identity"><span className="profile-avatar" style={{ background: moment.color }}>{moment.creator.avatar}</span><div><h2>{moment.creator.name}</h2><p>{moment.creator.handle} · {moment.creator.niche}</p>{moment.creator.socialUrl && safePublicUrl(moment.creator.socialUrl) && <a className="underlined-link" href={moment.creator.socialUrl} target="_blank" rel="noopener noreferrer">View social profile ↗</a>}</div></div>
              <div className="creator-stat"><b>{moment.city}</b><span>Placement location</span></div>
              <div className="creator-stat"><b>{moment.isDemo ? "Example" : "Creator listed"}</b><span>{moment.isDemo ? "Fictional creator" : "Self-reported profile"}</span></div>
              {moment.fit.length > 0 && <div className="creator-fit"><span>Good fit for</span><div>{moment.fit.map((item) => <b key={item}>{item}</b>)}</div></div>}
              <div className="creator-context"><h3>Where your brand goes</h3><p>{moment.itinerary}</p><h3>What this creator commits to</h3><p>{moment.visibility}</p></div>
            </section>
            <section className="placement-terms"><h2>{moment.title}</h2><p>{moment.tagline}</p><dl>{[
              ["Ad surface", moment.surface], ["Size", moment.dimensions], ["Duration", moment.duration],
              ["Where it goes", moment.itinerary], ["Visibility commitment", moment.visibility],
              ["Proof of completion", moment.proof], ["Artwork & delivery", moment.production], ["Exclusivity", moment.exclusivity],
            ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="sample-disclaimer">{moment.isDemo ? "Fictional example, not a live listing. Follower counts are illustrative." : "Placement and profile details are supplied by the creator."} Followers do not measure offline impressions. No guaranteed reach or sales; social posts are included only if explicitly agreed.</p></section>
            <BookingPanel moment={moment} />
          </div>
        </div>
      </main>
    </>
  );
}
