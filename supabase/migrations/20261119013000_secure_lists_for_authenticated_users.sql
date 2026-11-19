alter table public.lists
  alter column user_id set default auth.uid();

drop policy "Users can read their own lists" on public.lists;
drop policy "Users can create their own lists" on public.lists;
drop policy "Users can update their own lists" on public.lists;
drop policy "Users can delete their own lists" on public.lists;

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
