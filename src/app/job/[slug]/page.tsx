import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { JobCard } from "@/components/job-card";
import { PageShell } from "@/components/page-shell";
import {
  employmentLabel,
  formatPostedDate,
  formatSalary,
  jobLocation,
  roleLabel,
  seniorityLabel,
} from "@/lib/format";
import { getJobBySlug, getLiveJobs } from "@/lib/jobs";

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
  const similarJobs = (await getLiveJobs({ roleType: job.role_type }))
    .filter((item) => item.id !== job.id)
    .slice(0, 2);

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

      <section className="px-4 pb-8 pt-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Link href="/jobs" className="text-sm font-semibold text-cyan-300 hover:text-cyan-100">
            Back to all jobs
          </Link>

          <div className="glass-card mt-6 rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">{job.company_name}</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {job.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
                  <Badge>{jobLocation(job)}</Badge>
                  <Badge>{roleLabel(job.role_type)}</Badge>
                  <Badge>{seniorityLabel(job.seniority)}</Badge>
                  <Badge>{employmentLabel(job.employment_type)}</Badge>
                </div>
              </div>
              <a
                href={job.apply_url}
                target="_blank"
                rel="noreferrer"
                className="glow-button inline-flex h-12 shrink-0 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white transition"
              >
                Apply now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px]">
        <article className="prose max-w-none glass-card rounded-[2rem] p-6 sm:p-8">
          <h2>About the role</h2>
          <ReactMarkdown>{job.description_markdown}</ReactMarkdown>
        </article>

        <aside className="glass-panel sticky top-28 h-fit rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick facts</h2>
          <dl className="mt-5 grid gap-5 text-sm">
            <Fact label="Salary" value={salary ?? "Not specified"} />
            <Fact label="Published" value={formatPostedDate(job.published_at ?? job.created_at)} />
            <Fact label="Location" value={jobLocation(job)} />
            <Fact label="Apply" value="External application link" />
          </dl>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noreferrer"
            className="glow-button mt-6 inline-flex w-full justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white"
          >
            Apply now
          </a>
          <div className="mt-5 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </section>

      {similarJobs.length ? (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Similar jobs</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">More roles in this signal</h2>
          </div>
          <div className="grid gap-4">
            {similarJobs.map((item) => (
              <JobCard key={item.id} job={item} />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-slate-300">{children}</span>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  );
}
