"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentAccount } from "@/lib/supabase/server";
import { validateVerification } from "@/lib/verification";
export async function startVerification() {
  const account = await currentAccount();
  if (!account) redirect("/login");
  const { error } = await account.client.from("verification_applications").insert({ user_id: account.user.id, role: account.profile.role });
  if (error && error.code !== "23505") redirect("/verify?message=Could+not+start+your+application.+Please+try+again.");
  revalidatePath("/verify");
  redirect("/verify");
}
export async function submitVerification(form: FormData) {
  const account = await currentAccount();
  if (!account) redirect("/login");
  const payload: Record<string, string> = {};
  for (const key of ["profileUrl","platform","followers","portraitUrl","summary","adult","accurate","accountAge","recentPosts","businessName","authority"]) payload[key] = String(form.get(key) || "").trim().slice(0,2000);
  const message = validateVerification(account.profile.role, payload);
  if (message) redirect("/verify?message=" + encodeURIComponent(message));
  const { data, error } = await account.client.from("verification_applications").update({ payload, status: "pending" }).eq("user_id", account.user.id).in("status", ["draft","needs_changes"]).select("user_id");
  if (error || !data?.length) redirect("/verify?message=Application+could+not+be+submitted.+Refresh+and+check+your+status.");
  revalidatePath("/dashboard"); revalidatePath("/verify");
  redirect("/verify?message=Application+submitted.+You+can+track+the+review+here.");
}
