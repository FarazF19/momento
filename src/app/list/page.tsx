import Link from "next/link";
import { redirect } from "next/navigation";
import ListingForm from "@/components/listing-form";
import { Header } from "@/components/header";
import { currentAccount } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function ListPage() {
  const account = await currentAccount();
  if (!account) redirect("/login?mode=signup&role=creator");
  if (account.profile.role !== "creator") return <><Header /><main className="account-page shell"><h1>This is for creator accounts.</h1><p>Your brand account can browse placements and send offers.</p><Link href="/discover" className="button button-primary">Explore ad spaces</Link></main></>;
  return <><Header /><ListingForm name={account.profile.name} email={account.user.email!} /></>;
}
