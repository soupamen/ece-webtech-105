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
  ('gitea', 'Gitea', 'GitHub', 'Lightweight self-hosted Git service.', '00000000-0000-0000-0000-000000000003', 'go-gitea/gitea', 'https://about.gitea.com'),
  ('gimp', 'GIMP', 'Adobe Photoshop', 'Raster image editor for retouching and composition.', '00000000-0000-0000-0000-000000000001', 'GNOME/gimp', 'https://www.gimp.org'),
  ('excalidraw', 'Excalidraw', 'Miro', 'Hand-drawn style virtual whiteboard.', '00000000-0000-0000-0000-000000000001', 'excalidraw/excalidraw', 'https://excalidraw.com'),
  ('darktable', 'darktable', 'Adobe Lightroom', 'Photography workflow and RAW developer.', '00000000-0000-0000-0000-000000000001', 'darktable-org/darktable', 'https://www.darktable.org'),
  ('kdenlive', 'Kdenlive', 'Adobe Premiere Pro', 'Multi-track non-linear video editor.', '00000000-0000-0000-0000-000000000001', 'KDE/kdenlive', 'https://kdenlive.org'),
  ('scribus', 'Scribus', 'Adobe InDesign', 'Desktop publishing for print and PDF layouts.', '00000000-0000-0000-0000-000000000001', 'scribusproject/scribus', 'https://www.scribus.net'),
  ('shotcut', 'Shotcut', 'Final Cut Pro', 'Cross-platform video editor.', '00000000-0000-0000-0000-000000000001', 'mltframework/shotcut', 'https://shotcut.org'),
  ('natron', 'Natron', 'Adobe After Effects', 'Node-based compositing for visual effects.', '00000000-0000-0000-0000-000000000001', 'NatronGitHub/Natron', 'https://natrongithub.github.io'),
  ('tldraw', 'tldraw', 'FigJam', 'Infinite canvas whiteboard and diagramming.', '00000000-0000-0000-0000-000000000001', 'tldraw/tldraw', 'https://www.tldraw.com'),
  ('mattermost', 'Mattermost', 'Slack', 'Self-hosted team messaging.', '00000000-0000-0000-0000-000000000002', 'mattermost/mattermost', 'https://mattermost.com'),
  ('rocket-chat', 'Rocket.Chat', 'Microsoft Teams', 'Team chat and collaboration platform.', '00000000-0000-0000-0000-000000000002', 'RocketChat/Rocket.Chat', 'https://www.rocket.chat'),
  ('wekan', 'Wekan', 'Trello', 'Kanban boards for teams.', '00000000-0000-0000-0000-000000000002', 'wekan/wekan', 'https://wekan.github.io'),
  ('cal-com', 'Cal.com', 'Calendly', 'Scheduling infrastructure for booking meetings.', '00000000-0000-0000-0000-000000000002', 'calcom/cal.com', 'https://cal.com'),
  ('logseq', 'Logseq', 'Roam Research', 'Local-first outliner and knowledge base.', '00000000-0000-0000-0000-000000000002', 'logseq/logseq', 'https://logseq.com'),
  ('bitwarden', 'Bitwarden', '1Password', 'Password manager for individuals and teams.', '00000000-0000-0000-0000-000000000002', 'bitwarden/clients', 'https://bitwarden.com'),
  ('libreoffice', 'LibreOffice', 'Microsoft Office', 'Office suite with documents, spreadsheets and slides.', '00000000-0000-0000-0000-000000000002', 'LibreOffice/core', 'https://www.libreoffice.org'),
  ('jitsi-meet', 'Jitsi Meet', 'Zoom', 'Encrypted video conferencing in the browser.', '00000000-0000-0000-0000-000000000002', 'jitsi/jitsi-meet', 'https://jitsi.org/jitsi-meet'),
  ('coolify', 'Coolify', 'Vercel', 'Self-hostable platform to deploy apps and databases.', '00000000-0000-0000-0000-000000000003', 'coollabsio/coolify', 'https://coolify.io'),
  ('plausible', 'Plausible', 'Google Analytics', 'Lightweight, privacy-friendly web analytics.', '00000000-0000-0000-0000-000000000003', 'plausible/analytics', 'https://plausible.io'),
  ('grafana', 'Grafana', 'Datadog', 'Dashboards and observability for metrics and logs.', '00000000-0000-0000-0000-000000000003', 'grafana/grafana', 'https://grafana.com'),
  ('uptime-kuma', 'Uptime Kuma', 'Pingdom', 'Self-hosted uptime monitoring.', '00000000-0000-0000-0000-000000000003', 'louislam/uptime-kuma', 'https://uptime.kuma.pet'),
  ('n8n', 'n8n', 'Zapier', 'Workflow automation with a visual editor.', '00000000-0000-0000-0000-000000000003', 'n8n-io/n8n', 'https://n8n.io'),
  ('meilisearch', 'Meilisearch', 'Algolia', 'Fast, typo-tolerant search engine.', '00000000-0000-0000-0000-000000000003', 'meilisearch/meilisearch', 'https://www.meilisearch.com'),
  ('strapi', 'Strapi', 'Contentful', 'Headless CMS with a customizable API.', '00000000-0000-0000-0000-000000000003', 'strapi/strapi', 'https://strapi.io'),
  ('bruno', 'Bruno', 'Postman', 'Offline-first API client stored in plain files.', '00000000-0000-0000-0000-000000000003', 'usebruno/bruno', 'https://www.usebruno.com')
on conflict (slug) do update
set name = excluded.name,
    alternative_to = excluded.alternative_to,
    description = excluded.description,
    category_id = excluded.category_id,
    github_repo = excluded.github_repo,
    website_url = excluded.website_url;
