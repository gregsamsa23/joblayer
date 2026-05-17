import { PageShell } from "@/components/page-shell";

export default function DatenschutzPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <article className="glass-card rounded-[2rem] p-8 sm:p-10">
          <div className="prose max-w-none">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Datenschutz</p>
            <h1>Datenschutzerklaerung</h1>
            <p>
              Diese Datenschutzerklaerung informiert darueber, wie JobLayer personenbezogene Daten verarbeitet, wenn
              Nutzerinnen und Nutzer die Website besuchen, Job Alerts abonnieren oder Arbeitgeber Stellenanzeigen
              einreichen.
            </p>

            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlich fuer die Datenverarbeitung ist:
              <br />
              [BETREIBER_NAME]
              <br />
              [ADRESSE]
              <br />
              E-Mail: <a href="mailto:[EMAIL]">[EMAIL]</a>
            </p>

            <h2>2. Hosting und technische Bereitstellung durch Vercel</h2>
            <p>
              JobLayer wird ueber Vercel Inc. gehostet. Beim Aufruf der Website verarbeitet Vercel technische
              Zugriffsdaten wie IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene URL, Browserinformationen und
              Server-Logdaten. Diese Verarbeitung ist erforderlich, um die Website sicher und stabil bereitzustellen.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren,
              schnellen und zuverlaessigen Auslieferung der Website.
            </p>

            <h2>3. Datenbank, Authentifizierung und Speicherung durch Supabase</h2>
            <p>
              Fuer Datenbankfunktionen, Admin-Authentifizierung und die Speicherung von Job- und Alert-Daten nutzt
              JobLayer Supabase. Dabei koennen insbesondere folgende Daten verarbeitet werden:
            </p>
            <ul>
              <li>Stellenanzeigen und Arbeitgeberdaten, die ueber das Formular eingereicht werden</li>
              <li>Kontakt-E-Mail-Adressen von Arbeitgebern</li>
              <li>Candidate-Alert-Daten wie Name, E-Mail, bevorzugter Rollentyp und bevorzugte Stadt</li>
              <li>technische Metadaten wie Erstellungs- und Aktualisierungszeitpunkte</li>
            </ul>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung zur Durchfuehrung
              vorvertraglicher oder vertraglicher Massnahmen erforderlich ist, sowie Art. 6 Abs. 1 lit. f DSGVO fuer
              den sicheren Betrieb der Plattform.
            </p>

            <h2>4. Zahlungen ueber Stripe</h2>
            <p>
              Zahlungen fuer Stellenanzeigen werden ueber Stripe abgewickelt. Wenn Arbeitgeber eine bezahlte
              Stellenanzeige buchen, werden Zahlungsdaten direkt durch Stripe verarbeitet. JobLayer speichert keine
              vollstaendigen Kreditkarten- oder Zahlungsinstrumentdaten.
            </p>
            <p>
              Verarbeitet werden koennen unter anderem Zahlungsstatus, Checkout-Session-ID, Zahlungsreferenzen und die
              zur Zuordnung erforderliche E-Mail-Adresse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
            </p>

            <h2>5. E-Mail-Versand ueber Resend</h2>
            <p>
              Fuer transaktionale E-Mails, Admin-Benachrichtigungen und Job-Alert-E-Mails nutzt JobLayer Resend. Dabei
              werden E-Mail-Adresse, Name, Betreff, Inhalt der Nachricht und technische Versandinformationen
              verarbeitet.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die E-Mail fuer eine angeforderte Funktion
              erforderlich ist, und Art. 6 Abs. 1 lit. f DSGVO fuer betriebliche Benachrichtigungen.
            </p>

            <h2>6. Bewerberdaten und Candidate Alerts</h2>
            <p>
              Nutzerinnen und Nutzer koennen sich fuer Job Alerts anmelden. Dabei speichern wir Name, E-Mail-Adresse,
              bevorzugten Rollentyp, bevorzugte Stadt sowie den Zeitpunkt einer Bestaetigung, sofern ein Double-Opt-in
              verwendet wird.
            </p>
            <p>
              Die Verarbeitung dient dem Versand passender AI- und Tech-Job-Hinweise. Rechtsgrundlage ist Art. 6 Abs.
              1 lit. a DSGVO. Eine erteilte Einwilligung kann jederzeit mit Wirkung fuer die Zukunft widerrufen werden,
              zum Beispiel per E-Mail an <a href="mailto:[EMAIL]">[EMAIL]</a>.
            </p>

            <h2>7. Arbeitgeberdaten und Stellenanzeigen</h2>
            <p>
              Wenn Arbeitgeber eine Stellenanzeige einreichen, verarbeiten wir die angegebenen Unternehmens-,
              Kontakt- und Jobdaten. Dazu gehoeren insbesondere Unternehmensname, Jobtitel, Standort, Arbeitsmodell,
              Beschreibung, Bewerbungslink, Kontakt-E-Mail und Zahlungsreferenzen.
            </p>
            <p>
              Diese Daten werden verarbeitet, um die Stellenanzeige zu pruefen, zu veroeffentlichen, abzurechnen und
              mit dem Arbeitgeber zu kommunizieren.
            </p>

            <h2>8. Speicherdauer</h2>
            <p>
              Personenbezogene Daten werden nur so lange gespeichert, wie es fuer den jeweiligen Zweck erforderlich ist
              oder gesetzliche Aufbewahrungspflichten bestehen. Candidate Alerts bleiben gespeichert, bis die
              betroffene Person die Loeschung oder Abmeldung verlangt.
            </p>

            <h2>9. Betroffenenrechte</h2>
            <p>
              Betroffene Personen haben nach Massgabe der DSGVO Rechte auf Auskunft, Berichtigung, Loeschung,
              Einschraenkung der Verarbeitung, Datenuebertragbarkeit und Widerspruch. Zudem besteht das Recht, sich bei
              einer Datenschutzaufsichtsbehoerde zu beschweren.
            </p>

            <h2>10. Kontakt fuer Datenschutzanfragen</h2>
            <p>
              Datenschutzanfragen koennen jederzeit an <a href="mailto:[EMAIL]">[EMAIL]</a> gerichtet werden.
            </p>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
