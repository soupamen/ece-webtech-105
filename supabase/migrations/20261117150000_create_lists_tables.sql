create table public.lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.list_items (
  list_id uuid not null references public.lists(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (list_id, tool_id)
);

create index lists_user_id_idx on public.lists(user_id);
create index list_items_tool_id_idx on public.list_items(tool_id);

alter table public.lists enable row level security;
alter table public.list_items enable row level security;

create policy "Users can read their own lists"
  on public.lists for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own lists"
  on public.lists for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own lists"
  on public.lists for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own lists"
  on public.lists for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can read items from their own lists"
  on public.list_items for select
  to authenticated
  using (
    exists (
      select 1
      from public.lists
      where lists.id = list_items.list_id
        and lists.user_id = auth.uid()
    )
  );

create policy "Users can add items to their own lists"
  on public.list_items for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.lists
      where lists.id = list_items.list_id
        and lists.user_id = auth.uid()
    )
  );

create policy "Users can update items from their own lists"
  on public.list_items for update
  to authenticated
  using (
    exists (
      select 1
      from public.lists
      where lists.id = list_items.list_id
        and lists.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.lists
      where lists.id = list_items.list_id
        and lists.user_id = auth.uid()
    )
  );

create policy "Users can remove items from their own lists"
  on public.list_items for delete
  to authenticated
  using (
    exists (
      select 1
      from public.lists
      where lists.id = list_items.list_id
        and lists.user_id = auth.uid()
    )
  );
