import { useState, useEffect, useCallback } from 'react'
import type { TodoItem } from '../types/todo'
import { loadTodos, saveTodos, addTodo } from '../services/todoStorage'

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    setTodos(loadTodos())
  }, [])

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const handleAdd = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setTodos(prev => [addTodo(text), ...prev])
    setInput('')
  }, [input])

  const handleToggle = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const handleDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      handleAdd()
    }
  }, [handleAdd])

  return (
    <div style={{ padding: '4px 8px', maxHeight: '150px', overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加待办..."
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '13px',
            outline: 'none'
          }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); handleAdd() }}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(100,200,255,0.3)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          +
        </button>
      </div>

      {todos.length === 0 && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '12px' }}>
          暂无待办
        </div>
      )}

      {todos.map(todo => (
        <div
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 4px',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => handleToggle(todo.id)}
            style={{ cursor: 'pointer', accentColor: '#64c8ff' }}
          />
          <span
            style={{
              flex: 1,
              fontSize: '13px',
              color: todo.done ? 'rgba(255,255,255,0.4)' : '#fff',
              textDecoration: todo.done ? 'line-through' : 'none'
            }}
          >
            {todo.text}
          </span>
          <button
            onClick={() => handleDelete(todo.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 4px'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
