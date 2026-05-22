## Context

当前桌宠点击后弹出对话框（ChatDialog），支持 AI 聊天。用户希望在同一界面中增加待办事项功能。

## Goals / Non-Goals

**Goals:**
- 快速添加待办事项
- 勾选标记完成
- 数据持久化（刷新后保留）
- 与对话框共存

**Non-Goals:**
- 不做复杂的分类/标签
- 不做同步/云存储
- 不做提醒功能

## Decisions

### 数据结构

```typescript
interface TodoItem {
  id: string
  text: string
  done: boolean
  createdAt: number
}
```

### 存储方案

使用 localStorage，key 为 `cyberpet-todos`。简单可靠，无需后端。

### UI 布局

在 ChatDialog 上方添加待办区域：
- 输入框 + 添加按钮
- 待办列表（可勾选、可删除）

## Risks / Trade-offs

- localStorage 有容量限制（~5MB），但对于待办足够
- 不支持多设备同步
