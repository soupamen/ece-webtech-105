insert into public.categories (id, slug, name, description)
values
  ('00000000-0000-0000-0000-000000000001', 'design', 'Design', 'Figma, Photoshop and friends.'),
  ('00000000-0000-0000-0000-000000000002', 'productivity', 'Productivity', 'Notion, Trello, Slack.'),
  ('00000000-0000-0000-0000-000000000003', 'dev-tools', 'Developer tools', 'Postman, Firebase, Vercel.')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description;

insert into public.tools (
  slug,
  name,
  alternative_to,
  description,
  category_id,
  github_repo,
  website_url
)
values
  ('penpot', 'Penpot', 'Figma', 'Open-source design and prototyping.', '00000000-0000-0000-0000-000000000001', 'penpot/penpot', 'https://penpot.app'),
  ('krita', 'Krita', 'Adobe Photoshop', 'Digital painting and illustration software.', '00000000-0000-0000-0000-000000000001', 'KDE/krita', 'https://krita.org'),
  ('inkscape', 'Inkscape', 'Adobe Illustrator', 'Vector graphics editor for illustrations and diagrams.', '00000000-0000-0000-0000-000000000001', 'inkscape/inkscape', 'https://inkscape.org'),
  ('blender', 'Blender', 'Cinema 4D', '3D creation suite for modeling, animation, and rendering.', '00000000-0000-0000-0000-000000000001', 'blender/blender', 'https://www.blender.org'),
  ('appflowy', 'AppFlowy', 'Notion', 'Privacy-first workspace.', '00000000-0000-0000-0000-000000000002', 'AppFlowy-IO/AppFlowy', 'https://appflowy.io'),
  ('vikunja', 'Vikunja', 'Todoist', 'Self-hosted task management for personal workflows.', '00000000-0000-0000-0000-000000000002', 'go-vikunja/vikunja', 'https://vikunja.io'),
  ('joplin', 'Joplin', 'Evernote', 'Open-source note-taking and to-do application.', '00000000-0000-0000-0000-000000000002', 'laurent22/joplin', 'https://joplinapp.org'),
  ('nextcloud', 'Nextcloud', 'Google Drive', 'Self-hosted file storage and collaboration platform.', '00000000-0000-0000-0000-000000000002', 'nextcloud/server', 'https://nextcloud.com'),
  ('supabase', 'Supabase', 'Firebase', 'Postgres backend as a service.', '00000000-0000-0000-0000-000000000003', 'supabase/supabase', 'https://supabase.com'),
  ('hoppscotch', 'Hoppscotch', 'Postman', 'Open-source API development and testing tool.', '00000000-0000-0000-0000-000000000003', 'hoppscotch/hoppscotch', 'https://hoppscotch.io'),
  ('appwrite', 'Appwrite', 'Firebase', 'Open-source backend platform for web and mobile applications.', '00000000-0000-0000-0000-000000000003', 'appwrite/appwrite', 'https://appwrite.io'),
  ('gitea', 'Gitea', 'GitHub', 'Lightweight self-hosted Git service.', '00000000-0000-0000-0000-000000000003', 'go-gitea/gitea', 'https://about.gitea.com')
on conflict (slug) do update
set name = excluded.name,
    alternative_to = excluded.alternative_to,
    description = excluded.description,
    category_id = excluded.category_id,
    github_repo = excluded.github_repo,
    website_url = excluded.website_url;
