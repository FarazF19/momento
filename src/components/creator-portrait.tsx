import type { Moment } from "@/lib/moments";
const examples = ["hoodie-dubai-week", "laptop-lahore-coworking", "backpack-london-commute", "travel-tokyo-week", "tshirt-karachi-weekend", "tote-lisbon-week"];
export function CreatorPortrait({ moment }: { moment: Moment }) {
  const index = moment.isDemo ? examples.indexOf(moment.slug) : -1;
  if (index >= 0) return <div role="img" aria-label={`AI-created portrait of ${moment.creator.name}, a fictional example creator`} className="creator-portrait" style={{ backgroundImage: "url('/creators/editorial-grid.webp')", backgroundSize: "300% 200%", backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%` }} />;
  if (moment.creator.portraitUrl) {
    // Native image avoids server-side fetching of creator-supplied URLs.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="creator-portrait" src={moment.creator.portraitUrl} alt={moment.creator.name} loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <div className="creator-portrait portrait-initials" style={{ background: moment.color }} aria-label={moment.creator.name}><span>{moment.creator.avatar}</span><small>Meet your next brand partner</small></div>;
}
