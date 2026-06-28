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
  glbUrl: import.meta.env.BASE_URL + '/arena_desert.glb',
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

- **Mesh:** `public/arena_desert.glb` — BlenderKit low-poly canyon + baked sand ground.
- **Decor:** three giant **Kanohi monuments** framing the canyon (`KanohiMonument`), reusing character meshes — a `kit_2001.glb` `McToranFace` head carved in sandstone, wearing a Kanohi from `masks.glb`, on a stone plinth with a tribe accent band.
- **Sky:** a blue sky dome (`ArenaSky`); the camera aims up slightly (`lookAtHeight`) so the sky reads above the canyon rim.
- **Atmosphere:** warm fog, quarry HDRI (IBL only), warm key light (low ambient so shadows read).
- **Recolorable:** yes (per element tribe) — `ArenaRecolor.blend` blends the canyon, ground, **and sky/horizon** toward the biome color for dramatic restyles (e.g. **Ice → snowy mountain**, **Fire → volcano**). Recolor applies to both PBR and unlit (`KHR_materials_unlit`) materials.

### Mangaia (`mangaia`)

- **Mesh:** fully procedural (`CavernArena`): a backside-culled enclosure sphere (`ArenaSky` — the camera only sees the inside), inlaid floor combat stage, and — set back in the **upper-left as a backdrop prop** so it never interferes with combatants — a domed shrine ("Kini") with a descending **green energy beam**, glowing **radial floor segments** fanning out from its base, and glowing ceiling veins.
- **Atmosphere:** night-time (`ambientIntensity 0.45`), dark green fog, a cool directional fill so fighters stay readable.
- Represents the tunnels beneath Mata Nui (inside the Great Spirit Robot).

### Metru Nui — daytime (`metru`) and underground (`metru_archives`)

The Metru Nui biome ships in **both lighting modes** from one shared palette (`METRU_BASE`, cyan beam / silver dome / blue-grey tech stone):

- **`metru`** (`lighting: 'daylight'`) — a bright, open daytime biome: overhead skylight, airy haze, lit ceiling.
- **`metru_archives`** (`lighting: 'underground'`) — the same biome deep underground: dark, fogged, no sky, cool fill light.

Any cavern biome can be authored once and rendered either way.

### Cavern lighting / time-of-day (`CavernPalette`)

`lighting: 'underground' | 'daylight'` is the primary knob; the rest override the per-mode defaults. Both modes use `ArenaSky` as a backside enclosure sphere — a blue sky in daylight, a dark interior underground.

| Field              | Effect                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `lighting`         | `'underground'` (dark, fogged, no sky) or `'daylight'` (open, skylit). Default `'underground'` |
| `ambientIntensity` | Override base brightness (defaults: day `0.85`, underground `0.42`)                            |
| `skyLight`         | Override the overhead hemisphere used in daylight                                              |
| `fogRange`         | `[near, far]` (defaults: day `[9,34]`, underground `[5,18]`)                                   |
| `anchor`           | `[x,y,z]` backdrop position of the dome + beam                                                 |

Current data mapping: single Bohrok-Kal fights → daytime `metru`; the climactic trio/final (fought in the nest) → underground `metru_archives`.

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
- [x] Desert arena GLB rendering (`arena_desert.glb`) with markers hidden
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

- [ ] Compress / optimize `arena_desert.glb` textures further for production
- [ ] Remove layout markers from the Blender export once positions are finalized
- [ ] Battle selector arena preview ([#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346))
- [ ] E2E visual regression for battle arenas (optional)

### CI notes

- Arena GLBs are **not mounted during team prep** (`BattlePhase.Preparing`) so E2E team selection stays responsive.
- Character model screenshot tests inherit Playwright's global `expect.timeout` (30s in CI); do not override with a lower per-test timeout.

---

## References

- [`docs/UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md) — hybrid diorama strategy, Phase 2 arena mesh
- [`ARCHITECTURE_ROADMAP.md`](../ARCHITECTURE_ROADMAP.md) — issue index
- [`AGENT_GUIDELINES.md`](../AGENT_GUIDELINES.md) — single canvas portal rules
