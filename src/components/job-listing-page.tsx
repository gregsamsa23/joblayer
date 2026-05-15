import Link from "next/link";
import { JobCard } from "@/components/job-card";
import { JobFiltersForm } from "@/components/job-filters";
import { PageShell } from "@/components/page-shell";
import type { Job, JobFilters } from "@/lib/types";

export function JobListingPage({
  jobs,
  filters,
  heading = "AI & Tech Jobs in DACH",
  subheading = "Kuratierte Rollen für AI Engineers, Machine-Learning-Teams und moderne Tech-Organisationen in Deutschland, Österreich und der Schweiz.",
}: {
  jobs: Job[];
  filters: JobFilters;
  heading?: string;
  subheading?: string;
}) {
  return (
    <PageShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">JobLayer</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{heading}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{subheading}</p>
          </div>
          <div className="mt-8">
            <JobFiltersForm filters={filters} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-600">
            {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} gefunden
          </p>
          <Link href="/post-job" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Stellenanzeige veröffentlichen
          </Link>
        </div>

        {jobs.length ? (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-950">Keine passenden Jobs gefunden</h2>
            <p className="mt-2 text-sm text-slate-600">
              Passe die Filter an oder abonniere den Job-Alert für neue Rollen.
            </p>
            <Link
              href="/alerts"
              className="mt-5 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Job-Alert erstellen
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
