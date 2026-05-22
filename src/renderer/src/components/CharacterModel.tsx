import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Emotion } from "../hooks/useEmotion";
import type { CharacterConfig } from "../types/character";

const DEFAULT_HEAD_BONES = [
  "Head", "head", "Neck", "neck",
  "mixamorigHead", "mixamorigNeck",
];

// --- Eye Tracking: applies AFTER animation mixer ---
function useEyeTracking(
  groupRef: React.RefObject<THREE.Group>,
  scene: THREE.Object3D,
  mixer: THREE.AnimationMixer | null,
  enabled: boolean
) {
  const { camera } = useThree();
  const headBoneRef = useRef<THREE.Bone | null>(null);
  const neutralQuatRef = useRef<THREE.Quaternion | null>(null);
  const headQuatRef = useRef(new THREE.Quaternion());
  const mouseRef = useRef({ x: 0, y: 0, near: false });
  const rafRef = useRef(0);
  const idleTimerRef = useRef(0);

  // Find head bone
  useEffect(() => {
    if (!enabled) return;
    const allBones: THREE.Bone[] = [];
    let knownMatch: THREE.Bone | null = null;
    scene.traverse((obj) => {
      if (obj.type === "Bone") {
        allBones.push(obj as THREE.Bone);
        if (!knownMatch && DEFAULT_HEAD_BONES.includes(obj.name)) {
          knownMatch = obj as THREE.Bone;
        }
      }
    });
    const found = knownMatch || allBones.find((b) => b.children.length > 0) || null;
    if (found) {
      console.log("[EyeTracking] Selected head bone:", found.name);
      headBoneRef.current = found;
      neutralQuatRef.current = found.quaternion.clone();
      headQuatRef.current.copy(found.quaternion);
    }
  }, [scene, enabled]);

  // Mouse listener — uses window dimensions (works in Electron transparent windows)
  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const x = -((e.clientX / w) * 2 - 1);
        const y = (e.clientY / h) * 2 - 1;
        const dist = Math.hypot(e.clientX - w / 2, e.clientY - h / 2);
        mouseRef.current = { x, y, near: dist < 500 };
      });
      // Reset idle timer — stop tracking after 2s of no mouse movement
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        mouseRef.current = { ...mouseRef.current, near: false };
      }, 2000);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(idleTimerRef.current);
    };
  }, [enabled]);

  // Apply eye tracking AFTER animation mixer updates
  useEffect(() => {
    if (!enabled || !mixer) return;

    const onMixerFinished = () => {};
    const onMixerLoop = () => {};

    // Listen to the mixer's update — fires after all actions are evaluated
    const originalUpdate = mixer.update.bind(mixer);
    mixer.update = (deltaTime: number) => {
      originalUpdate(deltaTime);
      // Apply eye tracking after animation has updated bones
      applyEyeTracking();
    };

    return () => {
      mixer.update = originalUpdate;
    };
  }, [mixer, enabled, camera]);

  function applyEyeTracking() {
    const head = headBoneRef.current;
    const neutral = neutralQuatRef.current;
    const group = groupRef.current;
    if (!head || !neutral || !group) return;

    const MAX_ANGLE = (30 * Math.PI) / 180;
    const LERP_SPEED = 0.15;

    if (mouseRef.current.near) {
      const headWorldPos = new THREE.Vector3();
      head.getWorldPosition(headWorldPos);

      // Ray from mouse position through the scene
      const ndcNear = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, -1);
      const ndcFar = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 1);
      ndcNear.unproject(camera);
      ndcFar.unproject(camera);
      const rayDir = ndcFar.clone().sub(ndcNear).normalize();

      // Closest point on ray to head
      const oc = headWorldPos.clone().sub(ndcNear);
      const t = oc.dot(rayDir);
      const closest = ndcNear.clone().add(rayDir.clone().multiplyScalar(t));

      // Direction from head to target, in local space
      const worldDir = closest.sub(headWorldPos).normalize();
      const parentWorldQuat = new THREE.Quaternion();
      head.parent!.getWorldQuaternion(parentWorldQuat);
      const localDir = worldDir.clone().applyQuaternion(parentWorldQuat.clone().invert());

      // Decompose into yaw (Y-axis) and pitch (X-axis) angles
      const yaw = -Math.atan2(localDir.x, localDir.z);
      const pitch = Math.atan2(localDir.y, Math.sqrt(localDir.x * localDir.x + localDir.z * localDir.z));

      // Build delta quaternion from Euler (YXZ order: yaw first, then pitch)
      const deltaQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(pitch, yaw, 0, 'YXZ')
      );

      // Clamp total angle
      const angle = 2 * Math.acos(Math.min(1, Math.abs(deltaQuat.w)));
      let clampedDelta = deltaQuat;
      if (angle > MAX_ANGLE) {
        const scale = MAX_ANGLE / angle;
        clampedDelta = new THREE.Quaternion().slerpQuaternions(
          new THREE.Quaternion(),
          deltaQuat,
          scale
        );
      }

      // Apply: neutral rotation + clamped delta
      const targetQuat = neutral.clone().multiply(clampedDelta);
      headQuatRef.current.slerp(targetQuat, LERP_SPEED);
    } else {
      headQuatRef.current.slerp(neutral, LERP_SPEED);
    }

    head.quaternion.copy(headQuatRef.current);
  }
}

