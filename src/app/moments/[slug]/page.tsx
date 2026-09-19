import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { BookingPanel } from "@/components/booking-panel";
import { CalendarIcon, PinIcon } from "@/components/icons";
import { getMoment, moments } from "@/lib/moments";

export function generateStaticParams() {
  return moments.map((moment) => ({ slug: moment.slug }));
}

export default async function MomentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moment = getMoment(slug);
  if (!moment) notFound();

  return (
    <>
      <Header />
      <main className="detail-page shell">
        <div className="detail-layout">
          <div className="detail-content">
            <div className="detail-image" style={{ backgroundColor: moment.color, backgroundImage: `linear-gradient(180deg, rgba(8,9,10,.02), rgba(8,9,10,.46)), url(${moment.image})` }}>
              <div className="detail-image-copy"><span>{moment.category}</span><b>{moment.tagline}</b></div>
              <div className="image-count">01 / 04</div>
            </div>
            <section className="detail-intro">
              <div className="eyebrow"><span /> Upcoming moment</div>
              <h1 className="detail-title">{moment.event}</h1>
              <div className="detail-meta"><span><CalendarIcon /> {moment.dates}</span><span><PinIcon /> {moment.city}, {moment.country}</span></div>
            </section>
            <section className="creator-profile">
              <div className="creator-identity"><span className="profile-avatar" style={{ background: moment.color }}>{moment.creator.avatar}</span><div><h2>{moment.creator.name}</h2><p>{moment.creator.handle} · {moment.creator.niche}</p></div></div>
              <div className="creator-stat"><b>{moment.creator.followers}</b><span>Followers</span></div>
              <div className="creator-stat"><b>{moment.creator.engagement}</b><span>Avg. engagement</span></div>
              <div className="creator-fit"><span>Good fit for</span><div>{moment.fit.map((item) => <b key={item}>{item}</b>)}</div></div>
            </section>
            <BookingPanel moment={moment} />
          </div>
        </div>
      </main>
    </>
  );
}
