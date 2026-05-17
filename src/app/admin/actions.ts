"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImportPreviewJob } from "@/lib/import-preview";
import { countryForCity } from "@/lib/jobs";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJobForm } from "@/lib/validation";

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

export async function updateJobDetails(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseAdminClient();

  if (!supabase || !id) {
    return;
  }

  try {
    const job = parseJobForm(formData);
    const adminNotes = String(formData.get("admin_notes") ?? "").trim();

    const update = {
      ...job,
      country: countryForCity(job.location_city),
      company_logo_url: job.company_logo_url || null,
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,
      admin_notes: adminNotes || null,
    };

    const { error } = await supabase.from("jobs").update(update).eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Der Job konnte nicht gespeichert werden.";
    redirect(`/admin/jobs/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/jobs/${id}/edit`);
  revalidatePath("/jobs");
  redirect(`/admin/jobs/${id}/edit?saved=1`);
}
