import type { PresetMaskKey } from '../types/imageGenerator'

export const PRESET_MASKS: Record<PresetMaskKey, string> = {
  default: 'EDGES:------------,CORNERS:--------,CENTERS:------',
  cross: 'EDGES:----IIIIIIII,CORNERS:IIIIIIII,CENTERS:------',
  f2l: 'EDGES:----IIII----,CORNERS:----IIII,CENTERS:------',
  oll: 'EDGES:----OOOO----,CORNERS:----IIII,CENTERS:------',
  pll: 'EDGES:----OOOO----,CORNERS:--------,CENTERS:------',
}

export function getPresetMaskValue(key: PresetMaskKey): string {
  return PRESET_MASKS[key]
}

export function resolveEffectiveMask(preset: PresetMaskKey, customMask: string): string {
  const trimmed = customMask.trim()
  if (trimmed.length > 0) {
    return trimmed
  }

  return getPresetMaskValue(preset)
}
