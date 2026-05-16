import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourcesPath = path.join(rootDir, "data", "dax-job-sources.json");
const previewPath = path.join(rootDir, "imports", "dax-job-import-preview.json");
const generatedJobsPath = path.join(rootDir, "src", "lib", "imported-jobs.generated.json");

const maxJobsPerSource = Number(readArg("--max-per-source") ?? 12);
const maxTotalJobs = Number(readArg("--max-total") ?? 30);

const relevantTerms = [
  "ai",
  "artificial intelligence",
  "agentic",
  "genai",
  "generative ai",
  "llm",
  "machine learning",
  "ml engineer",
  "mlops",
  "data scientist",
  "data engineer",
  "data platform",
  "analytics engineer",
  "software engineer",
  "developer",
  "cloud engineer",
  "platform engineer",
  "security engineer",
  "product manager",
  "computer vision",
  "nlp",
  "knowledge graph",
];

const excludeTerms = [
  "intern",
  "internship",
  "praktikum",
  "thesis",
  "werkstudent",
  "working student",
  "apprentice",
  "ausbildung",
  "sales",
  "account executive",
  "skip to",
  "français",
  "nederlands",
  "portuguese",
  "english",
  "deutsch",
  "search jobs",
  "job search",
  "privacy",
  "terms",
];

const nonDachLocationTerms = [
  "montreal",
  "riyadh",
  "bucharest",
  "budapest",
  "prague",
  "sofia",
  "jakarta",
  "dubai",
  "pune",
  "buenos aires",
  "mexico",
  "singapore",
  "bangalore",
  "bengaluru",
  "paris",
  "london",
  "amsterdam",
  "milan",
  "madrid",
  "vancouver",
  "british columbia",
];

const cityPatterns = [
  { value: "berlin", country: "DE", terms: ["berlin"] },
  { value: "munich", country: "DE", terms: ["munich", "muenchen", "münchen", "garching"] },
  { value: "hamburg", country: "DE", terms: ["hamburg"] },
  { value: "cologne", country: "DE", terms: ["cologne", "koeln", "köln"] },
  { value: "vienna", country: "AT", terms: ["vienna", "wien"] },
  { value: "zurich", country: "CH", terms: ["zurich", "zürich", "zuerich"] },
  {
    value: "remote-dach",
    country: "DE",
    terms: ["remote dach", "germany", "deutschland", "austria", "switzerland", "walldorf", "potsdam", "st. leon-rot"],
  },
];

const tagRules = [
  ["Python", ["python"]],
  ["LLM", ["llm", "large language", "generative ai", "genai"]],
  ["RAG", ["rag", "retrieval"]],
  ["React", ["react"]],
  ["TypeScript", ["typescript", "javascript"]],
  ["Next.js", ["next.js", "nextjs"]],
  ["MLOps", ["mlops", "model deployment", "model ops"]],
  ["Data Platform", ["data platform", "data engineering", "data engineer"]],
  ["NLP", ["nlp", "natural language"]],
  ["Computer Vision", ["computer vision", "vision"]],
  ["Cloud", ["cloud", "aws", "azure", "gcp", "kubernetes"]],
  ["Security", ["security", "cybersecurity", "privacy"]],
  ["Product", ["product manager", "product owner", "product"]],
];

