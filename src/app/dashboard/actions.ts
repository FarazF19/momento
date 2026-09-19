"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentAccount } from "@/lib/supabase/server";
export async function decideOffer(form: FormData) {
  const account = await currentAccount();
  if (!account) redirect("/login");
  const target = String(form.get("offerId"));
  const decision = String(form.get("decision"));
  if (!["accepted", "declined", "withdrawn"].includes(decision)) redirect("/dashboard?message=Invalid+decision.");
  const { error } = await account.client.rpc("respond_to_offer", { target, decision });
  if (error) redirect("/dashboard?message=That+offer+cannot+be+updated.+It+may+already+be+decided.");
  revalidatePath("/dashboard");
  revalidatePath("/discover");
  redirect("/dashboard?message=Offer+updated.+No+payment+has+been+taken.");
}
