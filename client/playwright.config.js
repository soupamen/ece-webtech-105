import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000/about',
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ??
        process.env.API_URL ??
        'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.PUBLISHABLE_KEY ??
        process.env.ANON_KEY ??
        'test-publishable-key',
      NEXT_PUBLIC_SITE_URL:
        process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3000',
      SUPABASE_E2E_ENABLED: process.env.SUPABASE_E2E_ENABLED ?? '',
    },
  },
})
