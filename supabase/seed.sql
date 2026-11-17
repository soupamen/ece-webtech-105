insert into public.categories (id, slug, name, description)
values
  ('00000000-0000-0000-0000-000000000001', 'design', 'Design', 'Figma, Photoshop and friends.'),
  ('00000000-0000-0000-0000-000000000002', 'productivity', 'Productivity', 'Notion, Trello, Slack.'),
  ('00000000-0000-0000-0000-000000000003', 'dev-tools', 'Developer tools', 'Postman, Firebase, Vercel.')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description;

insert into public.tools (slug, name, alternative_to, description, category_id)
values
  ('penpot', 'Penpot', 'Figma', 'Open-source design and prototyping.', '00000000-0000-0000-0000-000000000001'),
  ('krita', 'Krita', 'Adobe Photoshop', 'Digital painting and illustration software.', '00000000-0000-0000-0000-000000000001'),
  ('inkscape', 'Inkscape', 'Adobe Illustrator', 'Vector graphics editor for illustrations and diagrams.', '00000000-0000-0000-0000-000000000001'),
  ('blender', 'Blender', 'Cinema 4D', '3D creation suite for modeling, animation, and rendering.', '00000000-0000-0000-0000-000000000001'),
  ('appflowy', 'AppFlowy', 'Notion', 'Privacy-first workspace.', '00000000-0000-0000-0000-000000000002'),
  ('vikunja', 'Vikunja', 'Todoist', 'Self-hosted task management for personal workflows.', '00000000-0000-0000-0000-000000000002'),
  ('joplin', 'Joplin', 'Evernote', 'Open-source note-taking and to-do application.', '00000000-0000-0000-0000-000000000002'),
  ('nextcloud', 'Nextcloud', 'Google Drive', 'Self-hosted file storage and collaboration platform.', '00000000-0000-0000-0000-000000000002'),
  ('supabase', 'Supabase', 'Firebase', 'Postgres backend as a service.', '00000000-0000-0000-0000-000000000003'),
  ('hoppscotch', 'Hoppscotch', 'Postman', 'Open-source API development and testing tool.', '00000000-0000-0000-0000-000000000003'),
  ('appwrite', 'Appwrite', 'Firebase', 'Open-source backend platform for web and mobile applications.', '00000000-0000-0000-0000-000000000003'),
  ('gitea', 'Gitea', 'GitHub', 'Lightweight self-hosted Git service.', '00000000-0000-0000-0000-000000000003')
on conflict (slug) do update
set name = excluded.name,
    alternative_to = excluded.alternative_to,
    description = excluded.description,
    category_id = excluded.category_id;
