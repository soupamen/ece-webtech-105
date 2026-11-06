import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Plain GET form: submits to /explore?q=..., no client JS needed.
export default function SearchBar({ defaultValue = '' }) {
  return (
    <form action="/explore" role="search" className="flex w-full max-w-xl gap-2">
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search a tool or the software it replaces…"
        aria-label="Search"
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
