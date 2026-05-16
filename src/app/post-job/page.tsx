import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { dachCities, employmentTypes, roleTypes, seniorities, tagOptions, workModes } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Job posten",
  description: "Veröffentliche eine AI- oder Tech-Stellenanzeige auf JobLayer.",
};

export default function PostJobPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <PageShell>
      <section className="px-4 pb-10 pt-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">For employers</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Reach <span className="gradient-text">AI and tech talent</span> across DACH.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              JobLayer is a curated hiring surface for AI, data and modern software teams. Post once, reach a focused
              audience, and send applicants straight to your own application flow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#job-form" className="glow-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white">
                Submit listing
              </a>
              <a
                href="#pricing"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 text-sm font-semibold text-white hover:bg-white/[0.1]"
              >
                View pricing
              </a>
            </div>
          </div>

          <aside id="pricing" className="glass-card rounded-[2rem] p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basic Listing</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight text-white">149 €</span>
              <span className="pb-2 text-sm font-medium text-slate-400">one-time</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              30 days live, curated AI/Tech audience, external apply link and admin moderation.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-300">
              <PricingItem>Curated AI/Tech audience</PricingItem>
              <PricingItem>DACH-focused reach</PricingItem>
              <PricingItem>Job Digest mention coming soon</PricingItem>
              <PricingItem>Featured placement coming soon</PricingItem>
            </ul>
          </aside>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <Benefit title="Sharper audience" body="No generic board noise. JobLayer is deliberately built around AI, data and modern tech careers." />
          <Benefit title="Fast publishing" body="Submit, checkout and move into moderation. Approved listings stay live for 30 days." />
          <Benefit title="Conversion ready" body="Candidates go directly to your own apply URL, keeping your hiring process intact." />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr]">
        <aside className="glass-panel h-fit rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white">How it works</h2>
          <ol className="mt-5 grid gap-5">
            <Step number="1" title="Submit the role" body="Add role details, location, salary range, stack and apply URL." />
            <Step number="2" title="Checkout" body="Pay the 149 € listing fee through Stripe Checkout." />
            <Step number="3" title="Go live" body="After moderation, the listing is live for 30 days." />
          </ol>
        </aside>

        <div id="job-form">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Listing intake</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Create your role signal</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Clear details around stack, location, salary and seniority make the listing more useful for senior candidates.
            </p>
          </div>

          {searchParams.error ? (
            <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
              {decodeURIComponent(searchParams.error)}
            </div>
          ) : null}

          <form action="/api/stripe/checkout" method="post" className="glass-card grid gap-6 rounded-[2rem] p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company" name="company_name" required />
              <Field label="Job title" name="title" required />
              <Field label="Logo URL" name="company_logo_url" type="url" />
              <Field label="Contact email" name="contact_email" type="email" required />
              <Select label="Role" name="role_type" options={roleTypes} />
              <Select label="City" name="location_city" options={dachCities} />
              <Select label="Work mode" name="work_mode" options={workModes} />
              <Select label="Level" name="seniority" options={seniorities} />
              <Select label="Employment" name="employment_type" options={employmentTypes} />
              <Select
                label="Currency"
                name="salary_currency"
                options={[
                  { value: "EUR", label: "EUR" },
                  { value: "CHF", label: "CHF" },
                ]}
              />
              <Field label="Salary min." name="salary_min" type="number" />
              <Field label="Salary max." name="salary_max" type="number" />
            </div>

            <Field label="Apply URL" name="apply_url" type="url" required />

            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Description in Markdown
              <textarea
                name="description_markdown"
                required
                minLength={120}
                rows={10}
                className="premium-textarea rounded-2xl px-4 py-3 text-sm"
                placeholder="Describe responsibilities, requirements, stack, team and benefits."
              />
            </label>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium text-slate-300">Tags</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {tagOptions.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    <input type="checkbox" name="tags" value={tag} className="h-4 w-4 rounded border-slate-500 bg-transparent text-violet-500" />
                    {tag}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-400">
              After checkout, the listing is saved as <span className="font-semibold text-white">pending</span> and moves into admin moderation.
            </div>

            <button className="glow-button h-12 rounded-2xl px-5 text-sm font-semibold text-white">
              Continue to Stripe Checkout
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function PricingItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
      <span>{children}</span>
    </li>
  );
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white">
        {number}
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{body}</span>
      </span>
    </li>
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
