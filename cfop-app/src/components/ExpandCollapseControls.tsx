import 'bulma/css/bulma.min.css';

interface ExpandCollapseControlsProps {
  /** Whether all sections are currently expanded — drives the button's role. */
  allExpanded: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  disabled?: boolean;
}

/**
 * Single label-toggling control: shows "Expand All" when sections are collapsed
 * and "Collapse All" once they're all open, with a colour cue when active.
 * Matches the show/hide-arrows toggle pattern on the BGR page.
 */
export function ExpandCollapseControls({
  allExpanded,
  onExpandAll,
  onCollapseAll,
  disabled = false,
}: ExpandCollapseControlsProps) {
  return (
    <div className="buttons is-centered mb-5">
      <button
        className={`button is-small${allExpanded ? ' is-warning' : ' is-light'}`}
        onClick={allExpanded ? onCollapseAll : onExpandAll}
        disabled={disabled}
        aria-pressed={allExpanded}
        aria-label={allExpanded ? 'Collapse all algorithm sections' : 'Expand all algorithm sections'}
        type="button"
      >
        {allExpanded ? 'Collapse All' : 'Expand All'}
      </button>
    </div>
  );
}
