export function parseExploreParams(params = {}) {
  const q = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : ''
  const category =
    typeof params.category === 'string'
      ? params.category.trim().slice(0, 80)
      : ''
  const rawPage = typeof params.page === 'string' ? params.page : ''
  const page = /^\d+$/.test(rawPage) ? Number(rawPage) : 1

  return {
    q,
    category,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  }
}
