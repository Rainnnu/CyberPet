# CyberPet-3D

3D 桌面宠物 — Electron + React + Three.js

## 关键规则

- 窗口拖拽用 JavaScript 实现（mousedown/mousemove/mouseup + IPC），不用 `-webkit-app-region: drag`
- IPC 通信统一用**内容位置**（`getContentBounds()`），不是帧位置（`getPosition()`）
- 主进程 clamp 后转帧位置：`setPosition(clampedX - offsetX, clampedY - offsetY)`
- 所有 IPC 统一用 `invoke`/`handle`，渲染器需要拿到实际位置
- `resizable: true` + `setMinimumSize/setMaximumSize` 锁死尺寸，`thickFrame: false` 减少隐形边框
- Amy 模型动画使用 `crossFadeTo`（0.3 秒过渡），不直接 `stop().play()`
- 眼球跟踪叠加在情绪动画之上，不替换动画状态

## 项目结构

```
src/
  main/index.ts        — Electron 主进程，窗口创建、IPC handler、系统托盘
  preload/index.ts     — contextBridge 暴露 API
  renderer/src/
    App.tsx            — 主组件，拖拽逻辑、对话框吸附、空闲提醒
    components/
      PetScene.tsx     — Three.js Canvas 场景
      PetModel.tsx     — Amy 角色模型 + 情绪动画 + 视线跟随
      ChatDialog.tsx   — 对话框 UI（Chat + Todo 标签页）
      Settings.tsx     — 设置面板
      TodoList.tsx     — 待办列表组件
    hooks/
      useEmotion.ts    — 情绪状态管理（idle/happy/thinking/sad）
      useChat.ts       — AI 聊天逻辑 + todo 命令拦截 + 聊天持久化
    services/
      chat.ts          — LLM API 调用（通过 IPC 代理）
      chatStorage.ts   — 聊天记录 localStorage 持久化
      todoStorage.ts   — 待办列表 localStorage CRUD
      todoCommands.ts  — 聊天中的待办命令解析（添加/完成/删除）
```

## 运行

```bash
npm run dev      # 开发
npm run build    # 构建
npm run start    # 预览
```

## 深入文档

- [Electron 窗口拖拽经验](.claude/skills/electron-window-drag/SKILL.md)
- [项目企划书](readme.md)
