# JobLayer Deployment Checklist

Use this checklist when moving from local MVP to a public launch on `joblayer.de`.

## 1. GitHub

- Create a GitHub account if needed.
- Create a new private repository named `joblayer`.
- Push the local project to that repository.
- Confirm `.env.local`, `.next`, and `node_modules` are not committed.
- Confirm `.env.example`, `README.md`, and `supabase/migrations/001_initial_schema.sql` are committed.

Suggested first commit message:

```text
Initial JobLayer MVP
```

## 2. Supabase

- Create a new Supabase project.
- Run `supabase/migrations/001_initial_schema.sql` in the SQL Editor.
- Create the first admin user under Authentication.
- Copy these values:
  - Project URL
  - Anon public key
  - Service role key
- Add them to local `.env.local`.

## 3. Stripe

- Create a product for one JobLayer job listing.
- Create a one-time `149 EUR` price.
- Copy the Price ID.
- Use test mode first.
- After Vercel is live, create the webhook endpoint:

```text
https://joblayer.de/api/stripe/webhook
```

- Listen for `checkout.session.completed`.
- Copy the webhook signing secret.

## 4. Resend

- Create a Resend account.
- Verify the sender domain when DNS is ready.
- Add a production API key.
- Choose the admin recipient email.
- Test that a paid Stripe checkout sends an admin notification.

## 5. Vercel

- Create or log into a Vercel account.
- Import the GitHub repository.
- Use the default Next.js settings.
- Add all environment variables from `.env.example`.
- Set `NEXT_PUBLIC_SITE_URL` to:

```text
https://joblayer.de
```

- Deploy.
- Confirm `npm run build` succeeds in Vercel.

## 6. Domain

- Register or access `joblayer.de`.
- Add the domain in Vercel.
- Follow Vercel DNS instructions.
- Wait for SSL to become active.
- Confirm these URLs work:
  - `https://joblayer.de`
  - `https://joblayer.de/jobs`
  - `https://joblayer.de/post-job`
  - `https://joblayer.de/admin`
  - `https://joblayer.de/sitemap.xml`
  - `https://joblayer.de/robots.txt`

## 7. Launch QA

- Submit a job with Stripe test mode.
- Confirm the job is stored as `pending`.
- Confirm admin notification email arrives.
- Log into `/admin`.
- Approve the job.
- Confirm it appears on `/jobs`.
- Confirm the job detail page opens.
- Confirm `Jetzt bewerben` opens the external apply URL.
- Submit a candidate alert.
- Confirm it is stored in Supabase.
- Check mobile layout for listing, detail, post-job, alerts, and admin.

## 8. Before Public Traffic

- Replace legal placeholders for Impressum, Datenschutz, and AGB.
- Switch Stripe from test mode to live mode.
- Replace test env vars in Vercel with live env vars.
- Verify Resend sending domain.
- Add at least 5-10 seed jobs or manually approved listings.
- Create a simple sales list for first employer outreach.
