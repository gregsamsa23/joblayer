import { Resend } from "resend";
import { hasResendConfig, siteUrl } from "./env";
import type { Job } from "./types";

export async function sendAdminJobNotification(job: Pick<Job, "title" | "company_name" | "slug" | "contact_email">) {
  if (!hasResendConfig()) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "JobLayer <notifications@joblayer.de>",
    to: process.env.ADMIN_EMAIL!,
    subject: `Neue bezahlte Jobanzeige: ${job.title}`,
    html: `
      <h1>Neue Jobanzeige wartet auf Freigabe</h1>
      <p><strong>${job.title}</strong> bei ${job.company_name}</p>
      <p>Kontakt: ${job.contact_email}</p>
      <p><a href="${siteUrl}/admin">Im Adminbereich pruefen</a></p>
    `,
  });
}
