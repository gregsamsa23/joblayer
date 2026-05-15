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
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Für Arbeitgeber</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Jobanzeige veröffentlichen</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Reiche deine Rolle ein, bezahle 149 EUR via Stripe Checkout und erhalte nach Prüfung eine 30-Tage-Listung.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {searchParams.error ? (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {decodeURIComponent(searchParams.error)}
          </div>
        ) : null}

        <form action="/api/stripe/checkout" method="post" className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Unternehmen" name="company_name" required />
            <Field label="Jobtitel" name="title" required />
            <Field label="Logo-URL" name="company_logo_url" type="url" />
            <Field label="Kontakt-E-Mail" name="contact_email" type="email" required />
            <Select label="Rolle" name="role_type" options={roleTypes} />
            <Select label="Stadt" name="location_city" options={dachCities} />
            <Select label="Arbeitsmodell" name="work_mode" options={workModes} />
            <Select label="Level" name="seniority" options={seniorities} />
            <Select label="Beschäftigung" name="employment_type" options={employmentTypes} />
            <Select
              label="Währung"
              name="salary_currency"
              options={[
                { value: "EUR", label: "EUR" },
                { value: "CHF", label: "CHF" },
              ]}
            />
            <Field label="Gehalt min." name="salary_min" type="number" />
            <Field label="Gehalt max." name="salary_max" type="number" />
          </div>

          <Field label="Bewerbungs-URL" name="apply_url" type="url" required />

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Beschreibung in Markdown
            <textarea
              name="description_markdown"
              required
              minLength={120}
              rows={10}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Beschreibe Aufgaben, Anforderungen, Team, Stack und Benefits."
            />
          </label>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium text-slate-700">Tags</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {tagOptions.map((tag) => (
                <label key={tag} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input type="checkbox" name="tags" value={tag} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                  {tag}
                </label>
              ))}
            </div>
          </fieldset>

          <button className="h-11 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
            Weiter zu Stripe Checkout
          </button>
        </form>
      </section>
    </PageShell>
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
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="h-11 rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
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
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <select
        name={name}
        required
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
