'use client'

import Form from 'next/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// next/form: GET to /explore?q=&category= with client-side navigation; plain form without JS.
export default function SearchBar({ defaultValue = '', category = '', categories = [] }) {
  return (
    <Form action="/explore" role="search" className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
      <label htmlFor="explore-q" className="sr-only">
        Search tools
      </label>
      <Input
        id="explore-q"
        type="search"
        name="q"
        defaultValue={defaultValue}
        maxLength={100}
        placeholder="Search a tool or the software it replaces…"
        className="h-10 basis-full sm:flex-1 sm:basis-0"
      />
      {categories.length > 0 && (
        <>
          <label htmlFor="explore-category" className="sr-only">
            Category
          </label>
          <select
            id="explore-category"
            name="category"
            defaultValue={category}
            onChange={(event) => event.currentTarget.form.requestSubmit()}
            className="h-10 min-w-0 flex-1 rounded-md border border-input bg-transparent px-3 pr-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-52 sm:flex-none dark:bg-input/30"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </>
      )}
      <Button type="submit" size="lg">
        Search
      </Button>
    </Form>
  )
}
