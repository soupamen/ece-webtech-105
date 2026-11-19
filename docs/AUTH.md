# Authentication

OpenFinder uses Supabase Auth for email/password and GitHub OAuth.

## Environments

| Item | Local | Production |
| --- | --- | --- |
| Next.js | `http://localhost:3000` | `https://openfinder-ivory.vercel.app` |
| Supabase | `http://127.0.0.1:54321` | Hosted project `qedzcmnnbauavbyecqmp` |
| Supabase callback | `http://127.0.0.1:54321/auth/v1/callback` | `https://qedzcmnnbauavbyecqmp.supabase.co/auth/v1/callback` |
| Email testing | Mailpit: `http://127.0.0.1:54324` | Configured transactional SMTP |
| GitHub OAuth | Local OAuth app | Production OAuth app |
| Session storage | Supabase SSR cookies | Supabase SSR cookies |

## Local setup

Add only the public Supabase values to `client/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
SUPABASE_AUTH_GITHUB_CLIENT_ID=<github-client-id>
SUPABASE_AUTH_GITHUB_SECRET=<github-client-secret>
```

The two GitHub variables are server/provider secrets. They must not be prefixed
with `NEXT_PUBLIC_` and must not be added to browser code.

## Email/password

- `/login` supports sign up and sign in with email/password.
- Email confirmation is controlled by `supabase/config.toml`.
- With the local stack, confirmation emails appear in Mailpit.
- `AuthStatus` subscribes to auth state changes and shows the signed-in email or
  a login button in the header.

Useful local commands:

```bash
npm exec supabase -- start
npm exec supabase -- db reset
npm exec supabase -- stop
```

## GitHub OAuth

Create a local GitHub OAuth app with:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL:
  `http://127.0.0.1:54321/auth/v1/callback`

Set `SUPABASE_AUTH_GITHUB_CLIENT_ID` and
`SUPABASE_AUTH_GITHUB_SECRET` in `client/.env.local`, enable
`[auth.external.github]` in `supabase/config.toml`, and restart Supabase.

Next.js `/auth/callback` exchanges the OAuth code for a session and redirects
to a safe local path. The `next` parameter is accepted only as a same-app path.

## Protected collections

The `lists` table is protected by RLS:

- `user_id` defaults to `auth.uid()`;
- authenticated users can read, create, update, and delete only their own lists;
- anonymous users receive no list rows and cannot write to `lists`;
- `/list` uses a server Supabase client and remains dynamic.

The browser form uses the authenticated user's session; it does not send a
trusted `userId`. Database RLS remains the final authorization boundary.

## Production status

- GitHub OAuth has been configured in Supabase and Vercel.
- The OAuth callback is not yet verified as fully successful.
- SMTP confirmation is not yet verified as fully successful.
- Supabase hosted secrets must stay out of Git and Vercel client variables.

## OAuth actors

Complete this section after observing a real OAuth flow.

- **Resource Owner:** <!-- Prediction: -->
- **Client:** <!-- Prediction: -->
- **Authorization Server:** <!-- Prediction: -->
- **Resource Server:** <!-- Prediction: -->
