import { test, expect } from '@playwright/test'

test.describe('Admin Copilot Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByRole('button', { name: 'Home' }).click()
  })

  test('renders the header with Admin center and search', async ({ page }) => {
    await expect(page.getByText('Admin center', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()
  })

  test('renders the side navigation', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('renders the greeting section', async ({ page }) => {
    await expect(page.getByText('Good morning')).toBeVisible()
    await expect(page.getByText('Get help from admin copilot')).toBeVisible()
    await expect(page.getByText('What can copilot do?')).toBeVisible()
    await expect(page.getByText('Create a view of pending tickets')).toBeVisible()
    await expect(page.getByText('Learn about admin copilot')).toBeVisible()
  })

  test('renders latest insights section with 3 cards', async ({ page }) => {
    await expect(page.getByText('Latest insights')).toBeVisible()
    await expect(page.getByText('Sep 20–Sep 28, 2025')).toBeVisible()
    await expect(page.getByText('Full resolution time steady')).toBeVisible()
    await expect(page.getByText('Ticket volume increase')).toBeVisible()
    await expect(page.getByText('First reply time increase')).toBeVisible()
    await expect(page.getByText('Show me more')).toBeVisible()
    await expect(page.getByText('High volume topics today')).toBeVisible()
    await expect(page.getByText('How to improve it')).toBeVisible()
  })

  test('renders recommendations section with 3 items', async ({ page }) => {
    await expect(page.getByText('Recommendations', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View all', exact: true })).toBeVisible()
    await expect(page.getByText('Route specific tickets to assignee: EMEA Group')).toBeVisible()
    await expect(page.getByText('Change ticket status for intent: Unsolicited marketing')).toBeVisible()
    await expect(page.getByText('Turn on suggested macros')).toBeVisible()
  })

  test('renders recommendation tags correctly', async ({ page }) => {
    await expect(page.getByText('Triggers').first()).toBeVisible()
    await expect(page.getByText('Optimization').first()).toBeVisible()
    await expect(page.getByText('Procedures').first()).toBeVisible()
    await expect(page.getByText('Macros', { exact: true }).first()).toBeVisible()
  })
})
