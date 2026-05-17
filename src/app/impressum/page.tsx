import { PageShell } from "@/components/page-shell";

export default function ImpressumPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <article className="glass-card rounded-[2rem] p-8 sm:p-10">
          <div className="prose max-w-none">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Rechtliche Angaben</p>
            <h1>Impressum</h1>

            <h2>Angaben gemaess § 5 TMG</h2>
            <p>
              [BETREIBER_NAME]
              <br />
              [ADRESSE]
              <br />
              Deutschland
            </p>

            <h2>Kontakt</h2>
            <p>
              E-Mail: <a href="mailto:[EMAIL]">[EMAIL]</a>
            </p>

            <h2>Vertreten durch</h2>
            <p>[BETREIBER_NAME]</p>

            <h2>Umsatzsteuer</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemaess § 27a Umsatzsteuergesetz:
              <br />
              [UST_ID, falls vorhanden]
            </p>

            <h2>Verantwortlich fuer den Inhalt</h2>
            <p>
              Verantwortlich fuer redaktionelle Inhalte und die kuratierte Darstellung der Stellenanzeigen ist:
              <br />
              [BETREIBER_NAME], [ADRESSE]
            </p>

            <h2>EU-Streitschlichtung</h2>
            <p>
              Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:
              <br />
              <a href="https://ec.europa.eu/consumers/odr/" rel="noreferrer" target="_blank">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>

            <h2>Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <h2>Haftung fuer Inhalte</h2>
            <p>
              Als Diensteanbieter sind wir gemaess § 7 Abs. 1 TMG fuer eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, uebermittelte oder gespeicherte fremde Informationen zu ueberwachen oder nach Umstaenden
              zu forschen, die auf eine rechtswidrige Taetigkeit hinweisen.
            </p>

            <h2>Haftung fuer Links</h2>
            <p>
              JobLayer enthaelt Links zu externen Karriereseiten und Bewerbungsformularen von Arbeitgebern. Auf deren
              aktuelle und zukuenftige Inhalte haben wir keinen Einfluss. Fuer die Inhalte der verlinkten Seiten ist
              stets der jeweilige Anbieter oder Betreiber verantwortlich.
            </p>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
