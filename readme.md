# CyberPet-3D

3D 智能桌面宠物 — Electron + React + Three.js

## 已实现功能

- **桌面悬浮窗**：透明、无边框、始终置顶，JavaScript 实现拖拽
- **3D 角色**：Amy 角色模型，4 种情绪动画（idle/happy/thinking/sad），crossFade 过渡
- **视线跟随**：头部骨骼跟随鼠标旋转，30 度限制，远离自动回正
- **AI 对话**：OpenAI-compatible API，通过 IPC 代理绕过 CORS，JSON 情绪解析
- **聊天持久化**：按 API 配置分组存储，200 条上限
- **待办列表**：添加/完成/删除，支持聊天命令（”添加待办 X”、”完成 X”、”删除 X”）
- **空闲提醒**：90-120 秒无交互时随机提醒未完成待办
- **设置面板**：API Key、Base URL、Model、宠物尺寸
- **系统托盘**：Show/Hide/Quit，双击切换可见性

## 技术栈

| 模块 | 方案 |
|------|------|
| 桌面框架 | Electron |
| 前端 | React + TypeScript |
| 3D 渲染 | Three.js + React Three Fiber + Drei |
| AI 接口 | OpenAI-compatible API (DeepSeek / GPT 等) |
| 打包 | electron-builder |

## 运行

```bash
npm install
npm run dev      # 开发
npm run build    # 构建
npm run dist     # 打包 .exe
```

## 使用

1. 启动后右键桌宠打开设置，输入 API Key
2. 左键点击打开聊天框
3. 聊天框有 Chat 和 Todo 两个标签页
4. 在聊天中可以用中文命令管理待办：添加待办、完成、删除
