# OpenFinder

OpenFinder is the WebTech 105 team project: a directory for discovering open-source
alternatives to software and online services. The repository currently contains the
navigation shell and representative Next.js routes; data, authentication, and
user-facing features are still to be implemented.

## Documentation map

| Document | Use it for |
| --- | --- |
| [Architecture](architecture.md) | Repository structure, route responsibilities, and extension rules |
| [Rendering guide](RENDERING.md) | Why each route is static, dynamic, or incrementally regenerated |
| [Project plan](Project_Plan.md) | Current scope, milestones, and definition of done |
| [Course requirements](PROJECT_INSTRUCTIONS.md) | Technical and presentation requirements |
| [Git branch cheatsheet](.cheatsheet-git-branches.md) | Common branch and collaboration commands |
| [Evaluation template](PROJECT.md) | Official self-evaluation; this file is maintained separately |

## Current status

Implemented in the prototype:

- Next.js 16 App Router with React 19
- Shared root layout and navigation
- Home, about, explore, category, tool, list, profile, and not-found routes
- Tailwind CSS v4 through the PostCSS plugin
- Route examples using SSG, ISR, and SSR
- Responsive navigation styling and dark-mode utility classes

Not implemented yet:

- Supabase database and authentication
- Resource and category data
- Search, filtering, lists, profiles, and moderation
- Automated tests and CI
- Production deployment

The project plan is the source of truth for the order in which these capabilities
should be added. Do not document planned behavior as implemented behavior.

Known setup limitations:

- The `lint` script exists, but ESLint is not yet included in `package.json`; the
  foundation milestone must add and configure it.
- The current Next.js version is blocked by its security upgrade guard during
  `npm run build`; upgrade Next.js before treating a production build as valid.

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

There are no environment variables required by the current prototype. Add an
`.env.example` in the same change that introduces the first environment variable.
Never commit credentials or service-role keys.

## Route overview

| Route | Purpose | Current rendering |
| --- | --- | --- |
| `/` | Project landing page | ISR, 1 hour |
| `/about` | Project information | Static |
| `/explore` | Future resource browsing surface | Dynamic |
| `/category` | Category index placeholder | Static |
| `/category/[slug]` | Category detail placeholder | Static parameters |
| `/tool/[slug]` | Tool detail placeholder | ISR, 60 seconds |
| `/list` | Future personal lists surface | Dynamic |
| `/profile` | Future personal profile surface | Dynamic |
| `/not-found` | Fallback for unknown routes | Static |

See the [rendering guide](RENDERING.md) for the reasoning and the exact source
files behind each entry.

## Development conventions

- Keep routes in `app/` and reusable UI in `components/`.
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
[RENDERING.md](RENDERING.md) before changing caching behavior.

### The navigation looks stale

`components/layout/NavLinks.js` is a Client Component because it reads the current
pathname. Restart the development server after changing configuration files, and
check the browser console for compilation errors.

### The build fails after a dependency change

Run `npm ci` to reproduce the lockfile exactly, then run `npm run lint` and
`npm run build` separately. If a dependency is no longer used, remove it from
both `package.json` and `package-lock.json`.

If the build stops with a Next.js security warning, follow the recommended
Next.js upgrade path before deploying. Do not disable the guard as a workaround.

## Contributing

1. Create a focused branch from `main`.
2. Keep a change limited to one feature or documentation concern.
3. Run `npm run lint` and `npm run build`.
4. Update affected documentation and include a clear pull request description.
5. Ask for review before merging.

Use the [branch cheatsheet](.cheatsheet-git-branches.md) for common Git commands.

## Team

- Yannis De Saint Loubert "supamen"
- Lilian Bulteau "lilianblt6"
- Arsène Léonard Barton--von Saurma "Omani29"

## License

The course project is distributed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
