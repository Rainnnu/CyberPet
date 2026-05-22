## Why

桌宠应用存在两个关键问题：

1. **边界检测不准确**：窗口无法移动到屏幕真正的边缘，还有半个球的距离就停下了。原因是使用 `resizable: true` 让 `will-move` 事件工作，但 Windows 会给这类窗口添加不可见的缩放边框（约7-8像素），导致边界计算偏移。

2. **桌面交互失效**：在浏览器页面内（dev模式下），左右键可以正常对话和配置，但在浏览器页面外的实际桌宠上，只有系统按钮（最大化、最小化等），没有对话和配置功能。原因是 `WebkitAppRegion: 'drag'` 会捕获所有鼠标事件。

## What Changes

- 修复边界检测：补偿 Windows 不可见缩放边框，让窗口可以移动到屏幕真正的边缘
- 修复桌面交互：使点击和右键事件可以在桌面上正常工作，而不是只有系统按钮

## Capabilities

### New Capabilities

- `boundary-compensation`: 补偿 Windows 不可见缩放边框，实现精确的边界检测
- `desktop-mouse-events`: 在桌面上正常处理鼠标点击和右键事件

### Modified Capabilities

- `window-boundary`: 修改边界检测逻辑，补偿缩放边框
- `desktop-shell`: 修改事件处理，使桌面上的交互正常工作

## Impact

- 影响文件：src/main/index.ts（边界补偿）
- 影响文件：src/renderer/src/App.tsx（事件处理）
- 影响用户体验：桌宠可以移动到屏幕边缘，桌面上的交互正常工作
