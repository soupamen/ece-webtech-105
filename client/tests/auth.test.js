import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getAuthMessage,
  getSafeReturnPath,
  isValidEmail,
} from '../lib/auth.js'
import { getListMessage, validateListFields } from '../lib/lists.js'

test('validates email format and length', () => {
  assert.equal(isValidEmail('person@example.com'), true)
  assert.equal(isValidEmail('invalid-email'), false)
  assert.equal(isValidEmail(`${'a'.repeat(250)}@example.com`), false)
})

test('allows only local return paths', () => {
  assert.equal(getSafeReturnPath('/tool/penpot?q=design'), '/tool/penpot?q=design')
  assert.equal(getSafeReturnPath('//example.com'), '/profile')
  assert.equal(getSafeReturnPath('https://example.com'), '/profile')
  assert.equal(getSafeReturnPath('/\\\\example.com'), '/profile')
})

test('validates list fields before database writes', () => {
  assert.deepEqual(validateListFields('  Design tools ', '  Keep these  '), {
    name: 'Design tools',
    description: 'Keep these',
  })
  assert.equal(validateListFields(' ', ''), null)
  assert.equal(validateListFields('x'.repeat(81), ''), null)
  assert.equal(validateListFields('valid', 'x'.repeat(501)), null)
})

test('only exposes expected auth and list messages', () => {
  assert.equal(getAuthMessage('credentials'), 'The email or password is incorrect.')
  assert.equal(getAuthMessage('unknown'), null)
  assert.equal(getListMessage('list-created'), 'List created.')
  assert.equal(getListMessage('unknown'), null)
})
