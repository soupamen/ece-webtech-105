import { expect, test } from '@playwright/test'

// The contact form saves to Supabase and shows a confirmation.
test('a visitor can send a contact message', async ({ page }) => {
  test.skip(!process.env.SUPABASE_E2E_ENABLED, 'requires local Supabase')

  await page.goto('/contact')
  await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible()

  await page.getByLabel('Name').fill('OpenFinder E2E')
  await page.getByLabel('Email').fill(`contact-${Date.now()}@example.test`)
  await page
    .getByLabel('Message')
    .fill('This message verifies the integrated contact form.')
  await page.getByRole('button', { name: 'Send' }).click()

  await expect(page.getByRole('status')).toContainText(
    'Thanks, your message was sent.'
  )
})
