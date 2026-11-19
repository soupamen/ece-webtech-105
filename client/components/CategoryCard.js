import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CategoryCard({ category }) {
  return (
    <Link href={`/category/${category.slug}`} className="block rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
      <Card className="h-full shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-foreground/25 hover:shadow-[0_6px_20px_-12px_oklch(0_0_0/0.25)]">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
