import { PageShell } from "@/components/page-shell";

export default function ImpressumPage() {
  return <LegalPage title="Impressum" />;
}

function LegalPage({ title }: { title: string }) {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          Platzhalter. Diese Seite muss vor dem öffentlichen Launch durch rechtlich geprüfte Angaben ersetzt werden.
        </div>
      </section>
    </PageShell>
  );
}
