import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendAdminJobNotification } from "@/lib/notifications";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2025-02-24.acacia",
  });
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe webhook configuration." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const jobId = session.metadata?.job_id;
    const supabase = createSupabaseAdminClient();

    if (jobId && supabase) {
      const { data } = await supabase
        .from("jobs")
        .update({
          status: "pending",
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          stripe_customer_email: session.customer_details?.email ?? session.customer_email,
        })
        .eq("id", jobId)
        .select("title, company_name, slug, contact_email")
        .single();

      if (data) {
        await sendAdminJobNotification(data);
      }
    }
  }

  return NextResponse.json({ received: true });
}
