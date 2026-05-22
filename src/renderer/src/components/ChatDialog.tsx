import { useState, useRef, useEffect, useCallback } from 'react'
import TodoList from './TodoList'
import type { Conversation, Message } from '../services/chatStorage'

interface ChatDialogProps {
  onClose: () => void
  onSendMessage: (text: string) => Promise<string>
  messages: Message[]
  conversations: Conversation[]
  currentConversationId: string | null
  onNewConversation: () => void
  onSwitchConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  todoKey?: number
}

type Tab = 'chat' | 'todo'

export default function ChatDialog({
  onClose,
  onSendMessage,
  messages,
  conversations,
  currentConversationId,
  onNewConversation,
  onSwitchConversation,
  onDeleteConversation,
  todoKey
}: ChatDialogProps) {
  const [tab, setTab] = useState<Tab>('chat')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showConvList, setShowConvList] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (tab === 'chat') inputRef.current?.focus()
  }, [tab])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    setIsLoading(true)

    try {
      await onSendMessage(text)
    } catch (err) {
      // Error is already handled in useChat
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, onSendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [handleSend, onClose]
  )

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        flex: 1,
        padding: '6px 0',
        border: 'none',
        borderRadius: 6,
        background: tab === t ? 'rgba(100,200,255,0.3)' : 'transparent',
        color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: tab === t ? 600 : 400
      }}
    >
      {label}
    </button>
  )

  const currentConv = conversations.find(c => c.id === currentConversationId)

  return (
    <div
      style={{
        margin: 10,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        padding: 12,
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 280
      }}
    >
      {/* Tabs + Close */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 2 }}>
          {tabBtn('chat', 'Chat')}
          {tabBtn('todo', 'Todo')}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: 6,
            width: 24,
            height: 24,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            lineHeight: 1,
            marginLeft: 4
          }}
        >
          x
        </button>
      </div>

      {/* Chat Tab */}
      {tab === 'chat' && (
        <>
          {/* Conversation bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 6, alignItems: 'center' }}>
            <button
              onClick={onNewConversation}
              style={{
                background: 'rgba(100,200,255,0.2)',
                border: 'none',
                borderRadius: 4,
                padding: '3px 8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: 11,
                whiteSpace: 'nowrap'
              }}
            >
              + New
            </button>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <button
                onClick={() => setShowConvList(!showConvList)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '3px 8px',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  fontSize: 11,
                  width: '100%',
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {currentConv?.title || 'New Chat'}
              </button>
              {showConvList && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(20, 20, 30, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 6,
                    marginTop: 2,
                    maxHeight: 150,
                    overflowY: 'auto',
                    zIndex: 10,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {conversations.length === 0 && (
                    <div style={{ padding: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 11 }}>
                      No conversations
                    </div>
                  )}
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '5px 8px',
                        cursor: 'pointer',
                        background: conv.id === currentConversationId ? 'rgba(100,200,255,0.15)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                      }}
                    >
                      <span
                        onClick={() => { onSwitchConversation(conv.id); setShowConvList(false) }}
                        style={{
                          flex: 1,
                          fontSize: 11,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: conv.id === currentConversationId ? '#64c8ff' : 'rgba(255,255,255,0.7)'
                        }}
                      >
                        {conv.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteConversation(conv.id)
                          if (conversations.length <= 1) setShowConvList(false)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.3)',
                          cursor: 'pointer',
                          fontSize: 12,
                          padding: '0 2px',
                          lineHeight: 1
                        }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 8 }}>
            {messages.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 20 }}>
                Click to chat with your pet!
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 6,
                  textAlign: msg.role === 'user' ? 'right' : 'left'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 8,
                    maxWidth: '80%',
                    background:
                      msg.role === 'user'
                        ? 'rgba(100, 200, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.15)'
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {isLoading && (
              <div style={{ color: 'rgba(255,255,255,0.5)' }}>Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Say something..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                padding: '6px 10px',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                background: 'rgba(100, 200, 255, 0.3)',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                color: 'white',
                cursor: 'pointer',
                opacity: isLoading || !input.trim() ? 0.5 : 1
              }}
            >
              Send
            </button>
          </div>
        </>
      )}

      {/* Todo Tab */}
      {tab === 'todo' && <TodoList key={todoKey} />}
    </div>
  )
}
