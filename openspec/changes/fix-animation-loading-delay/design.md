## Context

每个情绪动画是独立的 GLB 文件（~30MB）。`useGLTF` 内部使用 `useLoader` + Suspense，切换 URL 时组件挂起直到加载完成。

## Goals / Non-Goals

**Goals:**
- 动画切换时保持旧动画播放，不冻结
- 新动画加载完成后平滑过渡

**Non-Goals:**
- 不改变动画文件格式或压缩

## Decisions

**选择**: 用 `useLoader(GLTFLoader, url)` 加载动画，捕获 pending 状态。加载期间用 `currentActionRef` 保持旧动画播放。加载完成后切换。

```ts
const { animations } = useLoader(GLTFLoader, url);
// useLoader 不会 suspend（R3F 扩展），返回最新结果
```

实际上 R3F 的 `useLoader` 在资源未就绪时仍会 suspend。所以改用 `loader.load` 手动加载：
```ts
const [animClips, setAnimClips] = useState<THREE.AnimationClip[]>([]);
useEffect(() => {
  let cancelled = false;
  new GLTFLoader().load(url, (gltf) => {
    if (!cancelled) setAnimClips(gltf.animations);
  });
  return () => { cancelled = true; };
}, [url]);
```

加载期间 `animClips` 保持旧值，旧动画继续播放。
