# CyberPet

3D 桌面宠物，基于 Electron + React + Three.js，支持透明置顶窗口、角色动画、AI 聊天和待办提醒。

## 如何使用

```bash
npm install
npm run dev      # 开发运行
npm run build    # 构建产物
npm run start    # 预览构建结果
npm run dist     # 打包 Windows 安装包
```

启动后：

- 左键点击宠物：打开 / 关闭聊天窗口。
- 拖动宠物：移动桌面窗口。
- 右键点击宠物：打开设置。
- 设置中可配置 `API Key`、`Base URL`、`Model`、角色和窗口大小。
- 系统托盘支持 `Show`、`Hide`、`Quit`。

聊天窗口包含 `Chat` 和 `Todo` 两个标签页。Todo 也可以通过聊天命令操作：

- `添加 买牛奶` / `新增 买牛奶` / `待办 买牛奶`
- `完成 买牛奶` / `搞定 买牛奶` / `做了 买牛奶`
- `删除 买牛奶` / `去掉 买牛奶`

默认 API 配置面向 OpenAI-compatible 接口：

- 默认 `Base URL`: `https://api.deepseek.com`
- 默认 `Model`: `deepseek-chat`
- 实际请求路径：`/v1/chat/completions`

## 实现细节与架构

### 技术栈

- Electron：桌面窗口、托盘、IPC、网络代理。
- React：界面状态和交互。
- Three.js / React Three Fiber：3D 角色渲染和动画。
- localStorage：聊天记录、待办、设置、角色选择持久化。

### 核心设计

- 主窗口是透明、无边框、置顶窗口。
- 窗口拖拽由渲染进程监听鼠标事件，再通过 IPC 调用主进程移动窗口。
- IPC 使用内容区域坐标，主进程负责屏幕边界 clamp，再转换成实际窗口位置。
- 透明区域默认点击穿透，鼠标进入宠物区域后恢复交互。
- AI 回复要求返回 `{ emotion, text }`，其中 `emotion` 驱动宠物动画状态。
- 待办命令会先在本地解析，未命中命令时才发送给 AI。
- 角色按配置链加载，模型失败时自动尝试下一个，全部失败则显示球形 fallback。

### 目录结构

```text
src/
  main/index.ts              # Electron 主进程：窗口、托盘、IPC、API 代理
  preload/index.ts           # contextBridge 暴露 electronAPI
  renderer/src/App.tsx       # 主界面：拖拽、点击穿透、聊天/设置挂载
  renderer/src/components/   # 3D 场景、角色、聊天框、设置、Todo
  renderer/src/hooks/        # useChat、useEmotion
  renderer/src/services/     # AI 请求、聊天存储、Todo 存储与命令解析
  renderer/src/configs/      # 角色模型与动画配置
```
