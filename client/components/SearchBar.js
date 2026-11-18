import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Plain GET form: submits to /explore?q=..., no client JS needed.
export default function SearchBar({ defaultValue = '', category = '', categories = [] }) {
  return (
    <form action="/explore" role="search" className="flex w-full max-w-xl gap-2">
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search a tool or the software it replaces…"
        aria-label="Search"
      />
      {categories.length > 0 && (
        <select
          name="category"
          defaultValue={category}
          aria-label="Filter by category"
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      )}
      <Button type="submit">Search</Button>
    </form>
  )
}
