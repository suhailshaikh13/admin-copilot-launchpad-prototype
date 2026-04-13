export type ChatMessage = { role: 'user' | 'assistant'; content: string }

const SYSTEM_PROMPT = `You are a helpful Zendesk Admin Center copilot. You assist Zendesk administrators with configuring their account, managing triggers, automations, views, macros, routing rules, and other admin tasks. Be concise and practical. When suggesting configurations, be specific about the steps needed.

At the end of every response, provide 1-3 short follow-up suggestion chips that the user might want to ask next. Format them in XML tags like this:

<suggestions>
<chip>Suggestion text here</chip>
<chip>Another suggestion</chip>
</suggestions>

Keep each suggestion under 60 characters. Make them specific and actionable, relevant to what you just discussed. If the conversation has naturally concluded, you may omit suggestions.`

export function parseSuggestions(text: string): { content: string; suggestions: string[] } {
  const match = text.match(/<suggestions>([\s\S]*?)<\/suggestions>\s*$/)
  if (!match) return { content: text, suggestions: [] }
  const content = text.slice(0, match.index).trimEnd()
  const chips = [...match[1].matchAll(/<chip>(.*?)<\/chip>/g)]
    .map(m => m[1].trim()).filter(Boolean).slice(0, 5)
  return { content, suggestions: chips }
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: messages.map(({ role, content }) => ({ role, content })),
      }),
      signal,
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`API error: ${response.status} ${body}`)
    }

    const data = await response.json()
    const text = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('') ?? ''

    onChunk(text)
    onDone()
  } catch (error) {
    if (signal?.aborted) return
    onError(error instanceof Error ? error : new Error(String(error)))
  }
}
