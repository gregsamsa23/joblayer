"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { parseCandidateAlertForm } from "@/lib/validation";

export async function createCandidateAlert(formData: FormData) {
  let target = "/alerts?success=1";

  try {
    const alert = parseCandidateAlertForm(formData);
    const supabase = createSupabaseAdminClient();

    if (supabase) {
      const { error } = await supabase.from("candidate_alerts").insert(alert);
      if (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Der Job-Alert konnte nicht gespeichert werden.";
    target = `/alerts?error=${encodeURIComponent(message)}`;
  }

  redirect(target);
}
