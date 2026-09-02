# Design: UI Motion Rollout Plan (motion.dev)

## Summary

This document describes the incremental rollout of `motion.dev` for UI transitions in the React app.
The goal is to improve perceived polish and readability of UI state changes without touching 3D model
animation behavior.

Scope is limited to 2D UI interactions in `src/components/` and `src/pages/`.

**Tracking:** [#347](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/347) (Phase 2), [#350](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/350) (Phase 3).

---

## Why adopt Motion

Current UI animation is split across:

- CSS transitions on hover/focus
- `max-height` accordion tricks
- mount/unmount without enter/exit transitions
- manual class reflow logic to restart keyframe effects

Motion provides:

- declarative enter/exit via `AnimatePresence`
- layout/height transitions without `max-height` hacks
- consistent easing/timing across surfaces
- cleaner per-state animation code in React components

---

## Constraints and Non-goals

### Constraints

- Preserve current architecture boundaries from `AGENT_GUIDELINES.md`.
- Keep accessibility intact (keyboard/focus behavior must remain unchanged).
- Keep visual regression tests deterministic in Playwright.

### Non-goals

- No changes to Three.js / React Three Fiber animation flows.
- No replacement of all existing CSS transitions in one pass.
- No route-wide page transition framework in the first phase.

---

## Dependency and import conventions

- Install package with Yarn classic:
  - `yarn add motion`
- Import from:
  - `motion/react`

Optional: add a small wrapper module for shared transition presets (`src/motion/transitions.ts`).

---

## Rollout phases

### Phase 0: Baseline and guardrails

- `motion` dependency, shared transition presets, reduced-motion handling, test-mode neutralization.

### Phase 1 (Pilot): High-impact, low-risk UI surfaces

- Modal enter/exit (`src/components/Modal/index.tsx`)
- Quests accordion transitions (`src/pages/Quests/index.tsx`)
- Battle damage popup (`src/pages/Battle/Cards/DamagePopup.tsx`)

Motion is also adopted more broadly (e.g. `RecruitmentCelebration`, `BattleOutcome`, `CharacterInventory`, `NavBar`, `RahkshiDetail`, Chronicle accordion).

### Phase 2: Expand to interactive panels

Tracked in [#347](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/347):

- Battle prep team selector reveal
- Recruitment requirement drawer
- Tooltip entrance/exit polish

### Phase 3: Navigation and list choreography

Tracked in [#350](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/350):

- Nav visibility transition refinement
- Tab content transitions
- Character list item enter/layout transitions

---

## Accessibility and UX rules

1. Respect reduced motion preference:
   - Disable non-essential movement.
   - Prefer opacity transitions for reduced-motion users.
2. Do not animate layout in ways that hide focus rings or trap keyboard users.
3. Keep animations short and informative:
   - standard: ~150-250ms
   - complex panel transitions: <= 300ms

---

## Testing strategy

### Automated checks per phase

- `yarn lint`
- `yarn test:ci` (targeted suites when possible)
- E2E snapshots relevant to touched pages/components

### Visual regression stability

Because many E2E tests use screenshots:

1. Continue using test mode (`TEST_MODE`) for deterministic rendering.
2. Ensure UI animation is disabled or neutralized in screenshot tests where needed.
3. Update snapshots only for intentional visual changes.

---

## Risk register

1. **Risk:** Snapshot flakiness from transitions.
   - **Mitigation:** disable/neutralize animations in screenshot tests.

2. **Risk:** Over-animated UI hurts readability.
   - **Mitigation:** use subtle defaults and reduced-motion fallback.

3. **Risk:** Inconsistent patterns if Motion is introduced ad-hoc.
   - **Mitigation:** shared transition presets and phased adoption.
