import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobListingPage } from "@/components/job-listing-page";
import { getLiveJobs } from "@/lib/jobs";
import { seoSegments } from "@/lib/taxonomy";
import type { JobFilters } from "@/lib/types";

type Category = keyof typeof seoSegments;

export function generateStaticParams() {
  return Object.keys(seoSegments).map((category) => ({ category }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const segment = seoSegments[params.category as Category];

  if (!segment) {
    return {};
  }

  return {
    title: segment.metaTitle,
    description: segment.description,
    openGraph: {
      title: segment.metaTitle,
      description: segment.description,
    },
  };
}

export default async function SeoJobsPage({ params }: { params: { category: string } }) {
  const segment = seoSegments[params.category as Category];

  if (!segment) {
    notFound();
  }

  const filters: JobFilters = {
    city: "city" in segment ? segment.city : undefined,
    workMode: "workMode" in segment ? segment.workMode : undefined,
    roleType: "roleType" in segment ? segment.roleType : undefined,
  };

  const jobs = await getLiveJobs(filters);

  return (
    <JobListingPage
      jobs={jobs}
      filters={filters}
      heading={`${segment.title} - JobLayer`}
      subheading={segment.description}
      seoContent={<SeoContent segment={segment} />}
    />
  );
}

function SeoContent({ segment }: { segment: (typeof seoSegments)[Category] }) {
  return (
    <section className="border-y border-white/10 bg-white/[0.025]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">SEO focus</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{segment.title} finden</h2>
          <p className="mt-4 text-base leading-8 text-slate-400">{segment.intro}</p>
          <p className="mt-4 text-base leading-8 text-slate-400">{segment.audience}</p>
        </div>

        <aside className="grid gap-4">
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Typische Schwerpunkte</h3>
            <ul className="mt-4 grid gap-2 text-sm text-slate-300">
              {segment.focus.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Weitere Suchen</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {segment.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
