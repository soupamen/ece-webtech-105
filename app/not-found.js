import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <h1 className="text-2xl font-bold">404 — Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-4 inline-block underline underline-offset-4">
        Back to home
      </Link>
    </>
  )
}
