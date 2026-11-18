# Polish plan

UI/UX polish to do once the team's features (auth, lists CRUD, profile) are
merged. Each item is small; check every page on desktop and mobile, in light and
dark mode, with no console errors.

## 1. Right after the merge

These files were polished and are likely to conflict with teammates' work.
Re-check them after merging, so the polish doesn't silently disappear:

- [ ] `client/lib/supabase.js`: tool queries load `category:categories!inner(slug, name)`
      and `mapTool` returns `categoryName`.
- [ ] `client/components/ToolCard.js`: shows `categoryName` and supports `hideCategory`.
- [ ] `client/app/page.js`: hero search capped to `max-w-xl`, 6 featured tools + "See all".
- [ ] `client/components/CategoryCard.js`: border + shadow hover, same as ToolCard.
- [ ] `client/components/layout/SearchBar.js`: search icon, SVG clear button, focus ring.
- [ ] `client/app/tool/[slug]/page.js`: breadcrumb, side-by-side cards, stats table.
- [ ] `client/app/category/[slug]/page.js`: breadcrumb, count, "Search in …", empty state.

## 2. List page (`/list`)

- [ ] Wire or remove the disabled "New list" button. On mobile it stretches full
      width: add `self-start sm:self-auto`.
- [ ] Empty state: "No lists yet", with "New list" as the main action and
      "Browse tools" (`/explore`) as the way out.
- [ ] A list with zero tools gets its own empty state.
- [ ] `loading.js` skeleton and `error.js` with retry, same pattern as `/explore`.
- [ ] Create / rename / delete: pending state on buttons, inline errors,
      confirmation before delete, success feedback.
- [ ] Logged-out visitor: clear message and a sign-in link, not an error.

## 3. Tool page (`/tool/[slug]`)

- [ ] Wire "Add to list" (choose a list, pending and success feedback); prompt
      sign-in when logged out.
- [ ] Replace the "About" placeholder text ("The full description, license and
      links will appear here.") with real content, or remove the card.
- [ ] Test a tool with no GitHub repo and one with no website.

## 4. Auth (sign up / sign in / GitHub / sign out)

- [ ] Forms: visible labels, error messages that say how to fix the problem,
      pending state on submit, keyboard focus.
- [ ] Header shows the signed-in state (desktop nav and mobile menu), with sign out.
- [ ] After sign-in, send the user back to the page they came from.

## 5. Pages not reviewed yet

- [ ] `/profile`
- [ ] `/contact` and `ContactForm` (all form states: pending, error, success)
- [ ] `/about`
- [ ] `/category` index: only 3 cards, consider a tool count per category
- [ ] 404 page (`not-found.js`)

## 6. Cross-cutting

- [ ] Breadcrumb markup is copied in the tool and category pages: extract a
      `Breadcrumb` component if a third page needs one.
- [ ] Explore on mobile: put the category select and Search button on one row.
- [ ] Chrome's native "×" in search inputs is not themed: hide it or style it.
- [ ] Header search animates its `width`: consider a transform/opacity version.
- [x] Shared `app/error.js` covers tool and category routes (explore keeps its own).
      No loading skeletons there: those pages are pre-built (SSG/ISR).
- [ ] Canonical URLs: set `metadataBase` once the deployed URL is known.
- [ ] Install eslint (ask the team first) and make `npm run lint` pass.

## 7. Final pass before delivery

- [ ] Every page: mobile 375px, tablet, desktop; light and dark.
- [ ] Keyboard only: every link and button reachable with a visible focus ring.
- [ ] No console errors, no horizontal scroll, no layout shift.
- [ ] Copy consistent: same words for the same things (tool, list, category).
