import { PageShell } from "@/components/page-shell";

export default function DatenschutzPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold text-slate-950">Datenschutz</h1>
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          Platzhalter. Vor Launch müssen Datenverarbeitung, Supabase, Stripe, Resend, Hosting und Kontaktwege rechtlich geprüft dokumentiert werden.
        </div>
      </section>
    </PageShell>
  );
}
