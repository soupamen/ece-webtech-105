import Link from 'next/link'

export default function ToolCard({ tool }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-xs transition-[border-color,box-shadow] duration-200 outline-none hover:border-foreground/25 hover:shadow-[0_6px_20px_-12px_oklch(0_0_0/0.25)] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold tracking-tight">{tool.name}</h2>
        <span className="truncate font-mono text-xs text-muted-foreground">{tool.category}</span>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{tool.description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3 text-xs">
        <span className="truncate font-mono text-muted-foreground">
          replaces <span className="text-foreground">{tool.alternativeTo}</span>
        </span>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
        >
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}
