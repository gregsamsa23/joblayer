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
  { value: "munich", label: "München", country: "DE" },
  { value: "hamburg", label: "Hamburg", country: "DE" },
  { value: "cologne", label: "Köln", country: "DE" },
  { value: "vienna", label: "Wien", country: "AT" },
  { value: "zurich", label: "Zürich", country: "CH" },
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
  "Product",
] as const;

export const seoSegments = {
  berlin: {
    title: "AI Jobs Berlin",
    metaTitle: "AI Jobs Berlin - JobLayer",
    description:
      "Finde kuratierte AI Jobs in Berlin: LLM Engineering, Machine Learning, Data Platform und moderne Software-Rollen.",
    city: "berlin",
    intro:
      "Berlin ist einer der aktivsten AI- und Tech-Standorte in DACH: Startups, Product-Teams und Scaleups suchen Engineers, die LLM-Produkte, Datenplattformen und moderne Software-Systeme bauen.",
    focus: ["LLM- und RAG-Produkte", "AI-native SaaS-Teams", "Data Platform und MLOps", "Product Engineering"],
    audience: "Für Kandidaten, die in Berlin oder hybrid für Berliner Teams arbeiten wollen.",
    related: [
      { href: "/jobs/remote", label: "Remote AI Jobs" },
      { href: "/jobs/ai-engineer", label: "AI Engineer Jobs" },
      { href: "/jobs/machine-learning", label: "Machine Learning Jobs" },
    ],
  },
  munich: {
    title: "AI Jobs München",
    metaTitle: "AI Jobs München - JobLayer",
    description:
      "Finde AI Jobs in München: Machine Learning, Robotics, Enterprise AI, Data Engineering und moderne Tech-Rollen.",
    city: "munich",
    intro:
      "München verbindet Industrie, Forschung, Enterprise-Software und Deep-Tech. Besonders gefragt sind AI- und ML-Profile, die robuste Systeme in produktionsnahen Umgebungen entwickeln.",
    focus: ["Industrial AI", "Computer Vision und Robotics", "Enterprise AI", "Cloud- und Data Engineering"],
    audience: "Für Kandidaten mit Interesse an B2B, Industrie, Forschungstransfer und produktionsreifen AI-Systemen.",
    related: [
      { href: "/jobs/machine-learning", label: "Machine Learning Jobs" },
      { href: "/jobs/remote", label: "Remote AI Jobs" },
      { href: "/jobs/berlin", label: "AI Jobs Berlin" },
    ],
  },
  remote: {
    title: "Remote AI Jobs",
    metaTitle: "Remote AI Jobs DACH - JobLayer",
    description:
      "Finde Remote AI Jobs für die DACH-Region: AI Engineering, Machine Learning, Data und Software-Rollen.",
    workMode: "remote",
    intro:
      "Remote AI Jobs sind ideal, wenn du für starke Teams arbeiten willst, ohne an einen Standort gebunden zu sein. JobLayer fokussiert Remote-Rollen mit DACH-Bezug.",
    focus: ["Remote-first Engineering", "LLM Features und AI Workflows", "Data und MLOps", "DACH-kompatible Zeitzonen"],
    audience: "Für Kandidaten, die remote arbeiten und trotzdem regionale Marktpassung suchen.",
    related: [
      { href: "/jobs/ai-engineer", label: "AI Engineer Jobs" },
      { href: "/jobs/machine-learning", label: "Machine Learning Jobs" },
      { href: "/jobs/berlin", label: "AI Jobs Berlin" },
    ],
  },
  "machine-learning": {
    title: "Machine Learning Jobs",
    metaTitle: "Machine Learning Jobs DACH - JobLayer",
    description:
      "Finde Machine Learning Jobs in DACH: MLOps, NLP, Computer Vision, Forecasting, Data Platform und produktionsnahe ML-Systeme.",
    roleType: "machine-learning",
    intro:
      "Machine Learning Rollen bewegen sich zunehmend von Experimenten zu produktionsreifen Systemen. Gesucht werden Profile, die Modelle, Daten, Infrastruktur und Engineering-Qualität zusammenbringen.",
    focus: ["MLOps und Model Deployment", "NLP und LLM-Anwendungen", "Computer Vision", "Forecasting und Data Products"],
    audience: "Für ML Engineers, Applied Scientists und Data-Profile mit Engineering-Fokus.",
    related: [
      { href: "/jobs/ai-engineer", label: "AI Engineer Jobs" },
      { href: "/jobs/remote", label: "Remote AI Jobs" },
      { href: "/jobs/munich", label: "AI Jobs München" },
    ],
  },
  "ai-engineer": {
    title: "AI Engineer Jobs",
    metaTitle: "AI Engineer Jobs DACH - JobLayer",
    description:
      "Finde AI Engineer Jobs in DACH: LLM-Produkte, RAG-Systeme, Evaluation, AI Agents und moderne Product Engineering Rollen.",
    roleType: "ai-engineer",
    intro:
      "AI Engineering verbindet Software Engineering, Produktverständnis und moderne AI-APIs. Besonders gefragt sind Engineers, die LLM-Funktionen sicher, messbar und nutzerzentriert in Produkte bringen.",
    focus: ["LLM-Produktfeatures", "RAG und Retrieval", "Evaluation und Guardrails", "AI-native Product Engineering"],
    audience: "Für Software Engineers, die nah an AI-Produkten und echten Nutzerworkflows arbeiten wollen.",
    related: [
      { href: "/jobs/berlin", label: "AI Jobs Berlin" },
      { href: "/jobs/remote", label: "Remote AI Jobs" },
      { href: "/jobs/machine-learning", label: "Machine Learning Jobs" },
    ],
  },
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
