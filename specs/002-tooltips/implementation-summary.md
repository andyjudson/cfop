# Implementation Summary: Algorithm Notes Tooltips (Retrospective)

**Feature**: 002-tooltips  
**Type**: Retrospective backfill  
**Status**: Completed historically

## What shipped

- Image-triggered algorithm notes tooltips
- Hover and touch-friendly interactions
- Structured note rendering for learning guidance
- Placement and layering tuning to reduce overlap/clipping
- UI style refinements for readability and consistency

## Historical source

This summary is reconstructed from the Feature 002 section in [spec.md](../../spec.md).

## Notes

- Backfilled to align legacy work with the newer per-feature folder structure.
- No implementation change is introduced by this documentation.

## March 2026 — Behavior change: tooltip replaced by bottom sheet

The hover/click tooltip in `AlgorithmCard` was replaced with a slide-up bottom sheet (`AlgorithmNotesSheet`). Motivation: the left/right flip logic was fragile and the tooltip was unusable on mobile. The sheet uses a fixed viewport-anchored panel (full width on mobile, 560px centered on desktop), dismissed via tap-outside, × button, or Escape. State is lifted to `BGRPage`; `AlgorithmCard` now takes an `onShowNotes` callback instead of managing tooltip state internally.
