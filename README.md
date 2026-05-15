# JobLayer

JobLayer is a niche job board for AI and tech roles in the DACH region, built for `joblayer.de`.

The MVP is a German-language Next.js application with public job discovery, paid employer submissions, candidate alert signup, SEO landing pages, and a protected admin moderation view.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase for database and admin auth
- Stripe Checkout for paid job listings
- Resend for email notifications
- Vercel for hosting

## Features

- Public job listing with filters for role type, city, work mode, and seniority
- Job detail pages with Markdown descriptions and external apply links
- Employer submit form with Stripe Checkout gate
- Paid jobs are stored as `pending` until admin approval
- Candidate email alert signup
- Admin dashboard for approving, rejecting, expiring, and restoring jobs
- SEO pages for Berlin, Munich, remote, machine learning, and AI engineer jobs
- Sitemap, robots.txt, Open Graph metadata, and basic JobPosting structured data
- Legal placeholder pages for Impressum, Datenschutz, and AGB

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Without Supabase, Stripe, and Resend keys, the app still renders public pages with sample jobs. The employer submit flow redirects to the success page in development mode when Stripe is not configured.

## Environment Variables

Copy `.env.example` to `.env.local` locally and add the same values in Vercel for production.

```env
NEXT_PUBLIC_SITE_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

RESEND_API_KEY=
ADMIN_EMAIL=
```

Production values:

- `NEXT_PUBLIC_SITE_URL`: `https://joblayer.de`
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key, server-only
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `STRIPE_PRICE_ID`: Stripe Price ID for the 149 EUR listing product
- `RESEND_API_KEY`: Resend API key
- `ADMIN_EMAIL`: email address that receives paid listing notifications

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Create the first admin user in Supabase Auth.
5. Add the Supabase env vars locally and in Vercel.

The app uses Supabase Auth for `/admin` and the service role key for trusted server-side inserts and moderation actions.

## Stripe Setup

1. Create a Stripe product named `JobLayer Job Listing`.
2. Add a recurring-free one-time price of `149 EUR`.
3. Copy the Price ID into `STRIPE_PRICE_ID`.
4. Create a webhook endpoint:

```text
https://joblayer.de/api/stripe/webhook
```

5. Subscribe the webhook to:

```text
checkout.session.completed
```

6. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Resend Setup

1. Create a Resend account.
2. Verify the sending domain or use a verified test sender during development.
3. Add `RESEND_API_KEY`.
4. Add `ADMIN_EMAIL`.

The MVP sends an admin notification after Stripe confirms payment. The weekly candidate digest template exists, but no scheduler is wired yet.

## Deployment

Recommended deployment flow:

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add all production environment variables in Vercel.
4. Deploy.
5. Connect `joblayer.de` to the Vercel project.
6. Configure Stripe webhook URL after the production URL is live.
7. Run an end-to-end test with Stripe test mode.

See `docs/deployment-checklist.md` for the full launch checklist.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
```

## MVP Notes

- Employer accounts are intentionally out of scope.
- Applications happen externally through the employer apply URL.
- Jobs go live only after admin approval.
- Listings are live for 30 days after approval.
- Legal pages are placeholders and must be finalized before public launch.
