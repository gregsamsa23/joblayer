import type {
  DachCity,
  EmploymentType,
  JobStatus,
  RoleType,
  SalaryCurrency,
  Seniority,
  WorkMode,
} from "./taxonomy";

export type Job = {
  id: string;
  created_at: string;
  updated_at?: string | null;
  slug: string;
  status: JobStatus;
  title: string;
  company_name: string;
  company_logo_url?: string | null;
  location_city: DachCity;
  country: "DE" | "AT" | "CH";
  work_mode: WorkMode;
  employment_type: EmploymentType;
  role_type: RoleType;
  seniority: Seniority;
  description_markdown: string;
  apply_url: string;
  contact_email: string;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency: SalaryCurrency;
  tags: string[];
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  stripe_customer_email?: string | null;
  published_at?: string | null;
  expires_at?: string | null;
  admin_notes?: string | null;
};

export type JobFilters = {
  q?: string;
  roleType?: string;
  city?: string;
  workMode?: string;
  seniority?: string;
};

export type CandidateAlert = {
  name: string;
  email: string;
  preferred_role_type: string;
  preferred_city: string;
};
