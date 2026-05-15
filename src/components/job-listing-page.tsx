import type { ReactNode } from "react";
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">JobLayer</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {heading}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{subheading}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Jobs durchsuchen
              </Link>
              <Link
                href="/post-job"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Job für 149 EUR posten
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="grid grid-cols-3 gap-3">
              <Metric value={`${jobs.length}+`} label="aktive Rollen" />
              <Metric value="DACH" label="Fokus" />
              <Metric value="30T" label="Listung" />
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Für Kandidaten schnell scanbar, für Arbeitgeber fokussiert auf AI-, Data- und moderne Software-Teams.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <JobFiltersForm filters={filters} />
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <QuickLink href="/jobs/berlin">Berlin</QuickLink>
            <QuickLink href="/jobs/munich">Munich</QuickLink>
            <QuickLink href="/jobs/remote">Remote</QuickLink>
            <QuickLink href="/jobs/machine-learning">Machine Learning</QuickLink>
            <QuickLink href="/jobs/ai-engineer">AI Engineer</QuickLink>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div>
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
        </div>

        <aside className="grid h-fit gap-4">
          <InfoPanel
            title="Für Kandidaten"
            body="Erhalte neue Rollen nach Rolle und Stadt. Perfekt, wenn du den Markt beobachtest, aber nicht täglich suchen willst."
            href="/alerts"
            linkLabel="Job-Alert erstellen"
          />
          <InfoPanel
            title="Für Arbeitgeber"
            body="Eine kuratierte 30-Tage-Listung für AI- und Tech-Talente in DACH. Zahlung, Einreichung und Freigabe sind bereits vorbereitet."
            href="/post-job"
            linkLabel="Job posten"
          />
        </aside>
      </section>
    </PageShell>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md bg-white p-3 text-center shadow-sm">
      <div className="text-lg font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}

function QuickLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
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
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      <Link href={href} className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
        {linkLabel}
      </Link>
    </div>
  );
}
