create table public.tool_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  alternative_to text not null,
  description text not null,
  github_repo text,
  website_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  moderator_note text,
  created_at timestamptz not null default now(),
  constraint tool_submissions_name_length
    check (char_length(btrim(name)) between 1 and 80),
  constraint tool_submissions_alternative_length
    check (char_length(btrim(alternative_to)) between 1 and 100),
  constraint tool_submissions_description_length
    check (char_length(btrim(description)) between 1 and 500),
  constraint tool_submissions_github_repo_length
    check (github_repo is null or char_length(github_repo) <= 100),
  constraint tool_submissions_website_url_length
    check (website_url is null or char_length(website_url) <= 2048),
  constraint tool_submissions_moderator_note_length
    check (moderator_note is null or char_length(moderator_note) <= 500)
);

create index tool_submissions_status_created_at_idx
  on public.tool_submissions(status, created_at desc);
create index tool_submissions_user_id_created_at_idx
  on public.tool_submissions(user_id, created_at desc);

alter table public.tool_submissions enable row level security;

create function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'moderator',
    false
  );
$$;

revoke all on function public.is_moderator() from public;
grant execute on function public.is_moderator() to authenticated;

create policy "Users can read their submissions and moderators can read all"
  on public.tool_submissions for select
  to authenticated
  using (auth.uid() = user_id or public.is_moderator());

create policy "Users can submit pending suggestions"
  on public.tool_submissions for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and moderator_note is null
  );

create policy "Moderators can update submissions"
  on public.tool_submissions for update
  to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

create policy "Moderators can delete submissions"
  on public.tool_submissions for delete
  to authenticated
  using (public.is_moderator());
