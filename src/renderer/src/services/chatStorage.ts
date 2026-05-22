const MAX_MESSAGES = 200
const CONVERSATIONS_KEY = 'cyberpet-conversations'
const CURRENT_KEY = 'cyberpet-current-conversation'

export interface Message {
  role: 'user' | 'assistant'
  text: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function loadConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  } catch {}
}

export function getCurrentConversationId(): string | null {
  try {
    return localStorage.getItem(CURRENT_KEY)
  } catch {
    return null
  }
}

function setCurrentConversationId(id: string): void {
  try {
    localStorage.setItem(CURRENT_KEY, id)
  } catch {}
}

export function createConversation(): Conversation {
  const conv: Conversation = {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  const conversations = loadConversations()
  conversations.unshift(conv)
  saveConversations(conversations)
  setCurrentConversationId(conv.id)
  return conv
}

export function deleteConversation(id: string): string | null {
  let conversations = loadConversations()
  conversations = conversations.filter(c => c.id !== id)
  saveConversations(conversations)

  const currentId = getCurrentConversationId()
  if (currentId === id) {
    const newCurrent = conversations.length > 0 ? conversations[0].id : null
    if (newCurrent) setCurrentConversationId(newCurrent)
    return newCurrent
  }
  return currentId
}

export function getConversation(id: string): Conversation | null {
  const conversations = loadConversations()
  return conversations.find(c => c.id === id) || null
}

export function updateConversationMessages(id: string, messages: Message[]): void {
  const conversations = loadConversations()
  const conv = conversations.find(c => c.id === id)
  if (conv) {
    conv.messages = messages.slice(-MAX_MESSAGES)
    conv.updatedAt = Date.now()
    saveConversations(conversations)
  }
}

export function updateConversationTitle(id: string, title: string): void {
  const conversations = loadConversations()
  const conv = conversations.find(c => c.id === id)
  if (conv) {
    conv.title = title.slice(0, 30)
    saveConversations(conversations)
  }
}

export function switchConversation(id: string): Conversation | null {
  setCurrentConversationId(id)
  return getConversation(id)
}
