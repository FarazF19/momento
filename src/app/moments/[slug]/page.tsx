import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { CampaignView } from "@/components/campaign-view";
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
      <CampaignView moment={moment} />
    </>
  );
}
