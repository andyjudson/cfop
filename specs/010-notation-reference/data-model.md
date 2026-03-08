# Data Model: Notation Reference Page (Feature 010)

## Entity: NotationSection

Represents a top-level instructional block on the notation page.

### Fields
- `id` (string, required): Stable section identifier (e.g., `face-turns`, `modifiers`, `slices`, `rotations`, `triggers`).
- `title` (string, required): Section heading shown to users.
- `description` (string, required): Beginner-friendly explanatory copy.
- `examples` (NotationExample[], required): Ordered examples shown in this section.

### Validation Rules
- `id` must be unique per page.
- `title` cannot be empty.
- `description` cannot be empty.
- `examples.length >= 1` for core notation sections (face/modifier/slice/rotation) where assets exist.

---

## Entity: NotationExample

Represents an individual notation symbol reference.

### Fields
- `id` (string, required): Stable identifier for rendering keys.
- `symbol` (string, required): Display symbol (e.g., `R`, `R'`, `R2`, `M`, `x`).
- `label` (string, required): Human-readable name or interpretation.
- `explanation` (string, required): Short beginner-friendly meaning.
- `imageSrc` (string, optional): Asset path under `/cubing.spec/assets/notation/...` where available.
- `imageAlt` (string, optional but required when `imageSrc` exists): Accessibility text.

### Validation Rules
- `symbol` cannot be blank.
- `explanation` cannot be blank.
- If `imageSrc` exists, `imageAlt` is required.
- Unknown/missing image must not remove symbol/label/explanation content.

---

## Entity: TriggerReference

Represents a named short sequence and its inverse for practice lookup.

### Fields
- `id` (string, required): Stable key.
- `name` (string, required): Trigger name (e.g., `Sexy Move`).
- `sequence` (string, required): Canonical move sequence.
- `inverse` (string, required): Inverse sequence.
- `context` (string, optional): Where/why it is commonly used.

### Validation Rules
- `name`, `sequence`, and `inverse` are required.
- `sequence` and `inverse` must be non-empty notation strings.
- Trigger list must contain at least one entry.

---

## Relationships
- One `NotationSection` has many `NotationExample`.
- Trigger references may be modeled as a dedicated `NotationSection` (`id=triggers`) with trigger-specific fields rendered in that section.

---

## State / Lifecycle
- Static content lifecycle only:
  1. Page initializes static section/example/trigger arrays.
  2. UI renders sections in fixed pedagogical order.
  3. Optional image load failure affects only visual tile state, not text content.

No persisted mutable state is required for this feature.
