import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { signInAdmin } from "../actions";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">JobLayer Admin</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Moderation für bezahlte Anzeigen</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Melde dich mit deinem Supabase-Admin-Account an, um Einreichungen zu prüfen, live zu schalten oder abzulehnen.
          </p>
          <Link href="/admin" className="mt-6 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Zur Admin-Übersicht
          </Link>
        </div>

        <form action={signInAdmin} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Einloggen</h2>
            <p className="mt-2 text-sm text-slate-600">Supabase Auth verwaltet den Zugang.</p>
          </div>
          {searchParams.error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {decodeURIComponent(searchParams.error)}
            </div>
          ) : null}
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            E-Mail
            <input
              name="email"
              type="email"
              required
              className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Passwort
            <input
              name="password"
              type="password"
              required
              className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <button className="h-11 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">
            Einloggen
          </button>
        </form>
      </section>
    </PageShell>
  );
}
