export default function EmptyState({ title, description, children, role }) {
  return (
    <div
      role={role}
      className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center"
    >
      <h2 className="text-balance font-semibold">{title}</h2>
      {description && <p className="max-w-prose text-pretty text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
