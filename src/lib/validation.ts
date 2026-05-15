import { z } from "zod";
import {
  dachCities,
  employmentTypes,
  roleTypes,
  seniorities,
  tagOptions,
  workModes,
} from "./taxonomy";

const values = <T extends readonly { value: string }[]>(items: T) =>
  items.map((item) => item.value) as [T[number]["value"], ...T[number]["value"][]];

export const jobSubmissionSchema = z
  .object({
    company_name: z.string().min(2, "Bitte gib den Unternehmensnamen an."),
    company_logo_url: z
      .string()
      .url("Bitte gib eine gueltige Logo-URL an.")
      .optional()
      .or(z.literal("")),
    title: z.string().min(4, "Bitte gib einen Jobtitel an."),
    role_type: z.enum(values(roleTypes)),
    location_city: z.enum(values(dachCities)),
    work_mode: z.enum(values(workModes)),
    employment_type: z.enum(values(employmentTypes)),
    seniority: z.enum(values(seniorities)),
    description_markdown: z.string().min(120, "Bitte beschreibe die Rolle etwas ausfuehrlicher."),
    apply_url: z.string().url("Bitte gib eine gueltige Bewerbungs-URL an."),
    contact_email: z.string().email("Bitte gib eine gueltige Kontakt-E-Mail an."),
    salary_min: z.coerce.number().int().positive().optional().or(z.literal("")),
    salary_max: z.coerce.number().int().positive().optional().or(z.literal("")),
    salary_currency: z.enum(["EUR", "CHF"]).default("EUR"),
    tags: z.array(z.enum(tagOptions)).min(1, "Bitte waehle mindestens einen Tag.").max(6),
  })
  .refine(
    (data) =>
      !data.salary_min ||
      !data.salary_max ||
      Number(data.salary_min) <= Number(data.salary_max),
    {
      message: "Das maximale Gehalt muss groesser als das minimale Gehalt sein.",
      path: ["salary_max"],
    },
  );

export const candidateAlertSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen an."),
  email: z.string().email("Bitte gib eine gueltige E-Mail-Adresse an."),
  preferred_role_type: z.enum(values(roleTypes)),
  preferred_city: z.enum(values(dachCities)),
});

export function parseJobForm(formData: FormData) {
  return jobSubmissionSchema.parse({
    company_name: formData.get("company_name"),
    company_logo_url: formData.get("company_logo_url") || "",
    title: formData.get("title"),
    role_type: formData.get("role_type"),
    location_city: formData.get("location_city"),
    work_mode: formData.get("work_mode"),
    employment_type: formData.get("employment_type"),
    seniority: formData.get("seniority"),
    description_markdown: formData.get("description_markdown"),
    apply_url: formData.get("apply_url"),
    contact_email: formData.get("contact_email"),
    salary_min: formData.get("salary_min") || "",
    salary_max: formData.get("salary_max") || "",
    salary_currency: formData.get("salary_currency") || "EUR",
    tags: formData.getAll("tags"),
  });
}

export function parseCandidateAlertForm(formData: FormData) {
  return candidateAlertSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    preferred_role_type: formData.get("preferred_role_type"),
    preferred_city: formData.get("preferred_city"),
  });
}
