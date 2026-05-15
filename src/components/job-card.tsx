import Link from "next/link";
import { formatPostedDate, formatSalary, jobLocation, roleLabel, seniorityLabel } from "@/lib/format";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job);
  const initials = job.company_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-950 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <Link
                href={`/job/${job.slug}`}
                className="block text-lg font-semibold leading-6 text-slate-950 hover:text-emerald-700"
              >
                {job.title}
              </Link>
              <p className="mt-1 truncate text-sm font-medium text-slate-600">{job.company_name}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700">{jobLocation(job)}</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">{roleLabel(job.role_type)}</span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                  {seniorityLabel(job.seniority)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:min-w-40 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="text-sm font-semibold text-slate-950">{salary ?? "Gehalt n. a."}</p>
            <p className="mt-1 text-xs text-slate-500">{formatPostedDate(job.published_at ?? job.created_at)}</p>
          </div>
          <Link
            href={`/job/${job.slug}`}
            className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
