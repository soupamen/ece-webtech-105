// SSG: categories rarely change, built once
export const dynamic = 'force-static'

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold">Categories</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">The categories will appear here.</p>
    </>
  )
}
