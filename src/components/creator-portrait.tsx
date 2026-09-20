import type { Moment } from "@/lib/moments";

export function CreatorPortrait({ moment }: { moment: Moment }) {
  const src = moment.creator.portraitUrl || moment.photoUrl;
  if (src) {
    // Native image avoids server-side fetching of creator-supplied URLs.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="creator-portrait" src={src} alt={moment.creator.name} loading="lazy" referrerPolicy="no-referrer" />;
  }
  return (
    <div className="creator-portrait portrait-initials" style={{ background: moment.color }} aria-label={moment.creator.name}>
      <span>{moment.creator.avatar}</span>
      <small>{moment.creator.name}</small>
    </div>
  );
}
