import { test, expect } from '@playwright/test'

test.describe('Launchpad trial experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('shows trial workspace and launchpad copilot', async ({ page }) => {
    await expect(page.getByText('Set up your trial essentials')).toBeVisible()
    await expect(page.getByText('1 of 5 completed')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go to Agent Workspace' })).toBeVisible()
    await expect(page.getByText('How can I help?')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go live quickly' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'What can you do?' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Show me examples' })).toBeVisible()
  })

  test('go live quickly shows onboarding actions', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await expect(page.getByText(/fastest way to go live/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Preview Help center' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Try a sample ticket' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Connect Support Email' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Bring in your team' })).toBeVisible()
  })

  test('preview help center generates articles and completes journey', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await page.getByRole('button', { name: 'Preview Help center' }).click({ timeout: 15000 })

    await expect(page.getByText(/Northwind Trading/i).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/Shipping and delivery for Northwind Trading/i).first()).toBeVisible({
      timeout: 10000,
    })

    await page.getByRole('button', { name: 'Publish all' }).click()

    await expect(page.getByText('Publish all articles for me')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/All three articles are/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Published').first()).toBeVisible()
  })

  test('try a sample ticket supports reply and solve flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await page.getByRole('button', { name: 'Try a sample ticket' }).click({ timeout: 15000 })

    await expect(page.getByText('Sample ticket #1')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Unable to log in after password reset')).toBeVisible()

    await page.getByRole('button', { name: 'Yes, draft a reply' }).click()
    await expect(page.getByText('Yes, draft a reply')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'Approve and send' })).toBeVisible({ timeout: 8000 })

    await page.getByRole('button', { name: 'Make the tone warmer' }).click()
    await expect(page.getByText('Make the tone warmer')).toBeVisible({ timeout: 5000 })
    await expect(page.getByLabel('Suggested reply').last()).toContainText('locked out', { timeout: 8000 })

    await page.getByRole('button', { name: 'Approve and send' }).click()
    await expect(page.getByText('Approve and send').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Your reply was sent on ticket/i)).toBeVisible({ timeout: 8000 })
    await expect(page.getByRole('link', { name: /View ticket #1/i })).toBeVisible()

    await page.getByRole('button', { name: 'Solve this ticket' }).click()
    await expect(page.getByText('Solve this ticket')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Ticket #1 is solved/i)).toBeVisible({ timeout: 8000 })
  })

  test('connect support email walks through gmail setup in copilot', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await page.getByRole('button', { name: 'Connect Support Email' }).click({ timeout: 15000 })

    await expect(page.getByText(/Turn customer emails into tickets/i).first()).toBeVisible({
      timeout: 10000,
    })
    await expect(page.getByRole('button', { name: 'Gmail connector' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Go to advanced options' })).toBeVisible()

    await page.getByRole('button', { name: 'Gmail connector' }).click()
    await expect(page.getByText(/Give the right access to connect to Gmail/i).first()).toBeVisible({
      timeout: 8000,
    })

    await page.getByRole('button', { name: 'Finish Gmail setup' }).click()
    await expect(page.getByText(/Gmail connector.*ready/i).first()).toBeVisible({ timeout: 8000 })
  })

  test('bring in your team opens copilot-led invite flow', async ({ page }) => {
    await page.getByRole('button', { name: 'Go live quickly' }).click()
    await expect(page.getByRole('button', { name: 'Bring in your team' })).toBeVisible({
      timeout: 15000,
    })
    await page.getByRole('button', { name: 'Bring in your team' }).click()

    await expect(page.getByText('Team invites').first()).toBeVisible({ timeout: 15000 })
    await expect(page.getByLabel('Email')).toHaveValue('alex@swiftfinance.io')

    await page.getByRole('button', { name: 'Invite' }).click()
    await expect(page.getByText('Send these team invites')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Invites sent')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Invite sent to/i)).toBeVisible({ timeout: 5000 })
  })
})
