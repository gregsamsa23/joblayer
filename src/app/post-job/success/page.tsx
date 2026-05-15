import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function PostJobSuccessPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-lg border border-emerald-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Zahlung erhalten</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Deine Anzeige wartet auf Freigabe</h1>
          <p className="mt-4 text-slate-600">
            Wir prüfen die Einreichung und veröffentlichen sie nach Freigabe für 30 Tage auf JobLayer.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Zur Jobübersicht
            </Link>
            <Link
              href="/post-job"
              className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Weitere Anzeige einreichen
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
