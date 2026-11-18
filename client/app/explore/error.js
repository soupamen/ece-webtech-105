'use client'

import { useEffect } from 'react'
import EmptyState from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function Error({ error, retry }) {
  useEffect(() => {
    console.error('Failed to load explore results', error)
  }, [error])

  return (
    <EmptyState
      role="alert"
      title="Couldn't load the catalogue"
      description="The tool database didn't respond. Check your connection, then try again."
    >
      <Button onClick={() => retry()}>Try again</Button>
    </EmptyState>
  )
}
