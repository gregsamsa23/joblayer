import Link from "next/link";
import {
  employmentLabel,
  formatPostedDate,
  formatSalary,
  jobLocation,
  roleLabel,
  seniorityLabel,
} from "@/lib/format";
import type { Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job);
  const isImported = Boolean(job.source_company || job.source_url);
  const sourceLabel = job.source_company ?? "Employer career site";
  const initials = job.company_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.075] hover:shadow-cyan-950/20">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.14] to-white/[0.04] text-sm font-bold text-white shadow-lg shadow-violet-500/10">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-slate-300">{job.company_name}</p>
                {isImported ? (
                  <span className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                    Curated source
                  </span>
                ) : null}
              </div>
              <Link
                href={`/job/${job.slug}`}
                className="mt-2 block text-xl font-semibold leading-7 text-white transition group-hover:text-cyan-100 sm:text-2xl"
              >
                {job.title}
              </Link>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                {job.work_mode === "remote" ? (
                  <span className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-cyan-200">
                    Remote-friendly
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-slate-300">
                  {jobLocation(job)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-slate-300">
                  {roleLabel(job.role_type)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-slate-300">
                  {seniorityLabel(job.seniority)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-slate-300">
                  {employmentLabel(job.employment_type)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 pl-0 sm:pl-[4.25rem]">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 xl:min-w-48 xl:flex-col xl:items-end xl:border-t-0 xl:pt-0">
          <div className="text-left xl:text-right">
            <p className="text-sm font-semibold text-white">{salary ?? "Salary not listed"}</p>
            <p className="mt-1 text-xs text-slate-500">{formatPostedDate(job.published_at ?? job.created_at)}</p>
            {isImported ? <p className="mt-2 text-xs text-slate-500">Source: {sourceLabel}</p> : null}
          </div>
          <Link
            href={`/job/${job.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] px-4 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
          >
            View role
          </Link>
        </div>
      </div>
    </article>
  );
}
