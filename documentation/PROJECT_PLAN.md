# Project plan

This plan is intentionally short and outcome-based. It describes the work still
needed from the current prototype to the course-ready OpenFinder product. The
assignment constraints are in [PROJECT_INSTRUCTIONS.md](PROJECT_INSTRUCTIONS.md);
the official evaluation file is [PROJECT.md](../PROJECT.md).

## Current baseline

- Next.js 16, React 19, and Tailwind CSS v4 are installed.
- The App Router provides the public catalogue, search, tool details, account,
  personal-list, contact, suggestion, and moderation routes.
- Supabase migrations, seed data, server-side access, and RLS policies are
  versioned in the repository.
- Email authentication and private lists are implemented.
- Tool suggestions remain private until a moderator reviews them; approval does
  not automatically publish a tool.
- Unit tests, browser tests, pgTAP authorization tests, and CI are configured.
- The integration branch has passed lint, unit tests, production build,
  dependency audit, all 23 pgTAP assertions, and all 8 browser scenarios against
  local Supabase.

## Delivery order

### Milestone 1 — Foundation (complete)

- Establish the product vocabulary: resource, category, user, and list.
- Replace placeholder copy with the first coherent browse experience.
- Add error and loading UI where data is asynchronous.
- Add formatting, lint, and test commands that pass from a clean clone.

**Exit condition:** a new contributor can install, run, understand, and verify the
application locally.

### Milestone 2 — Catalog (complete)

- Add Supabase migrations, seed data, and typed data access.
- Implement category and resource pages.
- Add search, filtering, pagination, and empty states.
- Add metadata and canonical URLs for public pages.

**Exit condition:** a visitor can reliably find and open a seeded resource.

### Milestone 3 — Accounts and contribution (implemented)

- Add Supabase authentication and protected profile/list routes.
- Add CRUD for one main user-owned resource.
- Add RLS policies and tests for visitor, user, and privileged roles.
- Add server-side validation and clear authorization errors.

**Exit condition:** one user cannot read or modify another user's private data.
RLS checks are covered by pgTAP and run in the CI workflow.

### Milestone 4 — External data and quality (implemented)

- Integrate one public API behind a server-side data boundary.
- Cache and handle API failures without breaking resource pages.
- Add unit tests for validation/data mapping and an end-to-end happy path.
- Add CI for lint, build, and tests.

**Exit condition:** the critical user journey is repeatable and regression-tested.

### Milestone 5 — Delivery

- Run the CI workflow with local Supabase, pgTAP, and the authenticated browser
  scenarios.
- Configure production Supabase, confirmation email delivery, and trusted
  moderator assignment for the moderation feature.
- Deploy the application and database changes through Vercel and Supabase.
- Run a production smoke test, add presentation evidence, and rehearse the
  presentation.
- Complete [PROJECT.md](../PROJECT.md) without changing its template structure.

**Exit condition:** the deployed happy path works and every team member can
explain their area.

## Scope control

Prioritize the vertical slice: browse → search → authenticate → create content →
verify ownership. Personal lists and basic suggestion moderation are in scope.
Defer translations, reporting, advanced moderation workflows, and additional
integrations until the deployed happy path is stable.

For every new request, record:

1. The user outcome.
2. The affected route or module.
3. The acceptance check.
4. What is postponed if the work cannot fit the current milestone.

## Definition of done

A feature is complete when it:

- Matches the intended user outcome and existing naming conventions.
- Has loading, empty, invalid-input, unauthorized, and failure behavior where
  applicable.
- Uses the correct Server/Client Component boundary.
- Includes focused tests for security-sensitive or data-dependent behavior.
- Updates the relevant documentation and route/rendering table.
- Passes `npm run lint` and `npm run build`.
