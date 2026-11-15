create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

-- Anyone can send a message; no select policy, so nobody can read them back.
create policy "Anyone can send a contact message"
  on public.contacts for insert
  to anon, authenticated
  with check (true);
