insert into public.categories (id, slug, name, description)
values
  ('00000000-0000-0000-0000-000000000001', 'design', 'Design', 'Figma, Photoshop and friends.'),
  ('00000000-0000-0000-0000-000000000002', 'productivity', 'Productivity', 'Notion, Trello, Slack.'),
  ('00000000-0000-0000-0000-000000000003', 'dev-tools', 'Developer tools', 'Postman, Firebase, Vercel.');

insert into public.tools (slug, name, alternative_to, description, category_id)
values
  ('penpot', 'Penpot', 'Figma', 'Open-source design and prototyping.', '00000000-0000-0000-0000-000000000001'),
  ('appflowy', 'AppFlowy', 'Notion', 'Privacy-first workspace.', '00000000-0000-0000-0000-000000000002'),
  ('supabase', 'Supabase', 'Firebase', 'Postgres backend as a service.', '00000000-0000-0000-0000-000000000003');
