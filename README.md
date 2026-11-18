

# OpenFinder

OpenFinder helps you find an open-source replacement for the proprietary
software you already use.

Live demo: <https://openfinder-ivory.vercel.app>

## Tech stack

- Frontend: Next.js 16 (App Router, Server Components) and React 19
- Styling: Tailwind CSS v4 with Radix UI primitives
- Backend: Supabase (PostgreSQL, Auth, Row Level Security)
- External API: GitHub REST API for repository stars, forks and license
- Tests: Node test runner, Playwright and pgTAP, run in GitHub Actions
- Hosting: Vercel and Supabase

## User guide

The app currently covers three kinds of use.

### Browsing, no account needed

Search for a tool you already use, such as Notion, from the home page. Explore
lets you combine a search with a category filter and pages through the
results, and Categories lists every tool in a category. A tool page shows what
the tool replaces, a link to its website and live stats from its GitHub
repository. The Contact page sends a message to the team.

### With an account

Create an account from Profile > Create account and confirm your email. You
can then keep personal lists in My lists (create, rename, delete) and save a
tool to one of them from its page with Add to list. Suggest a tool sends a new
tool to the moderators, and its status (pending, approved or rejected) appears
on the same page. Sign out from Profile.

### Moderators

Moderators review the suggestions on `/moderation` and approve or reject them.
Approved tools are added to the catalogue by hand.

## Documentation map

| Document | Use it for |
| --- | --- |
| [Architecture](documentation/ARCHITECTURE.md) | Repository structure, route responsibilities, and extension rules |
| [Rendering guide](documentation/RENDERING.md) | Why each route is static, dynamic, or incrementally regenerated |
| [Deployment guide](documentation/DEPLOYMENT.md) | Supabase and Vercel setup, release, and smoke checks |
| [Evaluation template](PROJECT.md) | Official self-evaluation; this file is maintained separately |

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

1. At the repository root, install the Supabase CLI and start the local
   database:

   ```bash
   git clone https://github.com/soupamen/ece-webtech-105.git
   cd ece-webtech-105
   npm ci
   npx supabase start
   ```

2. Move into the app folder and install its dependencies:

   ```bash
   cd client
   npm ci
   ```

3. Copy `.env.example` to `.env.local` and fill it with the URL and
   publishable key printed by `npx supabase start` in step 1.

4. Start the app, then open <http://localhost:3000>:

   ```bash
   npm run dev
   ```

5. Run the unit tests from `client/`, then the database RLS tests from the
   root:

   ```bash
   npm test
   cd ..
   npx supabase test db
   ```

## Team

- Yannis De Saint Loubert "supamen"
- Lilian Bulteau "lilianblt6"
- Arsène Léonard Barton--von Saurma "Omani29"

## License

The course project is distributed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
