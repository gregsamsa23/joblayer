import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobListingPage } from "@/components/job-listing-page";
import { getLiveJobs } from "@/lib/jobs";
import { seoSegments } from "@/lib/taxonomy";

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
    title: `${segment.title} - JobLayer`,
    description: `${segment.title} in der DACH-Region finden. Kuratierte Stellen für AI- und Tech-Fachkräfte.`,
    openGraph: {
      title: `${segment.title} - JobLayer`,
      description: `${segment.title} in der DACH-Region finden.`,
    },
  };
}

export default async function SeoJobsPage({ params }: { params: { category: string } }) {
  const segment = seoSegments[params.category as Category];

  if (!segment) {
    notFound();
  }

  const filters = {
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
      subheading="Finde kuratierte AI- und Tech-Rollen bei Teams in der DACH-Region."
    />
  );
}
