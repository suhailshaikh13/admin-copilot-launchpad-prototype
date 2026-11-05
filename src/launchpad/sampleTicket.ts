export const SAMPLE_TICKET = {
  id: 1,
  subject: 'Unable to log in after password reset',
  channel: 'Via email',
  summary:
    'The customer reset their password but still cannot log in and receives an error after multiple attempts.',
  customerLabel: 'Customer',
  timestamp: 'Nov 04 02:41',
  customerMessage: `Hi, I reset my password earlier today, but I'm still not able to log in. I keep getting an error message when I try, and I've already attempted it a couple of times. Could someone please take a look? I need to get into my account as soon as possible.`,
  defaultReply: `Sorry you're still having trouble signing in. Please try the most recent password reset link and use the new password to sign in. If the error continues, reply with the exact message you're seeing and I'll help investigate.`,
} as const

export const REPLY_REFINEMENT_PROMPTS = [
  'Make the tone warmer',
  'Ask for the exact error message',
  'Offer to escalate if it persists',
] as const

export type ReplyRefinementPrompt = (typeof REPLY_REFINEMENT_PROMPTS)[number]

/** Which preview card to render — each phase is a separate message/widget instance. */
export type SampleTicketPhase = 'ticket-preview' | 'reply-draft' | 'posted-thread'

export const REFINED_REPLIES: Record<ReplyRefinementPrompt, string> = {
  'Make the tone warmer': `I'm sorry you're still locked out — that sounds frustrating. Please try the most recent password reset link and sign in with the new password. If you're still stuck, send me the exact error message and we'll get this sorted together.`,
  'Ask for the exact error message': `Sorry you're still having trouble signing in. Please try the latest password reset link once more. If it still fails, reply with the exact error text on screen (or a screenshot) so I can pinpoint what's blocking access.`,
  'Offer to escalate if it persists': `Sorry you're still having trouble signing in. Please use the most recent password reset link and the new password. If the error continues after one more try, reply here and I'll escalate to our account team for a deeper look.`,
}

export function sampleTicketRefinementLine(prompt: ReplyRefinementPrompt): string {
  if (prompt === 'Make the tone warmer') {
    return 'Got it — I will **warm up the tone** and keep the same guidance.'
  }
  if (prompt === 'Ask for the exact error message') {
    return 'I will **ask for the exact error message** so we can troubleshoot faster.'
  }
  return 'I will **offer to escalate** if the issue continues after one more try.'
}
