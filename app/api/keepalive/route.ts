import { NextRequest, NextResponse } from "next/server";

// Called once a day by a Vercel cron job (see vercel.json). It makes one tiny read against Supabase so the
// free-plan project is never idle for a whole week (idle free projects are paused).
// It only reads a public view and returns no data, so it needs no secret.

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // If CRON_SECRET is set in Vercel, only Vercel's cron (which sends it) may call this route.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: true, skipped: "supabase not configured" });

  try {
    const res = await fetch(`${url}/rest/v1/leaderboard?select=display_name&limit=1`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
