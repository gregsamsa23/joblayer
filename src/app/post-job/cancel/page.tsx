import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function PostJobCancelPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">Checkout abgebrochen</h1>
          <p className="mt-4 text-slate-600">Deine Anzeige wurde noch nicht zur Moderation eingereicht.</p>
          <Link
            href="/post-job#job-form"
            className="mt-6 inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Zurück zum Formular
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
