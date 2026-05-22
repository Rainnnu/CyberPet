import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage, type ChatConfig } from '../services/chat'
import { tryTodoCommand } from '../services/todoCommands'
import {
  loadConversations,
  getCurrentConversationId,
  getConversation,
  createConversation,
  deleteConversation,
  updateConversationMessages,
  updateConversationTitle,
  switchConversation,
  type Message,
  type Conversation
} from '../services/chatStorage'
import type { Emotion } from './useEmotion'

interface ChatSettings {
  apiKey: string
  baseUrl: string
  model: string
}

const STORAGE_KEY = 'cyberpet-settings'

function loadSettings(): ChatSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { apiKey: '', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat' }
}

function saveSettings(settings: ChatSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {}
}

export function useChat(onEmotionChange: (emotion: Emotion) => void, onTodoUpdate?: () => void) {
  const [settings, setSettingsState] = useState<ChatSettings>(loadSettings)
  const [isConfigured, setIsConfigured] = useState(!!settings.apiKey)
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations())
  const [currentId, setCurrentId] = useState<string | null>(() => getCurrentConversationId())
  const [messages, setMessages] = useState<Message[]>(() => {
    const id = getCurrentConversationId()
    if (id) {
      const conv = getConversation(id)
      return conv?.messages || []
    }
    return []
  })

  // Ensure there's always a current conversation
  useEffect(() => {
    if (!currentId || !getConversation(currentId)) {
      if (conversations.length > 0) {
        setCurrentId(conversations[0].id)
        setMessages(conversations[0].messages)
      } else {
        const conv = createConversation()
        setCurrentId(conv.id)
        setMessages([])
        setConversations([conv])
      }
    }
  }, [])

  // Persist messages whenever they change
  useEffect(() => {
    if (currentId && settings.apiKey) {
      updateConversationMessages(currentId, messages)
      // Update conversations list in state
      setConversations(loadConversations())
    }
  }, [messages, currentId, settings.apiKey])

  const setSettings = useCallback((newSettings: ChatSettings) => {
    setSettingsState(newSettings)
    saveSettings(newSettings)
    setIsConfigured(!!newSettings.apiKey)
  }, [])

  const handleNewConversation = useCallback(() => {
    const conv = createConversation()
    setCurrentId(conv.id)
    setMessages([])
    setConversations(loadConversations())
  }, [])

  const handleSwitchConversation = useCallback((id: string) => {
    const conv = switchConversation(id)
    if (conv) {
      setCurrentId(conv.id)
      setMessages(conv.messages)
    }
  }, [])

  const handleDeleteConversation = useCallback((id: string) => {
    const newCurrentId = deleteConversation(id)
    setConversations(loadConversations())
    if (newCurrentId) {
      setCurrentId(newCurrentId)
      const conv = getConversation(newCurrentId)
      setMessages(conv?.messages || [])
    } else {
      // No conversations left, create a new one
      const conv = createConversation()
      setCurrentId(conv.id)
      setMessages([])
      setConversations([conv])
    }
  }, [])

  const sendMessage = useCallback(
    async (text: string): Promise<string> => {
      if (!settings.apiKey) {
        throw new Error('API key not configured')
      }

      // Ensure we have a conversation
      let convId = currentId
      if (!convId) {
        const conv = createConversation()
        convId = conv.id
        setCurrentId(convId)
        setConversations(loadConversations())
      }

      // Check for todo commands before sending to AI
      const todoResult = tryTodoCommand(text)
      if (todoResult.handled) {
        const userMessage: Message = { role: 'user', text }
        const botMessage: Message = { role: 'assistant', text: todoResult.message || 'Done.' }
        setMessages((prev) => [...prev, userMessage, botMessage])
        onTodoUpdate?.()
        return todoResult.message || 'Done.'
      }

      const userMessage: Message = { role: 'user', text }
      setMessages((prev) => [...prev, userMessage])

      // Auto-title: set title from first user message
      const currentConv = getConversation(convId)
      if (currentConv && currentConv.messages.length === 0 && currentConv.title === 'New Chat') {
        updateConversationTitle(convId, text)
        setConversations(loadConversations())
      }

      const config: ChatConfig = {
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl,
        model: settings.model
      }

      const allMessages = [...messages, userMessage]

      try {
        const response = await sendChatMessage(config, allMessages)

        const assistantMessage: Message = { role: 'assistant', text: response.text }
        setMessages((prev) => [...prev, assistantMessage])

        // Update emotion
        onEmotionChange(response.emotion as Emotion)

        return response.text
      } catch (err) {
        onEmotionChange('idle')
        throw err
      }
    },
    [settings, messages, currentId, onEmotionChange, onTodoUpdate]
  )

  return {
    messages,
    sendMessage,
    settings,
    setSettings,
    isConfigured,
    conversations,
    currentConversationId: currentId,
    onNewConversation: handleNewConversation,
    onSwitchConversation: handleSwitchConversation,
    onDeleteConversation: handleDeleteConversation
  }
}
