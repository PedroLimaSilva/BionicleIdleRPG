# UI/UX Strategy: Immersive Portrait-First Idle RPG

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
9. [Concrete Next Steps](#9-concrete-next-steps)
10. [Kill Criteria](#10-kill-criteria)

---

## 1. Current State Assessment

### What exists today

| Area | Implementation | Maturity |
|------|---------------|----------|
| **3D models** | 14+ GLB character models (Toa Mata, Nuva, Takanuva, Bohrok, Rahkshi, Matoran), arena, masks, armor | Good asset base |
| **Canvas architecture** | Single shared `<Canvas>` portaled to `#canvas-mount`, scenes swapped per route | Solid foundation |
| **Battle 3D** | `Arena` with orthographic camera, positioned combatants, `playAnimation` imperative API (Attack/Hit/Defeat/Idle), face-target rotation | Functional |
| **Character viewer** | `CharacterScene` with SSAO, selective bloom on eyes, `PresentationControls` | Polished |
| **Battle 2D** | Prep screen (team slots, roster scroll), in-progress (ally/enemy cards, HP bars, damage popups, cooldown fills), outcome/rewards | Functional, flat |
| **Navigation** | Bottom pill nav (portrait), side vertical nav (landscape), hidden during active battle | Works well |
| **Layout** | Portrait-default with `.landscape` overrides, CSS anchor positioning for canvas, 170px bottom padding for nav | Adequate |
| **Performance controls** | Shadow toggle, reduced motion, resolution scaling on postprocessing, `r3f-perf` debug overlay, PWA caching of GLBs | Present |

### Where it feels weak

1. **Disconnected screens** — Quests, characters, battle selector, and battle each feel like separate flat pages with no spatial continuity. The 3D canvas appears and disappears rather than feeling like a window into a persistent world.
2. **Battle feedback is split-brain** — The 3D arena sits behind the UI (`z-index: -1`) with models animating, but the player reads combat primarily from 2D cards. The two layers don't reinforce each other; they compete for attention.
3. **No environmental storytelling** — Every screen has the same dark gradient background. There's no sense of *place* (Mata Nui, Kini-Nui, Ta-Koro) despite the rich lore.
4. **Idle progression is invisible** — The only idle indicator is a protodermis counter and job badges. There's no visual heartbeat showing the game is alive when you're on the quests or characters screen.
5. **Recruitment uses `alert()`** — The most exciting moment (getting a new character) has the worst feedback.
6. **Text-heavy quest flow** — Available quests are a card list with requirement chips. No visual hook to the world the quest describes.

---

## 2. Player Experience Analysis

### What makes idle RPGs feel engaging

| Principle | Current gap | Opportunity |
|-----------|------------|-------------|
| **Constant visible progress** | Protodermis ticks are a single number. Jobs run silently. | Ambient 3D activity — characters visibly working, particles accumulating |
| **Satisfying collection** | Character grid with small cards | Full 3D character showcase, trophy room / lineup |
| **Clear combat readability** | Damage numbers + HP bars are good; 3D models animate but are tiny and far from the numbers | Tighter coupling: camera follows action, 3D effects echo damage |
| **Loot anticipation** | Krana/kraata drops shown as text rewards | 3D loot reveal, glow, physical drop from enemy |
| **Sense of place** | None — every screen is same dark void | Route-specific 3D backdrops |
| **Juicy feedback** | `motion` for layout transitions; damage popups float | Screen shake, particle bursts on crits, elemental VFX on mask powers |
| **One-hand reachability** | Bottom nav is good; battle "Run Round" button is not always thumb-reachable | Action buttons must live in bottom 40% of viewport |

---

## 3. Recommended Direction: Hybrid Diorama

### Core concept

The `#canvas-mount` becomes a **persistent stage** visible on every route (not just battle/character/recruitment). Each route sets a **backdrop scene** appropriate to its context:

| Route | Backdrop | Overlay |
|-------|----------|---------|
| `/` (Quests) | Mata Nui overview — island silhouette with ambient lighting, day/night cycle tied to quest progress | Quest cards, timers, notifications |
| `/characters` | "Village square" — recruited characters idle in formation, ambient animation | Character grid overlaid, tapping a card flies camera to that character |
| `/characters/:id` | Current character scene (keep existing `CharacterScene`) | Stats/tabs panel as bottom sheet |
| `/recruitment` | Recruitment shrine — dramatic reveal lighting | Requirement drawer (existing) |
| `/battle/selector` | World map with encounter markers, or current arena preview | Encounter cards |
| `/battle` | Arena (existing, enhanced) | Streamlined combat HUD |
| `/settings`, `/quest-tree` | Dim/blurred version of last active scene, or simple ambient | Full-page DOM content |

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

| Pros | Cons |
|------|------|
| Maximum immersion | Enormous scope — needs navmesh, camera controls, world geometry, UI-in-3D |
| Could be stunning on desktop | Portrait phone: tiny touch targets, text unreadable in perspective, thumb occlusion |
| Unique among idle RPGs | Performance risk: full scene + UI overlays on budget phones |
| | Accessibility: screen readers, keyboard nav, reduced motion all need custom solutions |
| | Breaks current architecture — `AGENT_GUIDELINES.md` prohibits multiple canvases or 3D outside portal |

**Verdict**: Not recommended for MVP. Consider as a long-term aspiration ("Phase 4+") once the hybrid model is proven. Elements can be borrowed earlier (e.g., an explorable island map for quest selection) as isolated experiments.

### Alternative B: "Polished Flat" (No additional 3D)

Keep the current flat UI, invest in motion design, illustration, and polish. Better transitions, illustrated backgrounds, particle effects in CSS/SVG, richer damage feedback.

| Pros | Cons |
|------|------|
| Simplest, fastest | Doesn't leverage the 3D models already built |
| Universally performant | Ceiling on immersion — looks like every other 2D idle game |
| No WebGL perf concerns | The existing 3D scenes (battle, character) feel even more disconnected if the rest is flat |

**Verdict**: Good as a fallback or as a first sprint before 3D backdrops are ready. Many of the 2D polish items (recruitment feedback, better damage popups, screen shake) should be done regardless of direction.

---

## 5. 3D Scope — Phased Approach

### Phase 0: 2D Polish & Battle UX (no new 3D)

**Goal**: Make the existing app feel better before adding scope.

- [ ] Replace `alert()` in recruitment with an animated modal + 3D reveal
- [ ] Move battle action buttons ("Run Round", "Retreat") into a fixed bottom bar within thumb reach
- [ ] Add screen shake (CSS transform on `.main-content`) on critical hits
- [ ] Add elemental particle burst on mask power activation (CSS or canvas 2D overlay)
- [ ] Improve damage popup with size scaling by damage magnitude, crit styling
- [ ] Add a brief "wave transition" animation between waves (fade or wipe)
- [ ] Add haptic feedback (`navigator.vibrate`) on hits and rewards
- [ ] Style the battle outcome screen — animated loot cards, exp bar fill

### Phase 1: Persistent Canvas & Battle Enhancement

**Goal**: The canvas is always visible; battle 3D gets meaningfully better.

- [ ] `#canvas-mount` becomes always-on at `z-index: -1` with a simple default backdrop (dark gradient with subtle floating particles — "void of Mata Nui")
- [ ] Per-route backdrop: simple colored lighting shifts + particle density changes (no new geometry yet)
- [ ] **Battle camera work**: On attack, camera briefly tightens on the attacker/target pair (orthographic zoom shift + position lerp over ~300ms, then restore). This connects the 3D animation to the damage popup.
- [ ] **Hit impact effects**: Simple instanced particle burst at the target's position on Hit animation. Particle color = attacker's element.
- [ ] **Defeat effect**: Target model plays Defeat clip + fades to silhouette + dissolves (opacity tween on the mesh material).
- [ ] Battle HP bars move from 2D cards to **floating world-space HP bars** above each combatant (drei `<Html>` or `<Billboard>` with a DOM HP bar). Cards become a compact sidebar/bottom strip.

### Phase 2: Environmental Backdrops

**Goal**: Each major route feels like a different location.

- [ ] **Island overview** (Quests): Low-poly Mata Nui island (single mesh, baked AO texture, < 2k tris). Camera orbits slowly. Quest markers as glowing points on the island. Clicking a marker scrolls the DOM to that quest.
- [ ] **Village** (Characters): Ground plane with 2–3 hut props. Recruited characters stand in a row with idle animations. Tapping a character in the DOM grid triggers a camera fly-to.
- [ ] **Shrine** (Recruitment): Dramatic pedestal with volumetric-style light cone (spotlight + fog plane). Character rotates on the pedestal. On recruit, light flares, particles burst.
- [ ] **Arena environment**: Replace the current flat `circleGeometry` ground with a simple arena mesh (the `arena.glb` that's already preloaded but unused). Add ambient dust particles.

### Phase 3: Advanced Feedback & Polish

**Goal**: Combat is a visual spectacle; the idle loop has ambient life.

- [ ] **Mask power VFX**: Per-element shader effects (fire: heat distortion + embers; ice: frost overlay + snowflakes; etc.) using `@react-three/postprocessing` custom effects or instanced particles.
- [ ] **Idle ambient activity**: On the Characters page, assigned characters show job-specific idle loops (mining = pickaxe swing; guarding = stance shift). Protodermis particles drift from workers to a pile.
- [ ] **Battle entry transition**: Camera swoops from the current backdrop into the arena. On victory, camera pulls back out.
- [ ] **Loot drop**: Defeated enemies drop a glowing krana/kraata model that floats toward the camera before the 2D reward card appears.
- [ ] **Day/night cycle**: Backdrop lighting shifts over real time or quest-progress milestones. Dawn = early game, dusk = late game. Purely cosmetic.

### Phase 4+ (Stretch / Future)

- Explorable island map (tap-to-navigate, quest zones)
- Character housing / customization
- Multiplayer arena spectating (WebRTC or WebSocket peer)
- Full skeletal animation pipeline with Mixamo retargeting

---

## 6. Performance Budget & Patterns

### Target device

**Baseline**: Snapdragon 6-series / Apple A13 (iPhone 11) — a ~3-year-old midrange phone in 2026. This gives roughly:

- **GPU**: ~150–200 GFLOPS, shared memory, thermal throttling after 30s of sustained load
- **WebGL 2** context with `EXT_color_buffer_float`, limited to 4096px max texture
- **RAM**: 4–6 GB total, browser tab gets ~500 MB–1 GB

### Budget per frame (target: 30 fps idle, 60 fps interaction)

| Resource | Budget | Notes |
|----------|--------|-------|
| **Draw calls** | ≤ 50 | Merge static geometry. Use instancing for particles. drei `<Instances>` for repeated props |
| **Triangle count** | ≤ 100k visible | Current Toa models are ~5–15k each. 6 combatants + arena + backdrop ≈ 80k. Backdrops should be < 5k |
| **Textures** | ≤ 32 MB VRAM | Shared atlas per character set. Backdrop textures 512x512 max. Use `THREE.CompressedTexture` (KTX2/basis) when possible |
| **Postprocessing** | 1 pass max on mobile | SSAO is expensive — gate behind a "quality" setting or disable on mobile. Bloom is cheaper with the `resolutionScale: 0.5` pattern already used |
| **Canvas resolution** | `dpr` capped at 1.5 | drei `<AdaptiveDpr>` or manual `gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` |
| **JS frame time** | ≤ 4ms | Avoid allocations in `useFrame`. No `new Vector3()` per frame — reuse with `.set()` |
| **DOM nodes** | ≤ 500 visible | React re-renders during battle should only touch the changed card. Use `React.memo` on combatant cards |

### Patterns to adopt

| Pattern | How | Why |
|---------|-----|-----|
| **Offscreen culling** | `<group visible={isActiveRoute}>` — don't render backdrop geometry when a full-page modal is up | Saves GPU fill + vertex work |
| **LOD / progressive detail** | Backdrops load a 256x256 placeholder texture, swap to 1024x1024 once loaded (`useTexture` + Suspense) | Fast first paint |
| **Instanced particles** | `drei <Instances>` or raw `THREE.InstancedMesh` for dust/sparks/protodermis | 1 draw call for hundreds of particles |
| **Shared materials** | Create materials once in a `<MaterialProvider>`, reference by name | Reduces GPU state changes |
| **Frame loop gating** | `useFrame` callbacks check `visible` or `shouldAnimate` flag; return early if offscreen or reduced-motion | Saves CPU |
| **Adaptive quality** | Measure FPS over 60 frames. If < 24 avg, disable postprocessing, lower DPR, simplify backdrop | Graceful degradation on weak devices |
| **Preloading** | Continue current pattern: `useGLTF.preload` for models on routes the player will visit next. Prefetch arena when player opens battle selector, not on app boot | Reduces initial load time |

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

| Technique | Effort | Impact | Details |
|-----------|--------|--------|---------|
| **Procedural idle variation** | Low | Medium | Add subtle `useFrame` sin-wave bob (Y position, ±0.02 units, period 2–4s) and slight rotation oscillation (Y axis, ±2°). Apply to all models as a wrapper `<IdleBob>` component. Breaks the "frozen statue" look even without animation clips. |
| **Shared hit-reaction** | Low | High | Instead of requiring a per-model "Hit" clip, create a procedural hit: brief scale pulse (1.0 → 1.1 → 1.0 over 150ms) + backward translation (Z ±0.05 over 100ms). Can be in `CombatantModel` without touching the child model. |
| **Stagger timing** | Low | Medium | Offset idle animation start times by combatant index × 0.5s so characters don't breathe in sync. |
| **Shared rigs** | Medium | High | All Toa Mata share one rig, all Toa Nuva share one rig, Bohrok share one rig. Author animation clips on the master rig, apply to all characters in that set via `mixer.clipAction(clip)`. Reduces animation authoring from 14 unique sets to ~4. |
| **Fewer bones** | Medium | Medium | Backprop models (village idle characters) can use a 6-bone rig (root, spine, head, 2 arms, hips). Only battle models need full rigs. |
| **Sprite animation for far characters** | Low | High | For the island/village backdrop, characters beyond a certain distance from camera render as animated billboards (2–4 frame sprite sheets) instead of full 3D models. `drei <Billboard>` + `<Sprite>`. |
| **Particle systems for VFX** | Medium | Very High | Elemental effects (fire, ice, stone, earth, water, air) as instanced particle emitters. One `InstancedMesh` of quads with a shared texture atlas (4 textures: circle, spark, snowflake, dust). Color + speed + gravity per element. |

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

| Concern | Guideline |
|---------|-----------|
| **Thumb reach** | Primary action buttons (Run Round, Recruit, Start Quest) must be in the bottom 40% of viewport height. Current "Run Round" is mid-screen — needs to move down. |
| **Safe areas** | Use `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` in CSS. The nav is already 24px from bottom; add `+ env(safe-area-inset-bottom)` for iPhone home indicator. |
| **Text size** | Minimum 14px for body text, 12px for secondary labels. Current `0.7rem` nav labels (~11.2px) are borderline — consider bumping to `0.75rem`. |
| **Touch targets** | Minimum 44x44px for all interactive elements (WCAG 2.5.8). Current nav items are fine (64px tall); check quest/battle card buttons. |
| **3D interaction** | Do not require precision taps on 3D models for gameplay-critical actions. 3D is for viewing; DOM handles interaction. `PresentationControls` for spin/zoom is fine (exploration, not action). |
| **When 3D should recede** | Modals, full-page settings, privacy policy, quest tree diagram: dim/blur the canvas or set `visible={false}` on backdrop group. Prevents visual competition with dense text/UI. |
| **Scroll behavior** | Vertical scroll only. No horizontal swipe navigation (conflicts with system back gesture on Android and iOS edge swipe). Horizontal scroll rows (existing roster scroll) are fine as explicit carousels. |
| **Orientation lock** | Consider adding `<meta name="screen-orientation" content="portrait">` and `screen.orientation.lock('portrait')` (progressive enhancement — fails silently on desktop). Landscape layout can remain as a secondary mode. |
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

## 9. Concrete Next Steps

### Prototype sprint (Phase 0 — immediate)

These changes are self-contained, low-risk, and immediately improve feel:

1. **Recruitment celebration** — Replace `alert()` with an animated modal showing the character's 3D model with a burst of element-colored particles and a "Welcome, Tahu!" message.

2. **Battle button repositioning** — Move "Run Round" / "Next Wave" / "Retreat" into a fixed bottom bar (`position: fixed; bottom: calc(24px + 64px + env(safe-area-inset-bottom))`), above the nav. Ensure buttons are ≥ 44px tall.

3. **Hit feedback juice** — Add CSS `@keyframes shake` on `.main-content` triggered via a class toggle on critical hits. Add a brief `navigator.vibrate(50)` on damage dealt. Scale damage popup font size by `min(1 + damage/maxHp, 2)` for proportional feedback.

4. **Wave transition** — On wave clear, brief 400ms CSS fade-to-black-and-back on `.battle-arena` before next wave spawns.

5. **Outcome screen polish** — Animate reward items appearing one by one (staggered `motion.div` with spring physics). Show exp gain as an animated bar fill.

### First 3D expansion (Phase 1)

6. **Always-on canvas** — Change `#canvas-mount` CSS to `display: block` always, `z-index: -1`, full viewport. Create a `<DefaultBackdrop>` component: dark void + 20 instanced floating particles (small glowing cubes, slow random drift). Set as fallback when no route-specific scene is active.

7. **Battle camera emphasis** — In `ArenaFraming`, add a transient zoom-in on the attacker/target during `playAnimation('Attack')`. Use a `useSpring` (drei) or manual lerp in `useFrame` to smoothly shift camera position toward the action, then restore. ~300ms in, ~200ms out.

8. **World-space HP** — Add `<Html>` from drei above each `CombatantModel` position with a mini HP bar component. Keep the 2D card HP bars for detailed info, but now the player can read combat from the 3D view alone.

9. **Hit particles** — On `playAnimation('Hit')`, spawn a burst of 8–12 instanced quads at the target's world position, colored by the attacker's element. Quads expand outward + fade over 400ms, then dispose. Use a shared `InstancedMesh` pool (max 64 particles) to avoid allocation.

### Metrics to track

| Metric | Tool | Target |
|--------|------|--------|
| FPS (P50, P10) | `r3f-perf` + custom logging | ≥ 30 fps P10 on baseline device |
| JS heap | `performance.measureUserAgentSpecificMemory()` | ≤ 150 MB after 10 min play |
| GLB load time | `PerformanceObserver` resource timing | ≤ 2s P90 on 4G (cached: ≤ 100ms) |
| First Contentful Paint | Lighthouse | ≤ 2.5s |
| Time to Interactive | Lighthouse | ≤ 4s |
| Canvas GPU time | `EXT_disjoint_timer_query_webgl2` (where available) | ≤ 8ms/frame |
| Player engagement | Session length, battles per session, return rate | Qualitative: "does it feel better?" |

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
