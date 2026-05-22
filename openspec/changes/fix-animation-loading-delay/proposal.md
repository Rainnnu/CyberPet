## Why

`ExternalCharacter` 组件在 emotion 变化时调用 `useGLTF(新URL)`，该 hook 使用 React Suspense。新动画 GLB（~30MB）加载期间，整个组件挂起，动画冻结，用户看到明显延迟。

## What Changes

- 用 `useLoader(GLTFLoader, url)` 替代 `useGLTF`，不触发 Suspense
- 加载期间保持旧动画播放
- 新动画加载完成后平滑过渡

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- `src/renderer/src/components/CharacterModel.tsx` — ExternalCharacter 动画加载逻辑