function readArg(name) {
  const raw = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return raw?.split("=").slice(1).join("=");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeUrlText(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&uuml;", "ue")
    .replaceAll("&Uuml;", "Ue")
    .replaceAll("&ouml;", "oe")
    .replaceAll("&Ouml;", "Oe")
    .replaceAll("&auml;", "ae")
    .replaceAll("&Auml;", "Ae")
    .replaceAll("&szlig;", "ss");
}

function stripTags(value) {
  return normalizeWhitespace(decodeEntities(value.replace(/<[^>]+>/g, " ")));
}

function absolutizeUrl(href, baseUrl) {
  try {
    return new URL(decodeEntities(href), baseUrl).toString();
  } catch {
    return null;
  }
}

function hash(input) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0).toString(36);
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function containsAny(haystack, terms) {
  const lower = haystack.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function inferCity(candidate) {
  const primary = `${candidate.title} ${decodeUrlText(candidate.url ?? "")}`.toLowerCase();
  const fallback = `${primary} ${candidate.context}`.toLowerCase();
  const primaryCity = cityPatterns.find((city) => city.terms.some((term) => primary.includes(term)));
  if (primaryCity) return primaryCity;

  return (
    cityPatterns.find((city) => city.terms.some((term) => fallback.includes(term))) ?? {
      value: "remote-dach",
      country: "DE",
    }
  );
}

function hasDachSignal(candidate) {
  const primary = `${candidate.title} ${decodeUrlText(candidate.url ?? "")}`.toLowerCase();
  const fallback = `${primary} ${candidate.context}`.toLowerCase();
  return cityPatterns.some((city) => city.terms.some((term) => primary.includes(term) || fallback.includes(term)));
}

function hasNonDachSignal(candidate) {
  const primary = `${candidate.title} ${decodeUrlText(candidate.url ?? "")}`.toLowerCase();
  return nonDachLocationTerms.some((term) => primary.includes(term));
}

function inferRoleType(context) {
  const lower = context.toLowerCase();
  if (/(machine learning|ml engineer|mlops|computer vision|nlp|data scientist)/.test(lower)) return "machine-learning";
  if (/(data engineer|data platform|analytics engineer|data architect)/.test(lower)) return "data-engineering";
  if (/(security|cybersecurity|privacy)/.test(lower)) return "security";
  if (/(product manager|product owner|product designer|ux)/.test(lower)) return "product";
  if (/(ai|artificial intelligence|genai|generative ai|llm|agentic|knowledge graph)/.test(lower)) return "ai-engineer";
  return "software-engineering";
}

function inferSeniority(context) {
  const lower = context.toLowerCase();
  if (/(principal|lead|staff|head of|director)/.test(lower)) return "lead";
  if (/(senior|sr\.)/.test(lower)) return "senior";
  if (/(junior|graduate|entry level)/.test(lower)) return "junior";
  return "mid";
}

function inferWorkMode(context) {
  const lower = context.toLowerCase();
  if (/(remote|home office|homeoffice)/.test(lower)) return "remote";
  if (/(hybrid|flexible work|mobile working)/.test(lower)) return "hybrid";
  return "onsite";
}

function inferEmploymentType(context) {
  const lower = context.toLowerCase();
  if (/(part time|part-time|teilzeit)/.test(lower)) return "part-time";
  if (/(contract|freelance|temporary|befristet)/.test(lower)) return "contract";
  return "full-time";
}

function inferTags(context) {
  const lower = context.toLowerCase();
  const tags = tagRules
    .filter(([, terms]) => terms.some((term) => lower.includes(term)))
    .map(([tag]) => tag);

  return [...new Set(tags)].slice(0, 5);
}

function scoreCandidate(candidate) {
  const haystack = `${candidate.title} ${candidate.context}`;
  const relevance = relevantTerms.filter((term) => haystack.toLowerCase().includes(term)).length;
  const dach = hasDachSignal(candidate);
  const excluded = containsAny(haystack, excludeTerms);
  const nonDach = hasNonDachSignal(candidate);

  return {
    score: relevance + (dach ? 2 : 0) - (excluded ? 3 : 0) - (nonDach ? 5 : 0),
    relevance,
    dach,
    excluded,
    nonDach,
  };
}

function extractAnchorCandidates(html, source) {
  const cleanHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const anchors = [...cleanHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];

  return anchors
    .map((match) => {
      const [raw, href, body] = match;
      const title = stripTags(body);
      const url = absolutizeUrl(href, source.sourceUrl);
      const rawIndex = match.index ?? 0;
      const context = stripTags(cleanHtml.slice(Math.max(0, rawIndex - 500), rawIndex + raw.length + 500));

      return {
        title,
        url,
        context,
      };
    })
    .filter((candidate) => candidate.url && candidate.title.length >= 8 && candidate.title.length <= 140)
    .filter((candidate) => !containsAny(candidate.title, excludeTerms))
    .filter((candidate) => {
      if (source.sourceType === "successfactors-list") return candidate.url.includes("/job/");
      return isLikelyJobDetailUrl(candidate.url ?? "", source);
    });
}

function isLikelyJobDetailUrl(candidateUrl, source) {
  if (candidateUrl === source.sourceUrl || candidateUrl.includes("#")) return false;
  if (/SearchJobs|jobsearch|jobfinder\.html|careers\?query/i.test(candidateUrl)) return false;

  return /JobDetail|\/job\/|\/jobs\/[^/?#]+|jobfinder\/job|jobangebot|requisition/i.test(candidateUrl);
}

function dedupeCandidates(candidates) {
  const byUrl = new Map();
  for (const candidate of candidates) {
    if (!candidate.url || byUrl.has(candidate.url)) continue;
    byUrl.set(candidate.url, candidate);
  }
  return [...byUrl.values()];
}

async function fetchSource(source) {
  const response = await fetch(source.sourceUrl, {
    headers: {
      "accept": "text/html,application/xhtml+xml",
      "user-agent": "JobLayerImportPreview/0.1 (+https://joblayer.de; editorial preview)",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function toPreviewRecord(candidate, source) {
  const city = inferCity(candidate);
  const roleType = inferRoleType(`${candidate.title} ${candidate.context}`);
  const tags = inferTags(`${candidate.title} ${candidate.context}`);
  const now = new Date().toISOString();
  const sourceId = hash(`${source.companyName}:${candidate.url}`);
  const title = normalizeWhitespace(candidate.title);

  const job = {
    id: `import-${sourceId}`,
    created_at: now,
    slug: slugify(`${title}-${source.companyName}-${sourceId}`),
    status: "live",
    title,
    company_name: source.companyName,
    company_logo_url: null,
    location_city: city.value,
    country: city.country,
    work_mode: inferWorkMode(candidate.context),
    employment_type: inferEmploymentType(candidate.context),
    role_type: roleType,
    seniority: inferSeniority(`${title} ${candidate.context}`),
    description_markdown: [
      `Diese Rolle wurde als Import-Preview aus der offiziellen Karriereseite von ${source.companyName} erkannt.`,
      "",
      "Die vollstaendige Stellenbeschreibung bleibt beim Arbeitgeber. Bitte vor einer Veroeffentlichung redaktionell pruefen und bei Bedarf eine eigene kurze Zusammenfassung verfassen.",
    ].join("\n"),
    apply_url: candidate.url,
    contact_email: "import-preview@joblayer.de",
    salary_min: null,
    salary_max: null,
    salary_currency: city.country === "CH" ? "CHF" : "EUR",
    tags,
    published_at: now,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    admin_notes: `Import preview from ${source.companyName}. Source: ${candidate.url}`,
  };

  const score = scoreCandidate(candidate);

  return {
    source_company: source.companyName,
    source_key: source.companyKey,
    source_url: source.sourceUrl,
    apply_url: candidate.url,
    recommended_status: "pending",
    confidence: score.score >= 4 ? "high" : "medium",
    match_reason: {
      relevance_terms: score.relevance,
      dach_location_detected: score.dach,
      excluded_terms_detected: score.excluded,
      non_dach_location_detected: score.nonDach,
    },
    job,
  };
}

async function run() {
  const sources = JSON.parse(await readFile(sourcesPath, "utf8"));
  const previewRecords = [];
  const sourceReports = [];

  for (const source of sources) {
    try {
      const html = await fetchSource(source);
      const candidates = dedupeCandidates(extractAnchorCandidates(html, source))
        .map((candidate) => ({ candidate, score: scoreCandidate(candidate) }))
        .filter(({ score }) => score.score >= 2 && score.relevance > 0 && score.dach && !score.excluded && !score.nonDach)
        .sort((left, right) => right.score.score - left.score.score)
        .slice(0, maxJobsPerSource)
        .map(({ candidate }) => candidate);

      const records = candidates.map((candidate) => toPreviewRecord(candidate, source));
      previewRecords.push(...records);
      sourceReports.push({
        company: source.companyName,
        source_url: source.sourceUrl,
        status: "ok",
        imported_candidates: records.length,
      });
    } catch (error) {
      sourceReports.push({
        company: source.companyName,
        source_url: source.sourceUrl,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const uniqueRecords = dedupePreviewRecords(previewRecords).slice(0, maxTotalJobs);
  const generatedJobs = uniqueRecords.map((record) => record.job);

  await mkdir(path.dirname(previewPath), { recursive: true });
  await writeFile(
    previewPath,
    `${JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        guardrails: [
          "Official employer career pages only.",
          "Imported descriptions are placeholders; do not copy full external job text.",
          "Review each role before publishing to Supabase.",
        ],
        source_reports: sourceReports,
        jobs: uniqueRecords,
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(generatedJobsPath, `${JSON.stringify(generatedJobs, null, 2)}\n`);

  console.log(`Imported ${generatedJobs.length} preview jobs.`);
  console.log(`Preview: ${path.relative(rootDir, previewPath)}`);
  console.log(`Local UI data: ${path.relative(rootDir, generatedJobsPath)}`);
}

function dedupePreviewRecords(records) {
  const byApplyUrl = new Map();
  for (const record of records) {
    if (byApplyUrl.has(record.apply_url)) continue;
    byApplyUrl.set(record.apply_url, record);
  }
  return [...byApplyUrl.values()];
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
