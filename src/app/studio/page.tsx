import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { PromptBuilder } from "@/components/prompt-builder";
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
  const { data: approval } = await account.client.from("verification_applications").select("status").eq("user_id", account.user.id).maybeSingle();
  const verified = approval?.status === "approved";

  return (
    <>
      <Header />
      <main className="studio-page shell">
        <div className="studio-copy">
          <div className="eyebrow"><span /> Build your page</div>
          <h1>Your campaign.<br />On Momento.</h1>
          <p>Describe the person, the event, the number of slots, and a price range. We map the zones onto a page that stays on this site — it will not open someone else’s campaign.</p>
          <ol className="studio-steps">
            <li>
              <b>1</b>
              <div>
                <strong>Account</strong>
                <p>Signed in as {account.profile.name}.</p>
              </div>
            </li>
            <li>
              <b>2</b>
              <div>
                <strong>Describe the slots</strong>
                <p>One sentence is enough to generate a working map.</p>
              </div>
            </li>
            <li>
              <b>3</b>
              <div>
                <strong>{verified ? "Publish the listing" : "Verify, then publish"}</strong>
                <p>{verified ? "Review the page, then publish so brands can offer." : "Marketplace verification takes about a minute before brands can offer."}</p>
              </div>
            </li>
          </ol>
          {!verified && <p className="studio-note"><Link href="/verify">Verify your creator account</Link> when you are ready to publish. You can still preview the page first.</p>}
        </div>
        <PromptBuilder signedIn creatorName={account.profile.name} />
      </main>
    </>
  );
}
