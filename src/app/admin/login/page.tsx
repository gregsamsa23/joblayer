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
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">JobLayer Admin</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white">Moderate the hiring signal.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Sign in with Supabase Auth to review submissions, approve roles and keep JobLayer curated.
          </p>
          <Link href="/admin" className="mt-6 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-100">
            Back to admin overview
          </Link>
        </div>

        <form action={signInAdmin} className="glass-card grid gap-4 rounded-[2rem] p-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Sign in</h2>
            <p className="mt-2 text-sm text-slate-400">Supabase Auth manages admin access.</p>
          </div>
          {searchParams.error ? (
            <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">
              {decodeURIComponent(searchParams.error)}
            </div>
          ) : null}
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Email
            <input name="email" type="email" required className="premium-input h-11 rounded-xl px-3 text-sm" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-300">
            Password
            <input name="password" type="password" required className="premium-input h-11 rounded-xl px-3 text-sm" />
          </label>
          <button className="glow-button h-11 rounded-2xl px-5 text-sm font-semibold text-white">Sign in</button>
        </form>
      </section>
    </PageShell>
  );
}
