import 'bulma/css/bulma.min.css';

interface ExpandCollapseControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  disabled?: boolean;
}

export function ExpandCollapseControls({
  onExpandAll,
  onCollapseAll,
  disabled = false,
}: ExpandCollapseControlsProps) {
  return (
    <div className="buttons has-addons is-centered mb-5">
      <button
        className="button is-small"
        onClick={onExpandAll}
        disabled={disabled}
        aria-label="Expand all algorithm sections"
        type="button"
      >
        Expand All
      </button>
      <button
        className="button is-small"
        onClick={onCollapseAll}
        disabled={disabled}
        aria-label="Collapse all algorithm sections"
        type="button"
      >
        Collapse All
      </button>
    </div>
  );
}
