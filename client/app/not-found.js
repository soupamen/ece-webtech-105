// SSG: static by default
import Link from 'next/link'
import EmptyState from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <EmptyState title="404 — Page not found" description="The page you are looking for does not exist.">
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </EmptyState>
  )
}
