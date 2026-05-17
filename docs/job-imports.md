# Job Import Prototype

JobLayer can test external job imports without writing directly to the public job board.

The importer reads official employer career pages from `data/dax-job-sources.json`, extracts job-link metadata, filters for AI and tech roles in DACH, and writes one review file:

- `imports/dax-job-import-preview.json`: editorial review data with source metadata.

The public job overview must not read imported jobs directly. Imported roles only become public after this flow:

1. Import preview is generated.
2. Admin imports a promising role into Supabase as `pending`.
3. Admin reviews and approves the role.
4. Only approved `live` jobs appear publicly.

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

Source notes:

- SAP uses SuccessFactors category/list pages.
- Siemens uses a dedicated adapter: Germany-filtered Siemens search pages are parsed by individual result cards, and selected official JobDetail URLs can be used as stable seed inputs when the Siemens search UI is slow or broad.

For production, add source metadata columns to Supabase before inserting imported jobs:

- `source_company`
- `source_url`
- `source_external_id`
- `imported_at`

These fields are included in `supabase/migrations/002_job_source_tracking.sql`.
