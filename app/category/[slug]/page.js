// SSG params: one static page per category, built with generateStaticParams
export async function generateStaticParams() {
  return [{ slug: 'example' }]
}

export default async function Page({ params }) {
  const { slug } = await params

  return (
    <>
      <h1 className="text-2xl font-bold">Category: {slug}</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The tools of this category will appear here.
      </p>
    </>
  )
}
