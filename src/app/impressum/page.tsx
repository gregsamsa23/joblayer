import { PageShell } from "@/components/page-shell";

export default function ImpressumPage() {
  return <LegalPage title="Impressum" body="Platzhalter. Diese Seite muss vor dem öffentlichen Launch durch rechtlich geprüfte Angaben ersetzt werden." />;
}

function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="glass-card rounded-[2rem] p-8">
          <h1 className="text-4xl font-semibold text-white">{title}</h1>
          <p className="mt-6 text-sm leading-7 text-slate-400">{body}</p>
        </div>
      </section>
    </PageShell>
  );
}
