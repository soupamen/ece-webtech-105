import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <>
      <Skeleton className="mb-8 h-8 w-40" />
      <Skeleton className="mb-6 h-9 w-full max-w-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </>
  )
}
