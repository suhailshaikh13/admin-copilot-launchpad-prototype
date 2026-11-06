import { chromium } from 'playwright'

const captureId = process.argv[2]
const promptId = process.argv[3]
const state = process.argv[4] || 'empty'
const baseUrl = process.env.CAPTURE_URL || 'http://localhost:5173/'

if (!captureId || !promptId) {
  console.error('Usage: node scripts/figma-capture-state.mjs <captureId> <promptId> <state>')
  process.exit(1)
}

async function setup(page, stateName) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.getByText('How can I help?').waitFor({ timeout: 20000 })
  await page.waitForTimeout(500)

  const clickChip = async name => {
    const btn = page.getByRole('button', { name, exact: true })
    await btn.waitFor({ timeout: 15000 })
    await btn.click()
    await page.waitForTimeout(1200)
  }

  if (stateName === 'empty') return

  if (stateName === 'go-live-hub') {
    await clickChip('Go live quickly')
    await page.getByText(/fastest way to go live/i).waitFor({ timeout: 15000 })
    return
  }

  await clickChip('Go live quickly')
  await page.getByText(/fastest way to go live/i).waitFor({ timeout: 15000 })

  if (stateName === 'help-center') {
    await clickChip('Preview Help center')
    await page.getByText(/Help center preview/i).waitFor({ timeout: 15000 })
    return
  }

  if (stateName === 'help-center-published') {
    await clickChip('Preview Help center')
    await page.getByRole('button', { name: 'Publish all' }).waitFor({ timeout: 15000 })
    await page.getByRole('button', { name: 'Publish all' }).click()
    await page.getByText(/All three articles are/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'sample-ticket') {
    await clickChip('Try a sample ticket')
    await page.getByText('Sample ticket #1').waitFor({ timeout: 15000 })
    return
  }

  if (stateName === 'sample-draft') {
    await clickChip('Try a sample ticket')
    await page.getByRole('button', { name: 'Yes, draft a reply' }).waitFor({ timeout: 15000 })
    await page.getByRole('button', { name: 'Yes, draft a reply' }).click()
    await page.getByRole('button', { name: 'Approve and send' }).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'sample-refined') {
    await clickChip('Try a sample ticket')
    await page.getByRole('button', { name: 'Yes, draft a reply' }).click()
    await page.getByRole('button', { name: 'Make the tone warmer' }).waitFor({ timeout: 10000 })
    await page.getByRole('button', { name: 'Make the tone warmer' }).click()
    await page.getByText(/warm up the tone/i).waitFor({ timeout: 10000 })
    await page.waitForTimeout(1000)
    return
  }

  if (stateName === 'sample-posted') {
    await clickChip('Try a sample ticket')
    await page.getByRole('button', { name: 'Yes, draft a reply' }).click()
    await page.getByRole('button', { name: 'Approve and send' }).waitFor({ timeout: 10000 })
    await page.getByRole('button', { name: 'Approve and send' }).click()
    await page.getByText(/reply has been posted/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'sample-solved') {
    await clickChip('Try a sample ticket')
    await page.getByRole('button', { name: 'Yes, draft a reply' }).click()
    await page.getByRole('button', { name: 'Approve and send' }).waitFor({ timeout: 10000 })
    await page.getByRole('button', { name: 'Approve and send' }).click()
    await page.getByRole('button', { name: 'Solve this ticket' }).waitFor({ timeout: 10000 })
    await page.getByRole('button', { name: 'Solve this ticket' }).click()
    await page.getByText(/Ticket #1 is solved/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-intro') {
    await clickChip('Connect Support Email')
    await page.getByText(/Turn customer emails into tickets/i).waitFor({ timeout: 15000 })
    return
  }

  if (stateName === 'email-gmail') {
    await clickChip('Connect Support Email')
    await clickChip('Gmail connector')
    await page.getByText(/Give the right access to connect to Gmail/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-gmail-done') {
    await clickChip('Connect Support Email')
    await clickChip('Gmail connector')
    await clickChip('Finish Gmail setup')
    await page.getByText(/Gmail connector.*ready|ready/i).first().waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-microsoft') {
    await clickChip('Connect Support Email')
    await clickChip('Microsoft Exchange')
    await page.getByText(/Connect Microsoft Exchange/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-microsoft-done') {
    await clickChip('Connect Support Email')
    await clickChip('Microsoft Exchange')
    await clickChip("I've signed in with Microsoft")
    await page.getByText(/inbox is connected/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-forward') {
    await clickChip('Connect Support Email')
    await clickChip('Forward from another email')
    await page.getByText(/Set up email forwarding/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-forward-done') {
    await clickChip('Connect Support Email')
    await clickChip('Forward from another email')
    await clickChip("I've set up forwarding")
    await page.getByText(/Email forwarding is set up/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-zendesk') {
    await clickChip('Connect Support Email')
    await clickChip('Zendesk email')
    await page.getByText(/You're all set with a Zendesk email/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'email-advanced') {
    await clickChip('Connect Support Email')
    await clickChip('Go to advanced options')
    await page.getByText(/advanced email channel settings/i).waitFor({ timeout: 10000 })
    return
  }

  if (stateName === 'team-invite') {
    await clickChip('Bring in your team')
    await page.getByText('Team invites').waitFor({ timeout: 15000 })
    return
  }

  if (stateName === 'team-invite-sent') {
    await clickChip('Bring in your team')
    await page.getByRole('button', { name: 'Invite' }).waitFor({ timeout: 15000 })
    await page.getByRole('button', { name: 'Invite' }).click()
    await page.getByText('Invites sent').waitFor({ timeout: 10000 })
    return
  }

  throw new Error(`Unknown state: ${stateName}`)
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

try {
  await setup(page, state)
  await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('div')].filter(el => {
      const style = getComputedStyle(el)
      return style.overflowY === 'auto' || style.overflowY === 'scroll'
    })
    const last = candidates[candidates.length - 1]
    if (last) last.scrollTop = last.scrollHeight
  })
  await page.waitForTimeout(400)

  const scriptRes = await page.context().request.get(
    'https://mcp.figma.com/mcp/html-to-design/capture.js'
  )
  const scriptText = await scriptRes.text()
  await page.evaluate(s => {
    const el = document.createElement('script')
    el.textContent = s
    document.head.appendChild(el)
  }, scriptText)
  await page.waitForTimeout(800)

  console.error('capturing…')
  const result = await Promise.race([
    page.evaluate(
      ({ captureId: id, promptId: pid }) => {
        if (!window.figma?.captureForDesign) {
          return { error: 'captureForDesign missing', keys: Object.keys(window.figma || {}) }
        }
        return window.figma.captureForDesign({
          captureId: id,
          endpoint: `https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true&promptId=${pid}`,
          selector: 'body',
        })
      },
      { captureId, promptId }
    ),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('captureForDesign timed out after 90s')), 90000)
    ),
  ])

  console.log(JSON.stringify({ state, result }, null, 2))
} catch (err) {
  console.error(String(err))
  process.exit(1)
} finally {
  await browser.close()
}
