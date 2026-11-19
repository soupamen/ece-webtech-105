import assert from 'node:assert/strict'
import test from 'node:test'
import { parseExploreParams } from '../lib/explore.js'

// Search and category inputs are trimmed and capped to keep queries bounded.
test('parses valid explore filters and bounds their length', () => {
  const params = parseExploreParams({
    q: `  ${'a'.repeat(120)}  `,
    category: ` ${'b'.repeat(90)} `,
    page: '4',
  })

  assert.equal(params.q.length, 100)
  assert.equal(params.category.length, 80)
  assert.equal(params.page, 4)
})

// Missing or invalid params fall back to defaults instead of erroring.
test('uses safe defaults for missing or invalid parameters', () => {
  assert.deepEqual(parseExploreParams({ q: ['ignored'], page: '3.5' }), {
    q: '',
    category: '',
    page: 1,
  })
  assert.equal(parseExploreParams({ page: '9007199254740992' }).page, 1)
  assert.equal(parseExploreParams({ page: '0' }).page, 1)
})
