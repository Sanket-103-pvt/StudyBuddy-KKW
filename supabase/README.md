# Supabase setup (contributions, login, admin)

The site works without any of this. Login, the contribute form, the admin page and the leaderboard switch on once the two environment variables below exist.

1. **Create a project** at supabase.com (free plan). Region: Mumbai if offered.
2. **Run `schema.sql`**: Dashboard > SQL Editor > New query > paste the file > Run. It is safe to run again.
3. **Google sign-in**
   - Google Cloud Console > OAuth consent screen (External) > Credentials > OAuth client ID (Web application).
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Paste the Client ID and Client secret into Supabase > Authentication > Providers > Google (never into the repo).
   - Supabase > Authentication > URL Configuration: Site URL `https://www.studybuddykkw.dev`; add your Vercel preview URL pattern (for example `https://*-<team>.vercel.app/**`) under Redirect URLs.
4. **Environment variables** (Vercel > Project > Settings > Environment Variables, Production and Preview):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - Never use the `service_role` key anywhere in this project.
5. **Make yourself admin**: sign in once on the site, then run in the SQL Editor:
   `insert into public.admins (user_id) select id from auth.users where email = 'your-email@gmail.com';`
   The Admin link then appears in the sidebar.

## Who can do what (enforced by Row Level Security in `schema.sql`)

| Action | Visitor | Signed-in student | Admin |
|---|---|---|---|
| Read approved resources, timetables, leaderboard | yes | yes | yes |
| Submit a resource, timetable or broken-link report | no | yes (pending only, no points, max 10 pending) | yes |
| See submissions | no | own only | all |
| Approve, reject, give points | no | no | yes |
| Edit or add admins | no | no | no (SQL Editor only) |

Points can only be set by the admin. The leaderboard counts approved submissions and verified link reports only.

## Free-plan note

Free projects pause after 1 week without activity. A scheduled keep-alive request prevents that (added separately).
