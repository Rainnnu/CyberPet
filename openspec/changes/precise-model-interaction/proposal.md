## Why

当前 pet-overlay 是一个大圆形区域（70% 宽 × 70% 高），点击空白处也会触发。用户希望：
1. 只有点击到模型本身才触发交互
2. 模型周围的透明区域应该穿透，不阻挡桌面其他操作

## What Changes

- 移除 pet-overlay div，改用 R3F 的 mesh onClick 做精确点击检测
- 添加 `setIgnoreMouseEvents` IPC，透明区域自动穿透
- 鼠标悬停在模型上时取消穿透，离开时恢复穿透

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- `src/main/index.ts` — 添加 set-ignore-mouse-events IPC handler
- `src/preload/index.ts` — 暴露 setIgnoreMouseEvents API
- `src/renderer/src/electron.d.ts` — 类型声明
- `src/renderer/src/App.tsx` — 移除 pet-overlay，改用 R3F 回调
- `src/renderer/src/components/PetModel.tsx` — 添加 onClick 和 onPointerOver/Out
- `src/renderer/src/components/PetScene.tsx` — 传递回调
