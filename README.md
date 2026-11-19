

# OpenFinder

OpenFinder is the WebTech 105 team project: a directory for discovering
open-source alternatives to software and online services. Its public catalogue,
contact form, accounts, personal lists, and moderated tool suggestions use
Supabase.

## Documentation map

| Document | Use it for |
| --- | --- |
| [Architecture](documentation/ARCHITECTURE.md) | Repository structure, route responsibilities, and extension rules |
| [Rendering guide](documentation/RENDERING.md) | Why each route is static, dynamic, or incrementally regenerated |
| [Project plan](documentation/PROJECT_PLAN.md) | Current scope, milestones, and definition of done |
| [Deployment guide](documentation/DEPLOYMENT.md) | Supabase and Vercel setup, release, and smoke checks |
| [Course requirements](documentation/PROJECT_INSTRUCTIONS.md) | Technical and presentation requirements |
| [Git branch cheatsheet](documentation/.cheatsheet-git-branches.md) | Common branch and collaboration commands |
| [Evaluation template](PROJECT.md) | Official self-evaluation; this file is maintained separately |

## Current status

Implemented in the prototype:

- Next.js 16 App Router with React 19
- Shared root layout and navigation
- Home, about, contact, explore, category, tool, list, profile, and not-found routes
- Tailwind CSS v4 through the PostCSS plugin
- Supabase migrations, seed data, RLS, and server-side data access
- Catalogue search, category filtering, and pagination
- Server-side GitHub repository information on tool pages
- Public contact form with validation and insert-only access
- Supabase email authentication and private personal lists
- Authenticated tool suggestions and a moderator review queue
- Unit, browser, and database RLS tests with a GitHub Actions workflow
- Route rendering using SSG, ISR, and SSR
- Responsive navigation styling and dark-mode utility classes

Not implemented yet:

- Production Supabase and Vercel configuration and smoke testing
- SMTP delivery configuration for production account-confirmation email
- Moderator assignment for the deployed Supabase project
- Screenshots, presentation rehearsal, and the individual self-evaluation

The [project plan](documentation/PROJECT_PLAN.md) tracks the remaining delivery
work. Do not document planned behavior as implemented behavior.

Keep the dependency lockfile's tested Next.js patch version current and run the
production build before deployment.

## Prerequisites

- Node.js 24 or newer (CI currently uses Node.js 26)
- npm 10+
- Git
- Docker Engine or Docker Desktop

Check the installed versions before starting:

```bash
node --version
npm --version
```

## Run locally

```bash
git clone https://github.com/soupamen/ece-webtech-105.git
cd ece-webtech-105
npm ci
npm ci --prefix client
npx supabase start
```

Copy `client/.env.example` to `client/.env.local`. Set the local API URL and
publishable key from `npx supabase status -o env`, and set
`NEXT_PUBLIC_SITE_URL=http://localhost:3000`. Use only the public API URL and
publishable/anon key; never put the service-role key in the client environment.

Start the app with `npm --prefix client run dev`, then open
<http://localhost:3000>. The development server reloads when application files
change. Stop it with `Ctrl+C`.

