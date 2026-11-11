# Contributing to StudyBuddy KKW

Thanks for helping K.K. Wagh students. You can help in two ways: share notes (no coding), or improve the code and content with a pull request.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). This repository is source-available, not open source: read the [LICENSE](LICENSE) first. Contributions are accepted under section 4 of that license, and the code may not be copied or hosted elsewhere.

## Share notes (students)

1. Open the site and log in with your KKWagh email (`@kkwagh.edu.in`).
2. Go to **Contribute** and submit a link to your notes (a public Google Drive link works well).
3. An admin checks it. Approved notes go live with your name and count on the leaderboard.

Share only what you have the right to share, and do not upload copyrighted textbook PDFs. Found a broken link? Use the report button next to it.

## Contribute code or content

### Setup

You need Node.js 18 or newer and npm.

```bash
git clone https://github.com/YOUR_USERNAME/StudyBuddy-KKW.git
cd StudyBuddy-KKW
npm install
npm run dev
```

The site runs at http://localhost:3000 with no configuration. Login and contributions need a Supabase project: see [`supabase/README.md`](supabase/README.md) and put the two `NEXT_PUBLIC_SUPABASE_*` values in `.env.local`. Never commit `.env.local` or a `service_role` key.

### Before you open a pull request

```bash
npm run validate   # content files match content-schema.json
npm run lint
npm test
npm run build
```

### Branches and commits

- Never commit directly to `master`. Branch from the latest `master`, one task per branch and per pull request.
- Name branches `type/short-description`, for example `feat/search-filters` or `fix/mobile-navbar`.
- Write commits as `type(scope): description` in the present tense, under 72 characters. Types: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `ci`, `chore`.
- If you hit merge conflicts, resolve them file by file. Do not blindly take "ours" or "theirs".

### Adding or fixing notes

Subject files live in `content/<year>/<subject>.json`. Only First and Second Year are shown right now. The Third and Fourth Year folders are hidden until they have real content, so do not add placeholder links there.

```json
{
  "id": "subject-id",
  "name": "Subject Name",
  "year": "first-year",
  "icon": "book-open",
  "lastUpdated": "YYYY-MM-DD",
  "units": [
    {
      "unitNumber": 1,
      "title": "Unit 1",
      "resources": [
        { "label": "Handwritten notes", "type": "file", "url": "https://drive.google.com/...", "lastUpdated": "YYYY-MM-DD" }
      ]
    }
  ]
}
```

Run `npm run validate` after editing.

## Pull request checklist

- [ ] Small, focused change from the latest `master`
- [ ] `npm run validate`, `npm run lint`, `npm test` and `npm run build` pass
- [ ] Checked on a phone-sized screen if the UI changed
- [ ] No secrets, `.env` files, fake data, or invented syllabus content
- [ ] Clear title (for example `fix(navbar): stop tab overlap on mobile`) and a short description of what you changed and how you tested it
