export type VisualizationMode = '3d' | '2d'
export type SetupAnchor = 'start' | 'end'
export type PresetMaskKey = 'default' | 'cross' | 'f2l' | 'oll' | 'pll'

export interface VisualizationConfig {
  setupAlgorithm: string
  moveAlgorithm: string
  visualizationMode: VisualizationMode
  anchor: SetupAnchor
  presetMask: PresetMaskKey
  customMask: string
  effectiveMask: string
}

export interface ValidationState {
  moveAlgorithmError: string | null
  setupAlgorithmError: string | null
  isMoveAlgorithmValid: boolean
  isSetupAlgorithmValid: boolean
  canApply: boolean
  canPlay: boolean
  canCapture: boolean
}

export interface CaptureRequest {
  requestedAtMs: number
  filenameBase: string
  mode: VisualizationMode
  targetWidthPx: number
  targetHeightPx: number
  expectedFormat: 'png' | 'svg'
}

export interface AlgorithmLogEntry {
  originalAlgorithm: string
  invertedAlgorithm: string
  loggedAtMs: number
}
