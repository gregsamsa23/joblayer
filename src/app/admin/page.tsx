import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { formatPostedDate, formatSalary, jobLocation, roleLabel, seniorityLabel } from "@/lib/format";
import { hasSupabaseConfig } from "@/lib/env";
import { jobImportPreview, type ImportPreview, type ImportPreviewRecord } from "@/lib/import-preview";
import { getAdminJobs } from "@/lib/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { JobStatus } from "@/lib/taxonomy";
import type { Job } from "@/lib/types";
import { importPreviewJob, signOutAdmin, updateJobStatus } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
};

const statuses: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Review" },
  { value: "live", label: "Live" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" },
];

type ImportView = "new" | "all" | "imported" | "review";

type EnrichedImportRecord = ImportPreviewRecord & {
  alreadyImported: boolean;
  existingJob?: Job;
  qualityScore: number;
  hasQualityWarnings: boolean;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: {
    status?: JobStatus | "all";
    error?: string;
    importView?: ImportView;
    importSource?: string;
    importConfidence?: ImportPreviewRecord["confidence"] | "all";
  };
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
  const existingApplyUrls = new Map(jobs.map((job) => [job.apply_url, job]));
  const existingSourceUrls = new Map(jobs.filter((job) => job.source_url).map((job) => [job.source_url!, job]));
  const importJobs = jobImportPreview.jobs;
  const importView = searchParams.importView ?? "new";
  const importSource = searchParams.importSource ?? "all";
  const importConfidence = searchParams.importConfidence ?? "all";
  const importRecords = importJobs.map((record) =>
    enrichImportRecord(record, existingApplyUrls.get(record.apply_url) ?? existingSourceUrls.get(record.apply_url)),
  );
  const importedCount = supabaseConfigured ? importRecords.filter((record) => record.alreadyImported).length : 0;
  const newCount = supabaseConfigured ? importRecords.filter((record) => !record.alreadyImported).length : importRecords.length;
  const lowConfidenceCount = importRecords.filter((record) => record.confidence === "low" || record.hasQualityWarnings).length;
  const importSources = Array.from(new Set(importRecords.map((record) => record.source_company))).sort();
  const filteredImportRecords = importRecords.filter((record) => {
    const viewMatches =
      importView === "all" ||
      (importView === "new" && !record.alreadyImported) ||
      (importView === "imported" && record.alreadyImported) ||
      (importView === "review" && (record.confidence === "low" || record.hasQualityWarnings));
    const sourceMatches = importSource === "all" || record.source_company === importSource;
    const confidenceMatches = importConfidence === "all" || record.confidence === importConfidence;

    return viewMatches && sourceMatches && confidenceMatches;
  });

  return (
    <PageShell>
      <section className="px-4 pb-8 pt-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Moderation cockpit</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Admin Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review paid listings, approve strong roles and keep the JobLayer signal clean.
            </p>
          </div>

          {supabaseConfigured ? (
            <form action={signOutAdmin}>
              <button className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.1]">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/admin/login" className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.1]">
              Prepare login
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!supabaseConfigured ? (
          <div className="mb-6 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-5 text-amber-100">
            <h2 className="text-base font-semibold">Demo mode without Supabase</h2>
            <p className="mt-2 text-sm leading-6 text-amber-100/80">
              The dashboard currently uses sample jobs. Add Supabase environment variables to activate login and real moderation.
            </p>
          </div>
        ) : null}

        {searchParams.error ? (
          <div className="mb-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
            {decodeURIComponent(searchParams.error)}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-5">
          <StatCard label="Review" value={counts.pending} tone="amber" />
          <StatCard label="Live" value={counts.live} tone="emerald" />
          <StatCard label="Drafts" value={counts.draft} tone="slate" />
          <StatCard label="Expired" value={counts.expired} tone="slate" />
          <StatCard label="Rejected" value={counts.rejected} tone="red" />
        </div>

        <div className="mt-8 rounded-[2rem] border border-cyan-300/15 bg-cyan-400/[0.06] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Import Preview</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">DAX career feed review</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                External roles are kept as source-linked previews first. Import promising roles into moderation, then approve only after editorial review.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <MiniMetric label="Found" value={importJobs.length} />
              <MiniMetric label="New" value={newCount} />
              <MiniMetric label="Imported" value={importedCount} />
              <MiniMetric label="Review" value={lowConfidenceCount} />
              <MiniMetric label="Sources" value={jobImportPreview.source_reports.length} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap gap-2">
                <ImportFilterLink label="New" href={buildAdminHref(searchParams, { importView: "new" })} active={importView === "new"} />
                <ImportFilterLink label="All" href={buildAdminHref(searchParams, { importView: "all" })} active={importView === "all"} />
                <ImportFilterLink
                  label="Imported"
                  href={buildAdminHref(searchParams, { importView: "imported" })}
                  active={importView === "imported"}
                />
                <ImportFilterLink
                  label="Needs review"
                  href={buildAdminHref(searchParams, { importView: "review" })}
                  active={importView === "review"}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <ImportFilterLink
                  label="All sources"
                  href={buildAdminHref(searchParams, { importSource: "all" })}
                  active={importSource === "all"}
                  compact
                />
                {importSources.map((source) => (
                  <ImportFilterLink
                    key={source}
                    label={source}
                    href={buildAdminHref(searchParams, { importSource: source })}
                    active={importSource === source}
                    compact
                  />
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(["all", "high", "medium", "low"] as const).map((confidence) => (
                  <ImportFilterLink
                    key={confidence}
                    label={confidence === "all" ? "All confidence" : `${confidence} confidence`}
                    href={buildAdminHref(searchParams, { importConfidence: confidence })}
                    active={importConfidence === confidence}
                    compact
                  />
                ))}
              </div>
            </div>

            <SourceHealthPanel reports={jobImportPreview.source_reports} />
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {filteredImportRecords.length ? (
              filteredImportRecords.map((record) => (
                <ImportPreviewCard
                  key={record.job.id}
                  record={record}
                  actionsEnabled={supabaseConfigured}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-400">
                No import preview jobs match these filters. Adjust the import view or run{" "}
                <span className="font-semibold text-slate-200">npm run import:dax-jobs</span> locally.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Link
              key={status.value}
              href={status.value === "all" ? "/admin" : `/admin?status=${status.value}`}
              className={[
                "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                activeStatus === status.value
                  ? "border-violet-300/40 bg-violet-400/20 text-white"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100",
              ].join(" ")}
            >
              {status.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {filteredJobs.length ? (
            filteredJobs.map((job) => <AdminJobCard key={job.id} job={job} actionsEnabled={supabaseConfigured} />)
          ) : (
            <div className="glass-card rounded-[2rem] p-10 text-center">
              <h2 className="text-lg font-semibold text-white">No listings in this view</h2>
              <p className="mt-2 text-sm text-slate-400">Paid submissions will appear here for moderation.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ImportFilterLink({
  label,
  href,
  active,
  compact = false,
}: {
  label: string;
  href: string;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-2xl border font-semibold transition",
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        active
          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
          : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/30 hover:text-cyan-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function SourceHealthPanel({ reports }: { reports: ImportPreview["source_reports"] }) {
  const ok = reports.filter((report) => report.status === "ok").length;
  const candidates = reports.reduce((total, report) => total + (report.imported_candidates ?? 0), 0);

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source health</p>
          <p className="mt-1 text-sm text-slate-300">
            {ok}/{reports.length} sources ok · {candidates} candidates
          </p>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
          Live feed
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        {reports.map((report) => (
          <a
            key={`${report.company}-${report.source_url}`}
            href={report.source_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-xs transition hover:border-cyan-300/30"
          >
            <span className="truncate font-semibold text-slate-200">{report.company}</span>
            <span className={report.status === "ok" ? "text-emerald-200" : "text-red-200"}>
              {report.status === "ok" ? `${report.imported_candidates ?? 0} found` : "failed"}
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function ImportPreviewCard({
  record,
  actionsEnabled,
}: {
  record: EnrichedImportRecord;
  actionsEnabled: boolean;
}) {
  const job = record.job;
  const alreadyImported = actionsEnabled && record.alreadyImported;
  const qualityTone =
    record.qualityScore >= 80
      ? "text-emerald-100 bg-emerald-400/10 border-emerald-300/20"
      : record.qualityScore >= 55
        ? "text-amber-100 bg-amber-400/10 border-amber-300/20"
        : "text-red-100 bg-red-400/10 border-red-300/20";

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.07]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase text-cyan-100">
              {record.source_company}
            </span>
            <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase text-violet-100">
              {record.confidence} confidence
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${qualityTone}`}>
              {record.qualityScore}/100 quality
            </span>
            {alreadyImported ? (
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-100">
                imported
              </span>
            ) : null}
            {record.hasQualityWarnings ? (
              <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase text-amber-100">
                check
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-semibold leading-6 text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {jobLocation(job)} · {roleLabel(job.role_type)} · {seniorityLabel(job.seniority)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          {record.existingJob ? (
            <Link
              href={`/admin/jobs/${record.existingJob.id}/edit`}
              className="rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Edit imported
            </Link>
          ) : null}
          <form action={importPreviewJob}>
            <input type="hidden" name="id" value={job.id} />
            <button
              disabled={!actionsEnabled || alreadyImported}
              className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!actionsEnabled ? "Connect Supabase" : alreadyImported ? "Imported" : "Import"}
            </button>
          </form>
          <form action={importPreviewJob}>
            <input type="hidden" name="id" value={job.id} />
            <input type="hidden" name="next" value="edit" />
            <button
              disabled={!actionsEnabled || alreadyImported}
              className="rounded-xl border border-violet-300/25 bg-violet-300/10 px-3 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Import + edit
            </button>
          </form>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
        <Detail label="Terms" value={`${record.match_reason.relevance_terms}`} />
        <Detail label="DACH signal" value={record.match_reason.dach_location_detected ? "Yes" : "No"} />
        <Detail label="Recommended" value={record.recommended_status} />
      </dl>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${record.qualityScore}%` }} />
      </div>

      {record.hasQualityWarnings ? (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100/90">
          Review before import: this role has low confidence, non-DACH signals, excluded terms or weak relevance terms.
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.length ? (
          job.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-500">No tags detected yet</span>
        )}
      </div>

      <a href={record.apply_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">
        Open source role
      </a>
    </article>
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

function enrichImportRecord(record: ImportPreviewRecord, existingJob?: Job): EnrichedImportRecord {
  const confidenceBase = { high: 78, medium: 58, low: 36 }[record.confidence];
  const score = Math.max(
    0,
    Math.min(
      100,
      confidenceBase +
        Math.min(record.match_reason.relevance_terms * 6, 18) +
        (record.match_reason.dach_location_detected ? 8 : -18) -
        (record.match_reason.excluded_terms_detected ? 24 : 0) -
        (record.match_reason.non_dach_location_detected ? 18 : 0) -
        (record.job.tags.length ? 0 : 8),
    ),
  );

  return {
    ...record,
    alreadyImported: Boolean(existingJob),
    existingJob,
    qualityScore: score,
    hasQualityWarnings:
      score < 55 ||
      record.confidence === "low" ||
      record.match_reason.excluded_terms_detected ||
      Boolean(record.match_reason.non_dach_location_detected) ||
      record.match_reason.relevance_terms < 1,
  };
}

function buildAdminHref(
  current: {
    status?: JobStatus | "all";
    importView?: ImportView;
    importSource?: string;
    importConfidence?: ImportPreviewRecord["confidence"] | "all";
  },
  updates: {
    importView?: ImportView;
    importSource?: string;
    importConfidence?: ImportPreviewRecord["confidence"] | "all";
  },
) {
  const params = new URLSearchParams();
  const next = { ...current, ...updates };

  if (next.status && next.status !== "all") {
    params.set("status", next.status);
  }
  if (next.importView && next.importView !== "new") {
    params.set("importView", next.importView);
  }
  if (next.importSource && next.importSource !== "all") {
    params.set("importSource", next.importSource);
  }
  if (next.importConfidence && next.importConfidence !== "all") {
    params.set("importConfidence", next.importConfidence);
  }

  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "amber" | "emerald" | "red" | "slate" }) {
  const toneClass = {
    amber: "border-amber-300/20 bg-amber-400/10 text-amber-100",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
    red: "border-red-300/20 bg-red-400/10 text-red-100",
    slate: "border-white/10 bg-white/[0.04] text-slate-200",
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function AdminJobCard({ job, actionsEnabled }: { job: Job; actionsEnabled: boolean }) {
  const salary = formatSalary(job);

  return (
    <article className="glass-card rounded-2xl p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={job.status} />
            {job.source_company ? (
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                Imported from {job.source_company}
              </span>
            ) : null}
            {job.stripe_checkout_session_id ? (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-400">
                Stripe linked
              </span>
            ) : null}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-white">{job.title}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {job.company_name} · {jobLocation(job)} · {roleLabel(job.role_type)} · {seniorityLabel(job.seniority)}
          </p>
          <dl className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Contact" value={job.contact_email} />
            <Detail label="Created" value={formatPostedDate(job.created_at)} />
            <Detail label="Salary" value={salary ?? "Not specified"} />
            <Detail label="Expires" value={job.expires_at ? new Date(job.expires_at).toLocaleDateString("de-DE") : "Open"} />
            {job.source_url ? <Detail label="Source" value={job.source_company ?? "External"} href={job.source_url} /> : null}
          </dl>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-52 lg:justify-end">
          <Link
            href={`/admin/jobs/${job.id}/edit`}
            className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/15"
          >
            Edit
          </Link>
          <StatusButton id={job.id} status="live" label="Approve" disabled={!actionsEnabled} primary />
          <StatusButton id={job.id} status="rejected" label="Reject" disabled={!actionsEnabled} />
          <StatusButton id={job.id} status="expired" label="Expire" disabled={!actionsEnabled} />
          <StatusButton id={job.id} status="pending" label="Review" disabled={!actionsEnabled} />
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 truncate font-medium text-slate-200">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-cyan-100">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const config = {
    draft: "bg-slate-400/10 text-slate-300",
    pending: "bg-amber-400/10 text-amber-200",
    live: "bg-emerald-400/10 text-emerald-200",
    expired: "bg-slate-400/10 text-slate-300",
    rejected: "bg-red-400/10 text-red-200",
  }[status];

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${config}`}>{status}</span>;
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
          "rounded-xl px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
          primary
            ? "glow-button text-white"
            : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]",
        ].join(" ")}
      >
        {label}
      </button>
    </form>
  );
}
