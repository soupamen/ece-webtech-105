import { redirect } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AddToolToListForm from '@/components/lists/AddToolToListForm'
import PageHeader from '@/components/PageHeader'
import { createPageMetadata } from '@/lib/metadata'
import { getListMessage, getUserLists } from '@/lib/lists'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  createListAction,
  deleteListAction,
  removeToolFromListAction,
  updateListAction,
} from './actions'

export const dynamic = 'force-dynamic'

export const metadata = createPageMetadata({
  title: 'My lists',
  description: 'Manage your personal collections of open-source tools.',
  path: '/list',
})

export default async function ListsPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()
  const user = await getCurrentUser(supabase)
  if (!user) redirect('/auth/login?next=%2Flist')

  const lists = await getUserLists(supabase)
  const errorMessage = getListMessage(params.error)
  const noticeMessage = getListMessage(params.notice)

  return (
    <>
      <PageHeader
        title="My lists"
        description="Save and organize open-source tools you want to remember."
      />
      {(errorMessage || noticeMessage) && (
        <p
          className="mb-6 rounded-md border border-border p-3 text-sm"
          role={errorMessage ? 'alert' : 'status'}
        >
          {errorMessage ?? noticeMessage}
        </p>
      )}

      <Card className="mb-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Create a list</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createListAction} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new-list-name">
                Name
              </label>
              <input
                id="new-list-name"
                name="name"
                maxLength={80}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="new-list-description">
                Description
              </label>
              <input
                id="new-list-description"
                name="description"
                maxLength={500}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <SubmitButton pendingLabel="Creating...">Create list</SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>

      {lists.length ? (
        <div className="space-y-6">
          {lists.map((list) => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                {list.description && (
                  <p className="text-sm text-muted-foreground">{list.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <form action={updateListAction} className="space-y-3">
                      <input type="hidden" name="list_id" value={list.id} />
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor={`name-${list.id}`}
                        >
                          Edit name
                        </label>
                        <input
                          id={`name-${list.id}`}
                          name="name"
                          defaultValue={list.name}
                          maxLength={80}
                          required
                          className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor={`description-${list.id}`}
                        >
                          Edit description
                        </label>
                        <input
                          id={`description-${list.id}`}
                          name="description"
                          defaultValue={list.description ?? ''}
                          maxLength={500}
                          className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                        />
                      </div>
                      <SubmitButton variant="outline" pendingLabel="Saving...">
                        Save changes
                      </SubmitButton>
                    </form>
                    <form action={deleteListAction}>
                      <input type="hidden" name="list_id" value={list.id} />
                      <SubmitButton
                        variant="destructive"
                        pendingLabel="Deleting..."
                        confirmMessage={`Delete "${list.name}" and its saved tools? This cannot be undone.`}
                      >
                        Delete list
                      </SubmitButton>
                    </form>
                  </div>
                  <AddToolToListForm lists={[list]} />
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Saved tools</h3>
                  {list.list_items?.length ? (
                    <ul className="divide-y rounded-md border">
                      {list.list_items.map((item) => (
                        <li
                          key={`${list.id}-${item.tool?.id ?? item.added_at}`}
                          className="flex flex-wrap items-center justify-between gap-3 p-3"
                        >
                          <div>
                            <p className="font-medium">
                              {item.tool?.name ?? 'Unavailable tool'}
                            </p>
                            {item.tool?.alternative_to && (
                              <p className="text-sm text-muted-foreground">
                                Alternative to {item.tool.alternative_to}
                              </p>
                            )}
                          </div>
                          {item.tool && (
                            <form action={removeToolFromListAction}>
                              <input type="hidden" name="list_id" value={list.id} />
                              <input
                                type="hidden"
                                name="tool_id"
                                value={item.tool.id}
                              />
                              <SubmitButton size="sm" variant="outline" pendingLabel="Removing...">
                                Remove
                              </SubmitButton>
                            </form>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tools saved in this list yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-2xl">
          <CardContent className="py-8 text-center">
            <p className="font-medium">No lists yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a list above, then save tools from their detail pages.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
