import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AlgorithmLogEntry, ValidationState, VisualizationConfig } from './types/imageGenerator'
import { validateAlgorithm, invertAlgorithmNotation } from './utils/algUtils'
import { createCaptureRequest } from './utils/captureUtils'
import { resolveEffectiveMask } from './utils/maskPresets'
import ControlForm from './components/ControlForm'
import ActionButtons from './components/ActionButtons'
import CubeViewer from './components/CubeViewer'
import './App.css'

type TwistyPlayerHandle = {
  play: () => void
  jumpToStart?: () => void
  tempoScale?: number
  experimentalDownloadScreenshot?: (filename: string) => Promise<void> | void
} | null

const DEFAULT_PRESET = 'default' as const

export default function App() {
  const [formState, setFormState] = useState<Omit<VisualizationConfig, 'effectiveMask'>>({
    setupAlgorithm: '',
    moveAlgorithm: '',
    visualizationMode: '3d',
    anchor: 'end',
    presetMask: DEFAULT_PRESET,
    customMask: '',
  })

  const [appliedConfig, setAppliedConfig] = useState<VisualizationConfig>({
    ...formState,
    effectiveMask: resolveEffectiveMask(DEFAULT_PRESET, ''),
  })

  const [isBusy, setIsBusy] = useState(false)
  const playerRef = useRef<TwistyPlayerHandle>(null)

  const setupValidation = useMemo(
    () => validateAlgorithm(formState.setupAlgorithm, 'setup', true),
    [formState.setupAlgorithm],
  )

  const moveValidation = useMemo(
    () => validateAlgorithm(formState.moveAlgorithm, 'move', true),
    [formState.moveAlgorithm],
  )

  const hasMoveAlgorithm = formState.moveAlgorithm.trim().length > 0
  const canPlayOrCapture = hasMoveAlgorithm && moveValidation.isValid

  const validationState: ValidationState = {
    moveAlgorithmError: moveValidation.error,
    setupAlgorithmError: setupValidation.error,
    isMoveAlgorithmValid: moveValidation.isValid,
    isSetupAlgorithmValid: setupValidation.isValid,
    canApply: setupValidation.isValid && moveValidation.isValid,
    canPlay: canPlayOrCapture,
    canCapture: canPlayOrCapture,
  }

  const applyVisualization = useCallback(() => {
    if (!validationState.canApply) {
      return
    }

    const effectiveMask = resolveEffectiveMask(formState.presetMask, formState.customMask)
    const nextAppliedConfig: VisualizationConfig = {
      ...formState,
      effectiveMask,
    }

    setAppliedConfig(nextAppliedConfig)

    if (hasMoveAlgorithm && moveValidation.isValid) {
      const inverted = invertAlgorithmNotation(formState.moveAlgorithm)
      if (inverted) {
        const logEntry: AlgorithmLogEntry = {
          originalAlgorithm: formState.moveAlgorithm.trim(),
          invertedAlgorithm: inverted,
          loggedAtMs: Date.now(),
        }

        console.log('[imggen] apply', logEntry)
      }
    }
  }, [formState, hasMoveAlgorithm, moveValidation.isValid, validationState.canApply])

  useEffect(() => {
    if (!setupValidation.isValid) {
      return
    }

    if (!moveValidation.isValid) {
      setAppliedConfig((prev) => ({
        ...prev,
        visualizationMode: formState.visualizationMode,
      }))
      return
    }

    setAppliedConfig((prev) => ({
      ...prev,
      ...formState,
      effectiveMask: resolveEffectiveMask(formState.presetMask, formState.customMask),
      visualizationMode: formState.visualizationMode,
    }))
  }, [
    formState.visualizationMode,
    formState.anchor,
    formState.customMask,
    formState.moveAlgorithm,
    formState.presetMask,
    formState.setupAlgorithm,
    moveValidation.isValid,
    setupValidation.isValid,
  ])

  const handlePlay = () => {
    if (!validationState.canPlay || !playerRef.current) {
      return
    }

    playerRef.current.jumpToStart?.()
    playerRef.current.tempoScale = 1.5
    playerRef.current.play()
  }

  const handleCapture = async () => {
    if (!validationState.canCapture || !playerRef.current?.experimentalDownloadScreenshot) {
      return
    }

    const request = createCaptureRequest(appliedConfig.visualizationMode)

    setIsBusy(true)
    try {
      await playerRef.current.experimentalDownloadScreenshot(request.filenameBase)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <main className="app-shell">
      <h1 className="title app-title">Cube Image Generator</h1>
      <p className="subtitle is-6 app-subtitle">
        Standalone utility for generating clean 3×3 algorithm images.
      </p>

      <ControlForm
        setupAlgorithm={formState.setupAlgorithm}
        moveAlgorithm={formState.moveAlgorithm}
        visualizationMode={formState.visualizationMode}
        anchor={formState.anchor}
        presetMask={formState.presetMask}
        customMask={formState.customMask}
        setupAlgorithmError={validationState.setupAlgorithmError}
        moveAlgorithmError={validationState.moveAlgorithmError}
        onSetupAlgorithmChange={(value) => {
          setFormState((prev) => ({ ...prev, setupAlgorithm: value }))
        }}
        onMoveAlgorithmChange={(value) => {
          setFormState((prev) => ({ ...prev, moveAlgorithm: value }))
        }}
        onVisualizationModeChange={(value) => {
          setFormState((prev) => ({ ...prev, visualizationMode: value }))
        }}
        onAnchorChange={(value) => {
          setFormState((prev) => ({ ...prev, anchor: value }))
        }}
        onPresetMaskChange={(value) => {
          setFormState((prev) => ({ ...prev, presetMask: value }))
        }}
        onCustomMaskChange={(value) => {
          setFormState((prev) => ({ ...prev, customMask: value }))
        }}
        onApply={applyVisualization}
      />

      <ActionButtons
        canApply={validationState.canApply}
        canPlay={validationState.canPlay}
        canCapture={validationState.canCapture}
        isBusy={isBusy}
        onApply={applyVisualization}
        onPlay={handlePlay}
        onCapture={handleCapture}
      />

      <CubeViewer
        appliedConfig={appliedConfig}
        onPlayerReady={(player) => {
          playerRef.current = player
        }}
      />
    </main>
  )
}
