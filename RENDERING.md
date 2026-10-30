# Rendering guide

This document records the rendering decision for every current route. It is
deliberately based on the code in `app/`; update it whenever a route's data
requirements change.

## Quick reference

| Route | Source file | Mode | Why |
| --- | --- | --- | --- |
| `/` | `app/page.js` | ISR, 3,600 seconds | Public landing content can be cached and refreshed hourly |
| `/about` | `app/about/page.js` | Static | Content has no request-time data |
| `/category` | `app/category/page.js` | Static | Category index is currently placeholder content |
| `/category/[slug]` | `app/category/[slug]/page.js` | Static parameters | Known category pages are generated from `generateStaticParams` |
| `/tool/[slug]` | `app/tool/[slug]/page.js` | ISR, 60 seconds | Public tool details are cacheable and may change |
| `/explore` | `app/explore/page.js` | Dynamic | The future page will depend on request filters |
| `/list` | `app/list/page.js` | Dynamic | Lists will contain user-specific data |
| `/profile` | `app/profile/page.js` | Dynamic | Profiles will contain user-specific data |
| `/not-found` | `app/not-found.js` | Static | The fallback has no request-time data |

## Decision rules

### Static rendering (SSG)

Use static rendering when the output is the same for every visitor and does not
need request-time data. `dynamic = 'force-static'` makes that intent explicit on
the about and category index pages.

### Incremental Static Regeneration (ISR)

Use ISR for public pages that benefit from caching but need periodic refreshes.
`revalidate` is expressed in seconds:

```js
export const revalidate = 3600
```

The value is a product decision, not a default to copy blindly. Shorten it only
when the page has a real freshness requirement.

### Dynamic rendering (SSR)

Use `dynamic = 'force-dynamic'` when a page depends on request-time state, such
as URL filters or authenticated user data. Do not use it to bypass a data or
cache bug without documenting the reason.

### Client Components (CSR)

Client rendering is limited to interactive UI. `components/layout/NavLinks.js`
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
