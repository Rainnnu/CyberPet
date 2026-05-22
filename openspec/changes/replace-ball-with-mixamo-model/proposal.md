## Why

当前桌宠使用 Three.js 内置的球体（sphereGeometry）作为占位模型。用户新增了一个 Mixamo 的 FBX 模型文件（`public/models/Idle.fbx`），希望用它替换球体，让桌宠有更真实的外观和动画。

## What Changes

- 用 FBX 模型替换当前的球体占位模型
- 加载并播放 FBX 中的动画（idle 动画）
- 处理 FBX 模型的材质、缩放、位置适配

## Capabilities

### New Capabilities

- `mixamo-model`: 加载和渲染 Mixamo FBX 模型，替换球体占位模型

### Modified Capabilities

- `3d-pet-viewer`: 修改 PetModel 组件，使用 FBX 模型而非球体

## Impact

- 影响文件：src/renderer/src/components/PetModel.tsx
- 新增依赖：可能需要 `three-stdlib` 或手动 FBX loader
- 模型文件：public/models/Idle.fbx
