-- Visitor counter (run once in the Supabase SQL Editor, after schema.sql).
-- Stores only a count per day. No IP address, no user id, no cookie.
create table if not exists public.daily_visits (
  day date primary key,
  visits int not null default 0
);
alter table public.daily_visits enable row level security;
revoke all on public.daily_visits from anon, authenticated;   -- nobody reads or writes the table directly

-- The only way to add a visit: one +1 on today's row.
create or replace function public.track_visit()
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.daily_visits (day, visits) values (current_date, 1)
  on conflict (day) do update set visits = public.daily_visits.visits + 1;
$$;
revoke all on function public.track_visit() from public;
grant execute on function public.track_visit() to anon, authenticated;

-- Public totals (read-only).
create or replace view public.visit_stats as
select coalesce(sum(visits), 0)::bigint as total_visits,
       coalesce(sum(visits) filter (where day >= current_date - 6), 0)::bigint as last_7_days,
       coalesce(sum(visits) filter (where day = current_date), 0)::bigint as today
from public.daily_visits;
revoke all on public.visit_stats from anon, authenticated;
grant select on public.visit_stats to anon, authenticated;
