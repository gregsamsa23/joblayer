"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImportPreviewJob } from "@/lib/import-preview";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAdmin(formData: FormData) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/login?error=Supabase%20ist%20nicht%20konfiguriert.");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function updateJobStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const supabase = createSupabaseAdminClient();

  if (!supabase || !id || !["pending", "live", "expired", "rejected"].includes(status)) {
    return;
  }

  const update =
    status === "live"
      ? {
          status,
          published_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        }
      : { status };

  await supabase.from("jobs").update(update).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/jobs");
}

export async function importPreviewJob(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const job = getImportPreviewJob(id);
  const supabase = createSupabaseAdminClient();

  if (!supabase || !job) {
    return;
  }

  const pendingJob = {
    ...job,
    id: undefined,
    status: "pending",
    published_at: null,
    expires_at: null,
    stripe_checkout_session_id: null,
    stripe_payment_intent_id: null,
    stripe_customer_email: null,
    admin_notes: [
      job.admin_notes,
      "Imported from DAX preview. Review title, location, tags and summary before approval.",
    ]
      .filter(Boolean)
      .join("\n"),
  };

  await supabase.from("jobs").upsert(pendingJob, { onConflict: "slug", ignoreDuplicates: true });
  revalidatePath("/admin");
  revalidatePath("/jobs");
}
