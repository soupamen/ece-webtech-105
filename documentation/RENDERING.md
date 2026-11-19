# Rendering guide

This document records the rendering decision for every current route. It is
deliberately based on the code in `client/app/`; update it whenever a route's data
requirements change.

## Quick reference

| Route | Source file | Mode | Why |
| --- | --- | --- | --- |
| `/` | `client/app/page.js` | ISR, 3,600 seconds | Public landing content can be cached and refreshed hourly |
| `/about` | `client/app/about/page.js` | Static | Content has no request-time data |
| `/category` | `client/app/category/page.js` | Dynamic, public data cached 3,600 seconds | The page uses dynamic rendering and a cached public category query |
| `/category/[slug]` | `client/app/category/[slug]/page.js` | Dynamic, public data cached 3,600 seconds | Category details and tools use cached public queries |
| `/tool/[slug]` | `client/app/tool/[slug]/page.js` | Dynamic, public data cached 60 seconds | The save control depends on the signed-in user |
| `/contact` | `client/app/contact/page.js` | Static shell | The route is public; the form submits through a client interaction |
| `/explore` | `client/app/explore/page.js` | Dynamic | Results depend on URL search, category, and page parameters |
| `/list` | `client/app/list/page.js` | Dynamic | Lists contain user-specific data |
| `/profile` | `client/app/profile/page.js` | Dynamic | Account state depends on the signed-in user |
| `/auth/login` | `client/app/auth/login/page.js` | Dynamic | Form state depends on the requested return path |
| `/auth/signup` | `client/app/auth/signup/page.js` | Dynamic | Form state depends on the requested return path |
| `/auth/callback` | `client/app/auth/callback/route.js` | Dynamic | Exchanges a one-time email-confirmation code |
| `/suggest` | `client/app/suggest/page.js` | Dynamic | Shows private submissions and writes for the signed-in user |
| `/moderation` | `client/app/moderation/page.js` | Dynamic | Reads private suggestions for authorized moderators |
| `404` | `client/app/not-found.js` | Static | The fallback has no request-time data |

## Decision rules

### Static rendering (SSG)

Use static rendering when the output is the same for every visitor and does not
need request-time data. The about page and not-found fallback have no
request-time data. Unknown category and tool slugs keep the existing
`notFound()` behavior.

### Incremental Static Regeneration (ISR)

Use ISR for public pages that benefit from caching but need periodic refreshes.
`revalidate` is expressed in seconds:

```js
export const revalidate = 3600
```

The value is a product decision, not a default to copy blindly. Shorten it only
when the page has a real freshness requirement.

Tool pages also fetch optional GitHub repository metadata from the server with a
60-second fetch cache. GitHub failures are handled as an empty optional section,
so the Supabase-backed page remains available.

### Dynamic rendering (SSR)

Use `dynamic = 'force-dynamic'` when a page depends on request-time state, such
as URL filters or authenticated user data. `/explore` reads `q`, `category`, and
`page` from the URL and performs the filtered, counted Supabase query on every
request. Category routes use dynamic rendering while caching their public
catalogue queries. Account, list, suggestion, and moderation routes use cookies
and user-specific Supabase access, so they must not be statically rendered or
shared between users. Tool detail also reads the session to render the correct
save action; its public catalogue and GitHub data remain cached. The
authenticated routes set `noindex` metadata where appropriate. Do not use
dynamic rendering to bypass a data or cache bug without documenting the reason.

### Client Components (CSR)

Client rendering is limited to interactive UI. `client/components/layout/NavLinks.js`
uses `'use client'` because it reads `usePathname()` to mark the active link.
`client/components/lists/AddToolToListForm.js` uses it for the user's list
selection when saving a tool. Keep the surrounding layout and pages as Server
Components.

## Adding or changing a route

1. Decide whether the output is public and cacheable, request-dependent, or
   interactive.
2. Add the smallest explicit export that expresses that decision.
3. Add or update the route in the table above.
4. Run `npm run build` and inspect the route behavior locally.
5. If the route becomes user-specific, review data access and security before
   shipping it.

