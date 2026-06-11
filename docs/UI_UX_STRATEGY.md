# UI/UX Strategy: Immersive Portrait-First Idle RPG

**Tracking:** [#343](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/343) (Phase 1), [#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346) (Phase 2), [#349](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/349) (Phase 3), [#345](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/345) (portrait polish), [#348](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/348) (Phase 4+ stretch).

## Executive Summary

**Primary recommendation: Hybrid 2D UI + 3D Stage ("Diorama" model)**

Keep all menus, inventory, numbers, and navigation as DOM/CSS (the current stack), but expand the 3D canvas from a character-viewer/battle backdrop into a persistent, thematic **stage** that gives every screen a sense of place. Think of it as a toybox diorama behind a glass panel — the player always sees their world, but interacts through crisp, accessible 2D controls overlaid on top.

This direction maximizes immersion-per-engineering-hour, stays performant on mid-range phones, and avoids the two biggest traps of "full 3D UI": text readability and input accessibility.

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Player Experience Analysis](#2-player-experience-analysis)
3. [Recommended Direction: Hybrid Diorama](#3-recommended-direction-hybrid-diorama)
4. [Alternative Directions](#4-alternative-directions)
5. [3D Scope — Phased Approach](#5-3d-scope--phased-approach)
6. [Performance Budget & Patterns](#6-performance-budget--patterns)
7. [Animation & Art Strategy](#7-animation--art-strategy)
8. [Portrait-Specific UX](#8-portrait-specific-ux)
9. [Metrics to track](#9-metrics-to-track)
10. [Kill Criteria](#10-kill-criteria)

---

## 1. Current State Assessment

### What exists today

| Area                     | Implementation                                                                                                                         | Maturity         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **3D models**            | 14+ GLB character models (Toa Mata, Nuva, Takanuva, Bohrok, Rahkshi, Matoran), arena, masks, armor                                     | Good asset base  |
| **Canvas architecture**  | Single shared `<Canvas>` portaled to `#canvas-mount`, scenes swapped per route                                                         | Solid foundation |
| **Battle 3D**            | `Arena` with orthographic camera, positioned combatants, `playAnimation` imperative API (Attack/Hit/Defeat/Idle), face-target rotation | Functional       |
| **Character viewer**     | `CharacterScene` with SSAO, selective bloom on eyes, `PresentationControls`                                                            | Polished         |
| **Battle 2D**            | Prep screen (team slots, roster scroll), in-progress (ally/enemy cards, HP bars, damage popups, cooldown fills), outcome/rewards       | Functional, flat |
| **Navigation**           | Bottom pill nav (portrait), side vertical nav (landscape), hidden during active battle                                                 | Works well       |
| **Layout**               | Portrait-default with `.landscape` overrides, CSS anchor positioning for canvas, 170px bottom padding for nav                          | Adequate         |
| **Performance controls** | Shadow toggle, reduced motion, resolution scaling on postprocessing, `r3f-perf` debug overlay, PWA caching of GLBs                     | Present          |

### Where it feels weak

1. **Disconnected screens** — Quests, characters, battle selector, and battle each feel like separate flat pages with no spatial continuity. The 3D canvas appears and disappears rather than feeling like a window into a persistent world.
2. **Battle feedback is split-brain** — The 3D arena sits behind the UI (`z-index: -1`) with models animating, but the player reads combat primarily from 2D cards. The two layers don't reinforce each other; they compete for attention.
3. **No environmental storytelling** — Every screen has the same dark gradient background. There's no sense of _place_ (Mata Nui, Kini-Nui, Ta-Koro) despite the rich lore.
4. **Idle progression is invisible** — The only idle indicator is a protodermis counter and job badges. There's no visual heartbeat showing the game is alive when you're on the quests or characters screen.
5. **Text-heavy quest flow** — Available quests are a card list with requirement chips. No visual hook to the world the quest describes.

---

## 2. Player Experience Analysis

### What makes idle RPGs feel engaging

| Principle                     | Current gap                                                                                | Opportunity                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Constant visible progress** | Protodermis ticks are a single number. Jobs run silently.                                  | Ambient 3D activity — characters visibly working, particles accumulating |
| **Satisfying collection**     | Character grid with small cards                                                            | Full 3D character showcase, trophy room / lineup                         |
| **Clear combat readability**  | Damage numbers + HP bars are good; 3D models animate but are tiny and far from the numbers | Tighter coupling: camera follows action, 3D effects echo damage          |
| **Loot anticipation**         | Krana/kraata drops shown as text rewards                                                   | 3D loot reveal, glow, physical drop from enemy                           |
| **Sense of place**            | None — every screen is same dark void                                                      | Route-specific 3D backdrops                                              |
| **Juicy feedback**            | `motion` for layout transitions; damage popups float                                       | Screen shake, particle bursts on crits, elemental VFX on mask powers     |
| **One-hand reachability**     | Bottom nav and battle action bar are thumb-friendly; some secondary actions remain higher  | Keep primary actions in the bottom 40% of the viewport                   |

---

## 3. Recommended Direction: Hybrid Diorama

### Core concept

The `#canvas-mount` becomes a **persistent stage** visible on every route (not just battle/character/recruitment). Each route sets a **backdrop scene** appropriate to its context:

| Route                      | Backdrop                                                                                            | Overlay                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `/` (Quests)               | Mata Nui overview — island silhouette with ambient lighting, day/night cycle tied to quest progress | Quest cards, timers, notifications                                     |
| `/characters`              | "Village square" — recruited characters idle in formation, ambient animation                        | Character grid overlaid, tapping a card flies camera to that character |
| `/characters/:id`          | Current character scene (keep existing `CharacterScene`)                                            | Stats/tabs panel as bottom sheet                                       |
| `/recruitment`             | Recruitment shrine — dramatic reveal lighting                                                       | Requirement drawer (existing)                                          |
| `/battle/selector`         | World map with encounter markers, or current arena preview                                          | Encounter cards                                                        |
| `/battle`                  | Arena (existing, enhanced)                                                                          | Streamlined combat HUD                                                 |
| `/settings`, `/quest-tree` | Dim/blurred version of last active scene, or simple ambient                                         | Full-page DOM content                                                  |

### Why this direction

1. **Leverages existing architecture** — The single-canvas portal pattern already works. Adding more backdrop scenes is additive, not a rewrite.
2. **DOM stays for what DOM does best** — Text, lists, buttons, scrolling, accessibility, responsive typography. No fighting Three.js text rendering or raycasting for buttons.
3. **3D does what 3D does best** — Atmosphere, character presence, spatial feedback, particle effects, lighting moods.
4. **Incremental delivery** — Each route's backdrop can be added independently. The game is playable at every intermediate state.
5. **Performance ceiling is manageable** — Backdrops can be extremely low-poly (or even just a skybox + a few props) since they're behind DOM content.

### What changes in the code

- `SceneCanvasProvider` evolves: instead of `scene | null`, it manages a `backdrop` (always present, low-cost) and an optional `foreground` (character model, arena combatants).
- `#canvas-mount` visibility rules simplify: it's always `display: block`, positioned full-bleed at `z-index: -1` (behind page content). Route-specific framing is handled by camera position, not CSS insets.
- A new `<Backdrop>` component library provides simple, low-poly scenes: island, village, shrine, arena preview. These can be as simple as a single textured plane + particles + colored lighting.

---

## 4. Alternative Directions

### Alternative A: "Full 3D World" (Explorable)

Replace all flat UI with a navigable 3D environment. Tap locations to open quests, walk to the arena, visit characters in their village.

| Pros                         | Cons                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| Maximum immersion            | Enormous scope — needs navmesh, camera controls, world geometry, UI-in-3D                            |
| Could be stunning on desktop | Portrait phone: tiny touch targets, text unreadable in perspective, thumb occlusion                  |
| Unique among idle RPGs       | Performance risk: full scene + UI overlays on budget phones                                          |
|                              | Accessibility: screen readers, keyboard nav, reduced motion all need custom solutions                |
|                              | Breaks current architecture — `AGENT_GUIDELINES.md` prohibits multiple canvases or 3D outside portal |

**Verdict**: Not recommended for MVP. Consider as a long-term aspiration ("Phase 4+") once the hybrid model is proven. Elements can be borrowed earlier (e.g., an explorable island map for quest selection) as isolated experiments.

### Alternative B: "Polished Flat" (No additional 3D)

Keep the current flat UI, invest in motion design, illustration, and polish. Better transitions, illustrated backgrounds, particle effects in CSS/SVG, richer damage feedback.

| Pros                   | Cons                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Simplest, fastest      | Doesn't leverage the 3D models already built                                               |
| Universally performant | Ceiling on immersion — looks like every other 2D idle game                                 |
| No WebGL perf concerns | The existing 3D scenes (battle, character) feel even more disconnected if the rest is flat |

**Verdict**: Good as a fallback or as a first sprint before 3D backdrops are ready. Many of the 2D polish items (recruitment feedback, better damage popups, screen shake) should be done regardless of direction.

---

## 5. 3D Scope — Phased Approach

### Phase 0: 2D Polish & Battle UX (no new 3D)

**Goal**: Make the existing app feel better before adding scope. Complete — recruitment celebration, battle bottom bar, screen shake, mask power particles, damage popups, wave transitions, haptics, and outcome screen polish.

### Phase 1: Persistent Canvas & Battle Enhancement

**Goal**: The canvas is always visible; battle 3D gets meaningfully better.

**Done:** Battle camera emphasis on attack, hit impact particles, world-space HP bars.

**Remaining:** [#343](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/343) — always-on `#canvas-mount` with default backdrop, per-route lighting shifts, defeat dissolve effect.

### Phase 2: Environmental Backdrops

**Goal**: Each major route feels like a different location. Tracked in [#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346) — island overview (Quests), village (Characters), shrine (Recruitment), arena mesh.

### Phase 3: Advanced Feedback & Polish

**Goal**: Combat is a visual spectacle; the idle loop has ambient life. Tracked in [#349](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/349) — mask power VFX, idle ambient activity, battle transitions, loot drop, day/night cycle.

### Phase 4+ (Stretch / Future)

Tracked in [#348](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/348) — explorable island map, character housing, multiplayer spectating, skeletal animation pipeline.

---

## 6. Performance Budget & Patterns

### Target device

**Baseline**: Snapdragon 6-series / Apple A13 (iPhone 11) — a ~3-year-old midrange phone in 2026. This gives roughly:

- **GPU**: ~150–200 GFLOPS, shared memory, thermal throttling after 30s of sustained load
- **WebGL 2** context with `EXT_color_buffer_float`, limited to 4096px max texture
- **RAM**: 4–6 GB total, browser tab gets ~500 MB–1 GB

### Budget per frame (target: 30 fps idle, 60 fps interaction)

| Resource              | Budget               | Notes                                                                                                                                           |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Draw calls**        | ≤ 50                 | Merge static geometry. Use instancing for particles. drei `<Instances>` for repeated props                                                      |
| **Triangle count**    | ≤ 100k visible       | Current Toa models are ~5–15k each. 6 combatants + arena + backdrop ≈ 80k. Backdrops should be < 5k                                             |
| **Textures**          | ≤ 32 MB VRAM         | Shared atlas per character set. Backdrop textures 512x512 max. Use `THREE.CompressedTexture` (KTX2/basis) when possible                         |
| **Postprocessing**    | 1 pass max on mobile | SSAO is expensive — gate behind a "quality" setting or disable on mobile. Bloom is cheaper with the `resolutionScale: 0.5` pattern already used |
| **Canvas resolution** | `dpr` capped at 1.5  | drei `<AdaptiveDpr>` or manual `gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))`                                                       |
| **JS frame time**     | ≤ 4ms                | Avoid allocations in `useFrame`. No `new Vector3()` per frame — reuse with `.set()`                                                             |
| **DOM nodes**         | ≤ 500 visible        | React re-renders during battle should only touch the changed card. Use `React.memo` on combatant cards                                          |

### Patterns to adopt

| Pattern                      | How                                                                                                                                                            | Why                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Offscreen culling**        | `<group visible={isActiveRoute}>` — don't render backdrop geometry when a full-page modal is up                                                                | Saves GPU fill + vertex work          |
| **LOD / progressive detail** | Backdrops load a 256x256 placeholder texture, swap to 1024x1024 once loaded (`useTexture` + Suspense)                                                          | Fast first paint                      |
| **Instanced particles**      | `drei <Instances>` or raw `THREE.InstancedMesh` for dust/sparks/protodermis                                                                                    | 1 draw call for hundreds of particles |
| **Shared materials**         | Create materials once in a `<MaterialProvider>`, reference by name                                                                                             | Reduces GPU state changes             |
| **Frame loop gating**        | `useFrame` callbacks check `visible` or `shouldAnimate` flag; return early if offscreen or reduced-motion                                                      | Saves CPU                             |
| **Adaptive quality**         | Measure FPS over 60 frames. If < 24 avg, disable postprocessing, lower DPR, simplify backdrop                                                                  | Graceful degradation on weak devices  |
| **Preloading**               | Continue current pattern: `useGLTF.preload` for models on routes the player will visit next. Prefetch arena when player opens battle selector, not on app boot | Reduces initial load time             |

### What to avoid

- **Multiple render targets / MRT**: No deferred rendering. Stick to forward rendering.
- **Dynamic shadows on backdrops**: Static `ShadowMaterial` baked into backdrop texture, or no shadows on backdrop meshes. Only combatant shadows in battle (already gated).
- **Real-time environment maps**: Use `Environment preset` (already done) — these are pre-computed HDR. Never do runtime cube map captures.
- **Large `useFrame` dependency arrays**: Re-subscribing to the frame loop is expensive. Keep `useFrame` callbacks stable.

---

## 7. Animation & Art Strategy

### Current animation state

The codebase uses **GLTF animation clips** stored in the model GLBs. `useCombatAnimations` composes `useIdleAnimation` (looping) and `usePlayAnimation` (one-shot Attack/Hit/Defeat). This is a solid pattern.

### Getting more life without a full pipeline

| Technique                               | Effort | Impact    | Details                                                                                                                                                                                                                                          |
| --------------------------------------- | ------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Procedural idle variation**           | Low    | Medium    | Add subtle `useFrame` sin-wave bob (Y position, ±0.02 units, period 2–4s) and slight rotation oscillation (Y axis, ±2°). Apply to all models as a wrapper `<IdleBob>` component. Breaks the "frozen statue" look even without animation clips.   |
| **Shared hit-reaction**                 | Low    | High      | Instead of requiring a per-model "Hit" clip, create a procedural hit: brief scale pulse (1.0 → 1.1 → 1.0 over 150ms) + backward translation (Z ±0.05 over 100ms). Can be in `CombatantModel` without touching the child model.                   |
| **Stagger timing**                      | Low    | Medium    | Offset idle animation start times by combatant index × 0.5s so characters don't breathe in sync.                                                                                                                                                 |
| **Shared rigs**                         | Medium | High      | All Toa Mata share one rig, all Toa Nuva share one rig, Bohrok share one rig. Author animation clips on the master rig, apply to all characters in that set via `mixer.clipAction(clip)`. Reduces animation authoring from 14 unique sets to ~4. |
| **Fewer bones**                         | Medium | Medium    | Backprop models (village idle characters) can use a 6-bone rig (root, spine, head, 2 arms, hips). Only battle models need full rigs.                                                                                                             |
| **Sprite animation for far characters** | Low    | High      | For the island/village backdrop, characters beyond a certain distance from camera render as animated billboards (2–4 frame sprite sheets) instead of full 3D models. `drei <Billboard>` + `<Sprite>`.                                            |
| **Particle systems for VFX**            | Medium | Very High | Elemental effects (fire, ice, stone, earth, water, air) as instanced particle emitters. One `InstancedMesh` of quads with a shared texture atlas (4 textures: circle, spark, snowflake, dust). Color + speed + gravity per element.              |

### Art production recommendations

- **Backdrops**: Low-poly stylized meshes (< 2k tris each). Can be modeled in Blender in a few hours. Bake lighting into vertex colors to avoid extra texture loads.
- **Props**: 5–10 reusable props (hut, rock, tree, pillar, shrine, crate). Instanced across scenes.
- **Ground textures**: 512x512, tiling, 2–3 variants (sand, stone, grass). Use `MeshStandardMaterial` with roughness, no normal maps needed at this scale.
- **Skybox**: Gradient shader (no texture) or a single 1024x512 equirectangular image. Cheaper than `Environment preset` if you don't need reflections.

---

## 8. Portrait-Specific UX

### Layout principles

```
┌──────────────────────────┐
│    Status bar / safe     │  ← iOS notch / Android status bar
│    area padding          │
├──────────────────────────┤
│                          │
│    3D Canvas (backdrop)  │  ← z-index: -1, always visible
│    fills entire viewport │
│                          │
├──────────────────────────┤
│    DOM content overlay   │  ← z-index: 0+, scrollable
│    (quest cards, stats,  │
│     battle HUD)          │
│                          │
│                          │
├──────────────────────────┤
│    Action zone           │  ← Bottom 40% of viewport
│    (buttons, nav,        │     All interactive elements here
│     currency bar)        │     for one-thumb reach
├──────────────────────────┤
│    Nav pill              │  ← Fixed, bottom: 24px (existing)
└──────────────────────────┘
```

### Specific guidelines

| Concern                     | Guideline                                                                                                                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Thumb reach**             | Primary action buttons (Run Round, Recruit, Start Quest) must stay in the bottom 40% of viewport height. Battle actions use a fixed bottom bar above the nav; audit new screens against the same rule.                                         |
| **Safe areas**              | Use `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` in CSS. The nav is already 24px from bottom; add `+ env(safe-area-inset-bottom)` for iPhone home indicator.                                                                    |
| **Text size**               | Minimum 14px for body text, 12px for secondary labels. Nav label size bump tracked in [#345](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/345).                                                                                     |
| **Touch targets**           | Minimum 44x44px for all interactive elements (WCAG 2.5.8). Current nav items are fine (64px tall); check quest/battle card buttons.                                                                                                             |
| **3D interaction**          | Do not require precision taps on 3D models for gameplay-critical actions. 3D is for viewing; DOM handles interaction. `PresentationControls` for spin/zoom is fine (exploration, not action).                                                   |
| **When 3D should recede**   | Modals, full-page settings, privacy policy, quest tree diagram: dim/blur the canvas or set `visible={false}` on backdrop group. Prevents visual competition with dense text/UI.                                                                 |
| **Scroll behavior**         | Vertical scroll only. No horizontal swipe navigation (conflicts with system back gesture on Android and iOS edge swipe). Horizontal scroll rows (existing roster scroll) are fine as explicit carousels.                                        |
| **Orientation lock**        | Portrait lock tracked in [#345](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/345). Landscape layout can remain as a secondary mode.                                                                                                   |
| **Canvas height in battle** | Currently full-bleed. In portrait, the 3D arena should occupy the top ~50-60% of the viewport, with the compact combat HUD in the bottom 40-50%. The current `z-index: -1` full-bleed approach works if the HUD is opaque in the lower portion. |

### Battle HUD redesign for portrait

The current battle UI has ally cards on one side and enemy cards on the other, with buttons in between. For portrait, consider:

```
┌──────────────────────────┐
│                          │
│      3D Arena            │  Top 55%
│      (enemies visible    │
│       at top, team at    │
│       bottom of 3D)      │
│                          │
├──────────────────────────┤
│  Enemy HP bars (compact) │  Thin row, overlays bottom of 3D
├──────────────────────────┤
│                          │
│  Ally cards (3 slots)    │  Horizontal row, shows HP + cooldown
│  ┌────┐ ┌────┐ ┌────┐   │
│  │ A1 │ │ A2 │ │ A3 │   │
│  └────┘ └────┘ └────┘   │
│                          │
│  [Use Mask]  [Run Round] │  Action buttons, full width
│                          │
│  ▬▬▬▬▬ Nav Pill ▬▬▬▬▬   │  (hidden during combat)
└──────────────────────────┘
```

This puts all interactive elements in the bottom thumb zone while maximizing the 3D viewport.

---

## 9. Metrics to track

| Metric                 | Tool                                                | Target                              |
| ---------------------- | --------------------------------------------------- | ----------------------------------- |
| FPS (P50, P10)         | `r3f-perf` + custom logging                         | ≥ 30 fps P10 on baseline device     |
| JS heap                | `performance.measureUserAgentSpecificMemory()`      | ≤ 150 MB after 10 min play          |
| GLB load time          | `PerformanceObserver` resource timing               | ≤ 2s P90 on 4G (cached: ≤ 100ms)    |
| First Contentful Paint | Lighthouse                                          | ≤ 2.5s                              |
| Time to Interactive    | Lighthouse                                          | ≤ 4s                                |
| Canvas GPU time        | `EXT_disjoint_timer_query_webgl2` (where available) | ≤ 8ms/frame                         |
| Player engagement      | Session length, battles per session, return rate    | Qualitative: "does it feel better?" |

---

## 10. Kill Criteria

Conditions under which a 3D expansion should be paused or rolled back:

1. **FPS drops below 24 P10** on the baseline device profile with the new backdrop + battle scene active. Fix: simplify backdrop first. If still bad after simplification, revert to canvas-off-by-default.

2. **JS heap exceeds 300 MB** during normal gameplay (not during a GLB load). Fix: audit texture sizes, dispose unused geometries more aggressively.

3. **Time to Interactive exceeds 6s** on a 4G throttled Lighthouse run. Fix: defer backdrop loading, reduce preloaded assets, use progressive LOD.

4. **Battle readability degrades** — if playtesters report that floating HP bars or camera movement makes combat harder to follow, revert to static camera + 2D-only HP. 3D should aid clarity, not hinder it.

5. **Development velocity drops significantly** — if implementing a single backdrop takes more than the equivalent of a single focused engineering session's worth of work, the approach is too heavy. Backdrops should be simple and fast to produce.

---

## Appendix: Architecture Compatibility

All recommendations respect the constraints in `AGENT_GUIDELINES.md`:

- **Single canvas**: Maintained. All 3D goes through `#canvas-mount` portal.
- **Layer separation**: New 3D components are in `components/` or `pages/`. No game logic in 3D code.
- **State management**: Battle state stays in `useBattleState` via `useGame()`. New visual state (camera target, particle triggers) uses local component state or refs, not game state.
- **No new context providers**: Camera animation state lives in `Arena` component refs, not a new context.
- **Persistence unchanged**: No new persisted fields needed for visual changes.
- **Canvas portal pattern**: Preserved. `setScene()` API extended to support backdrop + foreground layers, or a single composed scene per route.
