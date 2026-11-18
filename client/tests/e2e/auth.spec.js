import { expect, test } from '@playwright/test'

// Guests see sign-in and sign-up links on the profile page.
test('a guest sees account options on the profile page', async ({ page }) => {
  await page.goto('/profile')

  await expect(page.getByRole('heading', { name: 'Guest' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Create account' })).toBeVisible()
})

// /list is protected: guests are redirected to login with a return path.
test('a guest is sent to sign in before opening personal lists', async ({
  page,
}) => {
  await page.goto('/list')

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Flist$/)
  await expect(
    page.getByRole('heading', { name: 'Sign in to OpenFinder' })
  ).toBeVisible()
})

// /suggest is protected the same way.
test('a guest is sent to sign in before suggesting a tool', async ({ page }) => {
  await page.goto('/suggest')

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fsuggest$/)
  await expect(
    page.getByRole('heading', { name: 'Sign in to OpenFinder' })
  ).toBeVisible()
})

// The login form drops an external "next" URL and falls back to /profile.
test('auth forms reject external return paths', async ({ page }) => {
  await page.goto('/auth/login?next=https%3A%2F%2Fexample.com')

  await expect(page.locator('input[name="next"]')).toHaveValue('/profile')
})

// Full CRUD journey: sign up, create/edit a list, add/remove a tool, delete, sign out.
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

// A regular user can submit a suggestion but is turned away from /moderation.
test('a user can send a tool suggestion but cannot open moderation', async ({
  page,
}) => {
  test.skip(!process.env.SUPABASE_E2E_ENABLED, 'requires local Supabase')

  const email = `suggest-${Date.now()}@example.test`
  const toolName = `Suggested tool ${Date.now()}`
  await page.goto('/auth/signup')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('OpenFinder-Test-123')
  await page.getByLabel('Confirm password').fill('OpenFinder-Test-123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/profile$/)
  await page.goto('/suggest')
  await page.getByLabel('Tool name').fill(toolName)
  await page.getByLabel('Alternative to').fill('A proprietary tool')
  await page.getByLabel('Category').selectOption({ label: 'Design' })
  await page.getByLabel('Description').fill('A proposed open-source design tool.')
  await page.getByLabel('GitHub repository').fill('example/suggested-tool')
  await page.getByLabel('Official website').fill('https://example.test')
  await page.getByRole('button', { name: 'Send suggestion' }).click()

  await expect(page).toHaveURL(/\/suggest\?notice=submitted$/)
  await expect(page.getByText(toolName)).toBeVisible()
  await expect(page.getByText('pending', { exact: true })).toBeVisible()

  await page.goto('/moderation')
  await expect(page).toHaveURL(/\/profile$/)
})

// No horizontal scroll at 320px, and the theme toggle switches its label.
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
