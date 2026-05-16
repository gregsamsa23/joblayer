import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function PostJobSuccessPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="glass-card rounded-[2rem] p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Payment received</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Your listing is in review</h1>
          <p className="mt-4 text-slate-400">
            We will review the submission and publish it for 30 days after approval.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/jobs" className="glow-button inline-flex rounded-2xl px-5 py-3 text-sm font-semibold text-white">
              Browse jobs
            </Link>
            <Link
              href="/post-job"
              className="inline-flex rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.1]"
            >
              Submit another listing
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
