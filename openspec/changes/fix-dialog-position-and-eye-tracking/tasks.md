## 1. 对话框定位

- [x] 1.1 将 ChatDialog 容器的 `bottom: 15%` 改为 `top: 55%`，使对话框向下生长

## 2. 视线跟随修复

- [x] 2.1 增强 useEyeTracking 的骨骼查找：优先匹配已知名称，fallback 到第一个有子节点的 Bone
- [x] 2.2 添加 console.log 输出骨骼查找结果，方便调试
