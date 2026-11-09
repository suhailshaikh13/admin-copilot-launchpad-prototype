export const SAMPLE_TICKET = {
  id: 1,
  subject: 'Unable to log in after password reset',
  channel: 'Via email',
  summary:
    'The customer reset their password but still cannot log in and receives an error after multiple attempts.',
  customerLabel: 'Customer',
  timestamp: 'Nov 04 02:41',
  customerMessage: `Hi, I reset my password earlier today, but I'm still not able to log in. I keep getting an error message when I try, and I've already attempted it a couple of times. Could someone please take a look? I need to get into my account as soon as possible.`,
  defaultReply: `Sign-in still fails after the reset. Try the most recent password reset link and the new password. If the error continues, reply with the exact message on screen for a closer look.`,
} as const

export const REPLY_REFINEMENT_PROMPTS = [
  'Make the tone warmer',
  'Ask for the exact error message',
  'Offer to escalate if it persists',
] as const

export type ReplyRefinementPrompt = (typeof REPLY_REFINEMENT_PROMPTS)[number]

/** Which preview card to render — each phase is a separate message/widget instance. */
export type SampleTicketPhase = 'ticket-preview' | 'reply-draft'

export const REFINED_REPLIES: Record<ReplyRefinementPrompt, string> = {
  'Make the tone warmer': `Still locked out after the reset — that is frustrating. Try the most recent password reset link and sign in with the new password. If you're still stuck, send the exact error message and the account team will follow up.`,
  'Ask for the exact error message': `Sign-in still fails after the reset. Try the latest password reset link once more. If it still fails, reply with the exact error text on screen (or a screenshot) so the cause is easier to pinpoint.`,
  'Offer to escalate if it persists': `Sign-in still fails after the reset. Use the most recent password reset link and the new password. If the error continues after one more try, reply here and the account team takes a deeper look.`,
}

export function sampleTicketRefinementLine(prompt: ReplyRefinementPrompt): string {
  if (prompt === 'Make the tone warmer') {
    return 'Got it. **Warming up the tone** with the same guidance.'
  }
  if (prompt === 'Ask for the exact error message') {
    return 'Next draft will **ask for the exact error message** for a faster fix.'
  }
  return 'Next draft will **offer to escalate** if it still fails after one more try.'
}
