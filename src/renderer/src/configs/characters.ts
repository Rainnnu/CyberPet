import { useGLTF } from "@react-three/drei";
import type { CharacterConfig } from "../types/character";

// --- Amy (external animations) ---
export const AMY_CONFIG: CharacterConfig = {
  name: "Amy",
  model: "/models/role/human/Amy/Ch46_nonPBR.glb",
  animations: {
    idle: "/models/role/human/Amy/Neutral Idle.glb",
    happy: "/models/role/human/Amy/Happy.glb",
    thinking: "/models/role/human/Amy/Thinking.glb",
    sad: "/models/role/human/Amy/Sad Idle.glb",
  },
  animationSource: "external",
  scale: 0.8,
  position: [0, -0.1, 0],
  eyeTracking: true,
  breathing: true,
};

// --- Cat (external animations from action folder) ---
export const CAT_CONFIG: CharacterConfig = {
  name: "Cat",
  model: "/models/role/animal/Cat/ccCat.glb",
  animations: {
    idle: "/models/role/animal/Cat/action/standing idle.glb",
    happy: "/models/role/animal/Cat/action/standing jump.glb",
    thinking: "/models/role/animal/Cat/action/standing idle looking ver. 1.glb",
    sad: "/models/role/animal/Cat/action/crouch idle.glb",
  },
  animationSource: "external",
  scale: 0.8,
  position: [0, -0.1, 0],
  eyeTracking: true,
  breathing: true,
};

// --- ThirtySeven (AccuRig model, external animations) ---
export const THIRTY_SEVEN_CONFIG: CharacterConfig = {
  name: "ThirtySeven",
  model: "/models/role/human/AccuRig/thirtySeven.glb",
  animations: {
    idle: "/models/role/human/AccuRig/anim_idle.glb",
    happy: "/models/role/human/AccuRig/anim_happy.glb",
    thinking: "/models/role/human/AccuRig/anim_thinking.glb",
    sad: "/models/role/human/AccuRig/anim_sad.glb",
  },
  animationSource: "external",
  scale: 0.8,
  position: [0, -0.1, 0],
  eyeTracking: true,
  breathing: true,
  headBoneNames: ["CC_Base_Head", "CC_Base_Neck"],
};

// --- pet.glb (embedded animations) ---
export const PET_CONFIG: CharacterConfig = {
  name: "Pet",
  model: "/models/role/other/Pet/pet.glb",
  animations: {
    idle: "Idle",
    happy: "Dance",
    thinking: "No",
    sad: "Sitting",
  },
  animationSource: "embedded",
  scale: 0.5,
  position: [0, -0.05, 0],
  breathing: true,
};

// Character fallback chain
export const CHARACTER_CHAIN: CharacterConfig[] = [
  AMY_CONFIG,
  CAT_CONFIG,
  THIRTY_SEVEN_CONFIG,
  PET_CONFIG,
];

// Character list for UI (name only)
export const CHARACTER_NAMES: string[] = CHARACTER_CHAIN.map((c) => c.name);

// Get character config by name
export function getCharacterByName(name: string): CharacterConfig | undefined {
  return CHARACTER_CHAIN.find((c) => c.name === name);
}

// selectedCharacter persistence
const CHAR_STORAGE_KEY = "cyberpet-selected-character";

export function loadSelectedCharacter(): string {
  try {
    return localStorage.getItem(CHAR_STORAGE_KEY) || CHARACTER_CHAIN[0].name;
  } catch {
    return CHARACTER_CHAIN[0].name;
  }
}

export function saveSelectedCharacter(name: string): void {
  try {
    localStorage.setItem(CHAR_STORAGE_KEY, name);
  } catch {}
}

// Preload all external animation files
function preloadCharacter(config: CharacterConfig) {
  useGLTF.preload(config.model);
  if (config.animationSource === "external") {
    Object.values(config.animations).forEach((url) => useGLTF.preload(url));
  }
}

preloadCharacter(AMY_CONFIG);
preloadCharacter(CAT_CONFIG);
preloadCharacter(THIRTY_SEVEN_CONFIG);
preloadCharacter(PET_CONFIG);
