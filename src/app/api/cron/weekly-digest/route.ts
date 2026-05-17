import { NextResponse } from "next/server";
import { Resend } from "resend";
import { weeklyDigestTemplate } from "@/lib/email-templates";
import { hasCronConfig, hasResendConfig, siteUrl } from "@/lib/env";
import { getLiveJobs } from "@/lib/jobs";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ConfirmedAlert = {
  id: string;
  name: string;
  email: string;
};

export async function GET(request: Request) {
  if (!hasCronConfig()) {
    return NextResponse.json({ error: "Cron is not configured" }, { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasResendConfig()) {
    return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin is not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("candidate_alerts")
    .select("id,name,email")
    .not("confirmed_at", "is", null);

  if (error) {
    console.error("Failed to load confirmed candidate alerts", error);
    return NextResponse.json({ error: "Failed to load confirmed candidate alerts" }, { status: 500 });
  }

  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const jobs = (await getLiveJobs()).filter((job) => {
    if (!job.published_at) {
      return false;
    }

    return new Date(job.published_at).getTime() > cutoff;
  });

  if (!jobs.length) {
    return NextResponse.json({
      recipients: data?.length ?? 0,
      sent: 0,
      jobs: 0,
      timestamp: new Date().toISOString(),
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;

  for (const alert of (data ?? []) as ConfirmedAlert[]) {
    await resend.emails.send({
      from: "JobLayer <notifications@joblayer.de>",
      to: alert.email,
      subject: "Dein JobLayer AI Jobs Digest",
      html: weeklyDigestTemplate({ name: alert.name, jobs, baseUrl: siteUrl }),
    });
    sent += 1;
  }

  return NextResponse.json({
    recipients: data?.length ?? 0,
    sent,
    jobs: jobs.length,
    timestamp: new Date().toISOString(),
  });
}
