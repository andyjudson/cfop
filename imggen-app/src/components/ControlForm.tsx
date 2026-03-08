import type { ChangeEvent, FormEvent } from 'react'
import type {
  PresetMaskKey,
  SetupAnchor,
  VisualizationMode,
} from '../types/imageGenerator'

interface ControlFormProps {
  setupAlgorithm: string
  moveAlgorithm: string
  visualizationMode: VisualizationMode
  anchor: SetupAnchor
  presetMask: PresetMaskKey
  customMask: string
  setupAlgorithmError: string | null
  moveAlgorithmError: string | null
  onSetupAlgorithmChange: (value: string) => void
  onMoveAlgorithmChange: (value: string) => void
  onVisualizationModeChange: (value: VisualizationMode) => void
  onAnchorChange: (value: SetupAnchor) => void
  onPresetMaskChange: (value: PresetMaskKey) => void
  onCustomMaskChange: (value: string) => void
  onApply: () => void
}

export default function ControlForm({
  setupAlgorithm,
  moveAlgorithm,
  visualizationMode,
  anchor,
  presetMask,
  customMask,
  setupAlgorithmError,
  moveAlgorithmError,
  onSetupAlgorithmChange,
  onMoveAlgorithmChange,
  onVisualizationModeChange,
  onAnchorChange,
  onPresetMaskChange,
  onCustomMaskChange,
  onApply,
}: ControlFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onApply()
  }

  return (
    <form className="box control-form" onSubmit={handleSubmit}>
      <div className="field">
        <label className="label" htmlFor="setupAlgorithm">
          Setup algorithm
        </label>
        <div className="control">
          <input
            id="setupAlgorithm"
            className={`input ${setupAlgorithmError ? 'is-danger' : ''}`}
            type="text"
            value={setupAlgorithm}
            placeholder="z2"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onSetupAlgorithmChange(event.target.value)
            }}
          />
        </div>
        {setupAlgorithmError ? <p className="help is-danger">{setupAlgorithmError}</p> : null}
      </div>

      <div className="field">
        <label className="label" htmlFor="moveAlgorithm">
          Move algorithm
        </label>
        <div className="control">
          <input
            id="moveAlgorithm"
            className={`input ${moveAlgorithmError ? 'is-danger' : ''}`}
            type="text"
            value={moveAlgorithm}
            placeholder="R U R' U'"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onMoveAlgorithmChange(event.target.value)
            }}
          />
        </div>
        {moveAlgorithmError ? <p className="help is-danger">{moveAlgorithmError}</p> : null}
      </div>

      <div className="columns is-multiline">
        <div className="column is-half">
          <div className="field">
            <label className="label" htmlFor="visualizationMode">
              Mode
            </label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="visualizationMode"
                  value={visualizationMode}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    onVisualizationModeChange(event.target.value as VisualizationMode)
                  }}
                >
                  <option value="3d">3D</option>
                  <option value="2d">2D</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-half">
          <div className="field">
            <label className="label" htmlFor="anchor">
              Anchor
            </label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="anchor"
                  value={anchor}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    onAnchorChange(event.target.value as SetupAnchor)
                  }}
                >
                  <option value="start">Start</option>
                  <option value="end">End</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-half">
          <div className="field">
            <label className="label" htmlFor="presetMask">
              Preset mask
            </label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="presetMask"
                  value={presetMask}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    onPresetMaskChange(event.target.value as PresetMaskKey)
                  }}
                >
                  <option value="default">default</option>
                  <option value="cross">cross</option>
                  <option value="f2l">f2l</option>
                  <option value="oll">oll</option>
                  <option value="pll">pll</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-half">
          <div className="field">
            <label className="label" htmlFor="customMask">
              Custom mask (optional)
            </label>
            <div className="control">
              <input
                id="customMask"
                className="input"
                type="text"
                value={customMask}
                placeholder="EDGES:----OOOO----,CORNERS:--------,CENTERS:------"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onCustomMaskChange(event.target.value)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
