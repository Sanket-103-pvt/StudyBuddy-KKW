# Contributing to Study Buddy KKW

Thank you for your interest in contributing to **Study Buddy KKW**! We welcome contributions from developers, students, and open-source enthusiasts. Whether you are fixing a bug, enhancing the UI, standardizing syllabus docs, or adding new subject notes, this guide will help you set up your development environment and follow project standards.

---

## 📋 Table of Contents

- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [Forking & Cloning](#forking--cloning)
  - [Environment Configuration](#environment-configuration)
  - [Installing Dependencies](#installing-dependencies)
  - [Development Server](#development-server)
  - [Content Validation](#content-validation)
  - [Testing & Building](#testing--building)
- [🌿 Git Branch Discipline](#-git-branch-discipline)
  - [Branch Naming Format](#branch-naming-format)
  - [Branch Rules](#branch-rules)
  - [Handling Upstream Updates & Merge Conflicts](#handling-upstream-updates--merge-conflicts)
- [✍️ Conventional Commit Guidelines](#-conventional-commit-guidelines)
  - [Commit Message Format](#commit-message-format)
  - [Standard Types & Examples](#standard-types--examples)
- [📁 Adding & Updating Subject Content](#-adding--updating-subject-content)
- [✅ Pull Request Submission Checklist](#-pull-request-submission-checklist)

---

## 🚀 Getting Started & Local Setup

### Prerequisites

Ensure your system meets the following requirements before getting started:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**: Installed and configured on your machine

### Forking & Cloning

1. Fork the official repository [Sanket-103-pvt/StudyBuddy-KKW](https://github.com/Sanket-103-pvt/StudyBuddy-KKW) to your GitHub account.
2. Clone your forked repository locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/StudyBuddy-KKW.git
   cd StudyBuddy-KKW
   ```
3. Add the main upstream repository as a remote:
   ```bash
   git remote add upstream https://github.com/Sanket-103-pvt/StudyBuddy-KKW.git
   git fetch upstream
   ```

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and configure your API keys (optional for basic UI development, required for AI Study Planner features):
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

### Installing Dependencies

Install the project dependencies using `npm`:
```bash
npm install
```

### Development Server

Start the Next.js local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application with hot reloading.

### Content Validation

Study Buddy uses an automatic **AJV JSON Schema Validator** to ensure subject notes and resource links in `content/` conform strictly to `content-schema.json`.

Run the validator script locally:
```bash
npm run validate
```

### Testing & Building

Run unit tests using Jest:
```bash
npm test
```

Verify that the production build compiles cleanly (this automatically triggers content schema validation during `prebuild`):
```bash
npm run build
```

---

## 🌿 Git Branch Discipline

### Branch Naming Format

All branch names must match one of the following issue formats:

| Category | Prefix | Example Branch Name |
| :--- | :--- | :--- |
| **New Feature / UI** | `feat/*` | `feat/toast-notifications-system` |
| **Bug Fix** | `fix/*` | `fix/mobile-navbar-scroll-overflow` |
| **Documentation / Content** | `docs/*` | `docs/standardize-year-page-nomenclature` |
| **Refactoring** | `refactor/*` | `refactor/recent-history-hook` |
| **Security Fix** | `security/*` | `security/sanitize-url-inputs` |
| **CI / Tooling / Scripts** | `ci/*` | `ci/json-schema-validator` |
| **UI Styling / Theme** | `style/*` | `style/glassmorphism-card-shadows` |
| **Testing** | `test/*` | `test/date-utils-unit-tests` |

### Branch Rules

1. **Never commit directly to `master`**: Always work inside a dedicated branch.
2. **One Issue = One Branch = One PR**: Keep branches focused on a single task or issue. Do not mix unrelated changes in one branch.
3. **Branch from Latest Upstream Master**: Always fetch and merge `upstream/master` before starting a new branch:
   ```bash
   git checkout master
   git fetch upstream
   git merge upstream/master
   git checkout -b feat/your-feature-name
   ```

### Handling Upstream Updates & Merge Conflicts

To keep your feature branch up-to-date with recent changes merged into main:
```bash
git fetch upstream
git merge upstream/master
```

If merge conflicts occur:
1. Open the conflicted files and resolve the differences **file-by-file**.
2. **Never blindly accept all incoming or current changes** (`--ours` or `--theirs`).
3. Run `npm test` and `npm run build` after resolving conflicts to ensure the build remains clean.
4. Stage the resolved files and commit the merge:
   ```bash
   git add .
   git commit -m "Merge upstream/master into feat/your-feature-name"
   ```

---

## ✍️ Conventional Commit Guidelines

We enforce **Conventional Commit Messages** to maintain a clean git history and automated changelogs.

### Commit Message Format

```text
type(scope): description
```

- **Type**: Must be one of the recognized standard types.
- **Scope** *(optional)*: The module, component, or area being modified (e.g. `auth`, `ui`, `nomenclature`, `schema`).
- **Description**: Concise summary in imperative present tense (e.g., "add", "fix", "update"). **Keep under 72 characters.**

### Standard Types & Examples

- **`feat`**: A new user-facing feature or component
  - `feat(ui): add toast notifications for pinned notes`
- **`fix`**: A bug fix
  - `fix(navbar): resolve bottom navigation tab overlap on mobile`
- **`docs`**: Documentation or syllabus text changes
  - `docs(nomenclature): standardize year titles across year pages`
- **`ci`**: CI/CD build scripts, workflows, or validation tools
  - `ci(schema): implement automatic JSON schema validator`
- **`refactor`**: Code changes that neither fix a bug nor add a feature
  - `refactor(storage): simplify bookmark parsing helper`
- **`style`**: Formatting, white-space, or visual design tweaks
  - `style(cards): add subtle hover scaling to subject cards`
- **`test`**: Adding or updating unit test suites
  - `test(utils): add boundary tests for date utility functions`
- **`chore`**: Maintenance, updating dependencies, or build config
  - `chore(deps): update devDependencies in package.json`

---

## 📁 Adding & Updating Subject Content

You can add new handwritten notes, Drive folders, or PYQ papers by editing the JSON files in the `content/` folder without touching application code.

1. Locate the year directory (e.g. `content/first-year/` or `content/second-year/`).
2. Add or modify the subject JSON file adhering strictly to `content-schema.json`:
   ```json
   {
     "id": "subject-id",
     "name": "Subject Title in Title Case",
     "year": "first-year",
     "icon": "book-open",
     "lastUpdated": "YYYY-MM-DD",
     "units": [
       {
         "unitNumber": 1,
         "title": "Unit Title",
         "resources": [
           {
             "label": "Handwritten Notes Unit 1",
             "type": "file",
             "url": "https://drive.google.com/...",
             "lastUpdated": "YYYY-MM-DD"
           }
         ]
       }
     ]
   }
   ```
3. Run `npm run validate` to ensure your JSON formatting passes schema checks.

---

## ✅ Pull Request Submission Checklist

Before opening your Pull Request, make sure you complete the following checklist:

- [ ] My branch is created from the latest `upstream/master` branch.
- [ ] My branch name follows the required format (`feat/*`, `fix/*`, `docs/*`, etc.).
- [ ] All subject content JSON files pass schema validation (`npm run validate`).
- [ ] All unit tests pass cleanly (`npm test`).
- [ ] The production build compiles with zero errors (`npm run build`).
- [ ] No `.env`, secret keys, node_modules, or temporary files are staged.
- [ ] Commit messages follow conventional commit format (`type(scope): description`).
- [ ] The PR title follows conventional format and references the target issue number (e.g., `docs(setup): add contributing guidelines (#54)`).
- [ ] A detailed summary and verification steps are included in the PR description.

---

Thank you for helping make **Study Buddy KKW** better for every engineering student! 🎓🚀
