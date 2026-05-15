import { NextResponse } from "next/server";
import Stripe from "stripe";
import { hasStripeConfig, siteUrl } from "@/lib/env";
import { countryForCity } from "@/lib/jobs";
import { sendAdminJobNotification } from "@/lib/notifications";
import { jobSlug } from "@/lib/slug";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { parseJobForm } from "@/lib/validation";

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    const job = parseJobForm(formData);
    const supabase = createSupabaseAdminClient();
    const slug = jobSlug(job.title, job.company_name, job.location_city);
    const draft = {
      ...job,
      slug,
      status: "draft",
      country: countryForCity(job.location_city),
      company_logo_url: job.company_logo_url || null,
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,
    };

    let jobId = crypto.randomUUID();

    if (supabase) {
      const { data, error } = await supabase.from("jobs").insert(draft).select("id").single();

      if (error) {
        throw new Error(error.message);
      }

      jobId = data.id;
    }

    if (!hasStripeConfig()) {
      if (supabase) {
        await supabase.from("jobs").update({ status: "pending" }).eq("id", jobId);
      }

      await sendAdminJobNotification({
        title: job.title,
        company_name: job.company_name,
        slug,
        contact_email: job.contact_email,
      });

      return NextResponse.redirect(`${siteUrl}/post-job/success?dev=1`, 303);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer_email: job.contact_email,
      success_url: `${siteUrl}/post-job/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/post-job/cancel`,
      metadata: {
        job_id: jobId,
        slug,
      },
    });

    if (supabase) {
      await supabase
        .from("jobs")
        .update({ stripe_checkout_session_id: session.id })
        .eq("id", jobId);
    }

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Die Einreichung konnte nicht verarbeitet werden.";
    return NextResponse.redirect(`${siteUrl}/post-job?error=${encodeURIComponent(message)}`, 303);
  }
}
