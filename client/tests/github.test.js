import assert from 'node:assert/strict'
import test from 'node:test'
import { getGithubRepository } from '../lib/github.js'

// Replaces fetch with a fixed response and silences the expected warnings.
function mockFetch(t, response) {
  t.mock.method(console, 'warn', () => {})
  return t.mock.method(globalThis, 'fetch', async () => response)
}

// A complete API payload is reduced to the fields the tool page displays.
test('maps a valid GitHub response', async (t) => {
  const fetch = mockFetch(t, {
    ok: true,
    json: async () => ({
      html_url: 'https://github.com/penpot/penpot',
      stargazers_count: 10,
      forks_count: 2,
      license: { spdx_id: 'MPL-2.0' },
      updated_at: '2026-01-01T00:00:00Z',
    }),
  })

  assert.deepEqual(await getGithubRepository('penpot/penpot'), {
    url: 'https://github.com/penpot/penpot',
    stars: 10,
    forks: 2,
    license: 'MPL-2.0',
    updatedAt: '2026-01-01T00:00:00Z',
  })
  assert.equal(fetch.mock.calls[0].arguments[0], 'https://api.github.com/repos/penpot/penpot')
})

// Any API failure degrades to null so the page renders without GitHub stats.
test('returns null on HTTP error, incomplete data or network failure', async (t) => {
  mockFetch(t, { ok: false, status: 404 })
  assert.equal(await getGithubRepository('a/b'), null)

  mockFetch(t, { ok: true, json: async () => ({ html_url: 'x' }) })
  assert.equal(await getGithubRepository('a/b'), null)

  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('offline')
  })
  assert.equal(await getGithubRepository('a/b'), null)
})

// Malformed "owner/repo" values never reach the network.
test('rejects invalid repository names without calling the API', async (t) => {
  const fetch = mockFetch(t, { ok: true })
  assert.equal(await getGithubRepository('not/a/repo'), null)
  assert.equal(await getGithubRepository('penpot'), null)
  assert.equal(fetch.mock.callCount(), 0)
})
