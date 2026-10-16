# OpenSource Finder — Project Plan

> Team of 3 · 4 weeks · ~8 h/week each · final demo **Fri 13 Nov 2026**
> Stack: Node.js 26 (Volta) · Next.js App Router · TypeScript · Tailwind · Supabase (Postgres, Auth, RLS) · Vercel
> Architecture and DB schema (tables, RLS policies, `search_resources` RPC) are assumed already defined and reusable.

## Table of contents

- [0. Assumptions](#0-assumptions)
- [1. Project overview](#1-project-overview)
- [2. Roadmap](#2-roadmap)
- [3. Weekly plan](#3-weekly-plan)
- [4. Work breakdown structure](#4-work-breakdown-structure)
- [5. Task assignment](#5-task-assignment)
- [6. Collaboration workflow](#6-collaboration-workflow)
- [7. Rituals and communication](#7-rituals-and-communication)
- [8. Risk register](#8-risk-register)
- [9. Quality plan](#9-quality-plan)
- [10. Final delivery plan](#10-final-delivery-plan)
- [11. Appendix](#11-appendix)

---

## 0. Assumptions

**Read this first: the full brief does not fit in 96 hours.** Committed work (73.5 h) plus bonus work (30 h) is about 104 h of tasks, plus about 16 h of reviews and rituals, so roughly 120 h against 96 h available. This plan therefore commits to a vertical slice and defines an explicit cut line.

| # | Assumption |
|---|---|
| A1 | **Dates:** start Mon 19 Oct 2026, demo Fri 13 Nov 2026. **Wed 11 Nov is a French public holiday**, so week 4 is short. Shift all dates if yours differ. |
| A2 | **Capacity:** 3 members × 8 h × 4 weeks = **96 h**. No exams or other deliverables during the period. |
| A3 | **Estimate scale:** S = 1.5 h, M = 3 h, L = 5 h of focused work, including self-testing and excluding review. Estimates assume copy-pasting the already-designed SQL/RLS/RPC, using shadcn/ui primitives, and demo-grade (not production-grade) polish. Treat them as ±30%. |
| A4 | **Environments:** local Supabase CLI per developer; one Supabase `staging` project (used by Vercel previews and `main`); one Supabase `prod` project created in week 4. Both on the free tier. |
| A5 | **UI language:** English only in the committed scope. FR/EN is a stretch item. |
| A6 | **Roles:** `admin` and `moderator` are granted by SQL/dashboard (no admin UI). Demo accounts (user, moderator, admin) are pre-created. |
| A7 | **Submissions:** only "new resource" submissions are built. The schema supports `update` submissions, but no edit-proposal UI is delivered. |
| A8 | **Specializations (with rotation):** see the table below. Each member owns at least one task outside their specialization. |
| A9 | **GitHub:** one fine-grained read-only PAT stored in Vercel env vars; ≤ 100 linked repos, so quota is a non-issue at this size. |
| A10 | **Tools:** GitHub (repo, Issues, Projects, Actions), Discord, Vercel, Supabase. |

| Member | Primary specialization | Rotation (owns outside specialty) |
|---|---|---|
| **Member A** | Frontend / UI / accessibility | Submission flow incl. Server Action (T-017), favorites action (T-030) |
| **Member B** | Backend / database / security (RLS, auth, moderation) | Moderation UI (T-019) |
| **Member C** | Data integration / DevOps / QA (seed, GitHub sync, CI, E2E) | Search UI (T-016), data layer (T-013) |

**Capacity budget (96 h)**

| Bucket | Hours | Share |
|---|---|---|
| Committed tasks (Must + Should) | 73.5 | 76.6% |
| Code review (24 reviews × ~20 min) | 8.0 | 8.3% |
| Rituals (kickoff 45 min, 3 weekly sessions 30 min, final retro) | 7.5 | 7.8% |
| Buffer | 7.0 | 7.3% |
| **Total** | **96.0** | **100%** |

---

## 1. Project overview

### 1.1 Goal

Ship a deployed, demo-ready community directory of open-source resources that, unlike AlternativeTo.net, also covers technical resources (cybersecurity, programming, operating systems, databases, networks) and lets the community contribute through a moderated workflow.

### 1.2 Scope by tier

| Tier                                  | Features                                                                                                                                                                                                                                                                                                                                    | Hours                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **MVP (Must)**                        | Catalog (6 domains, sub-categories, resource pages with canonical URLs) · full-text + typo-tolerant search with filters, sorting and pagination · auth (email + GitHub) with roles enforced by RLS · "new resource" submission with Zod validation and rate limit · moderation queue (approve / reject with reason, audit log) · deployment | 61 incl. Phase 0, E2E, docs, prod |
| **V1 (Should)**                       | Favorites · GitHub enrichment (nightly sync, stats on pages) · sitemap / robots / metadata · user guide                                                                                                                                                                                                                                     | 12.5                              |
| **V2 / bonus (Could, not committed)** | Collections (public/private/share link) · reports · accessibility deep pass · RSS · alternatives · FR/EN UI · JSON-LD · IP rate limiting + Turnstile                                                                                                                                                                                        | 30                                |

### 1.3 Success criteria

| ID | Criterion | Verified by |
|---|---|---|
| SC-1 | Golden path works live on the production URL: browse → search → sign in → submit → moderator approves → resource visible | Demo + Playwright test on `main` |
| SC-2 | ≥ 40 seeded resources, ≥ 5 in each of the 6 domains, all with valid SPDX license | SQL count query in the demo checklist |
| SC-3 | Search with typo ("wireshrk") and 3 combined filters returns correct results in < 1 s on the demo dataset | Unit test + manual timing |
| SC-4 | RLS enabled on 100% of `public` tables; role matrix passes in CI | pgTAP job in CI |
| SC-5 | No secret reachable from the client: service-role key absent from `.next/static` | CI grep step |
| SC-6 | Lighthouse mobile: Accessibility ≥ 90 and SEO ≥ 90 on home and a resource page; zero critical/serious axe violations on key pages | Lighthouse + axe in Playwright |
| SC-7 | CI green on `main`; every merged PR has an approving review from the assigned reviewer | Branch protection settings |
| SC-8 | Each member can demo and explain their own area during the oral | Rehearsal check |

### 1.4 Out of scope (explicit)

- Edit proposals for existing resources (schema only, no UI)
- Admin UI for users and taxonomy (done via SQL/dashboard)
- Content translation, per-locale slugs
- Email notifications, newsletters
- Public API, webhooks, ratings, comments
- Avatar/file upload (Supabase Storage)
- Link checker, analytics, bulk import beyond the seed
- Native mobile app, payments

---

## 2. Roadmap

| Phase | Window | Committed hours | Objective | Milestone |
|---|---|---|---|---|
| **Phase 0: Setup** | Mon 19 – Wed 21 Oct | 12.5 (T-001–T-004) | Reproducible repo, CI, preview deploys, migrated staging DB | **M0** Wed 21 Oct |
| **MVP** | Thu 22 Oct – Wed 4 Nov | 38 (T-010–T-020) | Catalog + search + auth + contribution + moderation end to end | **M1** Wed 4 Nov |
| **V1** | Mon 2 – Tue 10 Nov | 14 (T-030–T-034) | Favorites, GitHub enrichment, SEO, E2E safety net | **M2** Tue 10 Nov (feature freeze) |
| **Delivery** | Tue 10 – Fri 13 Nov | 9 (T-040–T-043) | Docs, production deploy, rehearsed demo | **M3** Fri 13 Nov (demo) |
| **V2 / bonus** | Opportunistic | 0 committed (30 stretch) | Only from buffer, only after M1 | — |

### 2.1 Definition of done per phase

**Phase 0**
- [ ] A fresh clone runs `volta install node@26 && npm ci && npm run dev` (verified by a member who did not write T-002)
- [ ] CI (lint, typecheck, test, build) is green on `main` and required for merging
- [ ] `main` is protected: PR + 1 approval + required checks, no direct pushes
- [ ] Staging Supabase has init + RLS migrations applied; `npm run db:types` produces no diff
- [ ] Vercel preview URL builds from a PR (on Node 26, or the fallback is recorded in `docs/DECISIONS.md`)
- [ ] `.env.example` is complete and no secret is in the repo
- [ ] Board is populated with the full backlog (Appendix C)

**MVP**
- [ ] Golden path demoed on staging by someone other than its author
- [ ] ≥ 40 seeded resources, ≥ 5 per domain
- [ ] RLS on all tables; pgTAP matrix (anon / user / moderator) green in CI
- [ ] Every Server Action: Zod validation + authorization check; service-role key absent from the client bundle
- [ ] `/contribute` and `/moderation` are protected server-side (`requireRole`)
- [ ] All Must tasks merged with reviewer approval; no open P0 bug

**V1**
- [ ] Favorites work and are private to their owner
- [ ] GitHub sync runs from cron on staging, updates ≥ 90% of linked seed rows and tolerates missing repos
- [ ] Sitemap lists all published resources; staging is `noindex`
- [ ] Playwright golden path + axe checks green on `main`
- [ ] **Feature freeze Tue 10 Nov**: only bug fixes afterwards

**Delivery**
- [ ] Production (Vercel + Supabase prod) live and smoke-tested
- [ ] README, architecture doc, user guide, `docs/DECISIONS.md` complete
- [ ] Demo rehearsed twice, ≤ 10 min, fallback video recorded
- [ ] Release `v1.0.0` tagged with notes

**V2 / bonus (per item):** task DoD met + golden-path E2E still green + merged before the freeze, otherwise cut.

### 2.2 Decision gates and cut order

| Gate | When | Question | Rule |
|---|---|---|---|
| **G1** | Fri 30 Oct (weekly session) | Is every W1–W2 task merged? | If yes, the team may **swap** GitHub enrichment (T-031, T-032, 6.5 h) for Collections (T-050, T-051, 8 h) as the V1 headline feature. If no, no swap. |
| **G2** | Fri 6 Nov | Is the MVP DoD met and V1 ≥ 70% done? | If yes, one stretch item may be pulled in (order below), funded by the buffer. |
| **G3** | Tue 10 Nov | Feature freeze | No new feature after this point, even if ahead. |

**Cut order if behind schedule** (first item is cut first; Must tasks are never cut):
1. T-041 user guide (shrink to README section) → 2. T-033 sitemap → 3. T-032 stats display → 4. T-030 favorites → 5. T-031 cron (fall back to a manual `npm run sync:github` script).

**Stretch pull order:** T-050 + T-051 (collections) → T-053 (a11y pass) → T-052 (reports) → T-054 (RSS) → T-057 (JSON-LD) → T-058 (rate limiting) → T-055 (alternatives) → T-056 (FR/EN).

---

## 3. Weekly plan

| Week | Dates | Task hours | Review | Rituals | Slack |
|---|---|---|---|---|---|
| W1 | 19–23 Oct | 18.5 | 2 | 3.75 | −0.25 |
| W2 | 26–30 Oct | 19.5 | 2 | 1.5 | 1.0 |
| W3 | 2–6 Nov | 20.5 | 2 | 1.5 | 0.0 |
| W4 | 9–13 Nov | 15.0 | 2 | 0.75 | 6.25 |

W1 and W3 are at zero slack; the real buffer sits in W4, after the freeze. Any spill-over from W3 goes first to W4 Monday and Tuesday.

### Week 1 (19–23 Oct): Foundations
**Goal:** a working skeleton everyone can build on.
**Tasks:** T-001, T-002, T-003, T-004 (Phase 0) + T-010 (layout) + T-013 (data layer).
**Plan:**
- Mon: kickoff (45 min: roles, board, working agreement), then T-001 → T-002
- Tue–Wed: T-003 (including the 30-min Node 26 / Vercel check) and T-004 in parallel; T-010 starts when T-002 is merged
- Wed 21 Oct: **M0**
- Thu–Fri: T-013; Friday session

**Expected outcome (demoable):** green CI, preview URL with themed layout (light/dark), staging DB migrated with seed taxonomy, `lib/data` returning the category tree.

### Week 2 (26–30 Oct): Browse, search, sign in
**Goal:** a visitor can find real content; a user can sign in.
**Tasks:** T-011 (auth), T-012 (seed), T-014 (category/resource pages), T-015 + T-016 (search).
**Expected outcome:** ≥ 40 resources visible; `/categories/cybersecurite/outils/nmap`-style URLs work; search with filters and pagination; email + GitHub sign-in on staging. **G1** at the Friday session.

### Week 3 (2–6 Nov): Contribute, moderate, enrich
**Goal:** complete the golden path and add the first V1 features.
**Tasks:** T-017 (submission), T-018 + T-019 (moderation), T-020 (RLS tests), T-030 (favorites), T-031 (GitHub sync).
**Expected outcome:** **M1 Wed 4 Nov**: golden path works on staging; RLS test matrix green in CI; favorites usable; GitHub sync callable and scheduled on staging. **G2** at the Friday session. Tag `v0.1.0` at M1.

### Week 4 (9–13 Nov): Polish and deliver
**Goal:** freeze, harden, deploy, rehearse, demo.
**Tasks:** T-032, T-033, T-034 (E2E), T-040 (docs), T-041 (user guide), T-042 (production), T-043 (demo).
**Plan:**
- Mon–Tue: T-032, T-033, T-034, T-040 start; **Tue 10 Nov feature freeze (M2)**, tag `v0.2.0`
- Wed 11 Nov: public holiday, nothing planned
- Thu 12 Nov: T-042 production deploy, T-043 first rehearsals, bug fixes only
- Fri 13 Nov: final rehearsal, **demo (M3)**, 15-min retro

**Expected outcome:** production URL live and smoke-tested, docs complete, demo rehearsed twice.

---

## 4. Work breakdown structure

Estimate scale: **S** = 1.5 h · **M** = 3 h · **L** = 5 h. MoSCoW: **M** = Must, **S** = Should, **C** = Could.

### 4.1 Epics

| ID | Epic | Phase | Committed hours |
|---|---|---|---|
| E0 | Foundation and DevOps | 0 | 12.5 |
| E1 | Auth and roles | MVP | 5 |
| E2 | Catalog (layout, seed, data layer, pages) | MVP | 14 |
| E3 | Search and filters | MVP | 6.5 |
| E4 | Contributions and moderation | MVP | 11 |
| E5 | Quality and security | MVP / V1 | 4.5 |
| E6 | GitHub enrichment | V1 | 6.5 |
| E7 | Favorites and collections | V1 / stretch | 3 (+8 stretch) |
| E8 | SEO | V1 | 1.5 |
| E9 | Delivery and documentation | Delivery | 9 |
| E10 | Bonus (reports, a11y pass, RSS, alternatives, i18n, JSON-LD, rate limiting) | Stretch | 0 (+22 stretch) |
| | **Total committed** | | **73.5** |

### 4.2 User stories

| ID | Epic | Story | Acceptance criteria | Tasks | MoSCoW |
|---|---|---|---|---|---|
| US-01 | E0 | As a team member, I can clone, install and run the project quickly, and every PR is checked automatically. | README steps work on a fresh machine; CI blocks failing PRs | T-001–T-004 | M |
| US-02 | E1 | As a visitor, I can sign up and sign in with email or GitHub. | Both flows work on staging; session persists; sign-out clears it | T-011 | M |
| US-03 | E1 | As the system, I restrict pages and data by role. | `/moderation` rejects non-moderators; RLS matrix passes | T-011, T-020 | M |
| US-04 | E2 | As a visitor, I can browse domains and sub-categories. | 6 domains; paginated listings; breadcrumbs; metadata | T-010, T-013, T-014 | M |
| US-05 | E2 | As a visitor, I can read a resource page with all key facts. | Name, summary, type, SPDX license, platforms, difficulty, tags, links; wrong URL segments 308-redirect to canonical | T-014 | M |
| US-06 | E2 | As a visitor, I find real content from day one. | ≥ 40 resources, ≥ 5 per domain, original summaries | T-012 | M |
| US-07 | E3 | As a visitor, I can search (typo-tolerant), filter, sort and paginate. | "wireshrk" finds Wireshark; filters combine; state lives in the URL; 24 per page | T-015, T-016 | M |
| US-08 | E4 | As a signed-in user, I can propose a new resource and track its status. | Field-level Zod errors; https-only URLs; 6th submission within an hour is refused with a clear message; status visible in `/me/submissions` | T-017 | M |
| US-09 | E4 | As a moderator, I can approve or reject a submission with a reason. | Oldest-first queue; approve creates the published resource; reject requires a reason; every decision logged; normal users cannot call the RPCs | T-018, T-019 | M |
| US-10 | E5 | As the team, we detect regressions and policy leaks automatically. | pgTAP matrix and Playwright golden path run in CI | T-020, T-034 | M |
| US-11 | E7 | As a user, I can favorite resources and list them. | Optimistic toggle; `/me/favorites`; private to the owner | T-030 | S |
| US-12 | E6 | As a visitor, I see fresh GitHub stats. | Stars, latest release, last push shown; refreshed daily; missing repo hides the badge and is flagged | T-031, T-032 | S |
| US-13 | E8 | As a search engine, I get a sitemap and correct metadata. | Sitemap lists published resources; staging is `noindex` | T-033 | S |
| US-14 | E9 | As a jury member, I can run, understand and evaluate the project. | Docs, prod URL, rehearsed demo | T-040–T-043 | M |
| US-20 | E7 | As a user, I can create public/private collections and share them by link. | Public page, token link for unlisted, owner-only editing | T-050, T-051 | C |
| US-21 | E10 | As a user, I can report a bad listing. | One open report per user per resource; moderators see them | T-052 | C |
| US-22 | E10 | As a user with accessibility needs, I can use the whole golden path. | Keyboard-only run passes; Lighthouse a11y ≥ 95 | T-053 | C |
| US-23 | E10 | As a reader, I can follow new resources by RSS. | Valid feed of the 50 latest resources | T-054 | C |
| US-24 | E10 | As a visitor, I can find an open alternative to a proprietary product. | ≥ 15 "alternative to" links shown on resource pages | T-055 | C |
| US-25 | E10 | As a French speaker, I can use the UI in French. | Locale switcher; all UI strings translated | T-056 | C |
| US-26 | E10 | As a search engine, I get structured data. | Valid JSON-LD on resource pages | T-057 | C |
| US-27 | E10 | As an operator, I am protected from submission spam. | IP-level limit + Turnstile on the form | T-058 | C |

### 4.3 Tasks

| ID | Story | Task (verifiable "done when") | Size | h | MoSCoW | Depends on |
|---|---|---|---|---|---|---|
| T-001 | US-01 | Create GitHub repo; protect `main` (PR + 1 approval + required checks, linear history); add CODEOWNERS, PR template, issue templates, labels, Projects board (Appendix B); enable secret scanning. **Done when** a test PR cannot merge without approval. | S | 1.5 | M | — |
| T-002 | US-01 | Scaffold Next.js (App Router, TS strict + `noUncheckedIndexedAccess`), Tailwind, ESLint, Prettier, husky + lint-staged, Vitest config + 1 test, `volta pin node@26`, `.env.example`. **Done when** a fresh clone passes `npm ci`, `dev`, `lint`, `typecheck`, `test`. | M | 3 | M | T-001 |
| T-003 | US-01 | GitHub Actions CI (lint, typecheck, test, build on PR + `main`); Vercel project with preview deploys and env vars; 30-min check that Node 26 builds on Vercel (else document the fallback). **Done when** a PR shows 4 green checks and a preview URL. | M | 3 | M | T-002 |
| T-004 | US-01 | Create Supabase `staging` + local CLI; apply init and RLS migrations; seed licenses and categories; `db:types`; browser/server/admin clients, Zod `env.ts`, `proxy.ts` session refresh. **Done when** `supabase db reset` succeeds locally, preview reaches staging, and importing the admin client in a client component fails the build (`server-only`). | L | 5 | M | T-002 |
| T-010 | US-04 | Root layout, header/footer, dark mode toggle (persisted, respects `prefers-color-scheme`), shadcn/ui primitives (Button, Input, Select, Badge, Dialog), skip link, visible focus styles. **Done when** pages render in both themes and every header control is keyboard reachable. | M | 3 | M | T-002 |
| T-011 | US-02, US-03 | Email sign-up/in/out + GitHub OAuth, `/auth/callback`, `/login`, `/signup`, UserMenu, `requireRole()` helper; create demo accounts (user, moderator, admin). **Done when** both flows work on staging and `/moderation` blocks a normal user. | L | 5 | M | T-004, T-010 |
| T-012 | US-06 | Idempotent seed script (CSV → DB) with ≥ 40 resources, ≥ 5 in each of 6 domains, tags, SPDX licenses, platforms, `github_repo` where relevant. **Done when** `npm run db:seed` run twice gives identical counts. | M | 3 | M | T-004 |
| T-013 | US-04 | `lib/data` (server-only): category tree, paginated list by category, `getResourceBySlug`, tags; mapper unit tests. **Done when** pages never call Supabase directly and functions return typed seed data. | M | 3 | M | T-004 |
| T-014 | US-04, US-05 | Pages `/categories`, `/[domain]`, `/[sub]`, `/[slug]` with breadcrumbs, `generateMetadata`, ISR, 308 to canonical URL, `not-found`. **Done when** `/categories/cybersecurite/outils/nmap` renders and a wrong segment redirects. | L | 5 | M | T-010, T-013 |
| T-015 | US-07 | Search backend: Zod parsing of `searchParams`, `searchResources()` wrapper over the `search_resources` RPC, category slug → ids resolution; unit tests. **Done when** a typo query returns the expected resource in a test. | S | 1.5 | M | T-013 |
| T-016 | US-07 | Search UI: SearchBar, FilterPanel (category, license, platform, level, type), SortSelect, Pagination, ActiveFilters, EmptyState; state in URL; mobile filter drawer. **Done when** filters combine, reload reproduces state, and everything is keyboard operable. | L | 5 | M | T-015, T-010 |
| T-017 | US-08 | `submitResource` Server Action (Zod → `submissions` payload), ResourceForm (category, tags, license), `/me/submissions` (status + rejection reason), friendly rate-limit error. **Done when** invalid input shows field errors, the 6th submission in an hour is refused, and a valid one appears as pending. | L | 5 | M | T-011, T-013 |
| T-018 | US-09 | RPCs `approve_submission` / `reject_submission` (SECURITY DEFINER, role check, atomic creation of resource + tags + category, write to `moderation_actions`) + Server Actions + tests. **Done when** a normal user calling the RPC is denied and an approval makes the resource visible in the catalog. | M | 3 | M | T-004, T-011 |
| T-019 | US-09 | Moderation UI: `/moderation` queue (oldest first), review page with payload preview, decision dialog (reason mandatory on reject), `/moderation/history`. **Done when** a moderator completes both an approval and a rejection and both appear in history. | M | 3 | M | T-018, T-010 |
| T-020 | US-03, US-10 | pgTAP RLS matrix in `supabase/tests` (anon / user / moderator × `resources`, `submissions`, `moderation_actions`, `favorites`, `profiles.role`) wired into CI. **Done when** deliberately breaking one policy turns CI red. | S | 1.5 | M | T-018 |
| T-030 | US-11 | `toggleFavorite` action, FavoriteButton (optimistic), `/me/favorites`. **Done when** favorites of account X are invisible to account Y (pgTAP or E2E). | M | 3 | S | T-011, T-014 |
| T-031 | US-12 | GitHub sync: GraphQL batch client (≤ 50 repos per query), quota guard (stop under 10% remaining), `/api/cron/github-sync` (Bearer `CRON_SECRET`), upsert `github_metadata`, `refresh_popularity()`, daily cron in `vercel.json`, fixture-based tests (≥ 80% coverage on `lib/github`). **Done when** a manual trigger updates the seed rows and a missing repo increments `error_count`. | L | 5 | S | T-004, T-012 |
| T-032 | US-12 | GithubStats component on resource page and card; `revalidateTag` after sync. **Done when** stars/release/last push show and the block is hidden when there is no data. | S | 1.5 | S | T-031, T-014 |
| T-033 | US-13 | `sitemap.ts`, `robots.ts` (index prod only), default canonical + Open Graph metadata. **Done when** the sitemap lists all published resources and staging returns `noindex`. | S | 1.5 | S | T-014 |
| T-034 | US-10 | Playwright golden path (browse → search → sign in → submit → moderate → visible) + axe checks on 5 pages; runs on `main` in CI. **Done when** green in CI with zero critical/serious axe violations. | M | 3 | M | T-011, T-016, T-017, T-019 |
| T-040 | US-14 | README (what/why, quick start with Volta, env vars, scripts, deploy), `docs/architecture.md` (diagram, ER, RLS matrix, routes), `CONTRIBUTING.md`. **Done when** someone outside the team runs the app from the README alone. | M | 3 | M | T-019, T-031 |
| T-041 | US-14 | `docs/user-guide.md` with screenshots: visitor, contributor, moderator, admin (SQL role grant). **Done when** every golden-path step has a screenshot. | S | 1.5 | S | T-019, T-030 |
| T-042 | US-14 | Production: Supabase `prod` project, `supabase db push`, seed, GitHub OAuth app + redirect URLs, Vercel production env + cron, smoke checklist (Section 10), demo accounts. **Done when** the smoke checklist is fully ticked on the prod URL. | S | 1.5 | M | T-003, T-034 |
| T-043 | US-14 | Demo script, slides, two timed rehearsals (≤ 10 min), fallback video. **Done when** both rehearsal timings are logged in the board. | M | 3 | M | T-042 |

**Committed total: 73.5 h** (Must 61 h, Should 12.5 h).

### 4.4 Stretch tasks (Could, not committed)

| ID | Story | Task | Size | h | Depends on |
|---|---|---|---|---|---|
| T-050 | US-20 | Collections backend: actions, RLS checks, `get_collection_by_token` RPC, pgTAP cases | M | 3 | T-011, T-020 |
| T-051 | US-20 | Collections UI: create/edit, AddToCollectionMenu, `/collections/[username]/[slug]`, `/c/[token]`, ShareLinkButton | L | 5 | T-050, T-010 |
| T-052 | US-21 | Reports: `reportResource` action + `/moderation/reports` | M | 3 | T-019 |
| T-053 | US-22 | Accessibility pass: keyboard-only golden path, contrast in both themes, Lighthouse a11y ≥ 95, fixes | M | 3 | T-034 |
| T-054 | US-23 | RSS feed `/rss.xml` (50 latest) | S | 1.5 | T-014 |
| T-055 | US-24 | Alternatives: migration (`proprietary_products`, `resource_alternatives`), resource page section, 15 seeded links | L | 5 | T-014 |
| T-056 | US-25 | FR/EN UI with `next-intl`, locale switcher | L | 5 | T-010 |
| T-057 | US-26 | JSON-LD on resource pages | S | 1.5 | T-014 |
| T-058 | US-27 | Upstash IP rate limiting + Turnstile on the submission form | M | 3 | T-017 |

Stretch total: **30 h**.

---

## 5. Task assignment

### 5.1 Committed tasks

| Task | Name | Owner | Reviewer | Week | h | Critical |
|---|---|---|---|---|---|---|
| T-001 | Repo governance | C | B | W1 | 1.5 | ✔ |
| T-002 | Scaffold and tooling | A | C | W1 | 3 | ✔ |
| T-003 | CI + Vercel previews | C | A | W1 | 3 | |
| T-004 | Supabase setup, clients, proxy | B | A | W1 | 5 | ✔ |
| T-010 | Layout, UI primitives, dark mode | A | B | W1 | 3 | |
| T-013 | Data layer | C | B | W1 | 3 | catalog chain |
| T-011 | Auth flows | B | C | W2 | 5 | ✔ |
| T-012 | Seed ≥ 40 resources | C | A | W2 | 3 | |
| T-014 | Category and resource pages | A | B | W2 | 5 | |
| T-015 | Search backend | B | C | W2 | 1.5 | catalog chain |
| T-016 | Search UI | C | A | W2 | 5 | catalog chain |
| T-017 | Submission flow | A | B | W3 | 5 | contribution chain |
| T-018 | Moderation RPCs | B | A | W3 | 3 | ✔ |
| T-019 | Moderation UI | B | C | W3 | 3 | ✔ |
| T-020 | RLS pgTAP tests | B | A | W3 | 1.5 | |
| T-030 | Favorites | A | C | W3 | 3 | |
| T-031 | GitHub sync | C | B | W3 | 5 | near-critical (freeze) |
| T-032 | GitHub stats display | A | C | W4 | 1.5 | near-critical (freeze) |
| T-033 | Sitemap / robots | B | A | W4 | 1.5 | |
| T-034 | Playwright golden path + axe | C | B | W4 | 3 | ✔ |
| T-040 | README + architecture doc | B | C | W4 | 3 | |
| T-041 | User guide | C | A | W4 | 1.5 | |
| T-042 | Production deploy | B | C | W4 | 1.5 | ✔ |
| T-043 | Demo script, slides, rehearsals | A | B | W4 | 3 | ✔ |

### 5.2 Stretch tasks (provisional)

| Task | Owner | Reviewer | | Task | Owner | Reviewer |
|---|---|---|---|---|---|---|
| T-050 | B | A | | T-055 | C | B |
| T-051 | A | B | | T-056 | A | C |
| T-052 | C | B | | T-057 | B | A |
| T-053 | C | A | | T-058 | B | C |
| T-054 | B | C | | | | |

### 5.3 Workload balance (committed)

| Member | Specialization | Task hours | Share | W1 | W2 | W3 | W4 | Reviews |
|---|---|---|---|---|---|---|---|---|
| **A** | Frontend / UI | 23.5 | 32% | 6 | 5 | 8 | 4.5 | 8 |
| **B** | Backend / DB / security | 25.0 | 34% | 5 | 6.5 | 7.5 | 6 | 8 |
| **C** | Data / DevOps / QA | 25.0 | 34% | 7.5 | 8 | 5 | 4.5 | 8 |
| **Team** | | **73.5** | 100% | 18.5 | 19.5 | 20.5 | 15 | 24 |

Per-member weekly capacity is about 6.7 task hours. Swings of ±1.5 h (A in W3, C in W2, B in W1) are absorbed by the buffer. B's lighter W1 is used for early reviews and for a Supabase SSR cookie spike before T-011. A and C have lighter W4 loads and are first in line for bug triage and stretch items.

### 5.4 Critical path

Two chains converge on the E2E test, then the deployment and demo:

- **Contribution chain (longest):** T-001 → T-002 → T-004 → T-011 → T-018 → T-019 → **T-034** → T-042 → T-043 (27 h sequential)
- **Catalog chain (near-critical):** T-004 → T-013 → T-015 → T-016 → **T-034**
- **Near-critical for the freeze:** T-031 → T-032 must be merged by Mon 9 Nov; T-017 must be merged before T-034 starts.

Any slip on T-004 or T-011 delays everything downstream, so both are assigned to B with a named reviewer ready to take over.

---

## 6. Collaboration workflow

### 6.1 Git branching: trunk-based

- `main` is protected and always deployable. Merging to `main` deploys to staging.
- Short-lived branches (≤ 2 working days), named `type/T-0xx-short-slug`, e.g. `feat/T-017-submission-form`.
- Slice work vertically so every PR is mergeable on its own (no long-lived feature branches, no feature flags).
- Rebase on `main` before opening the PR; **squash merge**; branch deleted on merge; linear history.
- No direct pushes to `main`. Nobody merges their own PR.
- Tags: `v0.1.0` at M1, `v0.2.0` at M2, `v1.0.0` at the demo.

### 6.2 Commit convention (Conventional Commits)

Format: `type(scope): imperative subject (T-0xx)`

| Types | `feat` `fix` `docs` `style` `refactor` `test` `perf` `build` `ci` `chore` |
|---|---|
| **Scopes** | `auth` `catalog` `search` `submit` `moderation` `favorites` `github` `db` `ui` `seo` `ci` `docs` |

Examples:
- `feat(search): add typo-tolerant search wrapper (T-015)`
- `fix(db): restrict reports select to owner and moderators (T-020)`
- `ci: add pgTAP job (T-020)`

Breaking DB changes use `feat(db)!:` and a `BREAKING CHANGE:` footer.

### 6.3 Pull requests

**Rules**
- PR title = commit message of the squash (Conventional Commits, with task ID). Link the issue with `Closes #n`.
- Target size: ≤ 400 changed lines (excluding generated types, lockfile, seed data). Larger PRs must be split.
- One approval from the **assigned reviewer** (Section 5); any other member may substitute if the reviewer is absent > 24 h.
- Review SLA: 24 working hours. The author pings in Discord if the SLA is missed.
- All CI checks green and all conversations resolved before merge.
- UI PRs include a screenshot or short clip (light and dark).

**PR template** (`.github/pull_request_template.md`)

```markdown
## What and why
Closes #<issue> · Task: T-0xx

## How to test
1.
2.

## Screenshots (UI changes: light + dark)

## Checklist
- [ ] Acceptance criteria of the issue are met
- [ ] CI is green (lint, typecheck, tests, build)
- [ ] Server-side validation (Zod) and authorization checked for every new action/route
- [ ] DB change? Migration + regenerated types + RLS policy + pgTAP case included
- [ ] No secret or service-role key in client code; `.env.example` updated if needed
- [ ] Accessibility basics (labels, keyboard, contrast in both themes)
- [ ] Docs / `docs/DECISIONS.md` updated if behaviour or architecture changed
```

### 6.4 Database and migration rules

- Member B owns `supabase/migrations` (CODEOWNERS). Any migration PR needs two approvals (B + one more).
- Never edit an applied migration; add a new timestamped file.
- Regenerate types (`npm run db:types`) in the same PR as the migration.
- Every new table: RLS enabled, policies written, pgTAP case added, indexes for new filters.
- Staging is the shared environment: no destructive manual changes in the dashboard; everything goes through migrations.

### 6.5 CI checks (GitHub Actions)

| Check | Command | Required from | Blocking |
|---|---|---|---|
| lint | `npm run lint` (ESLint + Prettier check) | T-003 | Yes |
| typecheck | `npm run typecheck` | T-003 | Yes |
| unit tests | `npm test -- --coverage` (80% threshold on `lib/validation` and `lib/github` only) | T-003 | Yes |
| build + secret scan | `npm run build && ! grep -rq "service_role" .next/static` | T-003 | Yes |
| Vercel preview | Vercel status check | T-003 | Yes |
| db tests | `supabase start && supabase test db` | T-020 | Yes |
| dependency audit | `npm audit --omit=dev --audit-level=high` | T-003 | Yes |
| e2e | `npx playwright test` (on `main` and `workflow_dispatch`, not on every PR) | T-034 | On `main` |

### 6.6 Definition of done (every task)

- [ ] Acceptance criteria in the issue are met and demoable
- [ ] CI green; unit tests added where the task specifies them
- [ ] PR approved by the assigned reviewer; comments resolved
- [ ] No new secret in client code; new env vars documented in `.env.example`
- [ ] If the DB changed: migration + types + RLS policy + pgTAP case
- [ ] UI changes: keyboard operable, labels present, contrast OK in both themes
- [ ] Docs or `docs/DECISIONS.md` updated when behaviour or architecture changed
- [ ] Issue moved to **Done** and **actual hours** recorded in the issue

### 6.7 Code ownership (`CODEOWNERS`)

```
/supabase/        @member-b
/lib/auth/        @member-b
/lib/github/      @member-c
/.github/         @member-c
/tests/           @member-c
/components/      @member-a
/app/             @member-a @member-b
```

Ownership means "must be reviewed by", not "only edited by".

---

## 7. Rituals and communication

### 7.1 Rotating facilitator

One member per week runs the session, updates the board and writes the decision log: **W1 A · W2 B · W3 C · W4 A**.

### 7.2 Rituals

| Ritual | When | Duration | Who | Output |
|---|---|---|---|---|
| **Kickoff** | Mon 19 Oct | 45 min | All | Roles, board filled from Appendix C, working agreement, first decisions logged |
| **Weekly session: demo · retro · plan** | Fridays 23 Oct, 30 Oct, 6 Nov | 30 min (10 demo / 10 retro / 10 plan) | All | Merged work demoed on staging, one retro action, next week's tasks confirmed, gate decision (G1, G2) |
| **Async stand-up** | Mon and Wed, Discord `#standup` | 2 min each | All | Three lines: done / next / blocked |
| **Blocker call** | On demand | ≤ 15 min | Needed members | Blocker removed or cut decision |
| **Freeze check (G3)** | Tue 10 Nov | 10 min | All | Feature freeze confirmed, release `v0.2.0` |
| **Demo day + retro** | Fri 13 Nov | demo + 15 min | All | Demo, lessons learned |

### 7.3 Communication rules

- **Discord channels:** `#general`, `#standup`, `#help`, `#prs` (GitHub webhook), `#decisions`.
- A question in `#help` gets an answer attempt within 4 working hours. A blocker lasting more than 1 working day triggers a blocker call.
- Everything that changes scope, schema or architecture goes to `docs/DECISIONS.md`, not just chat.
- Issues are the source of truth for task status; Discord is for conversation.

### 7.4 Tools

| Need | Tool |
|---|---|
| Backlog, board, hours tracking | GitHub Issues + Projects (custom fields: Owner, Reviewer, Hours, Phase, Week, MoSCoW) |
| Code, review, CI | GitHub (PRs, Actions, CODEOWNERS, secret scanning) |
| Chat | Discord |
| Hosting, previews | Vercel |
| Database, auth | Supabase (staging, prod) |
| Secrets sharing | Password manager vault (never Discord, never Git) |

### 7.5 Decision log

File: `docs/DECISIONS.md`, one row per decision.

| ID | Date | Decision | Why | Alternatives rejected | Owner |
|---|---|---|---|---|---|
| D-001 | 19 Oct | Trunk-based, squash merge, no long-lived branches | Small team, short project | GitFlow-lite (overhead) | Facilitator |
| D-002 | 19 Oct | Scope tiers and cut order from this plan | 96 h capacity vs ~120 h full scope | Commit to full scope | All |
| D-003 | 21 Oct (T-003) | Node 26 on Vercel: confirmed or fallback recorded | Platform support must be verified | — | C |

### 7.6 Scope and progress control

- **Swap, don't add:** any new task must remove a task of equal size, decided at the weekly session.
- **WIP limits:** ≤ 2 tasks in progress per person; ≤ 4 PRs in review.
- **Progress check:** at each Friday session compare remaining hours with the plan below. If remaining exceeds plan by **more than 4 h**, apply the cut order (Section 2.2) immediately.

| End of | W1 | W2 | W3 | W4 |
|---|---|---|---|---|
| Planned remaining committed hours | 55.0 | 35.5 | 15.0 | 0 |

---

## 8. Risk register

Likelihood (L) and Impact (I): H = 3, M = 2, L = 1. Score = L × I.

| ID | Risk | L | I | Score | Mitigation | Owner | Early warning |
|---|---|---|---|---|---|---|---|
| R1 | **Scope creep.** Full brief ≈ 120 h vs 96 h capacity | H | H | 9 | Tiered scope, cut order, swap rule, G3 freeze; stretch only from buffer | Facilitator | A new issue is added without a removal |
| R2 | **Deadline slip.** W3 has zero slack, W4 is short (holiday 11 Nov) | H | H | 9 | Planned-remaining table, gates G1/G2, cut order; create the Supabase `prod` project on Fri 6 Nov to de-risk T-042 | Facilitator | Remaining hours > plan + 4 h |
| R3 | **Uneven workload or absence** of a member | M | H | 6 | Hours per member visible on the board; ±15% check weekly; each critical task has a reviewer who can take over; pair on T-004 and T-011; rotation avoids silos | Facilitator | A member under 70% of planned hours |
| R4 | **RLS mistakes** (data leak or lockout) | M | H | 6 | Deny by default; role helper functions; pgTAP matrix in CI (T-020); two approvals on every migration; service-role key only in cron/admin client; manual probing with the anon key before M1 | B | A policy change without a pgTAP case |
| R5 | **GitHub API quota or failures** | M | M | 4 | GraphQL batching (≤ 50 repos per query, so ~2 calls for 100 repos); quota guard; DB cache so pages never call GitHub; `error_count` and graceful hiding; manual sync script as fallback | C | `rateLimit.remaining` under 10% |
| R6 | **Moderation abuse or spam** | M | M | 4 | Auth required; DB trigger limits 5 submissions/hour; Zod limits and https-only URLs; nothing is published without moderator approval; mandatory rejection reason; stretch: reports, Turnstile | B | >10 pending submissions from one account |
| R7 | **Node 26 / tooling mismatch** on Vercel or CI | M | M | 4 | 30-min check inside T-003 on day 2; fallback to Node 24 on Vercel documented in D-003; Volta pin + `engines` | C | First Vercel build fails |
| R8 | **Supabase SSR/auth cookie complexity** (skill gap) | M | M | 4 | Spike before T-011; follow the official `@supabase/ssr` guide; review by C | B | T-011 exceeds 7 h |
| R9 | **Review bottleneck or merge conflicts** | M | M | 4 | PRs ≤ 400 lines; 24 h SLA; daily rebase; B owns migrations; vertical slicing | Facilitator | PRs open > 24 h |
| R10 | **Demo-day failure** (OAuth redirect mismatch, email rate limits, network) | M | H | 6 | Prod smoke checklist on Thu; pre-created confirmed demo accounts (Supabase's default email sending is heavily rate-limited, so no email sign-up during the demo); recorded fallback video; staging as fallback URL; two rehearsals | A | Smoke checklist fails on Thu 12 Nov |
| R11 | **Supabase free-tier pause or limits** | L | H | 3 | Daily cron plus `/api/health` ping; check the dashboard the day before the demo | C | "Project paused" banner |
| R12 | **Content quality or legal issues** (copied text, logos, trademarks) | L | M | 2 | Original summaries ≤ 280 characters; no logos; SPDX identifiers from the official list; source of each entry noted in the seed CSV | C | Review finds copied text |
| R13 | **Accessibility debt found late** | M | M | 4 | A11y in every task's DoD; axe in T-034; Radix/shadcn primitives; stretch T-053 | A | Axe violations at M1 |

---

## 9. Quality plan

### 9.1 Testing strategy by phase

| Phase | Unit (Vitest) | Database (pgTAP) | E2E (Playwright) | Manual |
|---|---|---|---|---|
| **0** | Config + 1 smoke test | — | — | Fresh-clone run by a second member |
| **MVP** | Zod schemas (submission, search params), slug/URL helpers, `requireRole`, data-layer mappers | RLS matrix: anon / user / moderator on `resources`, `submissions`, `moderation_actions`, `favorites`, `profiles.role` (T-020) | — | Golden path run by a non-author before M1 |
| **V1** | GitHub client with mocked GraphQL fixtures (quota guard, missing repo, rename); ≥ 80% coverage on `lib/validation` and `lib/github` | + `favorites` privacy | Golden path + axe on 5 pages (T-034), run on `main` | Mobile viewport pass |
| **Delivery** | — | Run against `prod` migrations on a scratch DB | Golden path against the production URL | Full smoke checklist (10.2), Lighthouse, Chromium + Firefox pass |

Principles: test behaviour that would hurt in the demo (auth, roles, moderation, search); no coverage target outside the two folders above; every bug fix adds a regression test when it is cheap.

### 9.2 Code review checklist

**Correctness and scope**
- [ ] Matches the issue's acceptance criteria; no unrelated changes
- [ ] Edge cases handled: empty results, invalid input, unauthenticated user, wrong role

**Security**
- [ ] Every Server Action and route handler validates input with Zod and checks authorization server-side
- [ ] New table or column? RLS enabled, policy written, pgTAP case added
- [ ] No service-role key or secret reachable from client code; env vars documented
- [ ] User content rendered through sanitized Markdown or plain text; no `dangerouslySetInnerHTML`
- [ ] URLs from users are https-only

**Data and performance**
- [ ] Queries are paginated; no N+1; new filters have supporting indexes
- [ ] Server Components by default; `"use client"` only where interaction needs it

**Accessibility**
- [ ] Labels, roles, focus order, visible focus, keyboard operation
- [ ] Contrast OK in light and dark; information not conveyed by colour alone

**Maintainability**
- [ ] Types are strict (no `any`); naming is clear; no dead code
- [ ] Tests added where the task requires them

### 9.3 Security checks

- [ ] GitHub secret scanning and push protection enabled (T-001)
- [ ] CI step fails the build if `service_role` appears in `.next/static`
- [ ] `npm audit --omit=dev --audit-level=high` clean
- [ ] Security headers present on `/` (CSP with nonce, HSTS, `X-Content-Type-Options`), asserted in a Playwright test
- [ ] `/api/cron/github-sync` returns 401 without the bearer secret (unit test)
- [ ] Manual probe before M1: with the anon key, try to read `submissions`, update `profiles.role`, insert into `resources`; all must fail
- [ ] OAuth redirect URLs restricted to staging and prod domains

### 9.4 Accessibility checks (WCAG AA target)

- [ ] axe (`@axe-core/playwright`) on `/`, `/search`, a resource page, `/login`, `/contribute/new`: zero critical/serious violations
- [ ] Keyboard-only run of the golden path (also T-053 if pulled)
- [ ] Contrast checked in both themes
- [ ] `prefers-reduced-motion` respected; text resizes to 200% without loss
- [ ] Lighthouse mobile: Accessibility ≥ 90 (≥ 95 if T-053 is done)

---

## 10. Final delivery plan

### 10.1 Deployment steps (T-042, Thu 12 Nov)

**Supabase prod**
- [ ] Create `prod` project (pre-create on Fri 6 Nov to save time); store keys in the password manager
- [ ] `supabase link --project-ref <prod>` then `supabase db push`
- [ ] Run the seed script against prod
- [ ] Auth → Providers: enable GitHub with a **prod** OAuth app (callback = Supabase callback URL)
- [ ] Auth → URL configuration: Site URL = prod domain; redirect URLs restricted to prod domain
- [ ] Create confirmed demo accounts (user, moderator, admin) and set roles by SQL

**Vercel**
- [ ] Production env vars point to **prod** Supabase (Preview keeps staging): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_TOKEN`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`
- [ ] Node.js version set (26, or documented fallback)
- [ ] `vercel.json` cron for `/api/cron/github-sync` (daily on the Hobby plan)
- [ ] Redeploy; tag `v1.0.0`

### 10.2 Production smoke checklist

- [ ] Home, category, resource pages load (desktop and mobile viewport)
- [ ] Search with a typo + 2 filters returns the right resource
- [ ] Sign in with GitHub and with a demo email account
- [ ] Submit a resource as user → appears in `/me/submissions` as pending
- [ ] Approve as moderator → resource visible in the catalog; decision in history
- [ ] Anonymous user cannot open `/moderation` or `/contribute`
- [ ] Favorite toggle works and is private
- [ ] Manual call of the cron endpoint updates GitHub stats; without the secret it returns 401
- [ ] `robots.txt` allows indexing on prod; `sitemap.xml` lists the resources
- [ ] Lighthouse mobile run on home and a resource page meets SC-6

### 10.3 Demo script (≤ 10 min)

| Time | Segment | Presenter | Key point |
|---|---|---|---|
| 0:00 | Problem and gap vs AlternativeTo.net; 6 domains | A | Why technical resources need their own directory |
| 1:00 | Browse a domain → resource page (`/categories/cybersecurite/outils/nmap`) | A | Canonical URLs, license / platform / difficulty |
| 2:30 | Search with a typo, combine filters, change sort | C | Postgres FTS + trigram, URL-shareable state |
| 4:00 | GitHub stats: show a resource, trigger the cron endpoint live | C | Batching, quota guard, cache, no live API calls |
| 5:00 | Sign in with GitHub; submit a new resource; show validation error and rate limit | B | Zod, server-side checks |
| 6:30 | Switch to moderator: approve, then reject with reason; open history | B | Atomic RPC, audit log |
| 7:30 | Security slice: anon probe fails on `submissions`; show the pgTAP matrix in CI | B | RLS as the real authorization layer |
| 8:30 | Favorites and quality: CI, E2E, axe | A / C | Process and tests |
| 9:30 | What we cut and why (collections, i18n, …), next steps | All | Honest scope story |

**Fallbacks:** recorded video of the golden path; staging URL as backup; demo accounts already signed in on a second browser profile; screenshots in the slides.

### 10.4 Documentation deliverables

| Document | Owner | Content |
|---|---|---|
| `README.md` | B | What/why, features, quick start (Volta, Node 26, `npm ci`, env vars, scripts), deploy, tests |
| `docs/architecture.md` | B | Diagram, data model, RLS matrix, routes, GitHub sync, decisions summary |
| `docs/user-guide.md` | C | Visitor, contributor, moderator, admin flows with screenshots |
| `CONTRIBUTING.md` | B | Workflow summary (Section 6) |
| `docs/DECISIONS.md` | Facilitators | Decision log |
| `docs/demo-script.md` | A | Section 10.3 with timings |

### 10.5 Presentation outline (≈ 12 slides)

1. Title and team
2. Problem: gap between AlternativeTo.net and technical resources
3. Solution and scope (6 domains, community + moderation)
4. Live demo (Section 10.3)
5. Architecture (Next.js + Supabase + Vercel diagram)
6. Security: RLS, roles, rate limiting
7. Data enrichment from GitHub (batching, cache, quota)
8. Quality: CI, pgTAP, Playwright, accessibility
9. Team process: board, reviews, rituals, planned vs actual hours
10. Scope decisions: what shipped, what was cut, why
11. Lessons learned
12. Roadmap beyond the course and Q&A

---

## 11. Appendix

### Appendix A: GitHub issue templates

`.github/ISSUE_TEMPLATE/config.yml`

```yaml
blank_issues_enabled: false
```

`.github/ISSUE_TEMPLATE/task.md`

```markdown
---
name: Task
about: A unit of work from the plan (T-xxx)
title: "T-xxx: <verb + object>"
labels: ["type:task"]
---

**Story:** US-xx · **Epic:** Exx · **Phase:** 0 / MVP / V1 / V2
**Size / hours:** S 1.5 · M 3 · L 5 · **MoSCoW:** Must / Should / Could
**Owner:** @ · **Reviewer:** @ · **Week:** W1–W4
**Depends on:** T-xxx

## Description

## Done when (verifiable)
- [ ]
- [ ]

## Notes / links

## Actual hours (fill on completion)
```

`.github/ISSUE_TEMPLATE/user_story.md`

```markdown
---
name: User story
about: A user-facing capability (US-xx)
title: "US-xx: <short name>"
labels: ["type:story"]
---

As a **<role>**, I want **<capability>**, so that **<benefit>**.

## Acceptance criteria
- [ ]
- [ ]

## Tasks
- [ ] T-xxx
```

`.github/ISSUE_TEMPLATE/bug.md`

```markdown
---
name: Bug
about: Something is broken
title: "Bug: <short description>"
labels: ["type:bug"]
---

**Severity:** P0 (blocks demo) / P1 (major) / P2 (minor)
**Environment:** local / preview / staging / prod · browser:

## Steps to reproduce
1.
2.

## Expected / actual

## Screenshot or logs

## Suspected area
auth / catalog / search / submit / moderation / favorites / github / db / ui
```

**Labels:** `phase:0` `phase:mvp` `phase:v1` `phase:v2` · `epic:E0`…`epic:E10` · `type:task` `type:story` `type:bug` · `priority:must` `priority:should` `priority:could` · `size:S` `size:M` `size:L` · `blocked` `needs-review` · `area:auth` `area:catalog` `area:search` `area:submit` `area:moderation` `area:db` `area:ui` `area:ci`

### Appendix B: Kanban board layout (GitHub Projects)

| Column | Entry criteria | WIP limit | Exit |
|---|---|---|---|
| **Backlog** | Issue exists with story and size | — | Chosen for the week |
| **Ready** | Owner, reviewer, dependencies met, done-when written | — | Owner starts |
| **In progress** | Branch created | ≤ 2 per person | PR opened |
| **In review** | PR open, CI running or green | ≤ 4 total | Approved and merged |
| **Blocked** | Waiting on a dependency or decision (add `blocked` label + comment) | ≤ 2 | Blocker removed |
| **Done** | Merged, DoD checked, actual hours recorded | — | — |

**Custom fields:** Owner, Reviewer, Hours (planned), Actual hours, Phase, Week, MoSCoW.
**Views:** *By week* (grouped by Week), *By owner* (grouped by Owner), *Critical path* (filter `T-001, T-002, T-004, T-011, T-018, T-019, T-034, T-042, T-043`).
**Automation:** PR opened → In review; PR merged / issue closed → Done; label `blocked` → Blocked.

### Appendix C: Initial backlog (ready to paste)

Format: `ID — task (size, hours, MoSCoW) · owner → reviewer · depends on`

#### Phase 0: Setup (W1)
- [ ] **T-001** — Repo governance: protection, CODEOWNERS, templates, labels, board, secret scanning (S, 1.5 h, Must) · C → B · —
- [ ] **T-002** — Scaffold Next.js TS strict + Tailwind + lint/format/hooks + Vitest + Volta pin + `.env.example` (M, 3 h, Must) · A → C · T-001
- [ ] **T-003** — CI workflow + Vercel previews + Node 26 check (M, 3 h, Must) · C → A · T-002
- [ ] **T-004** — Supabase staging + local, migrations, seed taxonomy, types, clients, env validation, proxy (L, 5 h, Must) · B → A · T-002

#### MVP (W1–W3)
- [ ] **T-010** — Layout, UI primitives, dark mode (M, 3 h, Must) · A → B · T-002
- [ ] **T-013** — Data layer `lib/data` (M, 3 h, Must) · C → B · T-004
- [ ] **T-011** — Auth: email + GitHub, callback, role guard, demo accounts (L, 5 h, Must) · B → C · T-004, T-010
- [ ] **T-012** — Seed ≥ 40 resources across 6 domains (M, 3 h, Must) · C → A · T-004
- [ ] **T-014** — Category and resource pages, canonical redirect, metadata (L, 5 h, Must) · A → B · T-010, T-013
- [ ] **T-015** — Search backend wrapper + param parsing + tests (S, 1.5 h, Must) · B → C · T-013
- [ ] **T-016** — Search UI: bar, filters, sort, pagination (L, 5 h, Must) · C → A · T-015, T-010
- [ ] **T-017** — Submission flow: action, form, `/me/submissions`, rate-limit error (L, 5 h, Must) · A → B · T-011, T-013
- [ ] **T-018** — Moderation RPCs + actions + audit log (M, 3 h, Must) · B → A · T-004, T-011
- [ ] **T-019** — Moderation UI: queue, review, decision, history (M, 3 h, Must) · B → C · T-018, T-010
- [ ] **T-020** — pgTAP RLS matrix in CI (S, 1.5 h, Must) · B → A · T-018

#### V1 (W3–W4)
- [ ] **T-030** — Favorites (M, 3 h, Should) · A → C · T-011, T-014
- [ ] **T-031** — GitHub sync: batching, quota guard, cron, tests (L, 5 h, Should) · C → B · T-004, T-012
- [ ] **T-032** — GitHub stats display + revalidation (S, 1.5 h, Should) · A → C · T-031, T-014
- [ ] **T-033** — Sitemap, robots, metadata defaults (S, 1.5 h, Should) · B → A · T-014
- [ ] **T-034** — Playwright golden path + axe, run on `main` (M, 3 h, Must) · C → B · T-011, T-016, T-017, T-019

#### Delivery (W4)
- [ ] **T-040** — README, architecture doc, CONTRIBUTING (M, 3 h, Must) · B → C · T-019, T-031
- [ ] **T-041** — User guide with screenshots (S, 1.5 h, Should) · C → A · T-019, T-030
- [ ] **T-042** — Production deploy + smoke checklist (S, 1.5 h, Must) · B → C · T-003, T-034
- [ ] **T-043** — Demo script, slides, two rehearsals, fallback video (M, 3 h, Must) · A → B · T-042

#### Stretch (not committed; pull in the order of Section 2.2)
- [ ] **T-050** — Collections backend (M, 3 h) · B → A
- [ ] **T-051** — Collections UI + share links (L, 5 h) · A → B
- [ ] **T-053** — Accessibility pass (M, 3 h) · C → A
- [ ] **T-052** — Reports (M, 3 h) · C → B
- [ ] **T-054** — RSS feed (S, 1.5 h) · B → C
- [ ] **T-057** — JSON-LD (S, 1.5 h) · B → A
- [ ] **T-058** — IP rate limiting + Turnstile (M, 3 h) · B → C
- [ ] **T-055** — Alternatives (L, 5 h) · C → B
- [ ] **T-056** — FR/EN UI (L, 5 h) · A → C

#### Standing checklist for the facilitator (every Friday)
- [ ] Board matches reality (statuses, actual hours)
- [ ] Remaining hours compared with the planned-remaining table
- [ ] Decisions of the week written in `docs/DECISIONS.md`
- [ ] Next week's tasks have owner, reviewer and done-when
- [ ] Gate question answered (G1 Fri 30 Oct, G2 Fri 6 Nov, G3 Tue 10 Nov)
