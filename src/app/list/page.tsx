import Link from "next/link";
import { redirect } from "next/navigation";
import ListingForm from "@/components/listing-form";
import { Header } from "@/components/header";
import { currentAccount } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function ListPage() {
  const account = await currentAccount();
  if (!account) redirect("/login?mode=signup&role=creator&next=/list");
  if (account.profile.role !== "creator") return <><Header /><main className="account-page shell"><h1>This is for creator accounts.</h1><p>Your brand account can browse placements and send offers.</p><Link href="/discover" className="button button-primary">Explore ad spaces</Link></main></>;
  const { data: approval } = await account.client.from("verification_applications").select("status, payload").eq("user_id",account.user.id).maybeSingle();
  if (approval?.status !== "approved") redirect("/verify?message=Verify+your+creator+account+first+—+it+takes+about+a+minute.");
  const p = (approval.payload || {}) as Record<string, string>;
  const handle = (() => { try { const path = new URL(p.profileUrl || "").pathname.replaceAll("/", ""); return path ? (path.startsWith("@") ? path : "@" + path) : ""; } catch { return ""; } })();
  return <><Header /><ListingForm name={p.fetchedName || account.profile.name} email={account.user.email!} handle={handle} followers={p.fetchedFollowers || ""} /></>;
}
