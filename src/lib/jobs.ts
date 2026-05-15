import { unstable_noStore as noStore } from "next/cache";
import { dachCities } from "./taxonomy";
import { sampleJobs } from "./sample-data";
import type { Job, JobFilters } from "./types";
import { createSupabaseAdminClient } from "./supabase/admin";

function isVisible(job: Job) {
  return (
    job.status === "live" &&
    (!job.expires_at || new Date(job.expires_at).getTime() > Date.now())
  );
}

function matchesFilters(job: Job, filters: JobFilters) {
  return (
    (!filters.roleType || job.role_type === filters.roleType) &&
    (!filters.city || job.location_city === filters.city) &&
    (!filters.workMode || job.work_mode === filters.workMode) &&
    (!filters.seniority || job.seniority === filters.seniority)
  );
}

export async function getLiveJobs(filters: JobFilters = {}) {
  noStore();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return sampleJobs.filter((job) => isVisible(job) && matchesFilters(job, filters));
  }

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "live")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("published_at", { ascending: false });

  if (filters.roleType) query = query.eq("role_type", filters.roleType);
  if (filters.city) query = query.eq("location_city", filters.city);
  if (filters.workMode) query = query.eq("work_mode", filters.workMode);
  if (filters.seniority) query = query.eq("seniority", filters.seniority);

  const { data, error } = await query;
  if (error) {
    console.error("Failed to load jobs", error);
    return sampleJobs.filter((job) => isVisible(job) && matchesFilters(job, filters));
  }

  return data as Job[];
}

export async function getJobBySlug(slug: string) {
  noStore();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return sampleJobs.find((job) => job.slug === slug && isVisible(job)) ?? null;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();

  if (error) {
    console.error("Failed to load job", error);
    return sampleJobs.find((job) => job.slug === slug && isVisible(job)) ?? null;
  }

  if (!data || !isVisible(data as Job)) {
    return null;
  }

  return data as Job;
}

export async function getAdminJobs() {
  noStore();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return sampleJobs;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load admin jobs", error);
    return [];
  }

  return data as Job[];
}

export function countryForCity(city: string) {
  return dachCities.find((item) => item.value === city)?.country ?? "DE";
}
