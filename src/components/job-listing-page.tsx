import type { ReactNode } from "react";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { JobFiltersForm } from "@/components/job-filters";
import { PageShell } from "@/components/page-shell";
import type { Job, JobFilters } from "@/lib/types";

export function JobListingPage({
  jobs,
  filters,
  heading = "The curated AI & Tech job layer for DACH",
  subheading = "Discover curated AI, machine learning, data and tech jobs across Germany, Austria and Switzerland.",
  seoContent,
}: {
  jobs: Job[];
  filters: JobFilters;
  heading?: string;
  subheading?: string;
  seoContent?: ReactNode;
}) {
  return (
    <PageShell>
      <section className="px-4 pb-12 pt-8 sm:px-6 lg:pb-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <TrustPill>DACH-focused</TrustPill>
              <TrustPill>AI & Tech only</TrustPill>
              <TrustPill>Curated listings</TrustPill>
              <TrustPill>Remote-friendly</TrustPill>
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {heading.includes("DACH") ? (
                <>
                  The curated <span className="gradient-text">AI career layer</span> for DACH
                </>
              ) : (
                heading
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">{subheading}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className="glow-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white transition">
                Browse AI jobs
              </Link>
              <Link
                href="/post-job"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Post a job
              </Link>
            </div>
          </div>

          <JobRadar jobs={jobs} />
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <JobFiltersForm filters={filters} />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <QuickLink href="/jobs/berlin">Berlin</QuickLink>
            <QuickLink href="/jobs/munich">München</QuickLink>
            <QuickLink href="/jobs/remote">Remote</QuickLink>
            <QuickLink href="/jobs/machine-learning">Machine Learning</QuickLink>
            <QuickLink href="/jobs/ai-engineer">AI Engineer</QuickLink>
          </div>
        </div>
      </section>

      {seoContent}

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Open roles</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {jobs.length} {jobs.length === 1 ? "role" : "roles"} in the layer
              </h2>
            </div>
            <Link href="/alerts" className="text-sm font-semibold text-cyan-300 hover:text-cyan-100">
              Get the weekly AI Jobs Digest
            </Link>
          </div>

          {jobs.length ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-10 text-center">
              <h2 className="text-xl font-semibold text-white">No matching signal yet</h2>
              <p className="mt-2 text-sm text-slate-400">
                Adjust the filters or subscribe to the weekly AI Jobs Digest for new roles.
              </p>
              <Link href="/alerts" className="glow-button mt-6 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold text-white">
                Create job alert
              </Link>
            </div>
          )}
        </div>

        <aside className="grid h-fit gap-4">
          <InfoPanel
            title="For candidates"
            body="Track the market without scanning generic boards. Get a focused layer of AI, data and modern tech roles."
            href="/alerts"
            linkLabel="Create alert"
          />
          <InfoPanel
            title="For employers"
            body="Reach a focused DACH audience with a curated 30-day listing built for AI and tech hiring."
            href="/post-job"
            linkLabel="Post a job"
          />
        </aside>
      </section>
    </PageShell>
  );
}

function TrustPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
      {children}
    </span>
  );
}

function QuickLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-medium text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-100"
    >
      {children}
    </Link>
  );
}

function InfoPanel({
  title,
  body,
  href,
  linkLabel,
}: {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
      <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-100">
        {linkLabel}
      </Link>
    </div>
  );
}

function JobRadar({ jobs }: { jobs: Job[] }) {
  const previewJobs = jobs.slice(0, 4);

  return (
    <div className="glass-card radar-grid float-slow relative min-h-[430px] overflow-hidden rounded-[2rem] p-5">
      <div className="absolute left-8 top-8 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_28px_rgba(103,232,249,0.85)] pulse-soft" />
      <div className="absolute right-16 top-20 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_28px_rgba(196,181,253,0.85)] pulse-soft" />
      <div className="absolute bottom-20 left-16 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_28px_rgba(134,239,172,0.85)] pulse-soft" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Job Intelligence Radar</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Live hiring signals</h2>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          {jobs.length} active
        </span>
      </div>

      <div className="relative z-10 mt-8 grid gap-3">
        {previewJobs.map((job, index) => (
          <div
            key={job.id}
            className="rounded-2xl border border-white/10 bg-[#050816]/70 p-4 shadow-2xl shadow-black/20"
            style={{ marginLeft: `${index % 2 === 0 ? 0 : 28}px` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{job.title}</p>
                <p className="mt-1 text-xs text-slate-500">{job.company_name}</p>
              </div>
              <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
                {job.work_mode === "remote" ? "Remote DACH" : job.location_city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
