## Why

当前角色按 fallback 链自动切换（Amy → Cat → Pet），用户无法主动选择角色。需要一个角色切换 UI，让用户可以在设置中选择喜欢的角色。

## What Changes

- 在 Settings 面板中添加角色选择下拉框
- 用 `selectedCharacter` 配置项替代自动 fallback 链
- 切换角色时立即渲染新角色，保留 fallback 机制（选中的角色加载失败时自动降级）

## Capabilities

### New Capabilities
- `character-switcher`: 角色切换 UI 和状态管理

### Modified Capabilities

## Impact

- `src/renderer/src/components/Settings.tsx` — 添加角色选择 UI
- `src/renderer/src/components/PetModel.tsx` — 从 fallback 链改为用户选择 + fallback
- `src/renderer/src/configs/characters.ts` — 暴露角色列表供 UI 使用
- `src/renderer/src/hooks/useChat.ts` 或 App.tsx — 持久化 selectedCharacter
