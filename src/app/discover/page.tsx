import Discovery from "@/components/discovery";
import { Header } from "@/components/header";
import { publishedPlacements } from "@/lib/marketplace";
import { moments } from "@/lib/moments";
export const dynamic = "force-dynamic";
export default async function DiscoverPage() {
  const { placements, unavailable } = await publishedPlacements();
  return <><Header /><Discovery placements={placements.length ? placements : moments} unavailable={unavailable} /></>;
}