// --- Embedded Animations ---
function EmbeddedCharacter({
  config,
  emotion,
  onClick,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: {
  config: CharacterConfig;
  emotion: Emotion;
} & CharacterModelCallbacks) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(config.model);
  const { actions, names, mixer } = useAnimations(animations, group);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useEyeTracking(group, clonedScene, mixer, !!config.eyeTracking);

  // Animation transition
  useEffect(() => {
    const targetName = config.animations[emotion];
    const actionName = names.find((n) => n === targetName) || names[0];
    const action = actions[actionName];
    if (!action) return;

    const prev = currentActionRef.current;
    if (prev && prev !== action && prev.isRunning()) {
      prev.crossFadeTo(action, 0.3, true);
      action.reset().play();
    } else {
      action.reset().fadeIn(0.3).play();
    }
    currentActionRef.current = action;
  }, [emotion, actions, names, config.animations]);

  // Breathing
  useFrame((state) => {
    if (config.breathing && group.current) {
      const baseY = config.position[1];
      group.current.position.y =
        baseY + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <primitive
      ref={group}
      object={clonedScene}
      scale={config.scale}
      position={config.position}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}

// --- External Animations ---
function ExternalCharacter({
  config,
  emotion,
  onClick,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: {
  config: CharacterConfig;
  emotion: Emotion;
} & CharacterModelCallbacks) {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(config.model);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);
  const [animClips, setAnimClips] = useState<THREE.AnimationClip[]>([]);
  const loaderRef = useRef(new GLTFLoader());

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Load animation manually — no Suspense, old animation keeps playing
  useEffect(() => {
    const url = config.animations[emotion];
    let cancelled = false;
    loaderRef.current.load(url, (gltf) => {
      if (!cancelled && gltf.animations.length > 0) {
        setAnimClips(gltf.animations);
      }
    });
    return () => { cancelled = true; };
  }, [emotion, config.animations]);

  const { actions, names, mixer } = useAnimations(animClips, group);
  const prevActionRef = useRef<THREE.AnimationAction | null>(null);

  useEyeTracking(group, clonedScene, mixer, !!config.eyeTracking);

  // Animation transition — crossfade from old action to new
  useEffect(() => {
    if (names.length > 0) {
      const actionName = names[0];
      const action = actions[actionName];
      if (!action) return;

      const prev = prevActionRef.current || currentActionRef.current;
      if (prev && prev !== action) {
        prev.crossFadeTo(action, 0.3, true);
        action.reset().play();
      } else {
        action.reset().fadeIn(0.3).play();
      }
      prevActionRef.current = null;
      currentActionRef.current = action;
    }
  }, [animClips, actions, names]);

  // Before clips change, save reference to current action for crossfade
  useEffect(() => {
    return () => {
      if (currentActionRef.current?.isRunning()) {
        prevActionRef.current = currentActionRef.current;
      }
    };
  }, [emotion]);

  // Breathing
  useFrame((state) => {
    if (config.breathing && group.current) {
      const baseY = config.position[1];
      group.current.position.y =
        baseY + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <primitive
      ref={group}
      object={clonedScene}
      scale={config.scale}
      position={config.position}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
}

// --- Main Component ---
export interface CharacterModelCallbacks {
  onClick?: () => void;
  onPointerDown?: (e: any) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export default function CharacterModel({
  config,
  emotion,
  onClick,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: {
  config: CharacterConfig;
  emotion: Emotion;
} & CharacterModelCallbacks) {
  if (config.animationSource === "external") {
    return <ExternalCharacter config={config} emotion={emotion} onClick={onClick} onPointerDown={onPointerDown} onPointerOver={onPointerOver} onPointerOut={onPointerOut} />;
  }
  return <EmbeddedCharacter config={config} emotion={emotion} onClick={onClick} onPointerDown={onPointerDown} onPointerOver={onPointerOver} onPointerOut={onPointerOut} />;
}
