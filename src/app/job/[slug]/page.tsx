import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { PageShell } from "@/components/page-shell";
import {
  employmentLabel,
  formatPostedDate,
  formatSalary,
  jobLocation,
  roleLabel,
  seniorityLabel,
} from "@/lib/format";
import { getJobBySlug } from "@/lib/jobs";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    return {};
  }

  return {
    title: `${job.title} bei ${job.company_name}`,
    description: `${job.title} bei ${job.company_name} in ${jobLocation(job)}. Jetzt extern bewerben.`,
    openGraph: {
      title: `${job.title} bei ${job.company_name}`,
      description: `${job.title} in ${jobLocation(job)}`,
      type: "article",
    },
  };
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  const salary = formatSalary(job);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description_markdown,
    datePosted: job.published_at ?? job.created_at,
    validThrough: job.expires_at,
    employmentType: job.employment_type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      logo: job.company_logo_url ?? undefined,
    },
    jobLocationType: job.work_mode === "remote" ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: {
      "@type": "Country",
      name: job.country,
    },
    baseSalary: salary
      ? {
          "@type": "MonetaryAmount",
          currency: job.salary_currency,
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min ?? undefined,
            maxValue: job.salary_max ?? undefined,
            unitText: "YEAR",
          },
        }
      : undefined,
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <Link href="/jobs" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Zurück zu allen Jobs
          </Link>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600">{job.company_name}</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{job.title}</h1>
              <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-600">
                <span>{jobLocation(job)}</span>
                <span>·</span>
                <span>{roleLabel(job.role_type)}</span>
                <span>·</span>
                <span>{seniorityLabel(job.seniority)}</span>
                <span>·</span>
                <span>{employmentLabel(job.employment_type)}</span>
              </div>
            </div>
            <a
              href={job.apply_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Jetzt bewerben
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px]">
        <article className="prose prose-slate max-w-none rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <ReactMarkdown>{job.description_markdown}</ReactMarkdown>
        </article>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Jobdetails</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Gehalt</dt>
              <dd className="font-semibold text-slate-950">{salary ?? "Nicht angegeben"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Veröffentlicht</dt>
              <dd className="font-semibold text-slate-950">{formatPostedDate(job.published_at ?? job.created_at)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tags</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </PageShell>
  );
}
