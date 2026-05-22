# Electron Frameless Window Drag & Boundary

Electron 无边框透明窗口的拖拽和边界限制经验总结。

## 核心问题

### 1. WebkitAppRegion: 'drag' 会吞掉所有鼠标事件

```css
/* 这样写会导致 click、contextmenu 都不触发 */
-webkit-app-region: drag;
```

**解决方案**：不用 `WebkitAppRegion`，用 JavaScript 实现拖拽：
- `mousedown` 记录起始位置
- `mousemove` 计算偏移，通过 IPC 移动窗口
- `mouseup` 结束拖拽
- 用 `hasMoved` ref 区分拖拽和点击（移动超过 3px 才算拖拽）

### 2. Windows 隐形缩放边框

`resizable: true` 的窗口在 Windows 上有 ~8px 不可见边框，导致：
- `getPosition()` 返回帧位置，不是内容位置
- `getBounds()` 比 `getContentBounds()` 大
- 边界计算偏移，球到不了屏幕边缘

**解决方案**：
```typescript
const content = mainWindow.getContentBounds()
const frame = mainWindow.getBounds()
const offsetX = content.x - frame.x  // 隐形边框宽度
const offsetY = content.y - frame.y
```

用 `getContentBounds()` 做所有位置计算。

### 3. will-move 事件的坑

- `resizable: false` 时 `will-move` **不触发**
- `will-move` 内调用 `setBounds()` 会**递归触发**，导致闪动
- `event.preventDefault()` 可以阻止移动，但边界计算必须精确

**推荐方案**：不用 `will-move`，在 IPC handler 里 clamp：
```typescript
ipcMain.handle('set-window-position', (_event, contentX, contentY) => {
  // 用 getContentBounds() 获取真实内容尺寸
  // clamp 内容位置
  // 转成帧位置：setPosition(clampedX - offsetX, clampedY - offsetY)
  // 返回实际内容位置给渲染器
})
```

### 4. 帧位置 vs 内容位置

渲染器的 CSS 是相对于内容区域的，但 `setPosition()` 设的是帧位置。

```
帧位置 = 内容位置 - 隐形边框偏移
内容位置 = 帧位置 + 隐形边框偏移
```

**必须统一参考系**：渲染器和主进程都用内容位置通信。

### 5. 对话框吸附（Sticky）逻辑

当元素比球宽时，元素先到边贴住，球继续移动：

```typescript
// defaultLeft = 元素默认位置（居中于球）
// minLeft = 屏幕左边界 - winX
// maxLeft = 屏幕右边界 - 元素宽度 - winX
// clamp(defaultLeft, minLeft, maxLeft)
```

元素到边后 `clamp` 生效，位置固定；球回到元素中心时 `clamp` 失效，元素重新跟随。

## 推荐配置

```typescript
new BrowserWindow({
  transparent: true,
  frame: false,
  thickFrame: false,      // 减少 Windows 隐形边框
  resizable: true,         // 让 will-move 可用（如果需要）
  // 用 min/max 锁死尺寸防止实际缩放
})

mainWindow.setMinimumSize(size, size)
mainWindow.setMaximumSize(size, size)
```

## IPC 设计

```
渲染器 --[内容位置]--> 主进程 --[clamp + 转帧位置]--> setPosition
主进程 --[实际内容位置+尺寸]--> 渲染器 --[更新UI位置]
```

用 `invoke`/`handle`（不是 `send`/`on`），确保渲染器拿到实际位置。

## 已知限制

- `resizable: true` + `thickFrame: false` 仍可能有 1-2px 偏移
- 多显示器场景未处理
- DPI 缩放可能导致 getContentBounds 和 getSize 不一致
