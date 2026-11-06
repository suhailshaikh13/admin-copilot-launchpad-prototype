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
  return `**Step 1 of 2 — Turn customer emails into tickets**

Connect the email account that your customers use to contact you, for example help@yourcompany.com. Connecting your email won't affect your current systems or workflows. If Zendesk isn't for you, your data is securely deleted.

Choose how you want to connect:

- **Gmail connector** — New email sent to your Gmail inbox will be automatically converted to tickets. You can also create tickets from the last 300 emails.
- **Microsoft Exchange** — New email sent to your Microsoft address will be automatically converted to tickets. You can also create tickets from the last 300 emails.
- **Forward from another email** — Forward email from another external account to be converted into tickets.
- **Zendesk email** — Start using your Zendesk email **${ZENDESK_SUPPORT_EMAIL}** with your customers.

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

Open Google sign-in, then check the box to **Read, compose, and send emails** from your Gmail account.

[Sign in with Google](${GMAIL_LOGIN_URL})

**Permission to grant**
- Read, compose, and send emails from your Gmail account

I'll also create tickets from your last **300 emails** unless you tell me otherwise.

When you've finished in Google, continue here.

<suggestions>
<chip>Finish Gmail setup</chip>
<chip>Back to email options</chip>
</suggestions>`
}

export function getGmailSetupCompleteResponse(): string {
  return `Your **Gmail connector** is ready. New messages in that inbox will become tickets automatically, and I've queued the last **300 emails** to create tickets.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getMicrosoftExchangeResponse(): string {
  return `**Connect Microsoft Exchange**

Sign in with Microsoft to authorize Exchange for the account customers email.

[Sign in with Microsoft](${MICROSOFT_LOGIN_URL})

New email sent to that address will be automatically converted to tickets. I'll also create tickets from your last **300 emails** unless you tell me otherwise.

When you've finished signing in, continue here.

<suggestions>
<chip>I've signed in with Microsoft</chip>
<chip>Back to email options</chip>
</suggestions>`
}

export function getMicrosoftExchangeCompleteResponse(): string {
  return `Your **Microsoft Exchange** inbox is connected. New messages to that address will become tickets automatically, and I've queued the last **300 emails** to create tickets.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getForwardEmailResponse(): string {
  return `**Step 2 of 2 — Set up email forwarding**

1. **Enter your current support email**  
   Use the address customers already write to (for example help@yourcompany.com).

2. **Sign in to your email account (outside of Zendesk) and set up email forwarding**  
   Open your provider settings, find forwarding or filters, and point support mail at Zendesk.

3. **Add this address as the forwarding email**  
   \`${ZENDESK_SUPPORT_EMAIL}\`

When you've completed those steps, confirm here.

<suggestions>
<chip>I've set up forwarding</chip>
<chip>Back to email options</chip>
</suggestions>`
}

export function getForwardEmailCompleteResponse(): string {
  return `Email forwarding is set up. Messages forwarded to **${ZENDESK_SUPPORT_EMAIL}** will create tickets automatically.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getZendeskEmailResponse(): string {
  return `**You're all set with a Zendesk email**

Share your new support email (**${ZENDESK_SUPPORT_EMAIL}**) with your customers. Every email automatically becomes a support ticket in Zendesk.

If you decide to connect your own email later, you can do so anytime in settings.

<suggestions>
<chip>Try a sample ticket</chip>
<chip>Bring in your team</chip>
<chip>Preview Help center</chip>
</suggestions>`
}

export function getAdvancedEmailOptionsResponse(): string {
  return `For advanced email channel settings — custom addresses, authentication, and more — go to **Admin Center → Channels → Email**.

You can still finish the guided setup here anytime.

<suggestions>
<chip>Gmail connector</chip>
<chip>Microsoft Exchange</chip>
<chip>Forward from another email</chip>
<chip>Zendesk email</chip>
</suggestions>`
}
