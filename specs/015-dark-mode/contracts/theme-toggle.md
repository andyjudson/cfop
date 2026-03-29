# UI Contract: Theme Toggle Button

## Location
Navbar (`CfopNavigation`), positioned alongside the hamburger button — visible on all screen sizes.

## Visual Behaviour

| Active theme | Icon shown | Icon meaning |
|--------------|-----------|--------------|
| Light mode | `MdDarkMode` (crescent moon) | "Switch to dark" |
| Dark mode | `MdLightMode` (sun) | "Switch to light" |

## Interaction Contract

- **On press**: Immediately toggles the active theme (no delay, no reload).
- **Disabled state**: Never disabled.
- **Aria label**: `"Switch to dark mode"` / `"Switch to light mode"` (changes with state).

## Placement Rules

- Button MUST be visible at all breakpoints (≥375px).
- Button MUST NOT displace or overlap the hamburger button or navbar brand.
- On mobile, appears to the left of the hamburger (same row, same visual weight).
- No label text — icon only, with aria-label for accessibility.

## State Source

Button icon is driven by the active theme value from the `useTheme` hook. The hook is the single source of truth for the current theme.

## localStorage Contract

```
key:   'cfop-theme'
type:  string | null
values: 'light' | 'dark'
absent: inherit OS preference (prefers-color-scheme)
```

## CSS Attribute Contract

The active theme is applied as:
```
document.documentElement.setAttribute('data-theme', 'light' | 'dark')
```

All theme-sensitive CSS is scoped to `[data-theme="dark"]` in `index.css`.
