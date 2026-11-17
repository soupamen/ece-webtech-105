import Link from 'next/link'
import { addToolToListAction } from '@/app/list/actions'
import { Button } from '@/components/ui/button'

export default function AddToolToListForm({ lists, toolSlug = '' }) {
  if (!lists.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Create a list before saving tools. <Link className="underline" href="/list">Go to my lists</Link>
      </p>
    )
  }

  return (
    <form action={addToolToListAction} className="space-y-3">
      {toolSlug ? (
        <input type="hidden" name="tool_slug" value={toolSlug} />
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`tool-${lists[0].id}`}>
            Tool slug
          </label>
          <input
            id={`tool-${lists[0].id}`}
            name="tool_slug"
            autoComplete="off"
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
            className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          />
        </div>
      )}
      {lists.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="save-tool-list">
            Save to list
          </label>
          <select
            id="save-tool-list"
            name="list_id"
            required
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {lists.length === 1 && (
        <input type="hidden" name="list_id" value={lists[0].id} />
      )}
      <Button type="submit" variant="outline">
        {toolSlug ? 'Add to list' : 'Save tool'}
      </Button>
    </form>
  )
}
