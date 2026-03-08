import type { CaptureRequest, VisualizationMode } from '../types/imageGenerator'

// Note: cubing.js experimentalDownloadScreenshot captures at native resolution (~4096px)
// regardless of target size parameters. Use offline resize: sips -Z 288 *.png
const TARGET_SIZE_3D = 288

export function createCaptureRequest(mode: VisualizationMode): CaptureRequest {
  const now = Date.now()

  return {
    requestedAtMs: now,
    filenameBase: `cubing-3x3-${now}`,
    mode,
    targetWidthPx: mode === '3d' ? TARGET_SIZE_3D : 0,
    targetHeightPx: mode === '3d' ? TARGET_SIZE_3D : 0,
    expectedFormat: mode === '3d' ? 'png' : 'svg',
  }
}
