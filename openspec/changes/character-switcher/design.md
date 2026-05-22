## Context

`CHARACTER_CHAIN` 是一个固定数组，PetModel 按顺序尝试加载。用户无法选择角色。

## Goals / Non-Goals

**Goals:**
- Settings 中显示角色列表（名称 + 缩略描述）
- 用户选择后立即切换角色
- 选择持久化到 localStorage
- 选中角色加载失败时自动降级到下一个

**Non-Goals:**
- 不实现角色预览/缩略图
- 不支持运行时动态加载新角色文件

## Decisions

### 1. 状态管理

**选择**: `selectedCharacter` 存储在 localStorage（与 settings 一起），App.tsx 传给 PetModel。

**理由**: 与现有 settings 持久化模式一致。

### 2. PetModel 逻辑

**选择**: `selectedCharacter` 默认为第一个角色（Amy）。PetModel 先尝试加载选中角色，失败后 fallback 到 `CHARACTER_CHAIN` 中剩余的角色。

**理由**: 保留 fallback 机制确保始终有角色显示。

### 3. Settings UI

**选择**: 在 Settings 面板中添加下拉选择框，显示角色名称。

**理由**: 与其他设置项风格一致。
