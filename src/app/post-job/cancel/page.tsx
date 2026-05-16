import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function PostJobCancelPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <div className="glass-card rounded-[2rem] p-8">
          <h1 className="text-4xl font-semibold text-white">Checkout cancelled</h1>
          <p className="mt-4 text-slate-400">Your listing has not been submitted for moderation yet.</p>
          <Link href="/post-job#job-form" className="glow-button mt-6 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold text-white">
            Return to form
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
