begin;

create extension if not exists pgtap with schema extensions;

select plan(12);

insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'owner@example.test',
    'not-a-real-password',
    now(),
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'other@example.test',
    'not-a-real-password',
    now(),
    now(),
    now()
  );

select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

-- The owner can insert their own list.
select lives_ok(
  $$
    insert into public.lists (id, user_id, name)
    values (
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      '11111111-1111-4111-8111-111111111111',
      'private list'
    )
  $$,
  'an owner can create a list'
);
-- The owner can read it back.
select is(
  (select count(*) from public.lists where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  1::bigint,
  'an owner can read their list'
);
-- The owner can add a catalogue tool to it.
select lives_ok(
  $$
    insert into public.list_items (list_id, tool_id)
    select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', id
    from public.tools
    where slug = 'penpot'
  $$,
  'an owner can add a catalogue tool to their list'
);
-- The owner can read their list items.
select is(
  (select count(*) from public.list_items where list_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  1::bigint,
  'an owner can read their list items'
);

select set_config(
  'request.jwt.claim.sub',
  '22222222-2222-4222-8222-222222222222',
  true
);
-- Another user sees none of the owner's lists.
select is(
  (select count(*) from public.lists where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  0::bigint,
  'another user cannot read the list'
);
-- The update runs without error but RLS matches zero rows (checked below).
select lives_ok(
  $$
    update public.lists
    set name = 'stolen'
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  $$,
  'another user cannot update the list'
);
-- Same for delete: zero rows affected.
select lives_ok(
  $$
    delete from public.lists
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
  $$,
  'another user cannot delete the list'
);
-- Another user sees none of the owner's list items.
select is(
  (select count(*) from public.list_items where list_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  0::bigint,
  'another user cannot read list items'
);
-- Inserting a list with someone else's user_id is rejected.
select throws_ok(
  $$
    insert into public.lists (user_id, name)
    values (
      '11111111-1111-4111-8111-111111111111',
      'for another user'
    )
  $$,
  '42501',
  null,
  'another user cannot create a list for the owner'
);
-- Adding a tool to someone else's list is rejected.
select throws_ok(
  $$
    insert into public.list_items (list_id, tool_id)
    select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', id
    from public.tools
    where slug = 'appflowy'
  $$,
  '42501',
  null,
  'another user cannot add an item to the owners list'
);

select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  true
);
-- Back as the owner: the name survived the update attempt.
select is(
  (select name from public.lists where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  'private list',
  'unauthorized updates did not change the list'
);
-- The item survived the other user's attempts.
select is(
  (select count(*) from public.list_items where list_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  1::bigint,
  'unauthorized changes did not alter list items'
);

select * from finish();
rollback;
