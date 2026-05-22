## Why

两个问题：(1) 对话框用 `bottom: 15%` 定位，消息增多时向上生长挡住模型，需要改为顶部固定、向下生长；(2) 视线跟随未生效，可能是 cat 模型的骨骼名称不在默认候选列表中，需要增强骨骼查找逻辑。

## What Changes

- 对话框改为 `top` 定位，保持顶部距模型距离不变，内容向下扩展
- 增强 `useEyeTracking` 的骨骼查找：遍历所有 Bone 类型节点，不再硬编码名称
- 添加调试日志帮助确认骨骼查找结果

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- `src/renderer/src/App.tsx` — 对话框定位方式
- `src/renderer/src/components/CharacterModel.tsx` — useEyeTracking 骨骼查找逻辑
