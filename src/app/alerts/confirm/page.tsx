import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function ConfirmAlertPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const result = await confirmAlert(searchParams.token);

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="glass-card rounded-[2rem] p-8 text-center sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Job Alert</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{result.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">{result.message}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/jobs" className="glow-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white">
              Browse jobs
            </Link>
            <Link
              href="/alerts"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to alerts
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

async function confirmAlert(token?: string) {
  if (!token) {
    return {
      title: "Bestaetigung nicht moeglich",
      message: "Der Bestaetigungslink enthaelt kein gueltiges Token. Bitte fordere den Job Alert erneut an.",
    };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      title: "Konfiguration fehlt",
      message: "Die Bestaetigung kann aktuell nicht gespeichert werden. Bitte versuche es spaeter erneut.",
    };
  }

  const { data, error } = await supabase
    .from("candidate_alerts")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("id", token)
    .is("confirmed_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to confirm candidate alert", error);
    return {
      title: "Bestaetigung fehlgeschlagen",
      message: "Der Link konnte nicht bestaetigt werden. Bitte pruefe den Link oder fordere den Job Alert erneut an.",
    };
  }

  if (!data) {
    return {
      title: "Link bereits verwendet oder ungueltig",
      message: "Dieser Job Alert wurde bereits bestaetigt oder der Link ist nicht mehr gueltig.",
    };
  }

  return {
    title: "Job Alert bestaetigt",
    message: "Danke. Dein weekly AI Jobs Digest ist jetzt aktiviert.",
  };
}
