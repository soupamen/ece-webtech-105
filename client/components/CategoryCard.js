import Link from 'next/link'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CategoryCard({ category }) {
  return (
    <Link href={`/category/${category.slug}`} className="block rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
