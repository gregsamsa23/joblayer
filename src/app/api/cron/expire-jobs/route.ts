import { NextResponse } from "next/server";
import { hasCronConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!hasCronConfig()) {
    return NextResponse.json({ error: "Cron is not configured" }, { status: 503 });
  }

  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin is not configured" }, { status: 503 });
  }

  const timestamp = new Date().toISOString();
  const { data, error } = await supabase
    .from("jobs")
    .update({ status: "expired" })
    .eq("status", "live")
    .lt("expires_at", timestamp)
    .select("id");

  if (error) {
    console.error("Failed to expire jobs", error);
    return NextResponse.json({ error: "Failed to expire jobs" }, { status: 500 });
  }

  return NextResponse.json({
    expired: data?.length ?? 0,
    timestamp,
  });
}
