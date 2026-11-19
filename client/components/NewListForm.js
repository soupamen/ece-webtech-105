'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function NewListForm() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function createList(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: insertError } = await supabase
      .from('lists')
      .insert({ name: name.trim(), description: description.trim() || null })

    setLoading(false)
    if (insertError) {
      setError(insertError.message)
      return
    }

    setName('')
    setDescription('')
    router.refresh()
  }

  return (
    <form className="space-y-3" onSubmit={createList}>
      <div className="space-y-2">
        <label htmlFor="list-name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="list-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="list-description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="list-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={300}
        />
      </div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? 'Creating...' : 'Create list'}
      </Button>
    </form>
  )
}
