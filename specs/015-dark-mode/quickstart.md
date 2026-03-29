# Quickstart: Dark Mode — Feature 015

## Integration Scenarios

### Scenario 1: First visit, no stored preference, OS = light mode
- App loads
- Inline script in `<head>` reads `localStorage.getItem('cfop-theme')` → `null`
- Inline script checks `window.matchMedia('(prefers-color-scheme: dark)').matches` → `false`
- No `data-theme` attribute set (defaults to light)
- Moon icon visible in navbar

### Scenario 2: First visit, no stored preference, OS = dark mode
- App loads
- Inline script reads `localStorage` → `null`
- Inline script checks OS preference → `true`
- Inline script sets `document.documentElement.setAttribute('data-theme', 'dark')`
- Dark palette active; no flash of light mode
- Sun icon visible in navbar

### Scenario 3: User toggles to dark mode
- User clicks moon icon in navbar
- `useTheme` hook sets `document.documentElement.setAttribute('data-theme', 'dark')`
- `useTheme` writes `localStorage.setItem('cfop-theme', 'dark')`
- All `--color-*` tokens immediately resolve to dark values
- Toggle icon changes to sun
- No page reload

### Scenario 4: Return visit with stored dark preference
- App loads
- Inline script reads `localStorage.getItem('cfop-theme')` → `'dark'`
- Inline script sets `data-theme="dark"` before any CSS paints
- No flash of light mode
- `useTheme` hook initialises from `localStorage` → sun icon shown

### Scenario 5: Viewing algorithm cards in dark mode
- Dark mode active, page background = `#0f172a`
- Algorithm card background = `#1e293b` (via `--color-bg-subtle`)
- Cube net SVG: black facelet edges (`#111`) visible against `#1e293b` ✓
- Dark grey stickers (`~#333`) visible against `#1e293b` ✓
- Coloured stickers (yellow, red, orange, blue, green, white) unchanged — data-driven, not affected by theme

### Scenario 6: Practice modal in dark mode
- Modal backdrop: `rgba(0,0,0,0.85)` (darkened)
- Modal surface: `--color-bg-base` (`#0f172a`)
- Practice blocks: `--color-bg-subtle` (`#1e293b`)
- Timer display: white text on dark border
- All previously hardcoded values in PracticeSessionModal.css now resolved via tokens

### Scenario 7: localStorage unavailable (private browsing)
- Inline script wraps read/write in try/catch
- `useTheme` wraps localStorage calls in try/catch
- Theme still works in-session using component state only
- No stored preference survives session end — acceptable

## localStorage Key

```
key:   'cfop-theme'
value: 'light' | 'dark'
```
