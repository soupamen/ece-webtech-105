# Course requirements

This document is the compact implementation checklist for the WebTech 105
assignment. The official self-evaluation remains in [PROJECT.md](../PROJECT.md),
which must not be edited as part of documentation maintenance.

## Required stack and security

- Next.js App Router with Server Components, layouts, and loading or error UI.
- Supabase for authentication and database access.
- Row Level Security (RLS): a user must not edit another user's data.
- Tailwind CSS for styling.

These are assignment requirements, not a description of what the current
prototype already provides. Track implementation status in
[PROJECT_PLAN.md](PROJECT_PLAN.md).

## Minimum product requirements

The finished application must provide:

- A clear product concept and responsive, consistent user experience.
- Sign-up, sign-in, sign-out, and visible authentication state.
- CRUD for at least one main resource.
- At least one relationship between database tables.
- Search or filtering for the main resource.
- Data from at least one public external API.
- Graceful loading, empty, and error states.
- Correct separation between Server Components and Client Components.
- RLS policies that are tested, not only described.

## Delivery requirements

- A private GitHub repository shared with the instructor.
- A deployed application using Vercel and Supabase.
- A README with the product pitch, stack, prerequisites, local setup, and user
  guide.
- A completed [PROJECT.md](PROJECT.md) self-evaluation.
- A fifteen-minute presentation covering the pitch, happy path, and technical
  questions.

## Quality expectations

Use meaningful names, concise documentation, consistent formatting, and comments
only where intent is not obvious. Test the behavior that protects the product:
authentication, authorization, CRUD, search, and the main user journey. Document
security decisions, external dependencies, error behavior, and changes that
affect contributors.
