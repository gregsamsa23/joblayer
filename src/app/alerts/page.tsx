import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { dachCities, roleTypes } from "@/lib/taxonomy";
import { createCandidateAlert } from "./actions";

export const metadata: Metadata = {
  title: "Job-Alert",
  description: "Erhalte passende AI- und Tech-Jobs aus der DACH-Region per E-Mail.",
};

export default function AlertsPage({ searchParams }: { searchParams: { success?: string; error?: string } }) {
  return (
    <PageShell>
      <section className="px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Weekly AI Jobs Digest</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Let the right <span className="gradient-text">AI career signals</span> find you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Track curated AI, machine learning, data and modern tech roles across Germany, Austria and Switzerland.
              Useful whether you are actively searching or just watching the market.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#alert-form" className="glow-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white">
                Get the digest
              </a>
              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 text-sm font-semibold text-white hover:bg-white/[0.1]"
              >
                Browse jobs
              </Link>
            </div>
          </div>

          <aside className="glass-card rounded-[2rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Digest preview</p>
            <div className="mt-6 grid gap-3">
              <DigestItem title="LLM Engineer" meta="Berlin · Hybrid · Python" />
              <DigestItem title="AI Product Manager" meta="Remote DACH · Senior" />
              <DigestItem title="Data Scientist" meta="München · MLOps" />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              Curated updates, no generic job spam. Automation comes later; the signup flow is already ready.
            </p>
          </aside>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <RoleExample title="AI Engineering" body="LLM features, RAG systems, evaluation, AI-native products." />
          <RoleExample title="Machine Learning" body="MLOps, forecasting, computer vision, NLP and data products." />
          <RoleExample title="Modern Tech" body="React, TypeScript, data platform, security and cloud engineering." />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_430px]">
        <div className="grid h-fit gap-4">
          <InfoBlock title="For active search" body="See relevant roles early and move quickly when a strong signal appears." />
          <InfoBlock title="For market awareness" body="Follow stacks, salaries and hiring trends even before you are ready to move." />
          <InfoBlock title="For DACH fit" body="Stay close to Germany, Austria, Switzerland and remote-friendly regional roles." />
        </div>

        <form id="alert-form" action={createCandidateAlert} className="glass-card grid h-fit gap-4 rounded-[2rem] p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Free signup</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Your job preferences</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Pick a role and city as a starting point. More preference depth can be added later.
            </p>
          </div>

          {searchParams.success ? (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              Your job alert was saved.
            </div>
          ) : null}
          {searchParams.error ? (
            <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">
              {decodeURIComponent(searchParams.error)}
            </div>
          ) : null}

          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Select label="Preferred role" name="preferred_role_type" options={roleTypes} />
          <Select label="Preferred city" name="preferred_city" options={dachCities} />

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">
            MVP note: the signup is stored now. The weekly digest template is ready and automation comes later.
          </div>

          <button className="glow-button h-12 rounded-2xl px-5 text-sm font-semibold text-white">
            Create job alert
          </button>
        </form>
      </section>
    </PageShell>
  );
}

function DigestItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050816]/70 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{meta}</p>
    </div>
  );
}

function RoleExample({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-300">
      {label}
      <input name={name} type={type} required={required} className="premium-input h-11 rounded-xl px-3 text-sm" />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-300">
      {label}
      <select name={name} required className="premium-select h-11 rounded-xl px-3 text-sm">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
