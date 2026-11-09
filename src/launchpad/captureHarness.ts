/** Temporary deep-link harness for Figma journey captures via ?captureState= */

export type CaptureState =
  | 'empty'
  | 'go-live-hub'
  | 'help-center'
  | 'help-center-published'
  | 'sample-ticket'
  | 'sample-draft'
  | 'sample-refined'
  | 'sample-posted'
  | 'sample-solved'
  | 'email-intro'
  | 'email-gmail'
  | 'email-gmail-done'
  | 'email-microsoft'
  | 'email-microsoft-done'
  | 'email-forward'
  | 'email-forward-done'
  | 'email-zendesk'
  | 'email-advanced'
  | 'team-invite'
  | 'team-invite-sent'

type Step =
  | { type: 'send'; text: string }
  | { type: 'click'; name: string }
  | { type: 'waitText'; pattern: RegExp; timeout?: number }
  | { type: 'wait'; ms: number }

const SEQUENCES: Record<CaptureState, Step[]> = {
  empty: [{ type: 'wait', ms: 400 }],
  'go-live-hub': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
  ],
  'help-center': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Preview Help center' },
    { type: 'waitText', pattern: /Help center preview/i },
  ],
  'help-center-published': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Preview Help center' },
    { type: 'waitText', pattern: /Publish all/i },
    { type: 'click', name: 'Publish all' },
    { type: 'waitText', pattern: /All three articles are/i },
  ],
  'sample-ticket': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Try a sample ticket' },
    { type: 'waitText', pattern: /Sample ticket #1/i },
  ],
  'sample-draft': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Try a sample ticket' },
    { type: 'waitText', pattern: /Yes, draft a reply/i },
    { type: 'click', name: 'Yes, draft a reply' },
    { type: 'waitText', pattern: /Approve and send/i },
  ],
  'sample-refined': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Try a sample ticket' },
    { type: 'waitText', pattern: /Yes, draft a reply/i },
    { type: 'click', name: 'Yes, draft a reply' },
    { type: 'waitText', pattern: /Make the tone warmer/i },
    { type: 'click', name: 'Make the tone warmer' },
    { type: 'waitText', pattern: /warm up the tone/i },
    { type: 'wait', ms: 1200 },
  ],
  'sample-posted': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Try a sample ticket' },
    { type: 'waitText', pattern: /Yes, draft a reply/i },
    { type: 'click', name: 'Yes, draft a reply' },
    { type: 'waitText', pattern: /Approve and send/i },
    { type: 'click', name: 'Approve and send' },
    { type: 'waitText', pattern: /Your reply was sent on ticket/i },
  ],
  'sample-solved': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Try a sample ticket' },
    { type: 'waitText', pattern: /Yes, draft a reply/i },
    { type: 'click', name: 'Yes, draft a reply' },
    { type: 'waitText', pattern: /Approve and send/i },
    { type: 'click', name: 'Approve and send' },
    { type: 'waitText', pattern: /Solve this ticket/i },
    { type: 'click', name: 'Solve this ticket' },
    { type: 'waitText', pattern: /Ticket #1 is solved/i },
  ],
  'email-intro': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Turn customer emails into tickets/i },
  ],
  'email-gmail': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Gmail connector/i },
    { type: 'send', text: 'Gmail connector' },
    { type: 'waitText', pattern: /Give the right access to connect to Gmail/i },
  ],
  'email-gmail-done': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Gmail connector/i },
    { type: 'send', text: 'Gmail connector' },
    { type: 'waitText', pattern: /Finish Gmail setup/i },
    { type: 'send', text: 'Finish Gmail setup' },
    { type: 'waitText', pattern: /Gmail connector/i },
  ],
  'email-microsoft': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Microsoft Exchange/i },
    { type: 'send', text: 'Microsoft Exchange' },
    { type: 'waitText', pattern: /Connect Microsoft Exchange/i },
  ],
  'email-microsoft-done': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Microsoft Exchange/i },
    { type: 'send', text: 'Microsoft Exchange' },
    { type: 'waitText', pattern: /I've signed in with Microsoft/i },
    { type: 'send', text: "I've signed in with Microsoft" },
    { type: 'waitText', pattern: /inbox is connected/i },
  ],
  'email-forward': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Forward from another email/i },
    { type: 'send', text: 'Forward from another email' },
    { type: 'waitText', pattern: /Set up email forwarding/i },
  ],
  'email-forward-done': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Forward from another email/i },
    { type: 'send', text: 'Forward from another email' },
    { type: 'waitText', pattern: /I've set up forwarding/i },
    { type: 'send', text: "I've set up forwarding" },
    { type: 'waitText', pattern: /Email forwarding is set up/i },
  ],
  'email-zendesk': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Zendesk email/i },
    { type: 'send', text: 'Zendesk email' },
    { type: 'waitText', pattern: /You're all set with a Zendesk email/i },
  ],
  'email-advanced': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Connect Support Email' },
    { type: 'waitText', pattern: /Go to advanced options/i },
    { type: 'send', text: 'Go to advanced options' },
    { type: 'waitText', pattern: /advanced email channel settings/i },
  ],
  'team-invite': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Bring in your team' },
    { type: 'waitText', pattern: /Team invites/i },
  ],
  'team-invite-sent': [
    { type: 'send', text: 'Go live quickly' },
    { type: 'waitText', pattern: /fastest way to go live/i },
    { type: 'send', text: 'Bring in your team' },
    { type: 'waitText', pattern: /Invite/i },
    { type: 'click', name: 'Invite' },
    { type: 'waitText', pattern: /Invites sent/i },
  ],
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function waitForText(pattern: RegExp, timeout = 15000) {
  const start = Date.now()
  return new Promise<void>((resolve, reject) => {
    const tick = () => {
      if (pattern.test(document.body.innerText)) {
        resolve()
        return
      }
      if (Date.now() - start > timeout) {
        reject(new Error(`Timed out waiting for ${pattern}`))
        return
      }
      window.setTimeout(tick, 150)
    }
    tick()
  })
}

function clickButton(name: string) {
  const buttons = [...document.querySelectorAll('button')]
  const match = buttons.find(btn => btn.textContent?.trim() === name)
  if (!match) throw new Error(`Button not found: ${name}`)
  match.click()
}

export function parseCaptureState(): CaptureState | null {
  const value = new URLSearchParams(window.location.search).get('captureState')
  if (!value) return null
  if (value in SEQUENCES) return value as CaptureState
  return null
}

export async function runCaptureSequence(
  state: CaptureState,
  sendMessage: (text: string) => void
): Promise<void> {
  document.documentElement.dataset.captureReady = '0'
  document.documentElement.dataset.captureState = state

  for (const step of SEQUENCES[state]) {
    if (step.type === 'send') {
      sendMessage(step.text)
      await sleep(900)
    } else if (step.type === 'click') {
      clickButton(step.name)
      await sleep(600)
    } else if (step.type === 'waitText') {
      await waitForText(step.pattern, step.timeout)
      await sleep(400)
    } else if (step.type === 'wait') {
      await sleep(step.ms)
    }
  }

  // Scroll message panes to bottom so final CTA/status is visible
  ;[...document.querySelectorAll('div')].forEach(el => {
    const style = getComputedStyle(el)
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      el.scrollTop = el.scrollHeight
    }
  })

  await sleep(300)
  document.documentElement.dataset.captureReady = '1'
}

export const CAPTURE_STATES = Object.keys(SEQUENCES) as CaptureState[]
