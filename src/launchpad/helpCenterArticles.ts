export const HELP_CENTER_PREVIEW_BRAND = 'Northwind Trading'
export const HELP_CENTER_PREVIEW_SITE = 'northwindtrading.com'

export type ArticleStatus = 'generated' | 'draft' | 'published'

export interface HelpCenterArticle {
  id: string
  title: string
  excerpt: string
  category: string
}

export interface HelpCenterCompletionSummary {
  businessName: string
  siteLabel: string
  articles: Array<HelpCenterArticle & { status: Exclude<ArticleStatus, 'generated'> }>
}

export function inferSiteLabel(businessName: string): string {
  const slug = businessName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug ? `${slug}.com` : 'your-site.com'
}

export function buildHelpCenterArticles(businessName: string): HelpCenterArticle[] {
  const brand = businessName.trim() || 'your business'
  return [
    {
      id: 'shipping',
      title: `Shipping and delivery for ${brand}`,
      excerpt:
        'Processing times, carriers, and how customers track an order after checkout.',
      category: 'Orders & shipping',
    },
    {
      id: 'returns',
      title: `Returns, exchanges, and warranty`,
      excerpt:
        'Return window, condition requirements, and how customers start a return or warranty claim.',
      category: 'Policies',
    },
    {
      id: 'getting-started',
      title: `Getting started with ${brand}`,
      excerpt:
        'Account setup, accepted payment methods, and the fastest way to reach your support team.',
      category: 'Getting started',
    },
  ]
}

export function sampleAgentAnswer(
  businessName: string,
  publishedTitles: string[]
): string | null {
  if (publishedTitles.length === 0) return null
  const brand = businessName.trim() || 'our store'
  if (publishedTitles.some(t => /return|warranty/i.test(t))) {
    return `Most returns are accepted within 30 days if items are unused and in original packaging. Customers can start a return from their ${brand} account or by replying to their order confirmation email.`
  }
  if (publishedTitles.some(t => /shipping/i.test(t))) {
    return `Standard shipping typically leaves our warehouse in 1–2 business days. You'll get a tracking link by email once the order ships.`
  }
  return `Thanks for reaching out to ${brand}. Published help articles cover orders, returns, and getting started — ask me anything in those topics.`
}
