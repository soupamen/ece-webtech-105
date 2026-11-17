const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_CACHE_SECONDS = 60

function getRepositoryPath(repository) {
  if (!/^[^/]+\/[^/]+$/.test(repository)) return null

  return repository
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

export async function getGithubRepository(repository) {
  const repositoryPath = getRepositoryPath(repository)
  if (!repositoryPath) return null

  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${repositoryPath}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'OpenFinder',
      },
      next: { revalidate: GITHUB_CACHE_SECONDS },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status} for ${repository}`)
      return null
    }

    const data = await response.json()
    if (
      typeof data.stargazers_count !== 'number' ||
      typeof data.forks_count !== 'number' ||
      typeof data.html_url !== 'string'
    ) {
      console.warn(`GitHub API returned incomplete data for ${repository}`)
      return null
    }

    return {
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      license: data.license?.spdx_id || data.license?.name || null,
      updatedAt: data.updated_at || null,
    }
  } catch (error) {
    console.warn(`GitHub API request failed for ${repository}`, error)
    return null
  }
}
