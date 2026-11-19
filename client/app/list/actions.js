'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { validateListFields } from '@/lib/lists'

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function getValue(formData, name) {
  const value = formData.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

async function getListClient() {
  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)

  if (!user) {
    redirect('/auth/login?next=%2Flist')
  }

  return { supabase, user }
}

export async function createListAction(formData) {
  const fields = validateListFields(
    formData.get('name'),
    formData.get('description')
  )
  if (!fields) redirect('/list?error=invalid-list')

  const { supabase, user } = await getListClient()
  const { error } = await supabase
    .from('lists')
    .insert({ ...fields, user_id: user.id })

  if (error) {
    console.error('Supabase list creation failed', error)
    redirect('/list?error=list-save')
  }

  revalidatePath('/list')
  redirect('/list?notice=list-created')
}

export async function updateListAction(formData) {
  const id = getValue(formData, 'list_id')
  const fields = validateListFields(
    formData.get('name'),
    formData.get('description')
  )
  if (!uuidPattern.test(id) || !fields) {
    redirect('/list?error=invalid-list')
  }

  const { supabase } = await getListClient()
  const { data, error } = await supabase
    .from('lists')
    .update(fields)
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Supabase list update failed', error)
    redirect('/list?error=list-save')
  }
  if (!data) redirect('/list?error=list-not-found')

  revalidatePath('/list')
  redirect('/list?notice=list-updated')
}

export async function deleteListAction(formData) {
  const id = getValue(formData, 'list_id')
  if (!uuidPattern.test(id)) redirect('/list?error=list-not-found')

  const { supabase } = await getListClient()
  const { data, error } = await supabase
    .from('lists')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Supabase list deletion failed', error)
    redirect('/list?error=list-save')
  }
  if (!data) redirect('/list?error=list-not-found')

  revalidatePath('/list')
  redirect('/list?notice=list-deleted')
}

export async function addToolToListAction(formData) {
  const listId = getValue(formData, 'list_id')
  const slug = getValue(formData, 'tool_slug')
  if (!uuidPattern.test(listId) || !slugPattern.test(slug)) {
    redirect('/list?error=invalid-item')
  }

  const { supabase } = await getListClient()
  const { data: tool, error: toolError } = await supabase
    .from('tools')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (toolError) {
    console.error('Supabase tool lookup failed', toolError)
    redirect('/list?error=item-save')
  }
  if (!tool) redirect('/list?error=tool-not-found')

  const { error } = await supabase
    .from('list_items')
    .insert({ list_id: listId, tool_id: tool.id })

  if (error) {
    if (error.code === '23505') {
      redirect('/list?error=duplicate-item')
    }

    console.error('Supabase list item creation failed', error)
    redirect('/list?error=item-save')
  }

  revalidatePath('/list')
  redirect('/list?notice=item-added')
}

export async function removeToolFromListAction(formData) {
  const listId = getValue(formData, 'list_id')
  const toolId = getValue(formData, 'tool_id')
  if (!uuidPattern.test(listId) || !uuidPattern.test(toolId)) {
    redirect('/list?error=item-not-found')
  }

  const { supabase } = await getListClient()
  const { data, error } = await supabase
    .from('list_items')
    .delete()
    .eq('list_id', listId)
    .eq('tool_id', toolId)
    .select('list_id')
    .maybeSingle()

  if (error) {
    console.error('Supabase list item deletion failed', error)
    redirect('/list?error=item-save')
  }
  if (!data) redirect('/list?error=item-not-found')

  revalidatePath('/list')
  redirect('/list?notice=item-removed')
}
