export const roleTypes = [
  { value: "ai-engineer", label: "AI Engineer" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "data-engineering", label: "Data Engineering" },
  { value: "software-engineering", label: "Software Engineering" },
  { value: "product", label: "Product & Design" },
  { value: "security", label: "Security" },
] as const;

export const dachCities = [
  { value: "berlin", label: "Berlin", country: "DE" },
  { value: "munich", label: "Munich", country: "DE" },
  { value: "hamburg", label: "Hamburg", country: "DE" },
  { value: "cologne", label: "Cologne", country: "DE" },
  { value: "vienna", label: "Vienna", country: "AT" },
  { value: "zurich", label: "Zurich", country: "CH" },
  { value: "remote-dach", label: "Remote DACH", country: "DE" },
] as const;

export const workModes = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "Vor Ort" },
] as const;

export const seniorities = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
] as const;

export const employmentTypes = [
  { value: "full-time", label: "Vollzeit" },
  { value: "part-time", label: "Teilzeit" },
  { value: "contract", label: "Freelance/Contract" },
] as const;

export const tagOptions = [
  "Python",
  "LLM",
  "RAG",
  "React",
  "TypeScript",
  "Next.js",
  "MLOps",
  "Data Platform",
  "NLP",
  "Computer Vision",
  "Cloud",
  "Security",
] as const;

export const seoSegments = {
  berlin: { title: "AI Jobs Berlin", city: "berlin" },
  munich: { title: "AI Jobs Munich", city: "munich" },
  remote: { title: "Remote AI Jobs", workMode: "remote" },
  "machine-learning": { title: "Machine Learning Jobs", roleType: "machine-learning" },
  "ai-engineer": { title: "AI Engineer Jobs", roleType: "ai-engineer" },
} as const;

export type RoleType = (typeof roleTypes)[number]["value"];
export type DachCity = (typeof dachCities)[number]["value"];
export type WorkMode = (typeof workModes)[number]["value"];
export type Seniority = (typeof seniorities)[number]["value"];
export type EmploymentType = (typeof employmentTypes)[number]["value"];
export type SalaryCurrency = "EUR" | "CHF";
export type JobStatus = "draft" | "pending" | "live" | "expired" | "rejected";

export function labelFor<T extends readonly { value: string; label: string }[]>(
  items: T,
  value?: string | null,
) {
  return items.find((item) => item.value === value)?.label ?? value ?? "";
}
