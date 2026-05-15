import Link from "next/link";
import { formatPostedDate, formatSalary, jobLocation, roleLabel, seniorityLabel } from "@/lib/format";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
              {job.company_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <Link href={`/job/${job.slug}`} className="text-lg font-semibold text-slate-950 hover:text-emerald-700">
                {job.title}
              </Link>
              <p className="truncate text-sm text-slate-600">{job.company_name}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
            <span>{jobLocation(job)}</span>
            <span>·</span>
            <span>{roleLabel(job.role_type)}</span>
            <span>·</span>
            <span>{seniorityLabel(job.seniority)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 text-left sm:text-right">
          {salary ? <span className="text-sm font-semibold text-slate-900">{salary}</span> : null}
          <span className="text-sm text-slate-500">{formatPostedDate(job.published_at ?? job.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
