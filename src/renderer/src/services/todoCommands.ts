import { loadTodos, saveTodos, addTodo } from './todoStorage'

interface CommandResult {
  handled: boolean
  message?: string
}

export function tryTodoCommand(text: string): CommandResult {
  const trimmed = text.trim()

  // 完成命令
  const completeMatch = trimmed.match(/^(完成|搞定|做了)\s*(.+)/)
  if (completeMatch) {
    const keyword = completeMatch[2].trim()
    const todos = loadTodos()
    const target = todos.find(t => !t.done && t.text.includes(keyword))
    if (target) {
      target.done = true
      saveTodos(todos)
      return { handled: true, message: `已完成：${target.text}` }
    }
    return { handled: true, message: `未找到未完成的待办：${keyword}` }
  }

  // 删除命令
  const deleteMatch = trimmed.match(/^(删除|去掉)\s*(.+)/)
  if (deleteMatch) {
    const keyword = deleteMatch[2].trim()
    const todos = loadTodos()
    const idx = todos.findIndex(t => t.text.includes(keyword))
    if (idx >= 0) {
      const removed = todos.splice(idx, 1)[0]
      saveTodos(todos)
      return { handled: true, message: `已删除：${removed.text}` }
    }
    return { handled: true, message: `未找到待办：${keyword}` }
  }

  // 添加命令（带前缀）
  const addMatch = trimmed.match(/^(添加|新增|待办)\s*(.+)/)
  if (addMatch) {
    const keyword = addMatch[2].trim()
    if (keyword) {
      const todos = loadTodos()
      todos.unshift(addTodo(keyword))
      saveTodos(todos)
      return { handled: true, message: `已添加：${keyword}` }
    }
  }

  // 不匹配任何命令，交给 AI 处理
  return { handled: false }
}
