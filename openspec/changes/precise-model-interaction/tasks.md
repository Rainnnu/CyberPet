## 1. Electron 穿透 API

- [x] 1.1 在 main/index.ts 中添加 `set-ignore-mouse-events` IPC handler
- [x] 1.2 在 preload/index.ts 中暴露 `setIgnoreMouseEvents` 方法
- [x] 1.3 在 electron.d.ts 中添加类型声明

## 2. 移除 pet-overlay，改用 R3F 精确点击

- [x] 2.1 在 CharacterModel 中添加 onPointerOver/Out（控制穿透状态）和 onClick（触发交互）
- [x] 2.2 在 PetScene 中传递回调给 PetModel
- [x] 2.3 在 App.tsx 中移除 pet-overlay div，改用 PetScene 回调处理点击和拖拽

## 3. 拖拽适配

- [x] 3.1 将拖拽逻辑从 pet-overlay mousedown 改为 mesh onPointerDown
