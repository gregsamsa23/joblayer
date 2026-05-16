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
    <article className="group glass-card rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.075]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-bold text-white shadow-lg shadow-violet-500/10">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-400">{job.company_name}</p>
              <Link
                href={`/job/${job.slug}`}
                className="mt-1 block text-xl font-semibold leading-7 text-white transition group-hover:text-cyan-100"
              >
                {job.title}
              </Link>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                {job.work_mode === "remote" ? (
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                    Remote-friendly
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-slate-300">
                  {jobLocation(job)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-slate-300">
                  {roleLabel(job.role_type)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-slate-300">
                  {seniorityLabel(job.seniority)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 lg:min-w-44 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
          <div className="text-left lg:text-right">
            <p className="text-sm font-semibold text-white">{salary ?? "Salary n/a"}</p>
            <p className="mt-1 text-xs text-slate-500">{formatPostedDate(job.published_at ?? job.created_at)}</p>
          </div>
          <Link
            href={`/job/${job.slug}`}
            className="rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
          >
            View role
          </Link>
        </div>
      </div>
    </article>
  );
}
