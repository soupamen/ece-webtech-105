# Rendering guide

This document records the rendering decision for every current route. It is
deliberately based on the code in `client/app/`; update it whenever a route's data
requirements change.

## Quick reference

| Route | Source file | Mode | Why |
| --- | --- | --- | --- |
| `/` | `client/app/page.js` | Dynamic, public data cached 3,600 seconds | Renders per request; categories and tools come from cached queries |
| `/about` | `client/app/about/page.js` | Static (`force-static`) | Content has no request-time data |
| `/category` | `client/app/category/page.js` | Dynamic, public data cached 3,600 seconds | The page uses dynamic rendering and a cached public category query |
| `/category/[slug]` | `client/app/category/[slug]/page.js` | Dynamic, public data cached 3,600 seconds | Category details and tools use cached public queries |
| `/tool/[slug]` | `client/app/tool/[slug]/page.js` | Dynamic (reads cookies), public data cached 60 seconds | The save control depends on the signed-in user |
| `/contact` | `client/app/contact/page.js` | Static (`force-static`) | The form submits through a client interaction |
| `/explore` | `client/app/explore/page.js` | Dynamic | Results depend on URL search, category, and page parameters |
| `/list` | `client/app/list/page.js` | Dynamic | Lists contain user-specific data |
| `/profile` | `client/app/profile/page.js` | Dynamic | Account state depends on the signed-in user |
| `/auth/login` | `client/app/auth/login/page.js` | Dynamic (reads `searchParams`) | Form state depends on the requested return path |
| `/auth/signup` | `client/app/auth/signup/page.js` | Dynamic (reads `searchParams`) | Form state depends on the requested return path |
| `/auth/callback` | `client/app/auth/callback/route.js` | Dynamic | Exchanges a one-time email-confirmation code |
| `/suggest` | `client/app/suggest/page.js` | Dynamic | Shows private submissions and writes for the signed-in user |
| `/moderation` | `client/app/moderation/page.js` | Dynamic | Reads private suggestions for authorized moderators |
| `404` | `client/app/not-found.js` | Static | The fallback has no request-time data |

No route currently uses route-level ISR. Public catalogue data is cached at the
query level instead (see below).

## Decision rules

### Static rendering (SSG)

Use static rendering when the output is the same for every visitor and does not
need request-time data. `/about` and `/contact` export
`dynamic = 'force-static'`; the not-found fallback has no request-time data.
Unknown category and tool slugs keep the existing `notFound()` behavior.

### Cached data in dynamic routes

Public catalogue queries in `client/lib/supabase.js` are wrapped in
`unstable_cache`, so a dynamic page does not hit Supabase on every request:

| Query | Cache |
| --- | --- |
| `getCategories`, `getTools`, category by slug, tools by category | 3,600 seconds |
| `getTool` (tool detail) | 60 seconds |
| GitHub repository metadata (`client/lib/github.js`) | 60 seconds, `fetch` cache |

The values are product decisions, not defaults to copy blindly. Shorten them
only when the data has a real freshness requirement. GitHub failures are handled
as an empty optional section, so the Supabase-backed tool page remains
available.

### Incremental Static Regeneration (ISR)

ISR (`export const revalidate = <seconds>`) fits a public page whose output is
the same for every visitor. It has no effect on a page that reads cookies:
`/tool/[slug]` exports `revalidate = 60`, but it reads the session through
`createSupabaseServerClient()`, so Next.js renders it per request. Its freshness
comes from the 60-second query and GitHub caches above.

### Dynamic rendering (SSR)

Use `dynamic = 'force-dynamic'` when a page depends on request-time state, such
as URL filters or authenticated user data. `/explore` reads `q`, `category`, and
`page` from the URL and performs the filtered, counted Supabase query on every
request. The home and category routes use dynamic rendering while caching their
public catalogue queries. Account, list, suggestion, and moderation routes use
cookies and user-specific Supabase access, so they must not be statically
rendered or shared between users. Tool detail also reads the session to render
the correct save action. The authenticated routes set `noindex` metadata where
appropriate. Do not use dynamic rendering to bypass a data or cache bug without
documenting the reason.

### Loading and error boundaries

- `client/app/loading.js` shows a skeleton grid while any dynamic route renders.
- `client/app/error.js` is the shared error boundary with a retry button.
- `/explore` has its own `loading.js` and `error.js` matching its layout.

### Client Components (CSR)

Client rendering is limited to interactive UI. Each file below uses
`'use client'` for a concrete reason:

| File | Reason |
| --- | --- |
| `components/layout/NavLinks.js` | `usePathname()` marks the active link |
| `components/layout/ThemeToggle.js` | Reads and toggles the theme in the browser (`useSyncExternalStore`) |
| `components/SearchBar.js` | Submits the form when the category select changes (`onChange`) |
| `components/SubmitButton.js` | `useFormStatus()` pending state for server actions |
| `components/ContactForm.js` | Form state and validation messages |
| `components/SuggestToolForm.js` | Client-side validation before submitting |
| `app/error.js`, `app/explore/error.js` | Error boundaries must be Client Components |

`components/lists/AddToolToListForm.js` stays a Server Component: it posts to a
server action and delegates the pending state to `SubmitButton`. Keep the
surrounding layout and pages as Server Components.

## Adding or changing a route

1. Decide whether the output is public and cacheable, request-dependent, or
   interactive.
2. Add the smallest explicit export that expresses that decision.
3. Add or update the route in the table above.
4. Run `npm run build` and inspect the route behavior locally.
5. If the route becomes user-specific, review data access and security before
   shipping it.
