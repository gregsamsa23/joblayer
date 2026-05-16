import { PageShell } from "@/components/page-shell";

export default function DatenschutzPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="glass-card rounded-[2rem] p-8">
          <h1 className="text-4xl font-semibold text-white">Datenschutz</h1>
          <p className="mt-6 text-sm leading-7 text-slate-400">
            Platzhalter. Vor Launch müssen Datenverarbeitung, Supabase, Stripe, Resend, Hosting und Kontaktwege rechtlich geprüft dokumentiert werden.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
