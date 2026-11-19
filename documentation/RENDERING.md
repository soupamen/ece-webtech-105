# Rendering guide

This document records the rendering decision for every current route. It is
deliberately based on the code in `client/app/`; update it whenever a route's data
requirements change.

## Quick reference

| Route | Source file | Mode | Why |
| --- | --- | --- | --- |
| `/` | `client/app/page.js` | ISR, 3,600 seconds | Public landing content can be cached and refreshed hourly |
| `/about` | `client/app/about/page.js` | Static | Content has no request-time data |
| `/category` | `client/app/category/page.js` | Static | Category index is read from Supabase at build time |
| `/category/[slug]` | `client/app/category/[slug]/page.js` | Static parameters | Known category pages are generated from Supabase data |
| `/tool/[slug]` | `client/app/tool/[slug]/page.js` | ISR, 60 seconds | Public tool details and optional GitHub data are cacheable |
| `/explore` | `client/app/explore/page.js` | Dynamic | Results depend on URL search, category, and page parameters |
| `/login` | `client/app/login/page.js` | Static | The login form uses browser state and Supabase Auth |
| `/auth/callback` | `client/app/auth/callback/route.js` | Dynamic | Exchanges an OAuth code and writes the session |
| `/list` | `client/app/list/page.js` | Dynamic | Lists contain request-specific authenticated user data |
| `/profile` | `client/app/profile/page.js` | Dynamic | Profiles will contain user-specific data |
| `/not-found` | `client/app/not-found.js` | Static | The fallback has no request-time data |

## Decision rules

### Static rendering (SSG)

Use static rendering when the output is the same for every visitor and does not
need request-time data. `dynamic = 'force-static'` makes that intent explicit on
the about and category index pages. The public catalogue is read from Supabase
during the static build.

The `/category/[slug]` and `/tool/[slug]` parameters are generated from
Supabase catalogue data. Unknown slugs keep the existing `notFound()` behavior.

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
request. Do not use dynamic rendering to bypass a data or cache bug without
documenting the reason.

### Client Components (CSR)

Client rendering is limited to interactive UI. `client/components/layout/NavLinks.js`
uses `'use client'` because it reads `usePathname()` to mark the active link.
Keep the surrounding layout and pages as Server Components.

## Adding or changing a route

1. Decide whether the output is public and cacheable, request-dependent, or
   interactive.
2. Add the smallest explicit export that expresses that decision.
3. Add or update the route in the table above.
4. Run `npm run build` and inspect the route behavior locally.
5. If the route becomes user-specific, review data access and security before
   shipping it.

