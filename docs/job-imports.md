# Job Import Prototype

JobLayer can test external job imports without writing directly to Supabase.

The importer reads official employer career pages from `data/dax-job-sources.json`, extracts job-link metadata, filters for AI and tech roles in DACH, and writes two files:

- `imports/dax-job-import-preview.json`: editorial review data with source metadata.
- `src/lib/imported-jobs.generated.json`: normalized jobs that appear in the local fallback job overview when Supabase is not configured.

Run:

```bash
npm run import:dax-jobs
```

Important guardrails:

- Use official career pages only.
- Keep full application links on the employer site.
- Do not copy full job descriptions into JobLayer from imported pages.
- Review imported jobs before publishing them in Supabase.
- If a company exposes a stable API, prefer that over HTML parsing.

For production, add source metadata columns to Supabase before inserting imported jobs:

- `source_company`
- `source_url`
- `source_external_id`
- `imported_at`
- `import_status`
