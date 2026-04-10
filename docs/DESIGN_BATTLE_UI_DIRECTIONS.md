# Design: Battle UI Directions

## Summary

This document captures two possible future directions for the battle experience:

1. **Immersive hybrid UI**: keep a DOM-based HUD and navigation, but make the Three.js battle scene
   much more cinematic and stateful.
2. **Full 3D-first battle presentation**: push much more of the battle experience into the 3D scene,
   with the HUD minimized to essential overlays.

Both approaches aim to make battles feel more immersive and engaging on the web, especially in
portrait mode. This is a reference document, not a commitment to implementation.

---

## Problem statement

The current battle feature works mechanically, but the presentation feels closer to a functional
overlay on top of a 3D scene than to a cohesive battle experience.

Current pain points:

- battle UI hierarchy is weak in portrait mode
- encounter selection requires too much vertical scanning before the main action
- battle prep is functional but not especially clear or dramatic
- the 3D scene shows characters and an arena, but it does not yet carry enough mood, feedback, or
  encounter identity
- combat actions resolve correctly, but the player gets limited authored feedback about what just
  happened and why it mattered

---

## Project constraints

Any future direction should respect these constraints:

- **Web app first**: this is a browser game, not a native mobile app
- **Portrait-first usage**: most sessions are expected to be narrow and vertical
- **Single shared canvas**: the current canvas portal pattern is valuable and should be preserved
- **Performance-sensitive**: low-end mobile devices and laptop browsers must remain viable
- **Incremental scope preferred**: battle improvements should not require rewriting unrelated systems
- **3D asset cost matters**: new environments, animations, and effects carry real production cost

---

## Shared design goals

Regardless of approach, the battle experience should aim for:

1. **Clear hierarchy**
   - the player should always know what wave they are on, who is winning, and what action is ready
2. **Better authored feedback**
   - attacks, mask powers, defeats, and wave transitions should feel intentional and readable
3. **Stronger encounter identity**
   - different encounters should feel like different places and threats, not only different stats
4. **Portrait-friendly interaction**
   - large touch targets, low thumb travel, and limited simultaneous decisions
5. **Performance resilience**
   - features should degrade gracefully on weaker devices

---

## Approach A: Immersive hybrid UI

### One-line description

Keep the current React + DOM HUD model, but let the 3D scene do much more of the emotional and
visual work.

### What changes

- redesign the battle HUD for portrait mode
- preserve DOM controls for actions, stats, rewards, and navigation
- give encounters themed arenas, lighting, camera framing, and ambient motion
- add more expressive combat staging:
  - attack anticipation
  - hit reactions
  - ability callouts
  - wave intro transitions
  - victory and defeat framing
- move from large persistent cards toward lighter overlays and context panels

### Target player experience

The player still uses a familiar mobile-friendly HUD, but battles feel more like watching an
animated scene with responsive controls rather than pressing buttons on a list of cards.

### Why this fits the project well

- works with the current architecture
- keeps accessibility and readability strong
- minimizes risk for portrait mode
- allows incremental rollout
- gets large UX gains without requiring a full rendering/UI paradigm shift

### Candidate UX shape

- **Top rail**
  - wave number
  - encounter name
  - enemy threat or intent summary
- **Center stage**
  - mostly unobstructed 3D battle scene
  - camera beats and VFX carry emotion
- **Bottom battle sheet**
  - party portraits
  - HP and ability readiness
  - primary round button
  - contextual detail on tap

### Production scope

Moderate. This direction needs design work, scene tuning, animation polish, and targeted UI
refactors, but it does not require replacing the app shell or inventing a new interface model.

### Biggest risks

- could become visually richer without fully solving clarity problems
- may still feel partly card-driven if the HUD is not substantially rethought
- scene polish can consume time without a clear UX rubric

### Mitigations

- redesign hierarchy before adding more visual effects
- define a portrait battle wireframe first
- measure FPS during every new environment or VFX pass

---

## Approach B: Full 3D-first battle presentation

### One-line description

Push the battle experience much further into Three.js, using full environments and more scene-led
interaction to create a diorama-like or world-like battle mode.

### What changes

- build richer environment sets per battle or encounter family
- make character motion more spatial:
  - movement into attacks
  - stronger repositioning
  - more cinematic entrances and exits
- reduce the visual weight of the DOM HUD
- explore 3D-backed interaction surfaces, overlays, or world-space callouts
- potentially introduce more camera choreography and scene-led storytelling

### Target player experience

