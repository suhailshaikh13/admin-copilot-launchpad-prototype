export interface AnthropicEvent {
  type: string
  index?: number
  delta?: {
    type: string
    text?: string
    stop_reason?: string
  }
  content_block?: {
    type: string
    text?: string
  }
  message?: Record<string, unknown>
}

type Bytes = Uint8Array<ArrayBufferLike>

interface ParseResult {
  event: AnthropicEvent | null
  remaining: Bytes
}

function base64ToText(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

function parseOneMessage(buffer: Bytes): ParseResult | null {
  if (buffer.length < 4) return null

  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
  const totalByteLength = view.getUint32(0)

  if (buffer.length < totalByteLength) return null

  const headersByteLength = view.getUint32(4)
  const payloadOffset = 12 + headersByteLength
  const payloadLength = totalByteLength - headersByteLength - 16

  if (payloadLength <= 0) {
    return { event: null, remaining: buffer.slice(totalByteLength) }
  }

  const payloadBytes = buffer.slice(payloadOffset, payloadOffset + payloadLength)
  const payloadJson = JSON.parse(new TextDecoder().decode(payloadBytes))

  let event: AnthropicEvent | null = null

  if (payloadJson.bytes) {
    const decoded = base64ToText(payloadJson.bytes)
    event = JSON.parse(decoded)
  } else if (payloadJson.modelStreamErrorException || payloadJson.message) {
    event = {
      type: 'error',
      message: payloadJson.modelStreamErrorException ?? payloadJson,
    }
  }

  return { event, remaining: buffer.slice(totalByteLength) }
}

export function parseAllMessages(buffer: Bytes): { events: AnthropicEvent[]; remaining: Bytes } {
  const events: AnthropicEvent[] = []
  let current = buffer
  while (true) {
    const result = parseOneMessage(current)
    if (!result) break
    if (result.event) events.push(result.event)
    current = result.remaining
  }
  return { events, remaining: current }
}

export function concatBuffers(a: Bytes, b: Bytes): Bytes {
  const result = new Uint8Array(a.length + b.length)
  result.set(a, 0)
  result.set(b, a.length)
  return result
}
