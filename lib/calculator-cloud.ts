// Saves the calculator in the student's own account (table public.calculator_data, see supabase/calculator.sql).
// Used only while signed in; everyone else keeps the data on their own device.

import { getSupabase } from "@/lib/supabase";
import { parseCalculatorData, type CalculatorData } from "@/lib/calculator-utils";

export async function loadCalculatorFromCloud(): Promise<{ data: CalculatorData | null; error: boolean }> {
  const sb = await getSupabase();
  if (!sb) return { data: null, error: true };
  const { data, error } = await sb.from("calculator_data").select("data").maybeSingle();
  if (error) return { data: null, error: true };
  return { data: data ? parseCalculatorData((data as { data: unknown }).data) : null, error: false };
}

export async function saveCalculatorToCloud(value: CalculatorData): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;
  const { data: sess } = await sb.auth.getSession();
  const uid = sess.session?.user.id;
  if (!uid) return false;
  const { error } = await sb
    .from("calculator_data")
    .upsert({ user_id: uid, data: value, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  return !error;
}
