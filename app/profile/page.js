// SSR: personal data, rendered on every request
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Your profile will appear here.</p>
    </>
  )
}
