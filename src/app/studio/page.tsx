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

  const { data: approved } = await account.client.rpc("marketplace_approved", { account_id: account.user.id });
  if (!approved) return <><Header /><main className="account-page shell"><div className="account-card"><span className="eyebrow">Creator onboarding · Step 2 of 3</span><h1>Let brands meet the real you.</h1><p>Verify ownership of your Instagram, TikTok, or X profile with at least 10,000 followers on that one account. Then you can publish your first event and placement.</p><Link href="/verify" className="button button-primary">Verify my social profile</Link><p><Link href="/dashboard" className="underlined-link">Back to dashboard</Link></p></div></main></>;
  return (
    <>
      <Header />
      <main className="studio-page shell">
        <CampaignBuilder
          signedIn
          creatorName={account.profile.name}
          handle={typeof account.user.user_metadata?.handle === "string" ? account.user.user_metadata.handle : ""}
          niche={typeof account.user.user_metadata?.niche === "string" ? account.user.user_metadata.niche : ""}
        />
      </main>
    </>
  );
}

