## Context

pet-overlay 是一个覆盖模型区域的 div，用于捕获点击和拖拽。但它捕获了整个区域的点击，包括空白处。Electron 的 `setIgnoreMouseEvents(true, { forward: true })` 可以让窗口穿透鼠标事件，同时仍能收到 mousemove 用于检测鼠标是否在模型上。

## Goals / Non-Goals

**Goals:**
- 只有点击模型 mesh 才触发交互
- 透明区域穿透桌面交互
- 拖拽仍需通过 mousedown/mousemove 实现

**Non-Goals:**
- 不改变对话框的交互方式

## Decisions

### 1. 点击检测

**选择**: 在 CharacterModel 的 mesh 上添加 R3F `onClick`、`onPointerOver`、`onPointerOut`。移除 pet-overlay div。

**理由**: R3F 内置 raycasting，精确到 mesh 三角面。

### 2. 穿透机制

**选择**: 默认 `setIgnoreMouseEvents(true, { forward: true })`。鼠标进入模型时调用 `setIgnoreMouseEvents(false)`，离开时恢复 `true`。

**理由**: `forward: true` 让 Electron 仍转发 mousemove 到渲染器，R3F 可以检测 hover。

### 3. 拖拽

**选择**: 在 mesh 的 onPointerDown 中开始拖拽，window mousemove/mouseup 中处理拖拽和结束。

**理由**: 保持现有拖拽逻辑，只是触发点从 overlay div 改为 mesh。
