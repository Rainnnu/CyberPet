## Why

用户希望通过自然语言聊天来管理待办事项，比如输入"买牛奶"自动添加待办，输入"完成买牛奶"自动勾选。比手动操作更便捷。

## What Changes

- 在聊天输入中识别待办命令（添加/完成/删除）
- 解析命令后调用待办存储函数
- 返回操作结果给用户

## Capabilities

### New Capabilities

- `chat-commands`: 通过聊天消息管理待办事项

### Modified Capabilities

- `ai-emotion-chat`: 聊天消息预处理，识别待办命令

## Impact

- 新增文件：src/renderer/src/services/todoCommands.ts
- 修改文件：src/renderer/src/hooks/useChat.ts（命令预处理）
