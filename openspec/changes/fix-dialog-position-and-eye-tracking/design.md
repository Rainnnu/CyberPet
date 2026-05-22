## Context

对话框用 `bottom: 15%` 定位，消息增多时向上生长挡住宠物。cat 模型的骨骼名可能不在默认候选列表（Head/head/Neck/neck/mixamorigHead/mixamorigNeck）中，导致眼部追踪找不到骨骼。

## Goals / Non-Goals

**Goals:**
- 对话框顶部固定，向下生长
- 眼部追踪能正确找到 cat 模型的头部骨骼

**Non-Goals:**
- 不改变对话框宽度计算逻辑

## Decisions

### 1. 对话框定位

**选择**: 将 `bottom: 15%` 改为 `top` 定位。计算方式：`top = 100% - 15% - dialogHeight`，或者直接用一个固定的 `top` 百分比。

**理由**: 用 `top` 定位后，对话框向下生长，顶部位置不变。考虑到窗口是正方形且大小可变，用百分比 `top: 55%` 作为起始位置，对话框 maxHeight 280px，向下生长不会超出窗口（窗口最小 200px，最大 800px）。

### 2. 骨骼查找增强

**选择**: 遍历所有 `type === 'Bone'` 的节点，优先匹配已知名称，如果没有匹配到，取第一个 Bone 作为 fallback。

**理由**: 不同模型工具（Mixamo、Character Creator、Blender）导出的骨骼名各不相同。硬编码名称不可靠。遍历所有 Bone 并选第一个有子节点的（通常是脊柱/颈部链上的骨骼）更通用。
