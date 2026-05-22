import type { Emotion } from '../hooks/useEmotion'

export interface CharacterConfig {
  name: string
  model: string
  animations: Record<Emotion, string>
  animationSource: 'embedded' | 'external'
  scale: number
  position: [number, number, number]
  eyeTracking?: boolean
  breathing?: boolean
  headBoneNames?: string[]
}
