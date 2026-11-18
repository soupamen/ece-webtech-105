import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} WebTech 105</p>
        <Link href="/about" className="transition-colors hover:text-foreground">
          About
        </Link>
      </div>
    </footer>
  )
}
