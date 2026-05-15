import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { getLiveJobs } from "@/lib/jobs";
import { seoSegments } from "@/lib/taxonomy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getLiveJobs();
  const staticRoutes = ["", "/jobs", "/post-job", "/alerts", "/impressum", "/datenschutz", "/agb"];
  const seoRoutes = Object.keys(seoSegments).map((segment) => `/jobs/${segment}`);
  const jobRoutes = jobs.map((job) => `/job/${job.slug}`);

  return [...staticRoutes, ...seoRoutes, ...jobRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
