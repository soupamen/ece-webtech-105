// ISR: static, refreshed every hour
export const revalidate = 3600

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">Welcome to WebTech 105.</p>
    </>
  )
}