The player feels more like they are looking into a living battle space than reading a layered game
UI. The scene becomes the main attraction and the HUD becomes secondary.

### Why this is attractive

- highest immersion potential
- strongest visual differentiation from a standard idle RPG
- best path if the long-term vision is a highly cinematic battle presentation

### Why this is risky

- highest performance cost on the web
- most demanding in art, animation, and optimization work
- greatest chance of losing readability on portrait screens
- likely to increase implementation complexity across input, layout, and encounter authoring

### Production scope

High. This direction needs more environment art, more animation coverage, tighter performance
budgets, and stronger scene tooling. It is feasible, but it should be treated as a deliberate
product bet rather than a cosmetic upgrade.

### Biggest risks

- performance regressions on mobile browsers
- tap target and readability regressions in portrait mode
- expensive content pipeline for environments and animation variants
- temptation to replace clear UI with less readable world-space interactions

### Mitigations

- keep critical controls in screen-space DOM even in a 3D-first direction
- use fixed or semi-fixed camera framing instead of free camera control
- favor small, authored combat spaces over explorable worlds
- ship one encounter family as a vertical slice before broad rollout

---

## Recommended interpretation of "full 3D environment"

If the project explores a more ambitious direction, the safest interpretation is:

- **Do** build richer battle dioramas with themed scenery, ambient life, camera motion, and more
  expressive actor animation
- **Do not** rush into replacing all HUD interactions with world-space UI
- **Do not** assume free movement or explorable spaces are required for immersion

For this project, a **living diorama** is a much better target than a **fully 3D UI**.

---

## Comparison

| Topic | Approach A: Immersive hybrid UI | Approach B: Full 3D-first |
| --- | --- | --- |
| Immersion upside | High | Very high |
| Portrait readability | Strong | Medium to risky |
| Performance risk | Moderate | High |
| Asset and animation cost | Moderate | High |
| Fit with current architecture | Strong | Medium |
| Ease of incremental rollout | Strong | Weak to medium |
| Recommended as next step | Yes | Only after a successful vertical slice |

---

## Portrait-mode design rules

These rules should hold for either approach:

1. Keep the main decision controls near the bottom of the screen.
2. Minimize persistent top-of-screen chrome.
3. Avoid showing too many equally weighted cards at once.
4. Let the 3D scene occupy the emotional center of the screen.
5. Use tap-to-expand for details instead of showing every stat all the time.
6. Treat the battle flow as a sequence of focused decisions, not a dense dashboard.

---

## Performance guardrails

If battle presentation becomes more 3D-heavy, maintain these guardrails:

- preserve the single shared canvas architecture
- keep battle scenes capped to small actor counts
- prefer fake or simplified shadows over expensive fully dynamic lighting
- avoid heavy postprocessing by default
- favor stylized, readable environments over geometry-heavy realism
- lazy-load environment assets where possible
- treat performance monitor checks as part of routine battle UI iteration

---

## Proposed roadmap

### Phase 1: Battle UX foundation

- redesign portrait battle HUD
- improve encounter selection hierarchy and CTA placement
- make team selection clearer and more tactile
- add combat event readability improvements:
  - action callouts
  - turn summaries
  - clearer ability readiness

### Phase 2: Environment identity

- create encounter-themed arena variants
- add wave intro transitions and stronger camera framing
- add ambient environment motion and lightweight scene FX

### Phase 3: Expressive combat staging

- improve attack and hit animations
- add spotlight moments for mask powers
- tighten defeat and victory presentation

### Phase 4: Vertical slice for a 3D-first mode

- pick one encounter family
- build a more ambitious battle diorama
- test portrait readability and FPS on constrained hardware
- decide whether the gains justify broader rollout

---

## Recommendation

The best near-term direction is **Approach A: Immersive hybrid UI**.

Reasoning:

- it addresses the actual current weakness, which is presentation hierarchy and battle feedback
- it fits portrait web constraints much better
- it preserves readable, accessible controls
- it uses the existing Three.js foundation rather than replacing it
- it leaves the door open for a later 3D-first vertical slice if the hybrid direction succeeds

Approach B should remain a valid future option, but it should be explored as a contained prototype,
not as the default next step.

---

## Open questions for future planning

- Which encounter families deserve unique environments first?
- What is the minimum animation set that makes combat feel alive without exploding scope?
- How much battle information must remain permanently visible in portrait mode?
- Should battle pacing stay round-based with a single primary action, or add more pacing controls?
- What FPS floor should be considered acceptable on mobile browsers before expanding scene scope?
