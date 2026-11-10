-- Study Buddy KKW: saves a signed-in student's SGPA / CGPA calculator data in their own account.
-- Run once in the Supabase SQL editor. Each student can read and change only their own row.

create table if not exists public.calculator_data (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null check (pg_column_size(data) < 30000),
  updated_at timestamptz not null default now()
);

alter table public.calculator_data enable row level security;

drop policy if exists "calculator: own row" on public.calculator_data;
create policy "calculator: own row" on public.calculator_data
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

revoke all on public.calculator_data from anon, authenticated;
grant select, insert, update, delete on public.calculator_data to authenticated;
