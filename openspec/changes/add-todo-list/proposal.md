## Why

用户希望桌宠能记录日常待办事项，方便随时查看和管理。点击桌宠弹出对话框时，除了聊天功能外，还能快速添加和勾选待办。

## What Changes

- 新增待办事项数据模型（id, text, done, createdAt）
- 新增待办列表 UI 组件（TodoList）
- 在对话框中集成待办功能
- 待办数据持久化（localStorage）

## Capabilities

### New Capabilities

- `todo-list`: 待办事项的增删改查和勾选完成

### Modified Capabilities

- `ai-emotion-chat`: 对话框中集成待办列表

## Impact

- 新增文件：src/renderer/src/components/TodoList.tsx
- 修改文件：src/renderer/src/components/ChatDialog.tsx（集成待办）
- 数据存储：localStorage
