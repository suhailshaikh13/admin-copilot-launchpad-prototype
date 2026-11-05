import { test, expect } from '@playwright/test'

test.describe('Launchpad trial experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('shows trial workspace and launchpad copilot', async ({ page }) => {
    await expect(page.getByText('Set up your trial essentials')).toBeVisible()
    await expect(page.getByText('1 of 5 completed')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go to Agent Workspace' })).toBeVisible()
    await expect(page.getByText('Launch your trial')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go live quickly' })).toBeVisible()
  })

  test('go live quickly shows onboarding actions', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await expect(page.getByText(/fastest way to go live/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Preview Help center' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Try a sample ticket' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Connect Support Email' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bring in your team' })).toBeVisible()
  })

  test('try a sample ticket supports reply and solve flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await page.getByRole('button', { name: 'Try a sample ticket' }).click({ timeout: 15000 })

    await expect(page.getByRole('heading', { name: 'Sample ticket' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Unable to log in after password reset')).toBeVisible()

    await page.getByRole('button', { name: 'Make the tone warmer' }).click()
    await expect(page.getByLabel('Suggested reply')).toContainText('locked out')

    await page.getByRole('button', { name: 'Send reply' }).click()
    await expect(page.getByText('Reply sent — customer notified by email')).toBeVisible({ timeout: 5000 })

    await page.getByRole('button', { name: 'Solve this ticket' }).click()
    await expect(page.getByText('Ticket solved — nice work on your first resolution')).toBeVisible({
      timeout: 5000,
    })
    await expect(page.getByText(/4821.*solved/i)).toBeVisible({ timeout: 5000 })
  })

  test('bring in your team opens copilot-led invite flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await expect(page.getByRole('button', { name: 'Bring in your team' })).toBeVisible({
      timeout: 15000,
    })
    await page.getByRole('button', { name: 'Bring in your team' }).click()

    await expect(page.getByText(/bring in your team/i).first()).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Send email invites' })).toBeVisible()
    await expect(page.getByLabel('Send an email invite')).toHaveValue('alex@swiftfinance.io')

    await page.getByRole('button', { name: 'Invite' }).click()
    await expect(page.getByText('Invites sent')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/You're all set/i)).toBeVisible({ timeout: 5000 })
  })
})
