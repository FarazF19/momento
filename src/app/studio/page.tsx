import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { CampaignBuilder } from "@/components/campaign-builder";
import { currentAccount } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const account = await currentAccount();
  if (!account) redirect("/login?mode=signup&role=creator&next=/studio");
  if (account.profile.role !== "creator") {
    return (
      <>
        <Header />
        <main className="account-page shell">
          <h1>Campaign pages are for creators.</h1>
          <p>Your brand account can browse live campaigns and send offers on those pages.</p>
          <Link href="/discover" className="button button-primary">Browse campaigns</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="studio-page shell">
        <CampaignBuilder signedIn creatorName={account.profile.name} />
      </main>
    </>
  );
}
