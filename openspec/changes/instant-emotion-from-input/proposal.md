## Why

当前情绪标签来自 AI 回复中的 JSON 字段，需要等 API 响应（1-3 秒）才能切换动画。用户说"开心"时，体验上有明显延迟。

优化：从用户输入文本中即时检测情绪关键词，立即切换动画。AI 回复后如果有不同的情绪标签，再更新一次。

## What Changes

- 在 sendMessage 中，发送 API 请求前先扫描用户文本中的情绪关键词
- 匹配到关键词时立即调用 `onEmotionChange`
- API 响应后仍然用 AI 返回的 emotion 更新（AI 的判断更准确）

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- `src/renderer/src/hooks/useChat.ts` — sendMessage 中添加即时情绪检测
