export type ChatMessage = { role: 'user' | 'assistant'; content: string }

const SYSTEM_PROMPT = `You are a helpful Zendesk Admin Center copilot. You assist Zendesk administrators with configuring their account, managing triggers, automations, views, macros, routing rules, and other admin tasks. Be concise and practical. When suggesting configurations, be specific about the steps needed.`

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
