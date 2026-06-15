# Battle Arena Environments

Technical reference for 3D battle arena meshes, atmosphere, decor, recolor, and the per-arena definition system.

**Tracking:** [#366](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/366). Related: [#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346) (Phase 2 environmental backdrops), [#343](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/343) (persistent canvas / battle 3D polish).

**Implementation PR:** [#365](https://github.com/PedroLimaSilva/BionicleIdleRPG/pull/365)

---

## Overview

Battle arenas are **self-contained biomes** rendered behind the combat HUD. Each arena is a unit of:

- an optional authored **GLB** mesh (e.g. the desert canyon),
- optional **procedural decor** composed in code (`Scene`) — e.g. reused Kanohi mask monuments, or a cavern dome + energy beam,
- a paired **atmosphere** (fog, optional HDRI image-based lighting, lights),
- a **layout** (camera framing + combat spawn slots),
- an optional **recolor** mapping so one biome can represent different element tribes.

```
Arena.tsx (resolves arenaId + tribe)
  └── ArenaEnvironment (arenaId, recolor)
        ├── Atmosphere    ← per-arena: fog, HDRI, lights
        ├── ArenaGlbScene ← loads glbUrl, hides markers, applies recolor (optional)
        └── Scene         ← procedural decor (optional)
```

---

## Directory layout

```
src/pages/Battle/
├── Arena.tsx                 # combatants, camera, shadow pass; resolves arena + recolor
├── ArenaEnvironment.tsx      # renders atmosphere + optional GLB + optional Scene
├── arenaLayout.ts            # DEFAULT_ARENA_LAYOUT + shared spawn constants
└── arenas/
    ├── types.ts              # ArenaDefinition, ArenaLayout, ArenaRecolor, ArenaId
    ├── registry.ts           # getArenaDefinition(), getArenaIds(), DEFAULT_ARENA_ID
    ├── ArenaGlbScene.tsx     # generic GLB loader (recolor-aware)
    ├── arenaGlbUtils.ts      # marker hiding, shadow prep, recolor application
    ├── arenaRecolor.ts       # element-tribe palettes + material recolor
    ├── shared/
    │   ├── ArenaHdriIbl.tsx  # HDRI without visible skybox
    │   ├── KanohiMonument.tsx# giant carved Kanohi statue reusing masks.glb
    │   └── CavernArena.tsx   # parametric underground cavern (scene + atmosphere)
    ├── desert/               # GLB canyon + Kanohi monuments, recolorable
    ├── mangaia/              # green organic cavern (under Mata Nui)
    └── metru/                # cyan technological cavern (Metru Nui variant)
```

Encounter → arena mapping is pure and lives in `src/game/arena.ts`.

---

## Arena definition pattern

Each arena exports an `ArenaDefinition`:

```ts
export const desertArena: ArenaDefinition = {
  id: 'desert',
  glbUrl: import.meta.env.BASE_URL + '/arena_blockout.glb',
  Atmosphere: DesertArenaAtmosphere,
  Scene: DesertArenaScene, // optional procedural decor
  layout: DEFAULT_ARENA_LAYOUT,
  recolorForTribe: getTribeRecolor, // optional element-tribe variations
};
```

| Field             | Purpose                                                                   |
| ----------------- | ------------------------------------------------------------------------- |
| `id`              | Registry key (`ArenaId`, defined in `src/types/Arena.ts`)                 |
| `glbUrl`          | Optional path to an authored GLB in `public/` (procedural arenas omit it) |
| `Atmosphere`      | Component owning fog, `<Environment>`, and lights for this biome          |
| `Scene`           | Optional component composing procedural decor / props                     |
| `layout`          | Camera framing + team/enemy spawn slots (`ArenaLayout`)                   |
| `recolorForTribe` | Optional map from `ElementTribe` to an `ArenaRecolor`                     |

### Adding a new arena

1. (Optional) Export `public/<arena>.glb` from Blender, then `yarn compress public/<arena>.glb`.
2. Create `arenas/<arena>/` with an `Atmosphere`, optional `Scene`, and the `ArenaDefinition`.
3. Add the id to `ArenaId` in `src/types/Arena.ts` and register it in `registry.ts`.
4. Tag encounters with `arenaId: '<arena>'` in `src/data/combat.ts` (or rely on the desert default).

That is the entire surface — no other code changes are required.

---

## Per-encounter selection

`EnemyEncounter.arenaId?: ArenaId` (in `src/types/Combat.ts`) selects the biome per encounter. `Battle/index.tsx` resolves it via `src/game/arena.ts`:

| Helper                           | Behavior                                            |
| -------------------------------- | --------------------------------------------------- |
| `getEncounterArenaId(encounter)` | `encounter.arenaId` or `'desert'`                   |
| `getEncounterTribe(encounter)`   | `COMBATANT_DEX[headliner].element` (drives recolor) |

Current data mapping: Rahkshi encounters → `mangaia`; Bohrok-Kal encounters → `metru`; everything else → desert.

---

## Element-tribe recolor

`arenaRecolor.ts` defines a light **diffuse tint** + saturated **accent** color per `ElementTribe`. `applyArenaRecolor`:

- multiplies the diffuse tint into non-accent materials (so a sand canyon still reads as a canyon while shifting hue),
- sets the accent color + emissive on materials named `glow`/`accent`/`emiss`/`lava`,
- clones materials first, so the cached/shared GLB and other arenas are never mutated.

The desert arena opts in via `recolorForTribe: getTribeRecolor`. The tint flows into the GLB (`ArenaGlbScene`), the monuments' accent bands (`DesertArenaScene`), and the fog (`DesertArenaAtmosphere`). Fighting a Fire tribe warms the canyon to orange; a Water tribe cools it to blue, etc.

---

## Biomes

### Desert (`desert`)

- **Mesh:** `public/arena_blockout.glb` — BlenderKit low-poly canyon + baked sand ground.
- **Decor:** two giant carved **Kanohi monuments** flanking the stage, reusing `Hau`/`Pakari` meshes from `masks.glb` on stone pedestals with tribe-colored accent bands (`KanohiMonument`).
- **Atmosphere:** warm fog `#e8c992`, quarry HDRI (IBL only), warm key light + cool fill.
- **Recolorable:** yes (per element tribe).

### Mangaia (`mangaia`)

- **Mesh:** fully procedural (`CavernArena`): dark stone enclosure, inlaid floor platform, central **golden dome**, descending **green energy beam**, glowing ceiling veins.
- **Atmosphere:** dark green fog, very low ambient, green/gold point lights.
- Represents the tunnels beneath Mata Nui (inside the Great Spirit Robot).

### Metru Nui (`metru`)

- Same `CavernArena` framework, recast with a **cold/technological palette** (cyan beam, silver dome, blue-grey stone) — demonstrating cavern reuse across biomes.

---

## Layout markers (hidden at runtime)

Optional Blender reference markers remain in the GLB. `arenaGlbUtils.ts` sets `visible = false` on:

| Pattern        | Examples                                               |
| -------------- | ------------------------------------------------------ |
| Object names   | `ArenaBoundary`, `TeamSlotMarker0`, `EnemySlotMarker2` |
| Material names | `Places`, `Material_3`–`Material_9`                    |

The desert canyon (`3DModel_LowPoly`) and ground (`Ground.001_baked.001`) are kept visible.

---

## Camera and spawn layout

`ArenaLayout` lives on each `ArenaDefinition`; `DEFAULT_ARENA_LAYOUT` (in `arenaLayout.ts`) is shared by arenas without bespoke geometry.

| Field                                | Purpose                                          |
| ------------------------------------ | ------------------------------------------------ |
| `boxSize`                            | Stage diameter for `ArenaFraming` FOV            |
| `center`                             | Camera look-at + sun target                      |
| `team` / `enemy`                     | Combatant spawn slots                            |
| `cameraPortrait` / `cameraLandscape` | Base camera offset (× `boxSize`) per orientation |

The cavern arenas raise/pull back the camera so the beam and dome read as the focal point.

---

## Shadows

When shadows are enabled in settings:

- **Arena meshes:** `receiveShadow` + `castShadow` (set in `prepareArenaGlbScene`).
- **Layout markers / particles:** skipped (`shouldSkipArenaShadow`).
- **Combatants:** shadow pass in `Arena.tsx`.

The directional shadow frustum is widened to `±6` (was `±3`) so the monuments and larger arena geometry are covered. Shadows are disabled in E2E test mode (`shouldEnableShadows()`).

---

## Performance notes

- Procedural arenas add only a handful of primitive meshes + one reused mask mesh.
- Desert GLB is Draco-compressed; run `yarn compress` after re-exporting from Blender.
- CI reports GLB size diffs on PRs (`.github/workflows/glb-sizes.yml`).
- Budget from `docs/UI_UX_STRATEGY.md`: ≤100k visible tris total in battle.

---

## Progress

### Done

- [x] Registry-based arena definitions (`arenas/`)
- [x] Desert arena GLB rendering (`arena_blockout.glb`) with markers hidden
- [x] Per-arena atmosphere encapsulation (fog, HDRI, lighting)
- [x] HDRI IBL without visible skybox
- [x] Per-arena camera framing + spawn slots (`ArenaLayout`)
- [x] `arenaId` selected per encounter (`src/game/arena.ts`)
- [x] Element-tribe recolor (diffuse/emissive) for the desert
- [x] Desert Kanohi monuments reusing `masks.glb`
- [x] Mangaia cavern (dome + energy beam) and Metru Nui variation
- [x] Widened directional shadow frustum
- [x] Unit tests (markers, recolor, encounter→arena resolution)

### Remaining

- [ ] Compress / optimize `arena_blockout.glb` textures further for production
- [ ] Remove layout markers from the Blender export once positions are finalized
- [ ] Battle selector arena preview ([#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346))
- [ ] E2E visual regression for battle arenas (optional)

---

## References

- [`docs/UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md) — hybrid diorama strategy, Phase 2 arena mesh
- [`ARCHITECTURE_ROADMAP.md`](../ARCHITECTURE_ROADMAP.md) — issue index
- [`AGENT_GUIDELINES.md`](../AGENT_GUIDELINES.md) — single canvas portal rules
