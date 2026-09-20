"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentAccount } from "@/lib/supabase/server";
export async function reviewApplication(form: FormData) {
 const account = await currentAccount(); if (!account) redirect("/login");
 const decision = String(form.get("decision"));
 if (decision === "approved" && ["ownership","eligibility","fit"].some(k => form.get(k) !== "yes")) redirect("/review?message=Confirm+all+three+checks+before+approval.");
 const { error } = await account.client.rpc("review_verification", { target: String(form.get("applicant")), decision, note: String(form.get("note") || "") });
 if (error) redirect("/review?message=Review+not+saved.+Check+your+access,+note,+and+application+status.");
 revalidatePath("/review"); revalidatePath("/verify"); revalidatePath("/dashboard"); revalidatePath("/discover");
 redirect("/review?message=Decision+saved.");
}
