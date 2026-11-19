begin;

create extension if not exists pgtap with schema extensions;

select plan(3);

set local role anon;

-- The insert policy lets anyone use the contact form.
select lives_ok(
  $$
    insert into public.contacts (name, email, message)
    values ('Guest', 'guest@example.test', 'Hello from the RLS test')
  $$,
  'a guest can send a contact message'
);
-- No select policy: the row just inserted stays invisible to guests.
select is(
  (select count(*) from public.contacts),
  0::bigint,
  'a guest cannot read contact messages'
);

set local role authenticated;

-- Being signed in grants no extra read access.
select is(
  (select count(*) from public.contacts),
  0::bigint,
  'a signed-in user cannot read contact messages'
);

select * from finish();
rollback;
