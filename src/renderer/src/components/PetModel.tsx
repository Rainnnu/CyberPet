import React, { useState, useRef, useEffect, Component, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Emotion } from "../hooks/useEmotion";
import CharacterModel from "./CharacterModel";
import { CHARACTER_CHAIN } from "../configs/characters";

const EMOTION_COLORS: Record<Emotion, string> = {
  idle: "#64c8ff",
  happy: "#ffdd57",
  thinking: "#a78bfa",
  sad: "#6b7280",
};

// Fallback when all character models fail
function FallbackPet({ emotion }: { emotion: Emotion }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const targetColor = new THREE.Color(EMOTION_COLORS[emotion]);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.scale.y = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.1;

      if (emotion === "happy") {
        meshRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.3;
      }
      if (emotion === "thinking") {
        meshRef.current.rotation.z = Math.sin(t * 0.8) * 0.15;
      } else {
        meshRef.current.rotation.z *= 0.95;
      }
      if (emotion === "sad") {
        meshRef.current.position.y = -0.2 + Math.sin(t * 0.5) * 0.02;
      }
    }
    if (materialRef.current) {
      materialRef.current.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={EMOTION_COLORS.idle}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function LoadingIndicator() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.y = t * 2;
      meshRef.current.rotation.x = t * 0.5;
      const scale = 1 + Math.sin(t * 3) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#64c8ff" transparent opacity={0.6} />
    </mesh>
  );
}

class ErrorBoundary extends Component<
  { children: ReactNode; onError: () => void; resetKey?: string },
  { hasError: boolean; lastResetKey?: string }
> {
  state = { hasError: false, lastResetKey: undefined as string | undefined };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  static getDerivedStateFromProps(props: { resetKey?: string }, state: { hasError: boolean; lastResetKey?: string }) {
    if (state.hasError && props.resetKey !== state.lastResetKey) {
      return { hasError: false, lastResetKey: props.resetKey };
    }
    if (props.resetKey !== state.lastResetKey) {
      return { lastResetKey: props.resetKey };
    }
    return null;
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function PetModel({ emotion, selectedCharacter }: { emotion: Emotion; selectedCharacter?: string }) {
  const [failedNames, setFailedNames] = useState<Set<string>>(new Set());

  // Reset failed names when user explicitly selects a character
  useEffect(() => {
    if (selectedCharacter) {
      setFailedNames((prev) => {
        if (!prev.has(selectedCharacter)) return prev;
        const next = new Set(prev);
        next.delete(selectedCharacter);
        return next;
      });
    }
  }, [selectedCharacter]);

  const handleFail = (name: string) => {
    setFailedNames((prev) => new Set(prev).add(name));
  };

  // Build ordered list: selected character first, then the rest
  const ordered = [...CHARACTER_CHAIN];
  if (selectedCharacter) {
    const idx = ordered.findIndex((c) => c.name === selectedCharacter);
    if (idx > 0) {
      const [selected] = ordered.splice(idx, 1);
      ordered.unshift(selected);
    }
  }

  // Find the first character that hasn't failed
  const active = ordered.find((c) => !failedNames.has(c.name));

  if (!active) {
    return <FallbackPet emotion={emotion} />;
  }

  return (
    <ErrorBoundary resetKey={active.name} onError={() => handleFail(active.name)}>
      <React.Suspense fallback={<LoadingIndicator />}>
        <CharacterModel key={active.model} config={active} emotion={emotion} />
      </React.Suspense>
    </ErrorBoundary>
  );
}
