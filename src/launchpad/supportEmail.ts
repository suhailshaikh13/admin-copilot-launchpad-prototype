export const ZENDESK_SUPPORT_EMAIL = 'support@northwindtrading.zendesk.com'

/** Prototype login destinations for connector authorization. */
export const GMAIL_LOGIN_URL = 'https://accounts.google.com/'
export const MICROSOFT_LOGIN_URL = 'https://login.microsoftonline.com/'

export const SUPPORT_EMAIL_OPTION_CHIPS = [
  'Gmail connector',
  'Microsoft Exchange',
  'Forward from another email',
  'Zendesk email',
] as const

export type SupportEmailOptionChip = (typeof SUPPORT_EMAIL_OPTION_CHIPS)[number]

export function getConnectSupportEmailIntroResponse(): string {
  return `**Step 1 of 2: Turn customer emails into tickets**

Connect the email account customers use to reach you, for example help@yourcompany.com. Connecting email won't change current systems or workflows. If Zendesk isn't the right fit, the data is deleted securely.

Choose how to connect:

- **Gmail connector**: New email in the Gmail inbox converts to tickets automatically. Optional: create tickets from the last 300 emails.
- **Microsoft Exchange**: New email to the Microsoft address converts to tickets automatically. Optional: create tickets from the last 300 emails.
- **Forward from another email**: Forward mail from an external account into Zendesk.
- **Zendesk email**: Start with **${ZENDESK_SUPPORT_EMAIL}** for customers.

[Go to advanced options](#advanced-email-options)

<suggestions>
<chip>Gmail connector</chip>
<chip>Microsoft Exchange</chip>
<chip>Forward from another email</chip>
<chip>Zendesk email</chip>
<chip>Go to advanced options</chip>
</suggestions>`
}

export function getGmailConnectorResponse(): string {
  return `**Give the right access to connect to Gmail**

Open Google sign-in, then check **Read, compose, and send emails** for the Gmail account.

[Sign in with Google](${GMAIL_LOGIN_URL})

**Permission to grant**
- Read, compose, and send emails from your Gmail account

Also creates tickets from the last **300 emails** unless you say otherwise.

When Google sign-in is done, continue here.

<suggestions>
<chip>Finish Gmail setup</chip>
<chip>Back to email options</chip>
</suggestions>`
}

export function getGmailSetupCompleteResponse(): string {
  return `**Gmail connector** is ready. New messages in that inbox become tickets automatically. The last **300 emails** are queued to create tickets.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getMicrosoftExchangeResponse(): string {
  return `**Connect Microsoft Exchange**

Sign in with Microsoft to authorize Exchange for the address customers email.

[Sign in with Microsoft](${MICROSOFT_LOGIN_URL})

New email to that address converts to tickets automatically. Also creates tickets from the last **300 emails** unless you say otherwise.

When Microsoft sign-in is done, continue here.

<suggestions>
<chip>I've signed in with Microsoft</chip>
<chip>Back to email options</chip>
</suggestions>`
}

export function getMicrosoftExchangeCompleteResponse(): string {
  return `**Microsoft Exchange** is connected. New messages to that address become tickets automatically. The last **300 emails** are queued to create tickets.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getForwardEmailResponse(): string {
  return `**Step 2 of 2: Set up email forwarding**

1. **Enter your current support email**  
   Use the address customers already write to (for example help@yourcompany.com).

2. **Sign in to your email account (outside Zendesk) and set up forwarding**  
   Open provider settings, find forwarding or filters, and point support mail at Zendesk.

3. **Add this address as the forwarding email**  
   \`${ZENDESK_SUPPORT_EMAIL}\`

When those steps are done, confirm here.

<suggestions>
<chip>I've set up forwarding</chip>
<chip>Back to email options</chip>
</suggestions>`
}

export function getForwardEmailCompleteResponse(): string {
  return `Email forwarding is set up. Messages forwarded to **${ZENDESK_SUPPORT_EMAIL}** create tickets automatically.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getZendeskEmailResponse(): string {
  return `**Zendesk email is ready**

Share **${ZENDESK_SUPPORT_EMAIL}** with customers. Every message becomes a support ticket in Zendesk.

A custom email address can be connected later in settings.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getAdvancedEmailOptionsResponse(): string {
  return `For advanced email channel settings (custom addresses, authentication, and more), open **Admin Center → Channels → Email**.

Guided setup in chat is still available anytime.

<suggestions>
<chip>Gmail connector</chip>
<chip>Microsoft Exchange</chip>
<chip>Forward from another email</chip>
<chip>Zendesk email</chip>
</suggestions>`
}
