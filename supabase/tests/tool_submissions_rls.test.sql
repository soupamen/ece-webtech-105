begin;

create extension if not exists pgtap with schema extensions;

select plan(11);

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
    '33333333-3333-4333-8333-333333333333',
    'authenticated',
    'authenticated',
    'submitter@example.test',
    'not-a-real-password',
    now(),
    now(),
    now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'authenticated',
    'authenticated',
    'reviewer@example.test',
    'not-a-real-password',
    now(),
    now(),
    now()
  );

select set_config(
  'request.jwt.claim.sub',
  '33333333-3333-4333-8333-333333333333',
  true
);
select set_config(
  'request.jwt.claims',
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","app_metadata":{}}',
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select lives_ok(
  $$
    insert into public.tool_submissions (
      id,
      user_id,
      category_id,
      name,
      alternative_to,
      description
    )
    values (
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      '33333333-3333-4333-8333-333333333333',
      '00000000-0000-0000-0000-000000000001',
      'private suggestion',
      'Figma',
      'A proposed design tool.'
    )
  $$,
  'a signed-in user can submit a pending suggestion'
);
select is(
  (
    select count(*)
    from public.tool_submissions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  1::bigint,
  'a submitter can read their own suggestion'
);
select throws_ok(
  $$
    insert into public.tool_submissions (
      user_id,
      category_id,
      name,
      alternative_to,
      description,
      status
    )
    values (
      '33333333-3333-4333-8333-333333333333',
      '00000000-0000-0000-0000-000000000001',
      'forged approval',
      'Figma',
      'A proposed design tool.',
      'approved'
    )
  $$,
  '42501',
  null,
  'a submitter cannot create an approved suggestion'
);

select set_config(
  'request.jwt.claim.sub',
  '44444444-4444-4444-8444-444444444444',
  true
);
select set_config(
  'request.jwt.claims',
  '{"sub":"44444444-4444-4444-8444-444444444444","role":"authenticated","app_metadata":{}}',
  true
);
select is(
  (
    select count(*)
    from public.tool_submissions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  0::bigint,
  'a regular user cannot read another users suggestion'
);
select lives_ok(
  $$
    update public.tool_submissions
    set status = 'approved'
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  $$,
  'a regular user cannot change another users suggestion'
);

select set_config(
  'request.jwt.claim.sub',
  '33333333-3333-4333-8333-333333333333',
  true
);
select set_config(
  'request.jwt.claims',
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","app_metadata":{}}',
  true
);
select is(
  (
    select status
    from public.tool_submissions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  'pending',
  'a regular user cannot change the suggestion status'
);

select set_config(
  'request.jwt.claim.sub',
  '44444444-4444-4444-8444-444444444444',
  true
);
select set_config(
  'request.jwt.claims',
  '{"sub":"44444444-4444-4444-8444-444444444444","role":"authenticated","app_metadata":{"role":"moderator"}}',
  true
);
select is(
  (
    select count(*)
    from public.tool_submissions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  1::bigint,
  'a moderator can read all suggestions'
);
select lives_ok(
  $$
    update public.tool_submissions
    set status = 'approved',
        moderator_note = 'Verified'
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  $$,
  'a moderator can review a suggestion'
);

select set_config(
  'request.jwt.claim.sub',
  '33333333-3333-4333-8333-333333333333',
  true
);
select set_config(
  'request.jwt.claims',
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated","app_metadata":{}}',
  true
);
select is(
  (
    select status
    from public.tool_submissions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  'approved',
  'a submitter can see the moderation decision'
);
select lives_ok(
  $$
    update public.tool_submissions
    set status = 'rejected'
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  $$,
  'a submitter cannot overwrite a moderation decision'
);
select is(
  (
    select status
    from public.tool_submissions
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
  ),
  'approved',
  'the moderator decision remains unchanged'
);

select * from finish();
rollback;
