import { redirect } from "next/navigation";
import { currentAccount } from "@/lib/supabase/server";
import { resetPassword } from "../actions";
import { Header } from "@/components/header";
export const dynamic = "force-dynamic";
export default async function Reset() {
  if (!await currentAccount()) redirect("/login?message=Request+a+new+password+reset+link.");
  return <><Header /><main className="account-page shell"><section className="account-card"><h1>Choose a new password.</h1><form action={resetPassword} className="account-form"><label>New password<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label><button className="button button-primary">Update password</button></form></section></main></>;
}
