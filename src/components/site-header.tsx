import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">
            JL
          </span>
          JobLayer
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link className="hidden rounded-md px-3 py-2 hover:bg-slate-100 sm:inline-flex" href="/jobs">
            Jobs
          </Link>
          <Link className="hidden rounded-md px-3 py-2 hover:bg-slate-100 sm:inline-flex" href="/alerts">
            Job-Alert
          </Link>
          <Link
            className="rounded-md bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
            href="/post-job"
          >
            Job posten
          </Link>
        </nav>
      </div>
    </header>
  );
}
