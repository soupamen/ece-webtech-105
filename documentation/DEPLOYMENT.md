# Deployment guide

This guide covers local database verification and production release. The
repository does not contain production credentials; configure them only in
Supabase and Vercel.

## Local verification

Install dependencies from the repository root:

```sh
npm ci
npm ci --prefix client
npx supabase start
```

Create `client/.env.local` with the local Supabase API URL, publishable key, and
site URL. `npx supabase status -o env` prints local connection values; use only
the public API URL and anon/publishable key in the Next.js environment. Never
copy the service-role key into the client environment.

Supabase applies the migrations and seed data when the local stack starts. To
recreate the local database and apply all migrations from scratch, run:

```sh
npx supabase db reset
npx supabase test db
```

Build before running Playwright, because its web server starts the production
build:

```sh
npm --prefix client run lint
npm --prefix client test
npm --prefix client run build
cd client
npx playwright install chromium
SUPABASE_E2E_ENABLED=1 npm run test:e2e
```

The browser flow creates test accounts and exercises private lists and
suggestions. The CI workflow starts local Supabase, runs pgTAP, and enables the
authenticated browser tests.

## Production setup

1. Create a Supabase project and a Vercel project connected to this repository.
   Set the Vercel root directory to `client`.
2. Link the Supabase CLI to the intended production project, then apply the
   versioned migrations:

   ```sh
   export PROJECT_REF=your-project-ref
   npx supabase login
   npx supabase link --project-ref "$PROJECT_REF"
   npx supabase db push
   ```

   Review the migration list and target project before applying changes. Never
   run `supabase db reset` against production.
3. Configure these Vercel environment variables for the required environments:

   ```text
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   NEXT_PUBLIC_SITE_URL
   ```

   `NEXT_PUBLIC_SITE_URL` must be the canonical HTTPS origin of the deployed
   application. Do not configure a service-role key in the client or any
   `NEXT_PUBLIC_` variable.
4. In Supabase Auth URL configuration, set the production site URL and add the
   exact callback URL `https://your-domain.example/auth/callback`. Add local
   callback URLs only to the development project. Configure a production SMTP
   provider so confirmation messages can be delivered reliably.
   For GitHub OAuth, create a production OAuth app with the callback
   `https://<project-ref>.supabase.co/auth/v1/callback`, then add its Client
   ID and secret to the GitHub provider in the hosted Supabase dashboard.
5. Assign moderators through a trusted Supabase Auth Admin API operation by
   setting `app_metadata.role` to `moderator` for the intended user:

   ```js
   await supabaseAdmin.auth.admin.updateUserById(userId, {
     app_metadata: { role: 'moderator' },
   })
   ```

   `supabaseAdmin` must use the service-role key and run only in a trusted
   administrative server environment, never in a browser or client action. Do
   not use user-editable metadata for moderator access. A user must refresh
   their session after the claim changes.
6. Deploy and verify the production flow:
   - create an account and confirm it using the production email link;
   - sign in, create and edit a private list, and sign out;
   - submit a tool suggestion and verify it remains pending and private;
   - sign in as a moderator and approve or reject the suggestion;
   - confirm a regular account cannot read another user's lists or review
     suggestions.

## Release checks

- The GitHub Actions workflow passes lint, unit tests, dependency audit, pgTAP,
  production build, and the authenticated browser journeys.
- Vercel has the production environment variables and a successful build.
- Supabase has all repository migrations applied, RLS enabled, and production
  email delivery configured.
- The deployed URL, screenshots, and presentation evidence are recorded in the
  course evaluation document by the team.
