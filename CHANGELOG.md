# Changelog

## 2026-03-08 - Feature 006: Local Scramble Generator

### Added
- Local 3x3 scramble generator in [cfop-app/src/utils/scrambleGenerator.ts](cfop-app/src/utils/scrambleGenerator.ts)
- 20-move practice scramble generation with quality constraints
- Typed success/failure result model for generation outcomes
- Timeout wrapper with 1000ms failure handling
- Repository-level [README.md](README.md) and [LICENSE](LICENSE)

### Changed
- Practice scramble integration now uses local generator in [cfop-app/src/utils/scramble.ts](cfop-app/src/utils/scramble.ts)
- Renamed generator module from `fallbackScrambleGenerator` to `scrambleGenerator`
- Updated spec artifacts under [specs/006-fallback-scramble-generator](specs/006-fallback-scramble-generator)
- Added local dev-server stability guidance in [.github/copilot-instructions.md](.github/copilot-instructions.md)

### Removed
- Runtime dependence on `cubing/scramble` workers for scramble generation
- Legacy worker-specific Vite workaround configuration for scramble generation paths

### Validation
- Local production build passes (`npm run build`)
- Manual local feature checks passed for scramble flow, timer flow, and persistence
- GitHub Pages production URL responds successfully
