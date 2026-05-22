## Why

你是一个初级前端开发者，希望用 React 构建一个 3D 桌面宠物项目。另一份 AI 企划书已经给出了完整的功能蓝图和四阶段路线图，整体方向可行，但部分技术选型和范围需要根据你的实际能力进行取舍，避免因目标过大而中途放弃。

## 原企划书可行性评估与取舍

### 可行的部分（保留）

- **Electron 桌面壳**：透明无边框窗口是成熟方案，文档丰富，适合初学者。保留。
- **React 状态管理**：用 React 管理桌宠的情绪、对话、UI 显隐，合理且必要。保留。
- **AI 情感交互**：调用 LLM API 返回情绪标签 + 文本，前端解析后驱动动画，逻辑清晰。保留。
- **四阶段渐进式开发**：先载体 → 再视觉 → 再 AI → 最后打磨，节奏合理。保留。
- **API Key 由用户自行输入**：安全且通用的做法。保留。

### 需要调整的部分

| 原方案 | 问题 | 调整后 |
|--------|------|--------|
| Spline 做 3D | Spline 是可视化 3D 工具，导出 React 组件后可控性有限，动画状态切换需要 hack，调试困难 | **React Three Fiber (R3F)** — React 原生的 3D 库，状态驱动动画，与 React 生命周期无缝集成。学习曲线稍陡但天花板高，且社区资源丰富 |
| Spline 免费模型 | Spline 模型格式封闭，难以精细控制骨骼动画 | **glTF/GLB 格式的免费模型**（Sketchfab、Mixamo），用 R3F 的 `useAnimations` 控制动画状态机 |
| 视线跟随（Phase 2） | 需要射线检测 + 骨骼旋转，对初学者偏难 | **降为 Phase 4 优化项**，优先保证核心动画状态切换 |
| Electron 点击穿透 | 实现不难但容易出 bug，影响基础体验 | **Phase 1 即实现基础版**（`setIgnoreMouseEvents` + CSS 辅助），而非放到最后 |

### 砍掉的部分（降低复杂度）

- **多状态动画的平滑混合（Blend）**：初版只做离散切换（idle ↔ happy ↔ thinking），不做过渡混合。后期可用 R3F 的 `AnimationMixer` 追加。
- **本地打包为 .exe/.dmg**：Phase 4 再考虑，前期用 `electron .` 开发调试即可。打包本身不是难点，但签名、自动更新等会消耗精力。
- **性能优化（闲置降帧等）**：属于锦上添花，初版不处理，后续有卡顿问题再优化。

## What Changes

与原企划书相比，本次提案的实际变更：

- 使用 **React + Vite + Electron** 作为项目骨架（替代 CRA，Vite 更快更现代）
- 使用 **React Three Fiber + @react-three/drei** 替代 Spline 做 3D 渲染
- 使用 **glTF/GLB 免费模型** 替代 Spline 模型
- 动画系统：基于 R3F 的 `useAnimations` 实现状态机（idle / happy / thinking / sad）
- AI 接口：预留 DeepSeek / OpenAI 兼容的调用层，用户自行配置 API Key 和 Base URL
- 开发节奏调整为 5 个阶段（详见 tasks.md）

## Capabilities

### New Capabilities

- `desktop-shell`: Electron 透明无边框窗口、拖拽、置顶、基础穿透
- `3d-pet-viewer`: React Three Fiber 渲染 3D 模型，管理动画状态机（idle/happy/thinking/sad）
- `ai-emotion-chat`: AI 对话框 UI、LLM API 调用、情绪标签解析、与动画状态联动
- `pet-eye-tracking`: 鼠标跟随视线（Phase 4 优化项）

### Modified Capabilities

（无，这是全新项目）

## Impact

- **新增依赖**：electron, react, react-dom, vite, @vitejs/plugin-react, three, @react-three/fiber, @react-three/drei
- **AI 依赖**：用户需自行提供 OpenAI-compatible API Key
- **模型资产**：需下载 1-2 个 glTF/GLB 格式的 3D 模型（含动画），放入 `public/models/`
- **目标平台**：Windows（主要），macOS/Linux 可后期适配
- **学习成本**：R3F 需要 Three.js 基础概念（场景、相机、网格、动画），但对初学者来说文档和示例充足
