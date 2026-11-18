import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

const supabase = createClient(url, key)
export const EXPLORE_PAGE_SIZE = 12

function mapTool(tool) {
  return {
    slug: tool.slug,
    name: tool.name,
    alternativeTo: tool.alternative_to,
    description: tool.description,
    category: tool.category.slug,
    categoryName: tool.category.name,
    githubRepo: tool.github_repo,
    websiteUrl: tool.website_url,
  }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, description')
    .order('name')

  if (error) throw error
  return data
}

export async function getTools() {
  const { data, error } = await supabase
    .from('tools')
    .select('slug, name, alternative_to, description, category:categories!inner(slug, name)')
    .order('name')

  if (error) throw error
  return data.map(mapTool)
}

function escapeIlike(value) {
  return value.replace(/[\\%_]/g, '\\$&')
}

export async function getToolsPage({ q = '', category = '', page = 1 }) {
  const search = escapeIlike(q)

  const applyFilters = (query) => {
    if (search) {
      query = query.or(`name.ilike.%${search}%,alternative_to.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('categories.slug', category)
    }

    return query
  }

  let countQuery = supabase
    .from('tools')
    .select('id, category:categories!inner(slug)', { count: 'exact', head: true })
  countQuery = applyFilters(countQuery)
  const countResult = await countQuery
  if (countResult.error) throw countResult.error

  const totalCount = countResult.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / EXPLORE_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  let query = supabase
    .from('tools')
    .select('slug, name, alternative_to, description, category:categories!inner(slug, name)')
    .order('name')
    .range(
      (currentPage - 1) * EXPLORE_PAGE_SIZE,
      currentPage * EXPLORE_PAGE_SIZE - 1
    )
  query = applyFilters(query)
  const result = await query
  if (result.error) throw result.error

  return {
    tools: (result.data ?? []).map(mapTool),
    page: currentPage,
    totalPages,
    totalCount,
  }
}

export async function getCategory(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, description')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getToolsByCategory(slug) {
  const { data, error } = await supabase
    .from('tools')
    .select('slug, name, alternative_to, description, category:categories!inner(slug, name)')
    .eq('categories.slug', slug)
    .order('name')

  if (error) throw error
  return data.map(mapTool)
}

export async function getTool(slug) {
  const { data, error } = await supabase
    .from('tools')
    .select(
      'slug, name, alternative_to, description, github_repo, website_url, category:categories!inner(slug, name)'
    )
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? mapTool(data) : null
}

export async function getLists() {
  const { data, error } = await supabase
    .from('lists')
    .select('id, user_id, name, description, created_at, list_items(list_id, tool_id, added_at)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createList({ userId, name, description = null }) {
  const { data, error } = await supabase
    .from('lists')
    .insert({ user_id: userId, name, description })
    .select('id, user_id, name, description, created_at')
    .single()

  if (error) throw error
  return data
}

export async function addToolToList({ listId, toolId }) {
  const { data, error } = await supabase
    .from('list_items')
    .insert({ list_id: listId, tool_id: toolId })
    .select('list_id, tool_id, added_at')
    .single()

  if (error) throw error
  return data
}

export async function removeToolFromList({ listId, toolId }) {
  const { data, error } = await supabase
    .from('list_items')
    .delete()
    .eq('list_id', listId)
    .eq('tool_id', toolId)
    .select('list_id, tool_id, added_at')
    .maybeSingle()

  if (error) throw error
  return data
}

// No .select() after insert: RLS forbids reading contacts back.
export async function createContact(contact) {
  const { error } = await supabase.from('contacts').insert(contact)
  if (error) throw error
}