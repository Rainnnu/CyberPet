import type { TodoItem } from '../types/todo'

const STORAGE_KEY = 'cyberpet-todos'

export function loadTodos(): TodoItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveTodos(todos: TodoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {}
}

export function addTodo(text: string): TodoItem {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: text.trim(),
    done: false,
    createdAt: Date.now()
  }
}
