import Discovery from "@/components/discovery";
import { Header } from "@/components/header";
import { publishedPlacements } from "@/lib/marketplace";
import { moments } from "@/lib/moments";

export const revalidate = 60;

export default async function DiscoverPage() {
  const examples = moments.filter((item) => item.bodyKind);
  const { placements, unavailable } = await publishedPlacements(600);
  const catalog = [...placements, ...examples.filter((item) => !placements.some((live) => live.slug === item.slug))];
  return <><Header /><Discovery placements={catalog} unavailable={unavailable} /></>;
}
