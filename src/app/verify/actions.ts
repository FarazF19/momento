"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentAccount } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import { validateVerification } from "@/lib/verification";
import { runAutoReview } from "@/lib/auto-review";

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
  for (const key of ["profileUrl", "platform", "summary", "adult", "accurate", "businessName", "authority"]) payload[key] = String(form.get(key) || "").trim().slice(0, 2000);
  const message = validateVerification(account.profile.role, payload);
  if (message) redirect("/verify?message=" + encodeURIComponent(message));

  const { data, error } = await account.client.from("verification_applications").update({ payload, status: "pending" }).eq("user_id", account.user.id).in("status", ["draft", "needs_changes"]).select("user_id, ownership_code");
  if (error || !data?.length) redirect("/verify?message=Application+could+not+be+submitted.+Refresh+and+check+your+status.");

  // Automatic review: check the live public page for the ownership code and pick up
  // the public name, photo, and audience size. Decisions land in under a minute.
  const admin = adminClient();
  if (!admin) {
    revalidatePath("/dashboard"); revalidatePath("/verify");
    redirect("/verify?message=" + encodeURIComponent("Application submitted. Automatic checks are not configured on this environment, so a reviewer will confirm your details."));
  }
  const review = await runAutoReview(account.profile.role, payload, data[0].ownership_code);
  const { error: reviewError } = await admin.rpc("auto_review_verification", { target: account.user.id, decision: review.decision, note: review.note, identity: review.identity });
  revalidatePath("/dashboard"); revalidatePath("/verify"); revalidatePath("/discover");
  if (reviewError) redirect("/verify?message=" + encodeURIComponent("Application submitted. The automatic check hit a snag; refresh in a minute to see your status."));
  redirect("/verify?message=" + encodeURIComponent(review.decision === "approved" ? "You’re verified and ready to go." : "Almost there — one quick fix and you can verify again."));
}
