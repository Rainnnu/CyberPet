## Context

情绪系统当前完全依赖 AI 回复中的 emotion 字段。API 调用需要 1-3 秒，期间模型保持 idle 状态。

## Goals / Non-Goals

**Goals:**
- 用户输入包含情绪关键词时，立即切换动画

**Non-Goals:**
- 不改变 AI 回复中的 emotion 解析逻辑

## Decisions

**选择**: 在 useChat.sendMessage 中，发送 API 请求前扫描用户文本。匹配到关键词时立即调用 onEmotionChange。API 响应后再更新一次。

关键词映射：
- 开心/高兴/哈哈/太好了 → happy
- 思考/想想/让我看看 → thinking
- 难过/伤心/哭 → sad
- 其他 → 不触发，等 AI 判断

**理由**: 简单的关键词匹配，零延迟。AI 回复作为最终判断覆盖即时结果。
