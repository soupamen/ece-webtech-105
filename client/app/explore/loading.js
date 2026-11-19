import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div aria-busy="true">
      <p role="status" className="sr-only">Loading tools…</p>
      <Skeleton className="mb-2 h-9 w-40" />
      <Skeleton className="mb-8 h-5 w-72 max-w-full" />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-10 sm:flex-1" />
        <Skeleton className="h-10 sm:w-52" />
        <Skeleton className="h-10 sm:w-24" />
      </div>
      <Skeleton className="mt-4 mb-6 h-8 w-20" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex h-44 flex-col gap-3 rounded-xl border p-5">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-auto h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
