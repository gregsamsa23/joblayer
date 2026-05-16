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
  { value: "all", label: "All" },
  { value: "pending", label: "Review" },
  { value: "live", label: "Live" },
  { value: "expired", label: "Expired" },
  { value: "rejected", label: "Rejected" },
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

        <div className="grid gap-3 md:grid-cols-5">
          <StatCard label="Review" value={counts.pending} tone="amber" />
          <StatCard label="Live" value={counts.live} tone="emerald" />
          <StatCard label="Drafts" value={counts.draft} tone="slate" />
          <StatCard label="Expired" value={counts.expired} tone="slate" />
          <StatCard label="Rejected" value={counts.rejected} tone="red" />
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

function countByStatus(jobs: Job[]) {
  return jobs.reduce<Record<JobStatus, number>>(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    { draft: 0, pending: 0, live: 0, expired: 0, rejected: 0 },
  );
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
          </dl>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-52 lg:justify-end">
          <StatusButton id={job.id} status="live" label="Approve" disabled={!actionsEnabled} primary />
          <StatusButton id={job.id} status="rejected" label="Reject" disabled={!actionsEnabled} />
          <StatusButton id={job.id} status="expired" label="Expire" disabled={!actionsEnabled} />
          <StatusButton id={job.id} status="pending" label="Review" disabled={!actionsEnabled} />
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 truncate font-medium text-slate-200">{value}</dd>
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
