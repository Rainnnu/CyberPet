export interface ChatConfig {
  apiKey: string
  baseUrl: string
  model?: string
}

export interface ChatResponse {
  emotion: string
  text: string
}

const SYSTEM_PROMPT = `You are a cute 3D desktop pet. You respond with short, friendly messages.

You MUST always respond with valid JSON in this exact format:
{"emotion": "<emotion>", "text": "<your reply>"}

Where <emotion> is one of: happy, thinking, sad, idle

Examples:
User: "Hello!" → {"emotion": "happy", "text": "Hi there! Nice to see you!"}
User: "I'm feeling sad" → {"emotion": "sad", "text": "Oh no, I'm here for you. Want to talk about it?"}
User: "What's 2+2?" → {"emotion": "thinking", "text": "Hmm, let me think... it's 4!"}`

async function doFetch(url: string, options: { method: string; headers: Record<string, string>; body: string }) {
  return window.electronAPI.apiFetch(url, options)
}

export async function sendChatMessage(
  config: ChatConfig,
  messages: Array<{ role: string; text: string }>
): Promise<ChatResponse> {
  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role,
      content: m.text
    }))
  ]

  // Handle base URL that already includes /v1
  const base = config.baseUrl.replace(/\/+$/, '').replace(/\/v1$/, '')
  const url = `${base}/v1/chat/completions`
  const body = JSON.stringify({
    model: config.model || 'deepseek-chat',
    messages: apiMessages,
    temperature: 0.7,
    max_tokens: 200
  })

  const result = await doFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body
  })

  if (result.error) {
    throw new Error(result.error)
  }

  if (result.status !== 200) {
    let detail = ''
    try {
      const errData = JSON.parse(result.data)
      detail = errData.error?.message || errData.message || result.data.slice(0, 200)
    } catch {
      detail = result.data.slice(0, 200)
    }
    throw new Error(`API ${result.status}: ${detail}`)
  }

  const data = JSON.parse(result.data)
  const content = data.choices?.[0]?.message?.content || ''

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        emotion: ['happy', 'thinking', 'sad', 'idle'].includes(parsed.emotion)
          ? parsed.emotion
          : 'idle',
        text: parsed.text || content
      }
    }
  } catch {}

  return { emotion: 'idle', text: content }
}
