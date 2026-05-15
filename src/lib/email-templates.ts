import type { Job } from "./types";
import { formatSalary, jobLocation } from "./format";

export function weeklyDigestTemplate({ name, jobs }: { name: string; jobs: Job[] }) {
  const items = jobs
    .map((job) => {
      const salary = formatSalary(job);
      return `
        <li style="margin-bottom: 18px;">
          <strong>${job.title}</strong><br />
          ${job.company_name} · ${jobLocation(job)}${salary ? ` · ${salary}` : ""}<br />
          <a href="https://joblayer.de/job/${job.slug}">Job ansehen</a>
        </li>
      `;
    })
    .join("");

  return `
    <h1>Dein JobLayer Wochen-Update</h1>
    <p>Hallo ${name},</p>
    <p>hier sind neue AI- und Tech-Rollen aus der DACH-Region:</p>
    <ul>${items}</ul>
    <p>Viele Grüße<br />JobLayer</p>
  `;
}
