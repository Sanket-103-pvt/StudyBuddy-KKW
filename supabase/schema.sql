-- Study Buddy KKW: database schema for contributions, reports and the leaderboard.
-- Run this ONCE in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Security: every table has Row Level Security. The website talks to the database with the public
-- "anon" key, and these rules decide who can read or write what.

-- ── Profiles (one row per signed-in student, created automatically on first login) ──────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
                  nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
                  'Student'), 80)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Admins ─────────────────────────────────────────────────────────────────────────────────────
-- Only you. Add yourself once after your first Google login (see the bottom of this file).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ── Submissions (resource links and timetables sent by students) ────────────────────────────────
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('resource', 'timetable')),
  year text not null check (year in ('first-year', 'second-year', 'third-year', 'fourth-year')),
  subject_id text check (char_length(subject_id) <= 100),
  unit_number int check (unit_number between 1 and 10),
  title text not null check (char_length(title) between 3 and 120),
  url text not null check (url ~* '^https?://[^[:space:]]+$' and char_length(url) <= 500),
  note_type text not null default 'other' check (note_type in ('handwritten', 'typed', 'ai_generated', 'other')),
  description text check (char_length(description) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  points int not null default 0 check (points between 0 and 100),
  admin_note text check (char_length(admin_note) <= 300),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint resource_needs_subject check (kind <> 'resource' or subject_id is not null)
);
create index if not exists submissions_status_idx on public.submissions (status, created_at);
create index if not exists submissions_user_idx on public.submissions (user_id);

-- ── Broken link reports ─────────────────────────────────────────────────────────────────────────
create table if not exists public.link_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  subject_id text not null check (char_length(subject_id) between 1 and 100),
  resource_label text check (char_length(resource_label) <= 200),
  url text not null check (url ~* '^https?://[^[:space:]]+$' and char_length(url) <= 500),
  reason text check (char_length(reason) <= 300),
  status text not null default 'open' check (status in ('open', 'valid', 'invalid')),
  points int not null default 0 check (points between 0 and 2),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id, url)
);
create index if not exists link_reports_status_idx on public.link_reports (status, created_at);

-- ── Row Level Security ──────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.submissions enable row level security;
alter table public.link_reports enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- admins table: nobody can read or write it through the website (only the SQL editor can).

drop policy if exists "submissions: read own or admin" on public.submissions;
create policy "submissions: read own or admin" on public.submissions
  for select using (user_id = auth.uid() or public.is_admin());

-- A student can only create a PENDING submission for themselves, with no points and no admin fields,
-- and at most 10 pending ones at a time (spam brake).
drop policy if exists "submissions: students insert pending" on public.submissions;
create policy "submissions: students insert pending" on public.submissions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and points = 0
    and admin_note is null
    and reviewed_at is null
    and (select count(*) from public.submissions s where s.user_id = auth.uid() and s.status = 'pending') < 10
  );

drop policy if exists "submissions: admin review" on public.submissions;
create policy "submissions: admin review" on public.submissions
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "submissions: delete own pending or admin" on public.submissions;
create policy "submissions: delete own pending or admin" on public.submissions
  for delete using ((user_id = auth.uid() and status = 'pending') or public.is_admin());

drop policy if exists "reports: read own or admin" on public.link_reports;
create policy "reports: read own or admin" on public.link_reports
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "reports: students insert open" on public.link_reports;
create policy "reports: students insert open" on public.link_reports
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and status = 'open'
    and points = 0
    and reviewed_at is null
    and (select count(*) from public.link_reports r where r.user_id = auth.uid() and r.status = 'open') < 20
  );

drop policy if exists "reports: admin review" on public.link_reports;
create policy "reports: admin review" on public.link_reports
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports: admin delete" on public.link_reports;
create policy "reports: admin delete" on public.link_reports
  for delete using (public.is_admin());

-- ── Public read-only views (what visitors without login can see) ────────────────────────────────
-- Approved resources with the contributor's display name.
create or replace view public.community_resources as
select s.id, s.year, s.subject_id, s.unit_number, s.title, s.url, s.note_type, s.description,
       p.display_name as contributor_name, s.created_at
from public.submissions s
join public.profiles p on p.id = s.user_id
where s.status = 'approved' and s.kind = 'resource';

create or replace view public.community_timetables as
select s.id, s.year, s.title, s.url, p.display_name as contributor_name, s.created_at
from public.submissions s
join public.profiles p on p.id = s.user_id
where s.status = 'approved' and s.kind = 'timetable';

-- Leaderboard: only points an admin has given. Nobody can give points to themselves.
create or replace view public.leaderboard as
select p.display_name,
       coalesce(s.pts, 0) + coalesce(r.pts, 0) as points,
       coalesce(s.cnt, 0) as approved_resources,
       coalesce(r.cnt, 0) as valid_reports
from public.profiles p
left join (
  select user_id, sum(points) as pts, count(*) as cnt
  from public.submissions where status = 'approved' group by user_id
) s on s.user_id = p.id
left join (
  select user_id, sum(points) as pts, count(*) as cnt
  from public.link_reports where status = 'valid' group by user_id
) r on r.user_id = p.id
where coalesce(s.cnt, 0) + coalesce(r.cnt, 0) > 0
order by points desc, p.display_name
limit 100;

-- ── Privileges ──────────────────────────────────────────────────────────────────────────────────
revoke all on public.profiles, public.admins, public.submissions, public.link_reports from anon, authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.submissions to authenticated;
grant select, insert, update, delete on public.link_reports to authenticated;

revoke all on public.community_resources, public.community_timetables, public.leaderboard from anon, authenticated;
grant select on public.community_resources, public.community_timetables, public.leaderboard to anon, authenticated;

-- ── After your FIRST Google login on the site, make yourself admin ──────────────────────────────
-- Replace the email, then run just this line in the SQL Editor:
--   insert into public.admins (user_id) select id from auth.users where email = 'your-email@gmail.com';