Useful commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm --prefix client run dev` | Start the development server |
| `npm --prefix client run build` | Create a production build |
| `npm --prefix client run start` | Serve the production build |
| `npm --prefix client run lint` | Run ESLint |
| `npm --prefix client test` | Run unit tests |
| `npm --prefix client run test:e2e` | Run browser tests |
| `npx supabase start` | Start the local Supabase stack |
| `npx supabase test db` | Run database RLS tests |

The application requires these variables in `client/.env.local` for local
development and in Vercel for each relevant environment:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use only the public Supabase URL and publishable/anon key. Never commit
credentials or service-role keys.

The browser suite uses the production build. Start local Supabase, run
`npm --prefix client run build`, then run `npm --prefix client run test:e2e`.
The authenticated signup, list, and suggestion journeys run when
`SUPABASE_E2E_ENABLED=1` is set and Supabase is available. The CI workflow
starts Supabase and enables these journeys automatically.

## Route overview

| Route | Purpose | Current rendering |
| --- | --- | --- |
| `/` | Project landing page | ISR, 1 hour |
| `/about` | Project information | Static |
| `/explore` | Search, category filtering, and pagination | Dynamic |
| `/category` | Category index from Supabase | Dynamic; public data cached for 1 hour |
| `/category/[slug]` | Category detail from Supabase | Dynamic; public data cached for 1 hour |
| `/tool/[slug]` | Tool detail, GitHub data, and session-specific save controls | Dynamic; public data cached for 60 seconds |
| `/contact` | Public contact and suggestion form | Static shell, interactive form |
| `/list` | Authenticated personal lists and saved tools | Dynamic |
| `/profile` | Account state and sign-out | Dynamic |
| `/auth/login` | Email and password sign-in | Dynamic |
| `/auth/signup` | Account creation | Dynamic |
| `/auth/callback` | Email-confirmation callback | Dynamic |
| `/suggest` | Submit a catalogue suggestion and view its status | Dynamic |
| `/moderation` | Review suggestions; moderator-only | Dynamic |
| `404` | Fallback for unknown routes | Static |

See the [rendering guide](documentation/RENDERING.md) for the reasoning and the
exact source files behind each entry.

### Explore parameters

The `/explore` route accepts these query parameters:

- `q`: searches tool names and proprietary alternatives;
- `category`: filters by category slug;
- `page`: selects a page of 12 results.

The parameters can be combined, for example:
`/explore?q=notion&category=productivity&page=1`.

Searches and filters run in Supabase. Pagination uses an exact count and keeps
the active search and category in the previous/next links.

### Database and GitHub integration

The schema is versioned in `supabase/migrations/` and seeded by
`supabase/seed.sql`. The public `categories` and `tools` tables are readable
through RLS. The `lists` and `list_items` tables restrict access to each user's
own lists.
The `contacts` table accepts inserts but has no public read policy.
Tool suggestions are private to their submitter and moderators until an
authorized moderator reviews them. Moderator access is based on the trusted
Supabase `app_metadata.role` claim; ordinary user metadata cannot grant this
role. See the [deployment guide](documentation/DEPLOYMENT.md) for secure
moderator assignment and production setup.

Tool pages call GitHub's public REST API only from server components. Responses
are cached for 60 seconds. Timeouts, rate limits, invalid responses, and missing
repositories hide the GitHub section without preventing the tool page from
rendering.

## Development conventions

- The Next.js application is in `client/`; keep routes in `client/app/` and
  reusable UI in `client/components/`.
- Prefer Server Components. Add `'use client'` only when browser state or an
  event handler is required.
- Keep route-specific data and rendering close to the route until a shared
  abstraction is justified.
- Keep admin operations and service-role credentials on trusted server-side
  infrastructure only.
- Use descriptive names and small components.
- Update the relevant documentation when a route, rendering mode, dependency, or
  user workflow changes.
- Keep comments focused on intent or non-obvious framework behavior.

## Troubleshooting

### The page is not updating

The home page and tool pages use caching by design. Use
`npm --prefix client run dev`, then check
the route's `revalidate` or `dynamic` export in the matching file. See
[RENDERING.md](documentation/RENDERING.md) before changing caching behavior.

### The navigation looks stale

`client/components/layout/NavLinks.js` is a Client Component because it reads the
current pathname. Restart the development server after changing configuration
files, and check the browser console for compilation errors.

### The build fails after a dependency change

Run these commands from `client/` to reproduce the lockfile exactly, then run
`npm run lint` and `npm run build` separately. If a dependency is no longer used,
remove it from both `client/package.json` and `client/package-lock.json`.

If the build stops with a Next.js security warning, follow the recommended
Next.js upgrade path before deploying. Do not disable the guard as a workaround.

## Contributing

1. Create a focused branch from `main`.
2. Keep a change limited to one feature or documentation concern.
3. Run `npm run lint` and `npm run build`.
4. Update affected documentation and include a clear pull request description.
5. Ask for review before merging.

Use the [branch cheatsheet](documentation/.cheatsheet-git-branches.md) for
common Git commands.

## Team

- Yannis De Saint Loubert "supamen"
- Lilian Bulteau "lilianblt6"
- Arsène Léonard Barton--von Saurma "Omani29"

## License

The course project is distributed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
