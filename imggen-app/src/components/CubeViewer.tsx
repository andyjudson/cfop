import { useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import type { VisualizationConfig } from '../types/imageGenerator'

type TwistyPlayerWithExperimental = TwistyPlayer & {
  alg?: string
  visualization?: 'PG3D' | 'experimental-2D-LL'
  experimentalSetupAlg?: string
  experimentalSetupAnchor?: 'start' | 'end'
  experimentalStickeringMaskOrbits?: string
  background?: 'none'
  hintFacelets?: 'none'
  controlPanel?: 'none'
  tempoScale?: number
  experimentalDownloadScreenshot?: (filename: string) => Promise<void> | void
}

interface CubeViewerProps {
  appliedConfig: VisualizationConfig
  onPlayerReady: (player: TwistyPlayerWithExperimental | null) => void
}

export default function CubeViewer({ appliedConfig, onPlayerReady }: CubeViewerProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<TwistyPlayerWithExperimental | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hostRef.current) {
      return
    }

    try {
      const player = new TwistyPlayer({
        puzzle: '3x3x3',
        visualization: 'PG3D',
        background: 'none',
        hintFacelets: 'none',
        controlPanel: 'none',
        experimentalDragInput: 'none',
      }) as TwistyPlayerWithExperimental

      hostRef.current.innerHTML = ''
      hostRef.current.appendChild(player)
      playerRef.current = player
      onPlayerReady(player)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize TwistyPlayer'
      setError(message)
      console.error('CubeViewer error:', err)
      onPlayerReady(null)
    }

    return () => {
      onPlayerReady(null)
      playerRef.current = null
      if (hostRef.current) {
        hostRef.current.innerHTML = ''
      }
    }
  }, [onPlayerReady])

  useEffect(() => {
    const player = playerRef.current
    if (!player) {
      return
    }

    player.visualization = appliedConfig.visualizationMode === '3d' ? 'PG3D' : 'experimental-2D-LL'
    player.alg = appliedConfig.moveAlgorithm
    player.experimentalSetupAlg = appliedConfig.setupAlgorithm
    player.experimentalSetupAnchor = appliedConfig.anchor
    player.experimentalStickeringMaskOrbits = appliedConfig.effectiveMask
    player.background = 'none'
    player.hintFacelets = 'none'
    player.controlPanel = 'none'
  }, [appliedConfig])

  const is3D = appliedConfig.visualizationMode === '3d'

  if (error) {
    return (
      <div className="box viewer-shell">
        <div className="notification is-danger">
          <p><strong>Error initializing cube viewer:</strong> {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="box viewer-shell">
      <div
        className="viewer-stage"
        style={{
          width: is3D ? 288 : 420,
          height: is3D ? 288 : 220,
        }}
      >
        <div className="twisty-host" ref={hostRef} />
      </div>
      <p className="viewer-meta">Mode: {appliedConfig.visualizationMode.toUpperCase()} • Capture target: {is3D ? 'PNG ~4096×4096 (resize offline: sips -Z 288 *.png)' : 'SVG 288×288 viewBox'}</p>
    </div>
  )
}
