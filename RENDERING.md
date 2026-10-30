#lab rendering

## audit

| Page | Data source | Update | Personalized | SEO | Rendering 
|---|---|---|---|---|---|
| `/` | Database | Rare | No | Yes | ISR | 
| `/about` | None | Never | No | Yes | SSG | 
| `/category/[slug]` | Database | Rare | No | Yes | SSG params | 
| `/tool/[slug]` | Database | Sometimes | No | Yes | ISR |
| `/explore` | Database | Often | No | Base | SSR |
| `/list` | User | Often | Yes | No | SSR |
| `/list/[id]` | User | Sometimes | No | Yes | ISR |
| `/profile` | User | Often | Yes | No | SSR |
| `/admin` | Database | Often | Role | No | SSR |
| `/login` | None | Never | No | No | SSG + CSR |
| `/not-found` | None | Never | No | NO | SSG |

## CSR components 

- Searchabar and filters (`/explore`): updates results while typing, no page reload.
- Add to list (`/tool/[slug]`): depends on the logged-in user.
- Like button (`/tool/[slug]`): instant click feedback, user-specific state.
- LoginForm (`/login`): Supabase auth runs in the browser.
- ListEditor (`/list`): user edits their own lists .

A page stays SSG/ISR for SEO and speed. Only the small interactive or user-specific parts become CSR components.

## Strategy

**SSG** (built once, never changes)
- `/about`, `/not-found`: static content, no data.
- `/category/[slug]`: categories rarely change, so build every page once with `generateStaticParams`.
- `/login`: the page is static only the form is interactive (CSR).

**ISR** (static, refreshed after a delay)
- `/`: needs SEO and speed, and the data changes slowly, so refresh every hour.
- `/tool/[slug]`: SEO but tools change sometimes, so a short refresh (60 s).
- `/list/[id]`: public and SEO refreshed on demand with when the owner edits it.

**SSR** (rendered on every request)
- `/explore`: results depend on the filters in the URL so they can't be pre-built.
- `/list`, `/profile`: personal data so they can't be cached or shared.
- `/admin`: must always be fresh.

**CSR** (in the browser)
- Search bar, likes, comments, add to list: interactive or user-specific, small client components inside static pages.
