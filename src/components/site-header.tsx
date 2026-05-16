import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-6">
      <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-3 shadow-2xl shadow-black/20 sm:px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
            JL
          </span>
          <span className="tracking-tight">JobLayer</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-300 md:flex">
          <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.08] hover:text-white" href="/jobs">
            Browse jobs
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.08] hover:text-white" href="/alerts">
            Job alerts
          </Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-white/[0.08] hover:text-white" href="/admin">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/[0.08] sm:inline-flex"
            href="/jobs"
          >
            Browse jobs
          </Link>
          <Link
            className="glow-button rounded-xl px-4 py-2 text-sm font-semibold text-white transition"
            href="/post-job"
          >
            Post a job
          </Link>
        </div>
      </div>
    </header>
  );
}
