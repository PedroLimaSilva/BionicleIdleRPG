# Design: UI Motion Rollout Plan (motion.dev)

## Summary

This document proposes an incremental rollout of `motion.dev` for UI transitions in the React app.
The goal is to improve perceived polish and readability of UI state changes without touching 3D model
animation behavior.

Scope is limited to 2D UI interactions in `src/components/` and `src/pages/`.

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

Optional (future): add a small wrapper module for shared transition presets.

---

## Rollout Plan

## Phase 0: Baseline and guardrails

1. Add the dependency.
2. Define shared transition presets (durations/easing) aligned with existing CSS tokens.
3. Add reduced-motion handling for Motion components (`useReducedMotion` + graceful fallbacks).
4. Ensure test strategy can disable/neutralize UI motion where screenshots are taken.

### Exit criteria

- `motion` is installed and builds cleanly.
- Shared presets exist and are reused by pilot components.
- Screenshot tests remain stable.

---

## Phase 1 (Pilot): High-impact, low-risk UI surfaces

### Pilot scope

1. **Modal enter/exit**
   - Backdrop fade
   - Panel fade/scale
   - Proper unmount animation on close

2. **Quests accordion transitions**
   - Replace `max-height` accordion animation with Motion `height`/`opacity`.
   - Keep section toggle behavior unchanged.

3. **Battle damage popup**
   - Replace class-reflow keyframe restart with keyed Motion animation.
   - Keep timing and direction semantics (`up`/`down`) equivalent.

### Why this pilot

- High user-visible value
- Localized component changes
- Minimal coupling with game logic/state invariants

### Exit criteria

- Behavior unchanged except smoother transitions.
- No regressions in quest flow, modal close behavior, or battle action readability.
- Existing unit/E2E tests pass or are updated intentionally.

---

## Phase 2: Expand to interactive panels

Candidate surfaces:

- Chronicle accordion sections/entries
- Battle prep team selector reveal
- Recruitment requirement drawer
- Tooltip entrance/exit polish

### Exit criteria

- Animation patterns are reused (not copied ad-hoc).
- All updated pages maintain responsive behavior.

---

## Phase 3: Navigation and list choreography

Candidate surfaces:

- Nav visibility transition refinement
- Tab content transitions
- Character/inventory list item enter/layout transitions

### Exit criteria

- Animation remains subtle and readable.
- No interaction latency introduced on low-end devices.

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

## Automated checks per phase

- `yarn lint`
- `yarn test:ci` (targeted suites when possible)
- E2E snapshots relevant to touched pages/components

## Visual regression stability

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

---

## First pilot implementation checklist

- [ ] Install `motion` dependency.
- [ ] Add shared transition presets module.
- [ ] Animate `Modal` open/close with `AnimatePresence`.
- [ ] Animate Quests accordion content with Motion.
- [ ] Migrate battle damage popups to Motion.
- [ ] Run lint/tests and update snapshots if needed.
- [ ] Verify reduced-motion behavior for pilot components.
