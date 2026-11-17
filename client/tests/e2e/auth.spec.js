import { expect, test } from '@playwright/test'

test('a guest sees account options on the profile page', async ({ page }) => {
  await page.goto('/profile')

  await expect(page.getByRole('heading', { name: 'Guest' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Create account' })).toBeVisible()
})

test('a guest is sent to sign in before opening personal lists', async ({
  page,
}) => {
  await page.goto('/list')

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Flist$/)
  await expect(
    page.getByRole('heading', { name: 'Sign in to OpenFinder' })
  ).toBeVisible()
})

test('auth forms reject external return paths', async ({ page }) => {
  await page.goto('/auth/login?next=https%3A%2F%2Fexample.com')

  await expect(page.locator('input[name="next"]')).toHaveValue('/profile')
})

test('a user can sign up and manage a personal list', async ({ page }) => {
  test.skip(!process.env.SUPABASE_E2E_ENABLED, 'requires local Supabase')

  const email = `e2e-${Date.now()}@example.test`
  const listName = `E2E list ${Date.now()}`
  await page.goto('/auth/signup')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('OpenFinder-Test-123')
  await page
    .getByLabel('Confirm password')
    .fill('OpenFinder-Test-123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByText(email)).toBeVisible()

  await page.goto('/list')
  await page.getByLabel('Name', { exact: true }).fill(listName)
  await page.getByLabel('Description').fill('Created by the end-to-end test')
  await page.getByRole('button', { name: 'Create list' }).click()
  await expect(page.getByRole('heading', { name: listName })).toBeVisible()

  const updatedListName = `${listName} updated`
  await page.getByLabel('Edit name').fill(updatedListName)
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('heading', { name: updatedListName })).toBeVisible()

  await page.getByLabel('Tool slug').fill('penpot')
  await page.getByRole('button', { name: 'Save tool' }).click()
  await expect(page.getByText('Penpot')).toBeVisible()

  await page.getByRole('button', { name: 'Remove' }).click()
  await expect(page.getByText('No tools saved in this list yet.')).toBeVisible()

  await page.getByRole('button', { name: 'Delete list' }).click()
  await expect(page.getByText('No lists yet')).toBeVisible()

  await page.goto('/profile')
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('heading', { name: 'Guest' })).toBeVisible()
})

test('navigation wraps at mobile width and the theme toggle works', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 })
  await page.goto('/about')

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }))
  expect(widths.document).toBeLessThanOrEqual(widths.viewport)

  const toggle = page.getByRole('button', {
    name: /Activate (dark|light) theme/,
  })
  const previousLabel = await toggle.getAttribute('aria-label')
  await toggle.click()
  await expect(toggle).not.toHaveAttribute('aria-label', previousLabel)
})
