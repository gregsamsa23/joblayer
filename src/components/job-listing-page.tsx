import type { ReactNode } from "react";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { JobFiltersForm } from "@/components/job-filters";
import { PageShell } from "@/components/page-shell";
import { cityLabel, roleLabel, seniorityLabel } from "@/lib/format";
import type { Job, JobFilters } from "@/lib/types";

const defaultHeading = "The curated AI & Tech job layer for DACH";

export function JobListingPage({
  jobs,
  filters,
  heading = defaultHeading,
  subheading = "Discover curated AI, machine learning, data and tech jobs across Germany, Austria and Switzerland.",
  seoContent,
}: {
  jobs: Job[];
  filters: JobFilters;
  heading?: string;
  subheading?: string;
  seoContent?: ReactNode;
}) {
  const activeFilters = getActiveFilterLabels(filters);
  const remoteJobs = jobs.filter((job) => job.work_mode === "remote").length;
  const importedJobs = jobs.filter((job) => job.source_company || job.source_url).length;
  const companies = new Set(jobs.map((job) => job.company_name)).size;
  const isDefaultHeading = heading === defaultHeading;

  return (
    <PageShell>
      <section className="px-4 pb-10 pt-8 sm:px-6 lg:pb-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <TrustPill>DACH-focused</TrustPill>
              <TrustPill>AI & Tech only</TrustPill>
              <TrustPill>Curated listings</TrustPill>
              <TrustPill>Remote-friendly</TrustPill>
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {isDefaultHeading ? (
                <>
                  The curated <span className="gradient-text">AI career layer</span> for DACH
                </>
              ) : (
                heading
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">{subheading}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#open-roles"
                className="glow-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white transition focus:outline-none focus:ring-4 focus:ring-violet-300/20"
              >
                Browse AI jobs
              </Link>
              <Link
                href="/post-job"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
              >
                Post a job
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              <MarketMetric label="Live roles" value={jobs.length.toString()} />
              <MarketMetric label="Companies" value={companies.toString()} />
              <MarketMetric label="Remote" value={remoteJobs.toString()} />
            </div>
          </div>

          <JobRadar jobs={jobs} importedJobs={importedJobs} />
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6" id="open-roles">
        <div className="mx-auto max-w-6xl">
          <JobFiltersForm filters={filters} />
          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2 text-sm">
              <QuickLink href="/jobs/berlin">Berlin</QuickLink>
              <QuickLink href="/jobs/munich">Munich</QuickLink>
              <QuickLink href="/jobs/remote">Remote</QuickLink>
              <QuickLink href="/jobs/machine-learning">Machine Learning</QuickLink>
              <QuickLink href="/jobs/ai-engineer">AI Engineer</QuickLink>
            </div>
            {activeFilters.length ? (
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-violet-100"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {seoContent}

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">Open roles</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {jobs.length} {jobs.length === 1 ? "role" : "roles"} in the layer
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Curated AI, data and modern engineering jobs from DACH employers and selected career sites.
              </p>
            </div>
            <Link href="/alerts" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-100">
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
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mx-auto mb-5 h-12 w-12 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 shadow-[0_0_34px_rgba(6,182,212,0.18)]" />
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
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Market quality</p>
            <div className="mt-4 grid gap-3">
              <SideStat label="Curated imports" value={importedJobs.toString()} />
              <SideStat label="Remote options" value={remoteJobs.toString()} />
              <SideStat label="Hiring companies" value={companies.toString()} />
            </div>
          </div>
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

function getActiveFilterLabels(filters: JobFilters) {
  return [
    filters.q ? `Search: ${filters.q}` : null,
    filters.roleType ? roleLabel(filters.roleType) : null,
    filters.city ? cityLabel(filters.city) : null,
    filters.workMode ? `Mode: ${filters.workMode}` : null,
    filters.seniority ? seniorityLabel(filters.seniority) : null,
  ].filter((item): item is string => Boolean(item));
}

function TrustPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
      {children}
    </span>
  );
}

function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
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

function SideStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
      <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-cyan-300 transition hover:text-cyan-100">
        {linkLabel}
      </Link>
    </div>
  );
}

function JobRadar({ jobs, importedJobs }: { jobs: Job[]; importedJobs: number }) {
  const previewJobs = jobs.slice(0, 4);
  const signals = previewJobs.length ? previewJobs : fallbackRadarSignals;

  return (
    <div className="radar-grid float-slow relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
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

      <div className="relative z-10 mt-8 grid gap-3 pb-28">
        {signals.map((job, index) => (
          <div
            key={job.id}
            className="rounded-2xl border border-white/10 bg-[#050816]/75 p-4 shadow-2xl shadow-black/20 backdrop-blur"
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

      <div className="absolute inset-x-5 bottom-5 z-10 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
          <p className="text-xs text-slate-500">Curated imports</p>
          <p className="mt-1 text-lg font-semibold text-white">{importedJobs}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur">
          <p className="text-xs text-slate-500">Signal density</p>
          <p className="mt-1 text-lg font-semibold text-white">{jobs.length ? "Live" : "Building"}</p>
        </div>
      </div>
    </div>
  );
}

const fallbackRadarSignals: Job[] = [
  {
    id: "fallback-llm",
    created_at: new Date(0).toISOString(),
    slug: "fallback-llm",
    status: "live",
    title: "LLM Engineer",
    company_name: "DACH AI Team",
    location_city: "remote-dach",
    country: "DE",
    work_mode: "remote",
    employment_type: "full-time",
    role_type: "ai-engineer",
    seniority: "senior",
    description_markdown: "",
    apply_url: "/jobs",
    contact_email: "hello@joblayer.de",
    salary_currency: "EUR",
    tags: [],
  },
  {
    id: "fallback-data",
    created_at: new Date(0).toISOString(),
    slug: "fallback-data",
    status: "live",
    title: "Data Scientist",
    company_name: "Industrial AI",
    location_city: "munich",
    country: "DE",
    work_mode: "hybrid",
    employment_type: "full-time",
    role_type: "machine-learning",
    seniority: "mid",
    description_markdown: "",
    apply_url: "/jobs",
    contact_email: "hello@joblayer.de",
    salary_currency: "EUR",
    tags: [],
  },
];
