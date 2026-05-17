import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { hasSupabaseConfig } from "@/lib/env";
import { formatPostedDate, jobLocation, roleLabel, seniorityLabel } from "@/lib/format";
import { getAdminJobById } from "@/lib/jobs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  dachCities,
  employmentTypes,
  roleTypes,
  seniorities,
  tagOptions,
  workModes,
} from "@/lib/taxonomy";
import type { Job } from "@/lib/types";
import { updateJobDetails } from "../../../actions";

export const metadata: Metadata = {
  title: "Job bearbeiten",
};

export default async function AdminJobEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; saved?: string };
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

  const job = await getAdminJobById(params.id);

  if (!job) {
    notFound();
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
          Back to admin
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Editorial review</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Job bearbeiten</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Normalize imported and paid listings before approval: sharpen title, tags, seniority, location and the short description.
            </p>
          </div>

          <aside className="glass-card rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current signal</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{job.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {job.company_name} · {jobLocation(job)} · {roleLabel(job.role_type)} · {seniorityLabel(job.seniority)}
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <Fact label="Status" value={job.status} />
              <Fact label="Created" value={formatPostedDate(job.created_at)} />
              <Fact label="Apply URL" value={job.apply_url} href={job.apply_url} />
            </dl>
          </aside>
        </div>

        {!supabaseConfigured ? (
          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
            Supabase is not configured. Editing is disabled until the live database is connected.
          </div>
        ) : null}

        {searchParams.error ? (
          <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">
            {decodeURIComponent(searchParams.error)}
          </div>
        ) : null}

        {searchParams.saved ? (
          <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            Job gespeichert. Du kannst ihn jetzt im Adminbereich freigeben.
          </div>
        ) : null}

        <form action={updateJobDetails} className="mt-6 grid gap-6">
          <input type="hidden" name="id" value={job.id} />

          <div className="glass-card grid gap-5 rounded-[2rem] p-5 md:grid-cols-2">
            <Field label="Company" name="company_name" defaultValue={job.company_name} required />
            <Field label="Job title" name="title" defaultValue={job.title} required />
            <Field label="Company logo URL" name="company_logo_url" defaultValue={job.company_logo_url ?? ""} type="url" />
            <Field label="Apply URL" name="apply_url" defaultValue={job.apply_url} required type="url" />
            <Field label="Contact email" name="contact_email" defaultValue={job.contact_email} required type="email" />
            <Select label="Role type" name="role_type" defaultValue={job.role_type} options={roleTypes} />
            <Select label="Location" name="location_city" defaultValue={job.location_city} options={dachCities} />
            <Select label="Work mode" name="work_mode" defaultValue={job.work_mode} options={workModes} />
            <Select label="Employment" name="employment_type" defaultValue={job.employment_type} options={employmentTypes} />
            <Select label="Seniority" name="seniority" defaultValue={job.seniority} options={seniorities} />
            <Field label="Salary min" name="salary_min" defaultValue={job.salary_min?.toString() ?? ""} type="number" />
            <Field label="Salary max" name="salary_max" defaultValue={job.salary_max?.toString() ?? ""} type="number" />
            <Select
              label="Salary currency"
              name="salary_currency"
              defaultValue={job.salary_currency}
              options={[
                { value: "EUR", label: "EUR" },
                { value: "CHF", label: "CHF" },
              ]}
            />
          </div>

          <div className="glass-card rounded-[2rem] p-5">
            <LabelText>Tags</LabelText>
            <div className="mt-3 flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <label
                  key={tag}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-300 has-[:checked]:border-cyan-300/40 has-[:checked]:bg-cyan-300/10 has-[:checked]:text-cyan-100"
                >
                  <input
                    name="tags"
                    type="checkbox"
                    value={tag}
                    defaultChecked={job.tags.includes(tag)}
                    className="h-4 w-4 accent-cyan-300"
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card grid gap-5 rounded-[2rem] p-5">
            <label className="grid gap-2">
              <LabelText>Description</LabelText>
              <textarea
                name="description_markdown"
                required
                defaultValue={job.description_markdown}
                rows={12}
                className="premium-input rounded-2xl px-4 py-3 text-sm leading-6"
              />
            </label>
            <label className="grid gap-2">
              <LabelText>Admin notes</LabelText>
              <textarea
                name="admin_notes"
                defaultValue={job.admin_notes ?? ""}
                rows={5}
                className="premium-input rounded-2xl px-4 py-3 text-sm leading-6"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/admin" className="text-sm font-semibold text-slate-400 hover:text-white">
              Cancel
            </Link>
            <button
              disabled={!supabaseConfigured}
              className="glow-button rounded-2xl px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <LabelText>{label}</LabelText>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="premium-input h-11 rounded-xl px-3 text-sm"
      />
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-2">
      <LabelText>{label}</LabelText>
      <select name={name} defaultValue={defaultValue} className="premium-input h-11 rounded-xl px-3 text-sm">
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function LabelText({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-slate-300">{children}</span>;
}

function Fact({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-slate-200">
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
