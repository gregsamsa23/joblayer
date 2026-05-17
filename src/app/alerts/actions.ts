"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { confirmationEmailTemplate } from "@/lib/email-templates";
import { hasResendConfig, siteUrl } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { parseCandidateAlertForm } from "@/lib/validation";

export async function createCandidateAlert(formData: FormData) {
  let target = "/alerts?success=1";

  try {
    const alert = parseCandidateAlertForm(formData);
    const supabase = createSupabaseAdminClient();

    if (supabase) {
      const { data, error } = await supabase.from("candidate_alerts").insert(alert).select("id").single();
      if (error) {
        throw new Error(error.message);
      }

      if (data?.id && hasResendConfig()) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const confirmUrl = `${siteUrl}/alerts/confirm?token=${data.id}`;

        await resend.emails.send({
          from: "JobLayer <notifications@joblayer.de>",
          to: alert.email,
          subject: "Bestaetige deinen JobLayer Job Alert",
          html: confirmationEmailTemplate({ name: alert.name, confirmUrl }),
        });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Der Job-Alert konnte nicht gespeichert werden.";
    target = `/alerts?error=${encodeURIComponent(message)}`;
  }

  redirect(target);
}
