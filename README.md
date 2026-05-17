# cfop

CFOP (Rubik's cube) learning companion. Covers the full CFOP method — Cross, F2L, OLL, PLL — with algorithm reference grids, an interactive 3D visualiser, a practice timer with real WCA competition data, and a WR evolution chart.

**Live app:** https://andyjudson.github.io/cfop/

## Features

- Full CFOP navigation (Notation, Intuitive, Beginner 2-Look, F2L, OLL, PLL)
- About page with highlights of cubing history and background context to this project
- Algorithm reference grids with expandable groups and session-persistent state
- OLL and PLL probability scores and WCA case numbers on every card
- 3D algorithm visualiser modal using cubify, set/group filter (2-Look, full OLL, full PLL), play/pause/rewind, speed control, move-by-move highlight; full-screen on mobile
- Cubify integration harness — animated algorithm player with case selector, mask stickering, theme presets; WCA random-state scramble generator and Kociemba 2-phase solver (both via twips WASM worker)
- Practice timer full-screen on mobile
- Practice mode with random scrambles + space-bar timer with rolling stats; Champion mode loads real WCA competition finals
- Dark mode with localStorage persistence; mobile-responsive (iPhone 16 baseline)
- WCA World Record evolution chart and table

## Algorithm Data

Algorithm sets are stored as JSON in `cfop-app/public/data/`:

| File | Content |
|------|---------|
| `algs-cfop-bgr.json` | 2-Look Beginner cases |
| `algs-cfop-f2l.json` | Full F2L — 41 cases |
| `algs-cfop-oll.json` | Full OLL — 57 cases |
| `algs-cfop-pll.json` | Full PLL — 21 cases |
| `wca-wr-evolution.json` | WR progression history (single + average); refreshed via `scripts/wca-refresh/` |
| `wca-wr-legends.json` | Per-person WR summary; current holders flagged |
| `wca-beat-the-champion.json` | Finals results + scrambles for WR events and championships |

All entries include `id`, `name`, `notation`, `group`, `method`, `setup`, and optional `mask`, `prob`, `wca_id` fields.

## Development

```bash
cd cfop-app
npm install
npm run dev -- --host 127.0.0.1 --port 5173
# http://127.0.0.1:5173/cfop/
```

Production build: `npm run build` → `dist/`

### Local cubify development

`CUBIFY_LOCAL=1` in `cfop-app/.env.local` aliases `@andyjudson/cubify` and `@andyjudson/cubify-react` to the local TypeScript sources — no build step or publish needed, changes are picked up via HMR:

```bash
echo "CUBIFY_LOCAL=1" >> cfop-app/.env.local
```

CI and fresh clones never have `.env.local` and always install from GitHub Packages.

## Testing

Smoke tests via Playwright (Chromium) against the local dev server:

```bash
cd cfop-app
npx playwright test
```

16 tests across 5 spec files covering navigation, mobile layout, practice timer, visualiser modal, and WR chart.

## Built With

- **[cubify](https://github.com/andyjudson/cubify)** — clean-room cube rendering library; `<CubePlayer>` / `<CubeState>` React wrappers
- **[cubing.js](https://github.com/cubing/cubing.js)** — KPattern permutation state model and WCA standard move application (Lucas Garron & Tom Rokicki)
- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Bulma CSS** for UI components and responsive layout
- **Recharts** for the WR evolution chart
- **GitHub Copilot** and **Claude Code** for AI-assisted development
- Deployed on **GitHub Pages**

## License

MIT License — see [LICENSE](LICENSE) for details.

Note: Cubing algorithms are mathematical sequences in the public domain. This project uses [cubing.js](https://github.com/cubing/cubing.js) (MPL-2.0) for visualization.

---

**Status**: Active development • Features 001–023 complete
