# Battle Arena Environments

Technical reference for 3D battle arena meshes, atmosphere, and the per-arena definition system.

**Tracking:** [#366](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/366). Related: [#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346) (Phase 2 environmental backdrops), [#343](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/343) (persistent canvas / battle 3D polish).

**Implementation PR:** [#365](https://github.com/PedroLimaSilva/BionicleIdleRPG/pull/365)

---

## Overview

Battle arenas are **authored in Blender**, exported as GLB, and rendered behind the combat HUD. Each arena is a self-contained unit: mesh asset + atmosphere (fog, HDRI image-based lighting, lights) + optional layout markers hidden at runtime.

This replaces the earlier procedural blockout (code-generated ground disc, canyon planes, rim rocks).

```
Arena.tsx
  └── ArenaEnvironment (arenaId)
        ├── Atmosphere   ← per-arena: fog, HDRI, lights
        └── ArenaGlbScene ← loads glbUrl, hides layout markers
```

---

## Directory layout

```
src/pages/Battle/
├── Arena.tsx                 # combatants, camera, shadow pass on fighters
├── ArenaEnvironment.tsx      # selects arena definition, renders atmosphere + GLB
├── arenaLayout.ts            # shared camera framing + spawn slots (all arenas today)
└── arenas/
    ├── types.ts              # ArenaDefinition, ArenaId
    ├── registry.ts           # getArenaDefinition(), DEFAULT_ARENA_ID
    ├── ArenaGlbScene.tsx     # generic GLB loader
    ├── arenaGlbUtils.ts      # marker hiding, shadow prep
    ├── shared/
    │   └── ArenaHdriIbl.tsx  # HDRI without visible skybox
    └── desert/
        ├── desertArena.ts           # glbUrl + Atmosphere registration
        └── DesertArenaAtmosphere.tsx # Po-Wahi fog, quarry HDRI, desert lights
```

---

## Arena definition pattern

Each arena exports an `ArenaDefinition`:

```ts
export const desertArena: ArenaDefinition = {
  Atmosphere: DesertArenaAtmosphere,
  glbUrl: import.meta.env.BASE_URL + '/arena_blockout.glb',
  id: 'desert',
};
```

| Field | Purpose |
|-------|---------|
| `id` | Registry key (`ArenaId`) |
| `glbUrl` | Path to authored GLB in `public/` |
| `Atmosphere` | React component owning fog, `<Environment>`, and lights for this biome |

`ArenaEnvironment` resolves the definition and renders both parts:

```tsx
<Atmosphere castShadow={receiveShadow} />
<ArenaGlbScene glbUrl={glbUrl} receiveShadow={receiveShadow} />
```

### Adding a new arena (e.g. Mangaia)

1. Export `public/mangaia_arena.glb` from Blender.
2. Create `arenas/mangaia/MangaiaArenaAtmosphere.tsx` (fog color, HDRI, lighting).
3. Create `arenas/mangaia/mangaiaArena.ts` with `glbUrl` and `Atmosphere`.
4. Add `'mangaia'` to `ArenaId` in `types.ts` and register in `registry.ts`.
5. Pass `arenaId="mangaia"` from battle flow when that encounter type is selected.
6. Run `yarn compress public/mangaia_arena.glb` before committing.

---

## Blender workflow (desert arena)

**Runtime asset:** `public/arena_blockout.glb`

### Export checklist

- **Units:** 1 Blender unit = 1 world unit.
- **Origin:** arena center at `(0, 0, 0)`.
- **Coordinate system:** Y-up, apply transforms before export.
- **Layout markers:** optional in the export for Blender reference; hidden in-game (see below).
- **Post-export:** `yarn compress public/arena_blockout.glb`

### Layout markers (hidden at runtime)

These may remain in the GLB for modeling reference. `arenaGlbUtils.ts` sets `visible = false` on:

| Pattern | Examples |
|---------|----------|
| Object names | `ArenaBoundary`, `TeamSlotMarker0`, `EnemySlotMarker2` |
| Material names | `Places`, `Material_3`–`Material_9` |

Combat spawn positions are still defined in code (`arenaLayout.ts`) until per-arena layouts are added.

---

## Atmosphere (desert)

Defined in `arenas/desert/DesertArenaAtmosphere.tsx`:

| Element | Current value |
|---------|---------------|
| Fog | `#e8c992`, near `2.5`, far `9` |
| HDRI | `public/hdri/quarry_01_1k.hdr` (Poly Haven CC0), intensity `0.55` |
| Skybox | Off — HDRI used for IBL only (`ArenaHdriIbl`) |
| Key light | Warm directional `@ [2.8, 4.5, 2.2]`, targets `ARENA_CENTER` |
| Fill | Hemisphere + cool rim directional |

Atmosphere is **not** shared across arenas — each biome owns its own component.

---

## Shadows

When shadows are enabled in settings:

- **Arena meshes** (e.g. sand dunes): `receiveShadow` and `castShadow` (set in `prepareArenaGlbScene`).
- **Layout markers:** skipped.
- **Combatants:** `castShadow` + `receiveShadow` via `Arena.tsx` shadow pass.

Shadows are disabled in E2E test mode (`shouldEnableShadows()`).

**Known limitation:** directional shadow camera is sized for the ~3-unit combat stage (`±3`). Large arena geometry may clip shadows at the edges — widen frustum per arena if needed.

---

## Camera and spawn layout

`arenaLayout.ts` holds values shared across arenas today:

| Constant | Value | Used by |
|----------|-------|---------|
| `ARENA_BOX_SIZE` | `3` | `ArenaFraming` FOV |
| `ARENA_CENTER` | `[0, 0, 0]` | camera look-at, sun target |
| `TEAM_POSITIONS` | 3 slots at +Z | combatant placement |
| `ENEMY_POSITIONS` | 3 slots at −Z | combatant placement |

Future work: move layout into each `ArenaDefinition` when biomes need different spawn geometry.

---

## Performance notes

- Desert arena GLB is ~2 MB uncompressed; run `yarn compress` for Draco.
- CI reports GLB size diffs on PRs (`.github/workflows/glb-sizes.yml`).
- Budget from `docs/UI_UX_STRATEGY.md`: ≤100k visible tris total in battle; arena backdrop <5k tris ideal (current desert export may exceed — optimize in Blender as art iterates).

---

## Progress

### Done (PR #365)

- [x] Registry-based arena definitions (`arenas/`)
- [x] Desert arena GLB rendering (`arena_blockout.glb`)
- [x] Per-arena atmosphere encapsulation (fog, HDRI, lighting)
- [x] Layout marker hiding at runtime
- [x] Removed procedural blockout / reference generator
- [x] HDRI IBL without visible skybox
- [x] Unit tests for marker detection (`arenaGlbUtils.spec.ts`)

### Remaining

- [ ] Select `arenaId` per encounter / wave (not hardcoded to `desert`)
- [ ] Per-arena camera framing and spawn slots
- [ ] Widen shadow frustum for large arena meshes
- [ ] Compress `arena_blockout.glb` for production
- [ ] Remove layout markers from Blender export once positions are finalized
- [ ] Additional biomes (Mangaia, etc.)
- [ ] Battle selector arena preview ([#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346))
- [ ] E2E visual regression for battle arena (optional)

---

## References

- [`docs/UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md) — hybrid diorama strategy, Phase 2 arena mesh
- [`ARCHITECTURE_ROADMAP.md`](../ARCHITECTURE_ROADMAP.md) — issue index
- [`AGENT_GUIDELINES.md`](../AGENT_GUIDELINES.md) — single canvas portal rules
