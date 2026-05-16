import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold">
              JL
            </span>
            JobLayer
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            The curated AI career layer for DACH. Built for sharp candidates and teams hiring in AI, data and modern tech.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Platform</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <Link href="/jobs" className="hover:text-white">
              Browse jobs
            </Link>
            <Link href="/alerts" className="hover:text-white">
              Weekly AI Jobs Digest
            </Link>
            <Link href="/post-job" className="hover:text-white">
              Post a job
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Legal</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <Link href="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-white">
              AGB
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">
        © 2026 JobLayer. AI & Tech Jobs for Germany, Austria and Switzerland.
      </div>
    </footer>
  );
}
