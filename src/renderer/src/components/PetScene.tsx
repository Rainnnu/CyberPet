import { useRef, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PetModel from "./PetModel";
import type { Emotion } from "../hooks/useEmotion";

interface PetSceneProps {
  emotion: Emotion;
  selectedCharacter?: string;
  onClick?: () => void;
  onPointerDown?: (e: any) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

// Click/hover detection — cache rect, use single bounding sphere
function HitDetector({
  onClick,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: {
  onClick?: () => void;
  onPointerDown?: (e: any) => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const sphereRef = useRef(new THREE.Sphere(new THREE.Vector3(0, -0.1, 0), 0.6));
  const wasOverRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  let rafId = 0;

  // Cache rect, update on resize
  useEffect(() => {
    const updateRect = () => {
      rectRef.current = gl.domElement.getBoundingClientRect();
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    const interval = setInterval(updateRect, 1000);
    return () => {
      window.removeEventListener("resize", updateRect);
      clearInterval(interval);
    };
  }, [gl]);

  const hitTest = useCallback(
    (e: MouseEvent): boolean => {
      const rect = rectRef.current || gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.current.setFromCamera(ndc, camera);
      // Update sphere center to model's breathing position
      sphereRef.current.center.set(0, -0.1 + Math.sin(Date.now() * 0.0015) * 0.02, 0);
      return raycaster.current.ray.intersectsSphere(sphereRef.current);
    },
    [camera, gl]
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = (e: MouseEvent) => {
      if (hitTest(e)) onClick?.();
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (hitTest(e)) onPointerDown?.(e);
    };

    const handlePointerMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const over = hitTest(e);
        if (over && !wasOverRef.current) {
          wasOverRef.current = true;
          onPointerOver?.();
        } else if (!over && wasOverRef.current) {
          wasOverRef.current = false;
          onPointerOut?.();
        }
      });
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);

    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [gl, hitTest, onClick, onPointerDown, onPointerOver, onPointerOut]);

  return null;
}

export default function PetScene({
  emotion,
  selectedCharacter,
  onClick,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: PetSceneProps) {
  return (
    <Canvas
      dpr={1}
      camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 100 }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true, premultipliedAlpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    >
      <ambientLight intensity={1.0} />
      <hemisphereLight args={["#b1e1ff", "#b97a20", 0.8]} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-3, 2, 4]} intensity={0.6} />
      <PetModel emotion={emotion} selectedCharacter={selectedCharacter} />
      <HitDetector
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />
    </Canvas>
  );
}
