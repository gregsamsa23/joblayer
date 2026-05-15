import type { Metadata } from "next";
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
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Job-Alert</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Neue AI-Jobs nicht verpassen</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Hinterlege deine Präferenzen. Im MVP speichern wir die Anmeldung und bereiten den wöchentlichen Digest als E-Mail-Template vor.
          </p>
        </div>

        <form action={createCandidateAlert} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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
          <button className="h-11 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700">
            Job-Alert erstellen
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
