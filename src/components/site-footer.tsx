import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© 2026 JobLayer. AI & Tech Jobs für die DACH-Region.</p>
        <div className="flex gap-4">
          <Link href="/impressum" className="hover:text-slate-900">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-slate-900">
            Datenschutz
          </Link>
          <Link href="/agb" className="hover:text-slate-900">
            AGB
          </Link>
        </div>
      </div>
    </footer>
  );
}
