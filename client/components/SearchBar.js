import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// formulaire get, envoie les filtres a explore sans javascript
export default function SearchBar({ defaultValue = '', category = '', categories = [] }) {
  return (
    <form
      action="/explore"
      role="search"
      className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
    >
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search a tool or the software it replaces…"
        aria-label="Search"
        className="min-w-0 flex-1"
      />
      {categories.length > 0 && (
        <select
          name="category"
          defaultValue={category}
          aria-label="Filter by category"
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm sm:w-auto"
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
