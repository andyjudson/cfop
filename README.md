# cfop

CFOP (Rubik's cube) learning companion. Covers the full CFOP method — Intuitive Cross, F2L, OLL, PLL — with algorithm reference grids, an interactive 3D visualiser, a practice timer with real WCA competition data, and a WR evolution chart.

**Live app:** https://andyjudson.github.io/cfop/

## Features

- Full CFOP navigation (Intuitive, Notation, Beginner 2-Look, F2L, OLL, PLL, About)
- Algorithm reference grids with expandable groups and session-persistent state
- OLL and PLL probability scores and WCA case numbers on every card
- 3D algorithm visualiser modal — cubing.js TwistyPlayer with play/pause/rewind, speed control, and move-by-move highlight
- Practice timer: random scrambles + space-bar timer with rolling stats; Champion mode loads real WCA competition finals
- Dark mode with localStorage persistence; mobile-responsive (iPhone 16 baseline)
- WCA world record evolution chart (Recharts) and sortable WR Legends table

**Directory:** `/cfop-app/` • [README](cfop-app/README.md)

## Algorithm Data

Algorithm sets are stored as JSON in `cfop-app/public/data/`:

| File | Content |
|------|---------|
| `algs-cfop-bgr.json` | 2-Look Beginner (BGR) cases |
| `algs-cfop-f2l.json` | Full F2L — 41 cases |
| `algs-cfop-oll.json` | Full OLL — 57 cases in 7 groups |
| `algs-cfop-pll.json` | Full PLL — 21 cases |

All entries include `id`, `name`, `notation`, `group`, `method`, `setup` (WCA notation), and optional `mask`, `prob`, `wca_id` fields.

## Development

```bash
cd cfop-app
npm install
npm run dev -- --host 127.0.0.1 --port 5173
# http://127.0.0.1:5173/cfop/
```

Production build: `npm run build` → `dist/`

## Testing

Smoke tests via Playwright (Chromium) against the local dev server:

```bash
cd cfop-app
npx playwright test
```

16 tests across 5 spec files covering navigation, mobile layout, practice timer, visualiser modal, and WR chart.

## Built With

- **[cubing.js](https://github.com/cubing/cubing.js)** — cube graphics and algorithm visualization (Lucas Garron)
- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Bulma CSS** for UI components and responsive layout
- **Recharts** for the WR evolution chart
- **GitHub Copilot** and **Claude Code** for AI-assisted development
- Deployed on **GitHub Pages**

## License

MIT License — see [LICENSE](LICENSE) for details.

Note: Cubing algorithms are mathematical sequences in the public domain. This project uses [cubing.js](https://github.com/cubing/cubing.js) (MPL-2.0) for visualization.

---

**Status**: Active development • Features 001–021 complete
