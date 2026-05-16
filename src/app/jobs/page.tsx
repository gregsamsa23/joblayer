import type { Metadata } from "next";
import { JobListingPage } from "@/components/job-listing-page";
import { getLiveJobs } from "@/lib/jobs";

export const metadata: Metadata = {
  title: "AI & Tech Jobs",
  description: "Aktuelle AI- und Tech-Jobs in Deutschland, Österreich und der Schweiz.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { q?: string; roleType?: string; city?: string; workMode?: string; seniority?: string };
}) {
  const jobs = await getLiveJobs(searchParams);

  return <JobListingPage jobs={jobs} filters={searchParams} />;
}
