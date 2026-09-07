# 3D performance inspection

**Tracking:** draw-call budget in [`UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md) (≤ 50 draw calls in battle).

**Strategy:** phased draw-call reductions (battle LOD, instancing, kit geometry merge) are documented in [`3D_RENDERING_STRATEGY.md`](3D_RENDERING_STRATEGY.md).

## In-game overlay

Enable **Settings → 3D Performance Monitor**.

| Backend                                  | Overlay                                                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **WebGL** (Playwright / WebGPU fallback) | [`r3f-perf`](https://github.com/utsuboco/r3f-perf) panel (top-left)                                                   |
| **WebGPU** (default on supported Chrome) | Custom HUD (`ScenePerfOverlay`) showing smoothed FPS, frame time, and `renderer.info` draw/triangle/point/line counts |

The WebGPU path uses `WebGPURenderer.info`, which r3f-perf does not read. `PerfOverlay` in `src/rendering/3d/Canvas.tsx` picks the overlay by backend (`isWebGLBackend`).

### Reading the HUD

- **draw** — per-frame `info.render.drawCalls` (meshes submitted this frame). Read after render each frame.
- **tris** — shaded triangles after clipping (approximate; post-processing passes add their own draws).
- **fps / ms** — exponentially smoothed over the last ~10 frames.

Toggle off before capture/screenshots; the overlay is hidden in Playwright test mode (`isTestMode()`).

## Browser DevTools

Useful when the in-game HUD is not enough:

1. **Chrome Performance** — Record a timeline while fighting. Inspect main-thread vs GPU, long tasks, and frame drops. Works for both WebGL and WebGPU.
2. **Chrome Rendering → Frame Rendering Stats** — Live FPS and layer count (no draw-call breakdown).
3. **Spector.js** — WebGL-only capture; not available on the WebGPU backend.

## Three.js `renderer.info`

From the browser console on a page with the 3D canvas mounted:

```js
const canvas = document.querySelector('canvas.shared-canvas');
// R3F stores the renderer on the canvas fiber root; easier via the overlay toggle.
```

With the performance monitor enabled, the overlay already surfaces `info.render` each frame.

## WebGPU inspector

For shader/pipeline debugging (not draw-call budgeting):

- Chrome **WebGPU Developer Features** (chrome://flags) + **Three.js DevTools** when available.
- Compare against WebGL fallback by forcing test mode or temporarily setting `forceWebGL: true` in `createSceneWebGPURenderer` during local experiments.

## Character sheet console log

When a `CharacterScene` mounts and kit attachments finish, the browser console logs once per character load:

```text
[character:Toa_Tahu] render cost: +142 draws (+38 materials, +49,000 tris) — draws 6 → 148
```

**Draws** are estimated from the character subtree (one per mesh material slot) — stable across refresh rates. The **+142** is the character's contribution over the empty rig baseline. Re-logs when switching characters or when kit colors change. Disabled in Playwright test mode.

Use this log to compare characters before and after rendering optimizations (see [`3D_RENDERING_STRATEGY.md`](3D_RENDERING_STRATEGY.md)).

### Example baselines (Tahu Mata, scene-graph)

| Build             | Log fragment                                              |
| ----------------- | --------------------------------------------------------- |
| Master            | `+82 draws (+29 materials, +120,343 tris) — draws 0 → 82` |
| Phase B kit merge | `+74 draws (+29 materials, +120,343 tris) — draws 0 → 74` |

## Related code

| File                                       | Role                                      |
| ------------------------------------------ | ----------------------------------------- |
| `src/rendering/3d/Canvas.tsx`              | Perf overlay routing                      |
| `src/rendering/3d/ScenePerfOverlay.tsx`    | WebGPU-compatible HUD                     |
| `src/rendering/3d/SceneDrawCallLogger.tsx` | One-shot character sheet render-cost log  |
| `src/rendering/3d/sceneDrawCallStats.ts`   | Scene-graph + frame stat helpers          |
| `src/persistence/gamePersistence.ts`       | `PERFORMANCE_MONITOR_ENABLED` persistence |
| `docs/3D_RENDERING_STRATEGY.md`            | Phased draw-call reduction plan           |
| `docs/battle-lod/RAHKSHI.md`               | Rahkshi battle LOD authoring (pilot)      |
| `docs/battle-lod/TAHU_MATA.md`             | Toa Tahu battle LOD authoring             |
