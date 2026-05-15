import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { formatPostedDate, jobLocation } from "@/lib/format";
import { hasSupabaseConfig } from "@/lib/env";
import { getAdminJobs } from "@/lib/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAdmin, updateJobStatus } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  if (!hasSupabaseConfig()) {
    return (
      <PageShell>
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h1 className="text-2xl font-semibold">Supabase noch nicht konfiguriert</h1>
            <p className="mt-2 text-sm">
              Hinterlege die Supabase-Variablen aus der .env.example, um Admin-Login und Moderation zu aktivieren.
            </p>
          </div>
        </section>
      </PageShell>
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const jobs = await getAdminJobs();

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Moderation</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
          </div>
          <form action={signOutAdmin}>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Ausloggen
            </button>
          </form>
        </div>

        <div className="grid gap-4">
          {jobs.map((job) => (
            <article key={job.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-600">
                    {job.status}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold text-slate-950">{job.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {job.company_name} · {jobLocation(job)} · {formatPostedDate(job.created_at)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{job.contact_email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusButton id={job.id} status="live" label="Freigeben" />
                  <StatusButton id={job.id} status="rejected" label="Ablehnen" />
                  <StatusButton id={job.id} status="expired" label="Ablaufen" />
                  <StatusButton id={job.id} status="pending" label="Zur Prüfung" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function StatusButton({ id, status, label }: { id: string; status: string; label: string }) {
  return (
    <form action={updateJobStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        {label}
      </button>
    </form>
  );
}
