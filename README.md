

# OpenFinder

OpenFinder is the WebTech 105 team project: a directory for discovering open-source
alternatives to software and online services. The public catalogue is backed by
Supabase and the remaining user-facing features are being introduced incrementally.

## Documentation map

| Document | Use it for |
| --- | --- |
| [Architecture](documentation/ARCHITECTURE.md) | Repository structure, route responsibilities, and extension rules |
| [Rendering guide](documentation/RENDERING.md) | Why each route is static, dynamic, or incrementally regenerated |
| [Project plan](documentation/PROJECT_PLAN.md) | Current scope, milestones, and definition of done |
| [Course requirements](documentation/PROJECT_INSTRUCTIONS.md) | Technical and presentation requirements |
| [Git branch cheatsheet](documentation/.cheatsheet-git-branches.md) | Common branch and collaboration commands |
| [Evaluation template](documentation/PROJECT.md) | Official self-evaluation; this file is maintained separately |

## Current status

Implemented in the prototype:

- Next.js 16 App Router with React 19
- Shared root layout and navigation
- Home, about, explore, category, tool, list, profile, and not-found routes
- Tailwind CSS v4 through the PostCSS plugin
- Supabase migrations, seed data, RLS, and server-side data access
- Catalogue search, category filtering, and pagination
- Server-side GitHub repository information on tool pages
- Route rendering using SSG, ISR, and SSR
- Responsive navigation styling and dark-mode utility classes

Not implemented yet:

- Supabase authentication
- User-facing list and profile features
- Contact form and moderation
- Automated tests and CI
- Full Vercel deployment verification

The project plan is the source of truth for the order in which these capabilities
should be added. Do not document planned behavior as implemented behavior.

Known setup limitations:

- The `lint` script exists, but ESLint is not yet included in `package.json`; the
  foundation milestone must add and configure it.
- `npm audit` currently reports two moderate vulnerabilities through `nodemon`
  and `minimatch`.

### Next.js security upgrade

The current `main` uses Next.js 16.4.5. The earlier `security/next-upgrade`
branch was an isolated test of 16.4.3 from an older base; it is not needed to
use or integrate the update on `main`.

## Prerequisites

- Node.js 26.x, or the version selected by the team for the current milestone
- npm 10+
- Git

Check the installed versions before starting:

```bash
node --version
npm --version
```

## Run locally

```bash
git clone https://github.com/soupamen/ece-webtech-105.git
cd ece-webtech-105
cd client
npm ci
npm run dev
```

Open <http://localhost:3000>. The development server reloads when application
files change. Stop it with `Ctrl+C`.

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Apply safe ESLint fixes |

The application requires these variables in `client/.env.local` for local
development and in Vercel for each relevant environment:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use only the public Supabase URL and publishable/anon key. Never commit
credentials or service-role keys.

## Route overview

| Route | Purpose | Current rendering |
| --- | --- | --- |
| `/` | Project landing page | ISR, 1 hour |
| `/about` | Project information | Static |
| `/explore` | Search, category filtering, and pagination | Dynamic |
| `/category` | Category index from Supabase | Static |
| `/category/[slug]` | Category detail from Supabase | Static parameters |
| `/tool/[slug]` | Tool detail and GitHub information | ISR, 60 seconds |
| `/list` | Future personal lists surface | Dynamic |
| `/profile` | Future personal profile surface | Dynamic |
| `/not-found` | Fallback for unknown routes | Static |

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
through RLS. The `lists` and `list_items` tables are prepared for authenticated
users and restrict access to each user's own lists.

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
- Use descriptive names and small components.
- Update the relevant documentation when a route, rendering mode, dependency, or
  user workflow changes.
- Keep comments focused on intent or non-obvious framework behavior.

## Troubleshooting

### The page is not updating

The home page and tool pages use caching by design. Use `npm run dev`, then check
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
