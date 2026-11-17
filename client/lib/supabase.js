import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { getSupabaseConfig } from './supabase/config'

let supabase

function getSupabase() {
  if (supabase) return supabase

  const { url, key } = getSupabaseConfig()
  supabase = createClient(url, key)
  return supabase
}

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

export const getCategories = unstable_cache(
  async () => {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('slug, name, description')
      .order('name')

    if (error) throw error
    return data ?? []
  },
  ['categories'],
  { revalidate: 3600 }
)

export const getTools = unstable_cache(
  async () => {
    const { data, error } = await getSupabase()
      .from('tools')
      .select(
        'slug, name, alternative_to, description, category:categories!inner(slug, name)'
      )
      .order('name')

    if (error) throw error
    return (data ?? []).map(mapTool)
  },
  ['tools'],
  { revalidate: 3600 }
)

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

  let countQuery = getSupabase()
    .from('tools')
    .select('id, category:categories!inner(slug)', { count: 'exact', head: true })
  countQuery = applyFilters(countQuery)
  const countResult = await countQuery
  if (countResult.error) throw countResult.error

  const totalCount = countResult.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / EXPLORE_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  let query = getSupabase()
    .from('tools')
    .select(
      'slug, name, alternative_to, description, category:categories!inner(slug, name)'
    )
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

const getCachedCategory = unstable_cache(
  async (slug) => {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('slug, name, description')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data
  },
  ['category'],
  { revalidate: 3600 }
)

export function getCategory(slug) {
  return getCachedCategory(slug)
}

const getCachedToolsByCategory = unstable_cache(
  async (slug) => {
    const { data, error } = await getSupabase()
      .from('tools')
      .select(
        'slug, name, alternative_to, description, category:categories!inner(slug, name)'
      )
      .eq('categories.slug', slug)
      .order('name')

    if (error) throw error
    return (data ?? []).map(mapTool)
  },
  ['tools-by-category'],
  { revalidate: 3600 }
)

export function getToolsByCategory(slug) {
  return getCachedToolsByCategory(slug)
}

const getCachedTool = unstable_cache(
  async (slug) => {
    const { data, error } = await getSupabase()
      .from('tools')
      .select(
        'slug, name, alternative_to, description, github_repo, website_url, category:categories!inner(slug, name)'
      )
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data ? mapTool(data) : null
  },
  ['tool'],
  { revalidate: 60 }
)

export function getTool(slug) {
  return getCachedTool(slug)
}

export async function createContact(contact) {
  const { error } = await getSupabase().from('contacts').insert(contact)
  if (error) throw error
}
