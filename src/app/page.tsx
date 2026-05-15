import { JobListingPage } from "@/components/job-listing-page";
import { getLiveJobs } from "@/lib/jobs";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { roleType?: string; city?: string; workMode?: string; seniority?: string };
}) {
  const jobs = await getLiveJobs(searchParams);

  return <JobListingPage jobs={jobs} filters={searchParams} />;
}
