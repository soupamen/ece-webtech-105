// Temporary fake data so pages can render.
export const categories = [
  { slug: 'design', name: 'Design', description: 'Figma, Photoshop and friends.' },
  { slug: 'productivity', name: 'Productivity', description: 'Notion, Trello, Slack.' },
  { slug: 'dev-tools', name: 'Developer tools', description: 'Postman, Firebase, Vercel.' },
]

export const tools = [
  { slug: 'penpot', name: 'Penpot', category: 'design', alternativeTo: 'Figma', description: 'Open-source design and prototyping.' },
  { slug: 'appflowy', name: 'AppFlowy', category: 'productivity', alternativeTo: 'Notion', description: 'Privacy-first workspace.' },
  { slug: 'supabase', name: 'Supabase', category: 'dev-tools', alternativeTo: 'Firebase', description: 'Postgres backend as a service.' },
]
