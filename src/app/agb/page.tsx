import { PageShell } from "@/components/page-shell";

export default function AgbPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="glass-card rounded-[2rem] p-8">
          <h1 className="text-4xl font-semibold text-white">AGB</h1>
          <p className="mt-6 text-sm leading-7 text-slate-400">
            Platzhalter. Die Bedingungen für bezahlte Stellenanzeigen, Laufzeit, Moderation und Erstattung müssen vor Launch finalisiert werden.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
