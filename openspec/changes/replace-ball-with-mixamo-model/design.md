## Context

当前 PetModel.tsx 有两个组件：
- `FallbackPet`：球体占位模型（sphereGeometry）
- `LoadedModel`：加载 GLB 模型（pet.glb）

用户新增了 `public/models/Idle.fbx`（Mixamo 导出），希望用它替换球体。

Three.js 的 `useGLTF` 不支持 FBX 格式。需要用 `useLoader` + `FBXLoader` 加载。

## Goals / Non-Goals

**Goals:**
- 用 FBX 模型替换球体
- 播放 FBX 中的动画
- 保持现有的情绪颜色变化逻辑

**Non-Goals:**
- 不替换 GLB 模型加载逻辑（保留作为备选）
- 不修改情绪系统

## Decisions

### FBX 加载方案

使用 Three.js 的 `FBXLoader`：
```typescript
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const fbx = useLoader(FBXLoader, '/models/Idle.fbx')
```

### 动画播放

FBX 文件自带动画。用 `useAnimations` 播放：
```typescript
const { actions } = useAnimations(fbx.animations, group)
```

### 模型缩放和位置

Mixamo 模型通常是人形，缩放和位置需要调整。默认尝试 `scale={0.01}`（Mixamo 模型通常很大）。

## Risks / Trade-offs

- FBX 文件可能较大，首次加载有延迟
- Mixamo 模型的材质可能需要调整（透明度、颜色）
- 动画名称可能需要确认
