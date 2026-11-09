-- Only KKWagh college emails can create an account. Run once in the Supabase SQL Editor.
-- Existing accounts (for example the admin) keep working. A trigger on auth.users rejects NEW sign-ups
-- unless the email ends with @kkwagh.edu.in or is on the allowlist below.

create table if not exists public.email_allowlist (
  email text primary key check (email = lower(email))
);
alter table public.email_allowlist enable row level security;
revoke all on public.email_allowlist from anon, authenticated;

create or replace function public.enforce_kkw_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) like '%@kkwagh.edu.in'
     or lower(new.email) like '%.kkwagh.edu.in'
     or exists (select 1 from public.email_allowlist a where a.email = lower(new.email)) then
    return new;
  end if;
  raise exception 'Only KKWagh college email accounts can sign up.';
end;
$$;

drop trigger if exists enforce_kkw_email on auth.users;
create trigger enforce_kkw_email
  before insert on auth.users
  for each row execute function public.enforce_kkw_email();

-- Optional: let a non-college address sign up (for example your own test account):
--   insert into public.email_allowlist (email) values ('someone@gmail.com');
