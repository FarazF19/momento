import Discovery from "@/components/discovery";
import { publishedPlacements } from "@/lib/marketplace";
import { moments } from "@/lib/moments";
export const dynamic = "force-dynamic";
export default async function DiscoverPage() {
  const { placements, unavailable } = await publishedPlacements();
  return <Discovery placements={placements.length ? placements : moments} unavailable={unavailable} />;
}
