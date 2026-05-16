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
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Job-Alert</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Lass passende AI- und Tech-Jobs zu dir kommen.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              JobLayer filtert den DACH-Markt für AI Engineers, Machine-Learning-Profile, Data Teams und moderne
              Software-Rollen. Du hinterlegst deine Präferenzen, wir bereiten den wöchentlichen Digest vor.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#alert-form"
                className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Job-Alert erstellen
              </a>
              <Link
                href="/jobs"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Jobs ansehen
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Was du bekommst</p>
            <ul className="mt-5 grid gap-4">
              <CheckItem title="Relevante Rollen" body="AI, ML, Data, Security, Product und Software Engineering." />
              <CheckItem title="DACH-Fokus" body="Deutschland, Österreich, Schweiz und Remote-Rollen für die Region." />
              <CheckItem title="Kein Lärm" body="Kuratierte Updates statt täglicher Massen-E-Mails." />
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
          <RoleExample title="AI Engineer" body="LLM Features, RAG-Systeme, Evaluation, AI-native Produkte." />
          <RoleExample title="Machine Learning" body="MLOps, Forecasting, Computer Vision, NLP und Datenprodukte." />
          <RoleExample title="Modern Tech" body="React, TypeScript, Data Platform, Security und Cloud Engineering." />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="grid h-fit gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Für aktive Suche</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nutze den Alert, um neue Rollen schnell zu sehen und dich früh zu bewerben.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Für Marktbeobachtung</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Auch wenn du nicht sofort wechselst, bekommst du ein Gefühl für Gehälter, Stacks und Hiring-Trends.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">Für DACH-Rollen</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Der Fokus bleibt bewusst regional, damit Standort, Sprache, Remote-Modell und Markt besser passen.
            </p>
          </div>
        </div>

        <form
          id="alert-form"
          action={createCandidateAlert}
          className="grid h-fit gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Kostenlos anmelden</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Deine Job-Präferenzen</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Wähle eine Rolle und Stadt als Startpunkt. Weitere Präferenzen können später ergänzt werden.
            </p>
          </div>

          {searchParams.success ? (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Dein Job-Alert wurde gespeichert.
            </div>
          ) : null}
          {searchParams.error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {decodeURIComponent(searchParams.error)}
            </div>
          ) : null}

          <Field label="Name" name="name" required />
          <Field label="E-Mail" name="email" type="email" required />
          <Select label="Bevorzugte Rolle" name="preferred_role_type" options={roleTypes} />
          <Select label="Bevorzugte Stadt" name="preferred_city" options={dachCities} />

          <div className="rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Im MVP wird deine Anmeldung gespeichert. Der wöchentliche Digest ist vorbereitet und wird später automatisiert.
          </div>

          <button className="h-11 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
            Job-Alert erstellen
          </button>
        </form>
      </section>
    </PageShell>
  );
}

function CheckItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
        ✓
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-950">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">{body}</span>
      </span>
    </li>
  );
}

function RoleExample({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
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
