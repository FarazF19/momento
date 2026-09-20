import Discovery from "@/components/discovery";
import { Header } from "@/components/header";
import { publishedPlacements } from "@/lib/marketplace";
import { moments } from "@/lib/moments";

export const revalidate = 60;

export default async function DiscoverPage() {
  const examples = moments.filter((item) => item.bodyKind);
  const { placements, unavailable } = await publishedPlacements(2500);
  const catalog = placements;
  return <><Header /><Discovery placements={catalog} examples={examples} unavailable={unavailable} /></>;
}

