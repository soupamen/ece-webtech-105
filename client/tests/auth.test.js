import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getAuthMessage,
  getSafeReturnPath,
  isValidEmail,
} from '../lib/auth.js'
import { getListMessage, validateListFields } from '../lib/lists.js'
import {
  getModerationMessage,
  isModerator,
  validateToolSubmission,
} from '../lib/moderation.js'

// Rejects malformed or oversized emails before calling Supabase Auth.
test('validates email format and length', () => {
  assert.equal(isValidEmail('person@example.com'), true)
  assert.equal(isValidEmail('invalid-email'), false)
  assert.equal(isValidEmail(`${'a'.repeat(250)}@example.com`), false)
})

// Blocks open redirects: only same-site paths survive the "next" parameter.
test('allows only local return paths', () => {
  assert.equal(getSafeReturnPath('/tool/penpot?q=design'), '/tool/penpot?q=design')
  assert.equal(getSafeReturnPath('//example.com'), '/profile')
  assert.equal(getSafeReturnPath('https://example.com'), '/profile')
  assert.equal(getSafeReturnPath('/\\\\example.com'), '/profile')
})

// List names and descriptions are trimmed and length-checked before insert.
test('validates list fields before database writes', () => {
  assert.deepEqual(validateListFields('  Design tools ', '  Keep these  '), {
    name: 'Design tools',
    description: 'Keep these',
  })
  assert.equal(validateListFields(' ', ''), null)
  assert.equal(validateListFields('x'.repeat(81), ''), null)
  assert.equal(validateListFields('valid', 'x'.repeat(501)), null)
})

// Unknown message codes from the URL never display arbitrary text.
test('only exposes expected auth and list messages', () => {
  assert.equal(getAuthMessage('credentials'), 'The email or password is incorrect.')
  assert.equal(getAuthMessage('unknown'), null)
  assert.equal(getListMessage('list-created'), 'List created.')
  assert.equal(getListMessage('unknown'), null)
})

// Suggestions map to DB columns; unsafe URLs and bad repo paths are refused.
test('validates tool suggestions and permits only secure optional links', () => {
  const validSuggestion = {
    name: ' Penpot ',
    alternativeTo: ' Figma ',
    description: ' Open source design software ',
    categoryId: '00000000-0000-0000-0000-000000000001',
    githubRepo: 'penpot/penpot',
    websiteUrl: 'https://penpot.app',
  }

  assert.deepEqual(validateToolSubmission(validSuggestion), {
    name: 'Penpot',
    alternative_to: 'Figma',
    description: 'Open source design software',
    category_id: '00000000-0000-0000-0000-000000000001',
    github_repo: 'penpot/penpot',
    website_url: 'https://penpot.app',
  })
  assert.equal(
    validateToolSubmission({ ...validSuggestion, websiteUrl: 'javascript:alert(1)' }),
    null
  )
  assert.equal(
    validateToolSubmission({ ...validSuggestion, githubRepo: 'not/a/repository/path' }),
    null
  )
})

// The moderator role comes only from app_metadata, which users cannot edit.
test('recognizes moderators from trusted app metadata', () => {
  assert.equal(isModerator({ app_metadata: { role: 'moderator' } }), true)
  assert.equal(isModerator({ user_metadata: { role: 'moderator' } }), false)
  assert.equal(getModerationMessage('submitted'), 'Your suggestion was sent to the moderation team.')
  assert.equal(getModerationMessage('unknown'), null)
})
