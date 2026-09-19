import { currentAccount } from "@/lib/supabase/server";
import { HeaderNav } from "./header-nav";

export async function Header() {
  const account = await currentAccount();
  return <HeaderNav role={account?.profile.role ?? null} />;
}
