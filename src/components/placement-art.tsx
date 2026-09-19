import Image from "next/image";
import type { PlacementCategory } from "@/lib/moments";

export function PlacementArt({ category, photoUrl, title }: { category: PlacementCategory; photoUrl?: string; title?: string }) {
  // Creator-hosted photos load in the browser, never through a server-side URL fetch.
  // eslint-disable-next-line @next/next/no-img-element
  if (photoUrl && /^https:\/\//i.test(photoUrl)) return <img className="placement-art" src={photoUrl} alt={title || "Creator’s item and available advertising space"} loading="lazy" referrerPolicy="no-referrer" />;
  return <Image className="placement-art" src={`/placements/${category.toLowerCase()}.svg`} width={600} height={400} alt={`Illustration of rentable ad space on ${category.toLowerCase()}, not an actual creator photo`} />;
}
