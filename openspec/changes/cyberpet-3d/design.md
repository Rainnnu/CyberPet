## Context

你是一个初级前端开发者，熟悉 React 基础（组件、State、Effect），但没有 Three.js 和 Electron 经验。项目目标是构建一个运行在桌面的 3D 伴宠，能通过 AI 对话产生情绪变化。

当前状态：空项目，需从零搭建。

约束：
- 个人项目，无团队协作，无 CI/CD 需求
- Windows 开发环境
- 开发周期预期 3-4 周（边学边做）
- 3D 模型使用免费资源，不涉及自建模型

## Goals / Non-Goals

**Goals:**
- 搭建 React + Vite + Electron 的桌面应用骨架
- 用 React Three Fiber 渲染一个带动画的 3D 宠物模型
- 实现 AI 对话功能，情绪标签驱动动画状态切换
- 桌面悬浮窗：透明、无边框、可拖拽

**Non-Goals:**
- 不做跨平台适配（仅 Windows）
- 不做模型自建/骨骼编辑
- 不做动画混合（Blend）——初版只做离散状态切换
- 不做自动更新、应用签名、应用商店分发
- 不做多宠物切换、宠物养成系统、技能树等游戏化功能
- 不做本地模型推理（Ollama 等）

## Decisions

### D1: 项目脚手架 — Vite + electron-vite

**选择**: 使用 `electron-vite`（基于 Vite 的 Electron 开发工具链）

**理由**: electron-vite 同时管理主进程和渲染进程的构建，开箱即用支持 HMR，比手动配置 electron + vite 简单得多。比 Create React App 更快、更现代。

**替代方案**:
- 手动配置 electron + vite：灵活但繁琐，初学者容易踩坑
- electron-forge：官方推荐但配置复杂，学习成本高

### D2: 3D 方案 — React Three Fiber + @react-three/drei

**选择**: React Three Fiber (R3F) + drei 工具库

**理由**: R3F 是 Three.js 的 React 封装，用声明式 JSX 写 3D 场景，与 React 状态管理天然融合。drei 提供现成的组件（OrbitControls、useAnimations、Environment 等），大幅降低开发门槛。

**替代方案**:
- Spline：可视化编辑器，导出 React 组件。优点是无需写 3D 代码，缺点是动画状态切换受限、调试困难、模型格式封闭
- Babylon.js：功能强大但体积大、生态不如 R3F 在 React 中的集成度
- 纯 Three.js：灵活但命令式代码多，与 React 状态管理割裂

### D3: 3D 模型格式 — glTF/GLB

**选择**: glTF 2.0 (.glb) 格式

**理由**: glTF 是 Web 3D 的事实标准，R3F 原生支持（通过 `useGLTF`），文件体积小，支持骨骼动画。Sketchfab 和 Mixamo 提供大量免费可下载的 glTF 模型。

**模型来源建议**:
- Sketchfab（sketchfab.com）：搜索 "low poly pet" 或 "voxel animal"，筛选 CC 许可
- Mixamo（mixamo.com）：可上传自定义模型并自动绑定骨骼动画

### D4: 动画状态机 — 基于 React State 的离散切换

**选择**: 用一个 `emotion` state（idle / happy / thinking / sad）驱动当前播放的动画

**实现思路**:
```
emotion state → AnimationAction.play() / crossFadeTo()
```
R3F 的 `useAnimations` hook 返回动画 actions，通过 state 变化触发 `action.play()` 和 `action.crossFadeTo()` 实现切换。

**替代方案**:
- AnimationMixer 的 addEventListener + 事件驱动：更灵活但代码复杂度高
- Zustand / Jotai 全局状态：如果后续功能膨胀再引入，初版用 React useState 足够

### D5: AI 接口层 — OpenAI-compatible fetch 封装

**选择**: 直接用 `fetch` 调用 OpenAI-compatible API（DeepSeek / OpenAI / 其他兼容接口）

**理由**: 不引入额外 SDK 依赖。用一个简单的 `chat.ts` 模块封装请求，用户在设置面板配置 API Key 和 Base URL。

**System Prompt 设计要点**:
- 要求 AI 返回 JSON 格式：`{ "emotion": "happy|thinking|sad|idle", "text": "回复内容" }`
- 用 few-shot 示例确保输出稳定
- 前端做 JSON 解析兜底，解析失败时默认 idle 情绪

### D6: 桌面穿透方案

**选择**: Electron `setIgnoreMouseEvents(true, { forward: true })` + CSS 辅助

**实现思路**:
- 默认开启鼠标穿透
- 桌宠模型区域和对话框区域用 CSS `-webkit-app-region: no-drag` 标记为可交互
- 鼠标移入可交互区域时临时关闭穿透，移出时恢复

### D7: 项目目录结构

```
src/
├── main/                 # Electron 主进程
│   └── index.ts
├── renderer/             # React 渲染进程
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── PetScene.tsx      # R3F Canvas + 3D 场景
│   │   ├── PetModel.tsx      # 3D 模型加载 + 动画控制
│   │   ├── ChatDialog.tsx    # 对话框 UI
│   │   └── Settings.tsx      # API Key / Base URL 配置
│   ├── hooks/
│   │   ├── useEmotion.ts     # 情绪状态管理
│   │   └── useChat.ts        # AI 对话逻辑
│   ├── services/
│   │   └── chat.ts           # LLM API 调用封装
│   └── types.ts
├── shared/
│   └── constants.ts          # 情绪枚举、默认配置
public/
└── models/                   # glTF 模型文件
```

## Risks / Trade-offs

**[R1] R3F 学习曲线** → 你没写过 Three.js。缓解：drei 提供大量即用组件，官方示例丰富。从一个最简单的旋转立方体开始，逐步替换为宠物模型。前 2 天专门做 R3F 入门练习。

**[R2] 免费模型动画质量参差不齐** → 模型可能只有 T-pose 没有动画。缓解：优先从 Mixamo 下载（自带标准动画），或在 Sketchfab 筛选 "animated" 标签。

**[R3] Electron + R3F 内存占用** → Electron 本身 ~100MB + Three.js 渲染。缓解：初版不处理，后续可加闲置降帧、WebGL context lost 恢复等优化。

**[R4] 透明窗口渲染瑕疵** → 抗锯齿和 alpha 通道在某些显卡上表现不一致。缓解：在多台机器测试，必要时启用 `antialias: true` 和 `premultipliedAlpha: false`。

**[R5] AI API 返回格式不稳定** → DeepSeek/OpenAI 的 JSON 模式偶尔会返回非标内容。缓解：前端用 try-catch 解析，加正则提取 JSON，失败时给默认情绪。
