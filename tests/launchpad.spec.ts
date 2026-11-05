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

  test('go live quickly shows onboarding actions', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await expect(page.getByText(/fastest way to go live/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/Camera obscura/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Preview Help center' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Try a sample ticket' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Connect Support Email' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bring in your team' })).toBeVisible()
  })
})
