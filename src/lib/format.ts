import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { dachCities, employmentTypes, labelFor, roleTypes, seniorities, workModes } from "./taxonomy";
import type { Job } from "./types";

export function formatPostedDate(date: string) {
  return `vor ${formatDistanceToNow(new Date(date), { locale: de })}`;
}

export function formatSalary(job: Pick<Job, "salary_min" | "salary_max" | "salary_currency">) {
  if (!job.salary_min && !job.salary_max) {
    return null;
  }

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: job.salary_currency,
    maximumFractionDigits: 0,
  });

  if (job.salary_min && job.salary_max) {
    return `${formatter.format(job.salary_min)} - ${formatter.format(job.salary_max)}`;
  }

  return job.salary_min
    ? `ab ${formatter.format(job.salary_min)}`
    : `bis ${formatter.format(job.salary_max ?? 0)}`;
}

export function jobLocation(job: Pick<Job, "location_city" | "work_mode">) {
  const city = labelFor(dachCities, job.location_city);
  const workMode = labelFor(workModes, job.work_mode);
  return `${city} · ${workMode}`;
}

export function roleLabel(value: string) {
  return labelFor(roleTypes, value);
}

export function cityLabel(value: string) {
  return labelFor(dachCities, value);
}

export function seniorityLabel(value: string) {
  return labelFor(seniorities, value);
}

export function employmentLabel(value: string) {
  return labelFor(employmentTypes, value);
}
