'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

// Catches errors on every route without its own error.js (explore has one).
export default function Error({ error, retry }) {
  useEffect(() => {
    console.error('Page failed to load', error)
  }, [error])

  return (
    <EmptyState
      role="alert"
      title="Something went wrong"
      description="This page couldn't load. Check your connection, then try again."
    >
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </EmptyState>
  )
}
