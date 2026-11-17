import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

const supabase = createClient(url, key)

function mapTool(tool) {
  return {
    slug: tool.slug,
    name: tool.name,
    alternativeTo: tool.alternative_to,
    description: tool.description,
    category: tool.category.slug,
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
    .select('slug, name, alternative_to, description, category:categories!inner(slug)')
    .order('name')

  if (error) throw error
  return data.map(mapTool)
}

function escapeIlike(value) {
  return value.replace(/[\\%_]/g, '\\$&')
}

export async function searchTools(q = '') {
  const search = escapeIlike(q)
  let query = supabase
    .from('tools')
    .select('slug, name, alternative_to, description, category:categories!inner(slug)')
    .order('name')

  if (search) {
    query = query.or(`name.ilike.%${search}%,alternative_to.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(mapTool)
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
    .select('slug, name, alternative_to, description, category:categories!inner(slug)')
    .eq('categories.slug', slug)
    .order('name')

  if (error) throw error
  return data.map(mapTool)
}

export async function getTool(slug) {
  const { data, error } = await supabase
    .from('tools')
    .select('slug, name, alternative_to, description, category:categories!inner(slug, name)')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data ? { ...mapTool(data), categoryName: data.category.name } : null
}
