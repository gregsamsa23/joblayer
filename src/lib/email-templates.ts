import type { Job } from "./types";
import { formatSalary, jobLocation } from "./format";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function confirmationEmailTemplate({ name, confirmUrl }: { name: string; confirmUrl: string }) {
  return `
    <h1>Bitte bestaetige deinen JobLayer Job Alert</h1>
    <p>Hallo ${escapeHtml(name)},</p>
    <p>
      Bitte bestaetige deine Anmeldung fuer den weekly AI Jobs Digest. Danach erhaeltst du kuratierte
      AI- und Tech-Rollen aus der DACH-Region.
    </p>
    <p>
      <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#8B5CF6;color:#ffffff;text-decoration:none;font-weight:700;">
        Job Alert bestaetigen
      </a>
    </p>
    <p>Falls du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.</p>
    <p>Viele Gruesse<br />JobLayer</p>
  `;
}

export function weeklyDigestTemplate({
  name,
  jobs,
  baseUrl = "https://joblayer.de",
}: {
  name: string;
  jobs: Job[];
  baseUrl?: string;
}) {
  const items = jobs
    .map((job) => {
      const salary = formatSalary(job);
      return `
        <li style="margin-bottom: 18px;">
          <strong>${escapeHtml(job.title)}</strong><br />
          ${escapeHtml(job.company_name)} &middot; ${escapeHtml(jobLocation(job))}${salary ? ` &middot; ${escapeHtml(salary)}` : ""}<br />
          <a href="${escapeHtml(`${baseUrl}/job/${job.slug}`)}">Job ansehen</a>
        </li>
      `;
    })
    .join("");

  return `
    <h1>Dein JobLayer Wochen-Update</h1>
    <p>Hallo ${escapeHtml(name)},</p>
    <p>hier sind neue AI- und Tech-Rollen aus der DACH-Region:</p>
    <ul>${items}</ul>
    <p>Viele Gruesse<br />JobLayer</p>
  `;
}
