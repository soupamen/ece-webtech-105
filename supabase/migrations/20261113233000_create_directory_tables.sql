create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  alternative_to text not null,
  description text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index tools_category_id_idx on public.tools(category_id);

alter table public.categories enable row level security;
alter table public.tools enable row level security;

create policy "Categories are publicly readable"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Tools are publicly readable"
  on public.tools for select
  to anon, authenticated
  using (true);
