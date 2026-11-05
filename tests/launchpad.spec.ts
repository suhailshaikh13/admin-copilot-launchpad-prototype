import { test, expect } from '@playwright/test'

test.describe('Launchpad trial experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('shows trial workspace and launchpad copilot', async ({ page }) => {
    await expect(page.getByText('Your launch preview')).toBeVisible()
    await expect(page.getByText('Launch your trial')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go live quickly' })).toBeVisible()
  })

  test('go live quickly updates the preview', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await expect(page.getByText('Live for demo visitors')).toBeVisible({ timeout: 15000 })
  })
})
