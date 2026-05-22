## 1. FBX 模型加载

- [x] 1.1 在 PetModel.tsx 中添加 FBXLoader 导入
- [x] 1.2 用 useLoader(FBXLoader, '/models/Idle.fbx') 加载模型
- [x] 1.3 调整模型缩放和位置（Mixamo 模型通常需要 scale=0.01）

## 2. 动画播放

- [x] 2.1 用 useAnimations 获取 FBX 中的动画
- [x] 2.2 在 useEffect 中播放 idle 动画（循环）

## 3. 情绪适配

- [x] 3.1 保留情绪颜色变化逻辑（material color lerp）
- [x] 3.2 测试不同情绪下模型的颜色变化

## 4. 回退处理

- [x] 4.1 保留 FallbackPet 球体作为加载失败的回退
- [x] 4.2 用 ErrorBoundary 包裹 FBX 加载
