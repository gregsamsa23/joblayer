import preview from "../../imports/dax-job-import-preview.json";
import type { Job } from "./types";

export type ImportPreviewRecord = {
  source_company: string;
  source_key: string;
  source_url: string;
  apply_url: string;
  recommended_status: "pending";
  confidence: "high" | "medium" | "low";
  match_reason: {
    relevance_terms: number;
    dach_location_detected: boolean;
    excluded_terms_detected: boolean;
    non_dach_location_detected?: boolean;
  };
  job: Job;
};

export type ImportPreview = {
  generated_at: string;
  guardrails: string[];
  source_reports: {
    company: string;
    source_url: string;
    status: "ok" | "failed";
    imported_candidates?: number;
    error?: string;
  }[];
  jobs: ImportPreviewRecord[];
};

export const jobImportPreview = preview as ImportPreview;

export function getImportPreviewRecord(jobId: string) {
  return jobImportPreview.jobs.find((record) => record.job.id === jobId) ?? null;
}

export function getImportPreviewJob(jobId: string) {
  return getImportPreviewRecord(jobId)?.job ?? null;
}
