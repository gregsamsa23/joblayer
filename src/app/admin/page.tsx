import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { formatPostedDate, formatSalary, jobLocation, roleLabel, seniorityLabel } from "@/lib/format";
import { hasSupabaseConfig } from "@/lib/env";
import { getAdminJobs } from "@/lib/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { JobStatus } from "@/lib/taxonomy";
import type { Job } from "@/lib/types";
import { signOutAdmin, updateJobStatus } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
};

const statuses: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "pending", label: "Prüfung" },
  { value: "live", label: "Live" },
  { value: "expired", label: "Abgelaufen" },
  { value: "rejected", label: "Abgelehnt" },
  { value: "draft", label: "Draft" },
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { status?: JobStatus | "all" };
}) {
  const supabaseConfigured = hasSupabaseConfig();

  if (supabaseConfigured) {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase!.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }
  }

  const jobs = await getAdminJobs();
  const activeStatus = searchParams.status ?? "all";
  const filteredJobs = activeStatus === "all" ? jobs : jobs.filter((job) => job.status === activeStatus);
  const counts = countByStatus(jobs);

  return (
    <PageShell>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Moderation</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Admin Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Prüfe bezahlte Anzeigen, veröffentliche passende Rollen und halte die Jobbörse frisch.
            </p>
          </div>

          {supabaseConfigured ? (
            <form action={signOutAdmin}>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Ausloggen
              </button>
            </form>
          ) : (
            <Link
              href="/admin/login"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login vorbereiten
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!supabaseConfigured ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <h2 className="text-base font-semibold">Demo-Modus ohne Supabase</h2>
            <p className="mt-2 text-sm leading-6">
              Der Adminbereich zeigt aktuell Beispieldaten. Sobald die Supabase-Variablen gesetzt sind, wird der Login
              aktiviert und die Moderation arbeitet mit echten Einreichungen.
            </p>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-5">
          <StatCard label="Zur Prüfung" value={counts.pending} tone="amber" />
          <StatCard label="Live" value={counts.live} tone="emerald" />
          <StatCard label="Drafts" value={counts.draft} tone="slate" />
          <StatCard label="Abgelaufen" value={counts.expired} tone="slate" />
          <StatCard label="Abgelehnt" value={counts.rejected} tone="red" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Link
              key={status.value}
              href={status.value === "all" ? "/admin" : `/admin?status=${status.value}`}
              className={[
                "rounded-md border px-3 py-2 text-sm font-semibold",
                activeStatus === status.value
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
              ].join(" ")}
            >
              {status.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {filteredJobs.length ? (
            filteredJobs.map((job) => (
              <AdminJobCard key={job.id} job={job} actionsEnabled={supabaseConfigured} />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-slate-950">Keine Anzeigen in dieser Ansicht</h2>
              <p className="mt-2 text-sm text-slate-600">
                Sobald bezahlte Einreichungen ankommen, erscheinen sie hier zur Moderation.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function countByStatus(jobs: Job[]) {
  return jobs.reduce<Record<JobStatus, number>>(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    { draft: 0, pending: 0, live: 0, expired: 0, rejected: 0 },
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "emerald" | "red" | "slate";
}) {
  const toneClass = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-800",
    slate: "border-slate-200 bg-white text-slate-700",
  }[tone];

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${toneClass}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function AdminJobCard({ job, actionsEnabled }: { job: Job; actionsEnabled: boolean }) {
  const salary = formatSalary(job);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={job.status} />
            {job.stripe_checkout_session_id ? (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                Stripe vorhanden
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 text-lg font-semibold text-slate-950">{job.title}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {job.company_name} · {jobLocation(job)} · {roleLabel(job.role_type)} · {seniorityLabel(job.seniority)}
          </p>

          <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Kontakt" value={job.contact_email} />
            <Detail label="Erstellt" value={formatPostedDate(job.created_at)} />
            <Detail label="Gehalt" value={salary ?? "Nicht angegeben"} />
            <Detail label="Ablauf" value={job.expires_at ? new Date(job.expires_at).toLocaleDateString("de-DE") : "Offen"} />
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-52 lg:justify-end">
          <StatusButton id={job.id} status="live" label="Freigeben" disabled={!actionsEnabled} primary />
          <StatusButton id={job.id} status="rejected" label="Ablehnen" disabled={!actionsEnabled} />
          <StatusButton id={job.id} status="expired" label="Ablaufen" disabled={!actionsEnabled} />
          <StatusButton id={job.id} status="pending" label="Zur Prüfung" disabled={!actionsEnabled} />
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 truncate font-medium text-slate-700">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const config = {
    draft: "bg-slate-100 text-slate-700",
    pending: "bg-amber-100 text-amber-800",
    live: "bg-emerald-100 text-emerald-800",
    expired: "bg-slate-100 text-slate-700",
    rejected: "bg-red-100 text-red-800",
  }[status];

  return <span className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${config}`}>{status}</span>;
}

function StatusButton({
  id,
  status,
  label,
  disabled,
  primary = false,
}: {
  id: string;
  status: JobStatus;
  label: string;
  disabled: boolean;
  primary?: boolean;
}) {
  return (
    <form action={updateJobStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        disabled={disabled}
        className={[
          "rounded-md px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
          primary
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "border border-slate-300 text-slate-700 hover:bg-slate-100",
        ].join(" ")}
      >
        {label}
      </button>
    </form>
  );
}
