## Context

桌宠应用使用 Electron + React + Three.js 构建。窗口设置为透明、无边框、始终置顶。存在两个问题：

1. 边界检测不准确：使用 `resizable: true` 让 `will-move` 事件工作，但 Windows 会给这类窗口添加不可见的缩放边框（约7-8像素），导致窗口无法移动到屏幕真正的边缘。

2. 桌面交互失效：`WebkitAppRegion: 'drag'` 会捕获所有鼠标事件，包括点击和右键，导致在桌面上无法触发对话和配置功能。

## Goals / Non-Goals

**Goals:**
- 修复边界检测，让窗口可以移动到屏幕真正的边缘
- 修复桌面交互，使点击和右键事件可以在桌面上正常工作
- 保持窗口的拖拽功能

**Non-Goals:**
- 不改变3D渲染逻辑
- 不改变宠物模型和动画

## Decisions

### 1. 边界补偿方案

**问题分析**：Windows 给 `resizable: true` 的窗口添加不可见的缩放边框（约7-8像素）。当使用 `will-move` 事件检测边界时，窗口实际位置比报告的位置更靠近屏幕边缘。

**解决方案**：
- 在边界计算中添加一个补偿值（约7-8像素）
- 使用 `screen.getPrimaryDisplay().bounds` 获取屏幕尺寸
- 在 `will-move` 事件中，允许窗口位置在 `-borderCompensation` 到 `screenSize + borderCompensation` 范围内

**备选方案**：
- 使用 `resizable: false`，但这样 `will-move` 事件不会触发
- 使用 `moved` 事件，但会导致"回弹"效果

**选择原因**：补偿方案最简单，只需修改边界计算即可。

### 2. 桌面事件处理方案

**问题分析**：`WebkitAppRegion: 'drag'` 会捕获所有鼠标事件，包括点击和右键。在浏览器页面内（dev模式下），事件可以正常工作，但在实际桌面上，事件被系统窗口管理器捕获。

**解决方案**：
- 移除 `WebkitAppRegion: 'drag'` 属性
- 使用 JavaScript 实现窗口拖拽功能
- 在 `mousedown` 事件中开始拖拽，在 `mousemove` 事件中移动窗口，在 `mouseup` 事件中结束拖拽
- 使用 Electron 的 IPC 通信来移动窗口

**备选方案**：
- 使用 `WebkitAppRegion: 'no-drag'` 属性（但这样会失去拖拽功能）
- 使用 `pointer-events: none` 属性（但这样会失去所有交互功能）

**选择原因**：JavaScript 拖拽方案最灵活，可以同时支持拖拽和点击/右键事件。

### 3. 拖拽实现细节

**问题分析**：需要在 JavaScript 中实现窗口拖拽功能，同时保持点击和右键事件的正常工作。

**解决方案**：
- 在 `mousedown` 事件中记录鼠标位置和窗口位置
- 在 `mousemove` 事件中计算鼠标移动的距离，并移动窗口
- 在 `mouseup` 事件中结束拖拽
- 使用 Electron 的 `ipcRenderer` 发送窗口位置更新
- 在主进程中监听窗口位置更新，并移动窗口

**备选方案**：
- 使用 `requestAnimationFrame` 来平滑拖拽（但会增加复杂性）
- 使用第三方库来实现拖拽（但会增加依赖）

**选择原因**：直接使用 Electron 的 IPC 通信最简单，且性能最好。

## Risks / Trade-offs

### 风险1：边界补偿值不准确
- **风险**：不同 Windows 版本的缩放边框可能不同
- **缓解**：使用保守的补偿值（8像素），并在不同 Windows 版本上测试

### 风险2：拖拽性能问题
- **风险**：频繁的 IPC 通信可能影响性能
- **缓解**：使用节流（throttle）控制 IPC 通信频率

### 风险3：事件冲突
- **风险**：拖拽事件可能与点击/右键事件冲突
- **缓解**：通过判断鼠标移动距离来区分拖拽和点击

## Migration Plan

1. 修改 `src/main/index.ts`：添加边界补偿逻辑
2. 修改 `src/renderer/src/App.tsx`：实现 JavaScript 拖拽功能
3. 修改 `src/preload/index.ts`：添加窗口位置更新的 IPC 通信
4. 测试边界检测和桌面交互功能

## Open Questions

- 不同 Windows 版本的缩放边框是否一致？
- 是否需要支持多显示器？
