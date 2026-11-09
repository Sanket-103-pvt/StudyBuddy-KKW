// Supabase access. The site works without it: when the env vars are missing, login and
// contribution features are simply switched off (supabaseEnabled === false).
//
// To keep pages light on slow phones:
//  - anonymous reads (community notes, leaderboard) use a plain fetch to the REST API,
//  - the full supabase-js library is only downloaded when someone is signing in or is signed in.

import type { SupabaseClient } from "@supabase/supabase-js";

// Project URL only, e.g. https://abcd1234.supabase.co (no /rest/v1/ at the end).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

let clientPromise: Promise<SupabaseClient> | null = null;

/** Returns the shared browser client (loaded on first use), or null when Supabase is not configured. */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseEnabled) return null;
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url as string, anonKey as string, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
      })
    );
  }
  return clientPromise;
}

/** True when a Supabase session is stored in this browser or an OAuth redirect is being completed. */
export function mayHaveSession(): boolean {
  if (typeof window === "undefined" || !supabaseEnabled) return false;
  try {
    const hasStored = Object.keys(window.localStorage).some((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    const returning = new URLSearchParams(window.location.search).has("code");
    return hasStored || returning;
  } catch {
    return false;
  }
}

/** Anonymous read from a public view/table via the REST API (no library needed). */
export async function publicSelect<T>(table: string, params: Record<string, string>): Promise<T[]> {
  if (!supabaseEnabled) return [];
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      // Only the apikey header: works for both legacy anon keys and the newer sb_publishable_ keys (which are not JWTs).
      headers: { apikey: anonKey as string },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

/** Calls a database function via the REST API (no library needed). Returns true on success. */
export async function publicRpc(fn: string): Promise<boolean> {
  if (!supabaseEnabled) return false;
  try {
    const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { apikey: anonKey as string, "Content-Type": "application/json" },
      body: "{}",
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
