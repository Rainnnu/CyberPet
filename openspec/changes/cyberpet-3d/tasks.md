## 1. 项目初始化与 Electron 骨架

- [x] 1.1 使用 electron-vite 初始化项目（React + TypeScript 模板）
- [x] 1.2 配置 Electron 主进程：transparent: true, frame: false, alwaysOnTop: true
- [x] 1.3 设置窗口默认尺寸和位置（屏幕右下角，400x400）
- [x] 1.4 验证透明无边框窗口能正常显示（能看到桌面背景）

## 2. 桌面悬浮窗基础功能

- [x] 2.1 实现窗口拖拽（CSS -webkit-app-region: drag）
- [x] 2.2 实现鼠标穿透（setIgnoreMouseEvents + forward: true）
- [x] 2.3 在可交互区域（宠物模型、对话框）临时关闭穿透
- [x] 2.4 保存/恢复窗口位置（electron-store 或 localStorage）

## 3. R3F 基础与 3D 模型加载

- [x] 3.1 安装 three, @react-three/fiber, @react-three/drei 依赖
- [x] 3.2 创建 PetScene 组件：Canvas + 灯光 + 相机配置
- [x] 3.3 下载一个带动画的 glTF/GLB 宠物模型放入 public/models/
- [x] 3.4 创建 PetModel 组件：useGLTF 加载模型并渲染
- [x] 3.5 验证模型在透明窗口中正确显示（无黑边/白边）

## 4. 动画状态机

- [x] 4.1 使用 useAnimations hook 加载模型中的所有动画
- [x] 4.2 实现 useEmotion hook：管理 emotion state（idle/happy/thinking/sad）
- [x] 4.3 编写动画切换逻辑：emotion 变化时 crossFadeTo 目标动画
- [x] 4.4 实现 idle 动画自动循环播放
- [x] 4.5 添加 5 秒无交互自动回到 idle 的超时逻辑

## 5. 对话框 UI

- [x] 5.1 创建 ChatDialog 组件：半透明对话框 + 消息列表 + 输入框
- [x] 5.2 实现点击宠物模型打开/关闭对话框
- [x] 5.3 对话框内消息列表自动滚动到底部
- [x] 5.4 对话框打开时关闭鼠标穿透，关闭时恢复

## 6. AI 对话功能

- [x] 6.1 实现 chat.ts 服务：封装 OpenAI-compatible fetch 请求
- [x] 6.2 编写 System Prompt（要求返回 JSON: {emotion, text}）
- [x] 6.3 实现 useChat hook：管理消息列表、发送请求、处理响应
- [x] 6.4 对接 useEmotion：解析 AI 返回的 emotion 标签并更新状态
- [x] 6.5 处理 API 错误和 JSON 解析失败（fallback to idle）

## 7. 设置面板

- [x] 7.1 创建 Settings 组件：API Key 和 Base URL 输入框
- [x] 7.2 实现右键菜单或快捷键打开设置面板
- [x] 7.3 持久化设置到 localStorage
- [x] 7.4 未配置 API Key 时提示用户先配置

## 8. 视线跟随（Phase 4 优化项）

- [ ] 8.1 获取鼠标在屏幕上的全局坐标
- [ ] 8.2 将鼠标坐标转换为 3D 空间中的目标方向
- [ ] 8.3 对宠物头部骨骼应用旋转（lookAt），限制最大角度 30 度
- [ ] 8.4 鼠标远离窗口时头部回正到中立位置

## 9. 打磨与收尾

- [x] 9.1 调整透明窗口抗锯齿设置（antialias, premultipliedAlpha）
- [ ] 9.2 添加应用托盘图标和最小化到托盘功能
- [ ] 9.3 测试情绪动画切换的流畅性，必要时调整 crossFade 时长
- [ ] 9.4 使用 electron-builder 打包为 .exe 安装包
