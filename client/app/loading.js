import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading page</p>
      <Skeleton className="mb-8 h-8 w-40" aria-hidden="true" />
      <Skeleton className="mb-6 h-9 w-full max-w-xl" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-32" aria-hidden="true" />
        ))}
      </div>
    </div>
  )
}
