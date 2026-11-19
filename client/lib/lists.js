export function validateListFields(nameValue, descriptionValue) {
  const name = typeof nameValue === 'string' ? nameValue.trim() : ''
  const rawDescription =
    typeof descriptionValue === 'string' ? descriptionValue.trim() : ''

  if (!name || name.length > 80 || rawDescription.length > 500) {
    return null
  }

  return {
    name,
    description: rawDescription || null,
  }
}

export async function getUserLists(supabase) {
  const { data, error } = await supabase
    .from('lists')
    .select(
      'id, name, description, created_at, list_items(added_at, tool:tools(id, slug, name, description, alternative_to))'
    )
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function getListMessage(status) {
  const messages = {
    'list-created': 'List created.',
    'list-updated': 'List updated.',
    'list-deleted': 'List deleted.',
    'item-added': 'Tool added to your list.',
    'item-removed': 'Tool removed from your list.',
    'invalid-list': 'Enter a list name and keep the description under 500 characters.',
    'list-save': 'The list could not be saved. Please try again.',
    'list-not-found': 'That list could not be found.',
    'invalid-item': 'Select a valid list and tool.',
    'item-save': 'The tool could not be added. Please try again.',
    'item-not-found': 'That saved tool could not be found.',
    'tool-not-found': 'That tool could not be found in the catalogue.',
    'duplicate-item': 'That tool is already in this list.',
  }

  return typeof status === 'string' ? messages[status] ?? null : null
}
