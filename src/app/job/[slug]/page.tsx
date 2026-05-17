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
  const isImported = Boolean(job.source_company || job.source_url);
  const sourceLabel = job.source_company ?? "employer career site";
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

          <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 sm:p-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(139,92,246,0.24),transparent_28rem),radial-gradient(circle_at_88%_18%,rgba(6,182,212,0.18),transparent_24rem)]" />
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">{job.company_name}</p>
                  {isImported ? <Badge tone="cyan">Curated external role</Badge> : <Badge tone="violet">JobLayer listing</Badge>}
                </div>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {job.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                  {roleLabel(job.role_type)} role at {job.company_name}, curated for AI and tech talent in the DACH market.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
                  <Badge>{jobLocation(job)}</Badge>
                  <Badge>{roleLabel(job.role_type)}</Badge>
                  <Badge>{seniorityLabel(job.seniority)}</Badge>
                  <Badge>{employmentLabel(job.employment_type)}</Badge>
                  {salary ? <Badge>{salary}</Badge> : null}
                </div>
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Application</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Bewerbungen laufen direkt über {isImported ? sourceLabel : "den Arbeitgeber"}. JobLayer hält die Rolle kuratiert und verlinkt auf die Originalquelle.
                </p>
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-button mt-5 inline-flex w-full h-12 shrink-0 items-center justify-center rounded-2xl px-6 text-sm font-semibold text-white transition"
                >
                  Jetzt bewerben
                </a>
                {job.source_url ? (
                  <a href={job.source_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                    Originalquelle ansehen
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px]">
        <article className="grid gap-6">
          {isImported ? (
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Curated by JobLayer</p>
              <p className="mt-2 text-sm leading-6 text-cyan-50/80">
                Diese Rolle wurde aus einer offiziellen Arbeitgeberquelle erkannt und für JobLayer redaktionell einsortiert. Die vollständige Bewerbung und tagesaktuelle Details liegen beim Arbeitgeber.
              </p>
            </div>
          ) : null}

          <div className="prose max-w-none glass-card rounded-[2rem] p-6 sm:p-8">
            <h2>About the role</h2>
            <ReactMarkdown>{job.description_markdown}</ReactMarkdown>
          </div>

          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">Role signal</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Why this role fits JobLayer</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Signal label="Focus" value={roleLabel(job.role_type)} />
              <Signal label="Level" value={seniorityLabel(job.seniority)} />
              <Signal label="Market" value={job.country === "CH" ? "Switzerland" : job.country === "AT" ? "Austria" : "Germany"} />
            </div>
          </div>
        </article>

        <aside className="glass-panel sticky top-28 h-fit rounded-2xl p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Quick facts</h2>
          <dl className="mt-5 grid gap-5 text-sm">
            <Fact label="Salary" value={salary ?? "Not specified"} />
            <Fact label="Published" value={formatPostedDate(job.published_at ?? job.created_at)} />
            <Fact label="Location" value={jobLocation(job)} />
            <Fact label="Work mode" value={job.work_mode === "onsite" ? "Vor Ort" : job.work_mode === "hybrid" ? "Hybrid" : "Remote"} />
            <Fact label="Apply" value="External application link" />
            {isImported ? <Fact label="Source" value={sourceLabel} /> : null}
          </dl>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noreferrer"
            className="glow-button mt-6 inline-flex w-full justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white"
          >
            Jetzt bewerben
          </a>
          <div className="mt-5 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-semibold text-white">Weekly AI Jobs Digest</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Erhalte neue AI- und Tech-Rollen aus DACH direkt per E-Mail.
            </p>
            <Link href="/alerts" className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              Job Alert erstellen
            </Link>
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

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "cyan" | "violet" }) {
  const toneClass = {
    default: "border-white/10 bg-white/[0.06] text-slate-300",
    cyan: "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
    violet: "border-violet-300/20 bg-violet-400/10 text-violet-100",
  }[tone];

  return <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${toneClass}`}>{children}</span>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-white">{value}</dd>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
