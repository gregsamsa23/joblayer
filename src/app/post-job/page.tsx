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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Für Arbeitgeber</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Erreiche AI- und Tech-Talente in der DACH-Region.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              JobLayer ist eine kuratierte Nischenjobbörse für moderne AI-, Data- und Software-Rollen. Ideal für Teams,
              die gezielt Fachkräfte in Deutschland, Österreich und der Schweiz ansprechen wollen.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#job-form"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Anzeige einreichen
              </a>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Preis ansehen
              </a>
            </div>
          </div>

          <aside id="pricing" className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Launch-Angebot</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight text-slate-950">149 EUR</span>
              <span className="pb-1 text-sm font-medium text-slate-500">pro Anzeige</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              30 Tage Laufzeit, kuratierte Veröffentlichung und externe Bewerbungslinks ohne internes Bewerbermanagement.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-700">
              <PricingItem>AI-, Data- und Tech-Zielgruppe</PricingItem>
              <PricingItem>DACH-Fokus statt generischer Reichweite</PricingItem>
              <PricingItem>Stripe Checkout und Moderation vorbereitet</PricingItem>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
          <Benefit
            title="Fokussierte Reichweite"
            body="Keine breite Massenplattform, sondern ein klares Umfeld für AI Engineers, ML, Data, Security und moderne Software-Rollen."
          />
          <Benefit
            title="Schneller Launch"
            body="Einreichen, bezahlen, Freigabe abwarten. Danach läuft die Anzeige 30 Tage mit direktem Link zu deinem Bewerbungsprozess."
          />
          <Benefit
            title="SEO-freundlich"
            body="Listings und Kategorie-Seiten sind auf relevante Suchintentionen wie AI Jobs Berlin oder Remote AI Jobs ausgelegt."
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">So funktioniert es</h2>
          <ol className="mt-5 grid gap-5">
            <Step number="1" title="Anzeige einreichen" body="Rolle, Standort, Tags, Gehalt und Bewerbungslink erfassen." />
            <Step number="2" title="Checkout abschließen" body="149 EUR per Stripe bezahlen. Danach landet die Anzeige in der Moderation." />
            <Step number="3" title="Freigabe erhalten" body="Nach Prüfung geht die Anzeige live und bleibt 30 Tage sichtbar." />
          </ol>
        </aside>

        <div id="job-form">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Einreichung</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Jobdetails erfassen</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Schreibe die Anzeige so konkret wie möglich. Gute Angaben zu Stack, Arbeitsmodell und Gehalt erhöhen die Qualität der Bewerbungen.
            </p>
          </div>

          {searchParams.error ? (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {decodeURIComponent(searchParams.error)}
            </div>
          ) : null}

          <form
            action="/api/stripe/checkout"
            method="post"
            className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
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
                  <label
                    key={tag}
                    className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      name="tags"
                      value={tag}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Nach dem Klick geht es zu Stripe Checkout. Nach erfolgreicher Zahlung wird deine Anzeige als
              <span className="font-semibold text-slate-900"> pending</span> gespeichert und zur Freigabe vorgemerkt.
            </div>

            <button className="h-11 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
              Weiter zu Stripe Checkout
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
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
      <span>{children}</span>
    </li>
  );
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
        {number}
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">{body}</span>
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
