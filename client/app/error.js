'use client'

import { Button } from '@/components/ui/button'

export default function ErrorPage({ reset }) {
  return (
    <section
      className="mx-auto max-w-lg space-y-4 py-12 text-center"
      role="alert"
    >
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">
        The page could not be loaded. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  )
}
