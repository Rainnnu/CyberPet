## 1. 角色配置

- [x] 1.1 在 characters.ts 中导出角色名称列表（供 Settings UI 使用）
- [x] 1.2 添加 selectedCharacter 的 localStorage 读写函数

## 2. 状态管理

- [x] 2.1 在 App.tsx 中管理 selectedCharacter 状态，传递给 PetModel 和 Settings
- [x] 2.2 Settings 的 onSave 中包含 selectedCharacter

## 3. PetModel 逻辑

- [x] 3.1 PetModel 接收 selectedCharacter prop，优先渲染选中角色
- [x] 3.2 选中角色失败时 fallback 到 CHARACTER_CHAIN 中的其他角色

## 4. Settings UI

- [x] 4.1 在 Settings 面板中添加角色选择下拉框
- [x] 4.2 显示所有可用角色名称
