interface ActionButtonsProps {
  canApply: boolean
  canPlay: boolean
  canCapture: boolean
  isBusy: boolean
  onApply: () => void
  onPlay: () => void
  onCapture: () => void
}

export default function ActionButtons({
  canApply,
  canPlay,
  canCapture,
  isBusy,
  onApply,
  onPlay,
  onCapture,
}: ActionButtonsProps) {
  return (
    <div className="buttons action-buttons">
      <button
        type="button"
        className="button is-link"
        disabled={!canApply || isBusy}
        onClick={onApply}
      >
        Apply
      </button>
      <button
        type="button"
        className="button is-info is-light"
        disabled={!canPlay || isBusy}
        onClick={onPlay}
      >
        Play
      </button>
      <button
        type="button"
        className="button is-primary"
        disabled={!canCapture || isBusy}
        onClick={onCapture}
      >
        Capture
      </button>
    </div>
  )
}
