// ISR: one static page per tool, refreshed every 60 seconds
export const revalidate = 60

export async function generateStaticParams() {
  return [{ slug: 'example' }]
}

export default async function Page({ params }) {
  const { slug } = await params

  return (
    <>
      <h1 className="text-2xl font-bold">Tool: {slug}</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The details of this tool will appear here.
      </p>
    </>
  )
}
