import { PlacementArt } from "@/components/placement-art";
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
            <div className="detail-image" style={{ backgroundColor: moment.color }}>
              <PlacementArt category={moment.category} photoUrl={moment.photoUrl} title={moment.title} />
              {moment.isDemo && <span className="sample-chip">Illustrative placement</span>}
            </div>
            <section className="detail-intro">
              <div className="eyebrow"><span /> Rent the ad space, not the item</div>
              <h1 className="detail-title">{moment.title}</h1>
              <div className="detail-meta"><span><CalendarIcon /> {moment.dates}</span><span><PinIcon /> {moment.city}, {moment.country}</span></div>
            </section>
            <section className="creator-profile">
              <div className="creator-identity"><span className="profile-avatar" style={{ background: moment.color }}>{moment.creator.avatar}</span><div><h2>{moment.creator.name}</h2><p>{moment.creator.handle} · {moment.creator.niche}</p></div></div>
              <div className="creator-stat"><b>{moment.creator.followers}</b><span>Followers</span></div>
              <div className="creator-stat"><b>{moment.isDemo ? "Example" : "Creator listed"}</b><span>{moment.isDemo ? "Fictional creator" : "Self-reported profile"}</span></div>
              {moment.fit.length > 0 && <div className="creator-fit"><span>Good fit for</span><div>{moment.fit.map((item) => <b key={item}>{item}</b>)}</div></div>}
            </section>
            <section className="placement-terms"><h2>What the brand is renting</h2><p>{moment.tagline}</p><dl>{[
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
