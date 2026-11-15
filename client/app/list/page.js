import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

// SSR: personal data, rendered on every request
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <PageHeader title="My lists" description="Tools you saved, grouped by list.">
        <Button disabled>New list</Button>
      </PageHeader>
      <EmptyState title="No list yet" description="Create a list to save tools you like." />
    </>
  )
}
