import { PageShell } from "@/components/page-shell";

export default function AgbPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <article className="glass-card rounded-[2rem] p-8 sm:p-10">
          <div className="prose max-w-none">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Allgemeine Bedingungen</p>
            <h1>AGB fuer JobLayer</h1>

            <h2>1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschaeftsbedingungen gelten fuer die Nutzung von JobLayer durch Arbeitgeber, die eine
              Stellenanzeige einreichen oder buchen. Betreiber der Plattform ist [BETREIBER_NAME], [ADRESSE].
            </p>

            <h2>2. Leistungsgegenstand</h2>
            <p>
              JobLayer ist eine kuratierte Jobplattform fuer AI- und Tech-Rollen mit Fokus auf die DACH-Region.
              Arbeitgeber koennen Stellenanzeigen einreichen, die nach erfolgreicher Zahlung und redaktioneller
              Pruefung auf der Website veroeffentlicht werden koennen.
            </p>
            <p>
              Eine Stellenanzeige umfasst die Darstellung der vom Arbeitgeber bereitgestellten Jobinformationen,
              insbesondere Jobtitel, Unternehmen, Standort, Arbeitsmodell, Senioritaet, Beschreibung, Tags und externen
              Bewerbungslink.
            </p>

            <h2>3. Buchung und Zahlung</h2>
            <p>
              Die Buchung einer Stellenanzeige erfolgt ueber das Einreichungsformular und die anschliessende Zahlung
              per Stripe Checkout. Der Preis fuer eine Standard-Stellenanzeige betraegt 149 EUR zzgl. etwaiger
              gesetzlich anfallender Steuern, sofern auf der Website nichts Abweichendes ausgewiesen ist.
            </p>

            <h2>4. Laufzeit der Stellenanzeige</h2>
            <p>
              Eine veroeffentlichte Stellenanzeige laeuft fuer 30 Tage ab dem Zeitpunkt der Freischaltung, sofern keine
              andere Laufzeit vereinbart wurde. Nach Ablauf kann die Anzeige automatisch als abgelaufen markiert und aus
              der oeffentlichen Anzeige entfernt werden.
            </p>

            <h2>5. Moderation und Freischaltung</h2>
            <p>
              Jede Stellenanzeige wird vor der Veroeffentlichung manuell geprueft. JobLayer ist berechtigt, Anzeigen
              redaktionell zu formatieren, offensichtliche Tippfehler zu korrigieren oder eine Anzeige abzulehnen,
              wenn sie nicht zum fachlichen Fokus der Plattform passt.
            </p>
            <p>
              Ein Anspruch auf Veroeffentlichung besteht erst nach erfolgreicher Zahlung und Freigabe durch JobLayer.
              Jobs werden nicht automatisch auf live gesetzt.
            </p>

            <h2>6. Ausschluss von Anzeigen</h2>
            <p>
              JobLayer kann Anzeigen insbesondere dann ablehnen oder entfernen, wenn sie rechtswidrige Inhalte,
              irrefuehrende Angaben, diskriminierende Anforderungen, Spam, reine Vermittlungsangebote ohne klare
              Jobinformationen oder Rollen ausserhalb des AI- und Tech-Fokus enthalten.
            </p>

            <h2>7. Pflichten des Arbeitgebers</h2>
            <p>
              Der Arbeitgeber ist fuer die Richtigkeit, Aktualitaet und Rechtmaessigkeit der eingereichten Inhalte
              verantwortlich. Dies umfasst insbesondere die Stellenbeschreibung, Gehaltsangaben, Unternehmensdaten und
              den externen Bewerbungslink.
            </p>

            <h2>8. Rueckerstattung</h2>
            <p>
              Wird eine bezahlte Anzeige durch JobLayer abgelehnt, weil sie nicht zum Plattformfokus passt oder gegen
              diese Bedingungen verstoesst, kann JobLayer nach eigenem Ermessen eine Rueckerstattung anbieten oder eine
              Nachbesserung der Anzeige ermoeglichen.
            </p>
            <p>
              Eine Rueckerstattung ist in der Regel ausgeschlossen, wenn die Anzeige bereits freigeschaltet wurde oder
              die Ablehnung auf falschen, rechtswidrigen oder missbraeuchlichen Angaben des Arbeitgebers beruht.
            </p>

            <h2>9. Verfuegbarkeit</h2>
            <p>
              JobLayer bemueht sich um einen stabilen Betrieb der Plattform. Eine jederzeit ununterbrochene
              Verfuegbarkeit wird jedoch nicht geschuldet. Kurzzeitige Unterbrechungen durch Wartung, technische
              Stoerungen oder externe Dienstleister koennen auftreten.
            </p>

            <h2>10. Kontakt</h2>
            <p>
              Fragen zu Buchungen, Rechnungen oder veroeffentlichten Stellenanzeigen koennen an{" "}
              <a href="mailto:[EMAIL]">[EMAIL]</a> gerichtet werden.
            </p>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
