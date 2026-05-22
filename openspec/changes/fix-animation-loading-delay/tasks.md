## 1. 修复动画加载延迟

- [x] 1.1 ExternalCharacter 改用手动 GLTFLoader 加载动画，不使用 useGLTF（避免 Suspense 冻结）
- [x] 1.2 加载期间保持旧动画播放（animClips state 保持旧值）
- [x] 1.3 新动画加载完成后平滑过渡到新动画
