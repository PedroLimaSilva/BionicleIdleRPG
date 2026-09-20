# 3D rendering strategy

**Budget:** ≤ 50 draw calls per battle frame ([`UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md)).

Kit-based Toa builds currently land around **~80 draws per character** on the character sheet (e.g. Gali kit path). Six combatants at that cost cannot fit the battle budget. This document tracks the phased plan to cut draw calls without sacrificing dex fidelity.

## Problem

`useKitAttachments` clones one kit GLB subtree per socket (~50+ sockets on Mata Toa). Each clone may contain multiple meshes and per-slot materials. The shared `kit_2001.glb` library optimizes **asset reuse and authoring**, not **GPU submission count**.

Runtime geometry merge (Phase B) only batches meshes that already share a bone anchor, material instance, and render order — typically technic axles/pins on the same limb. Measured win on Tahu kit: **82 → 74 draws (~10%)**. Triangles and material count are unchanged.

## Phased plan

| Phase | What                                                                       | Where it applies                                  | Expected impact                                                                      |
| ----- | -------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **A** | Performance monitor + stable render-cost logger                            | Dev / character sheet                             | Baseline measurement ([`3D_PERFORMANCE.md`](3D_PERFORMANCE.md)) — **shipped** (#468) |
| **B** | Runtime `BufferGeometry` merge in `useKitAttachments`                      | Remaining kit-attached characters                 | Small incremental win (~10% draws); no asset re-export — **shipped**                 |
| **C** | **Skinned packed body** — one mesh set per rig; sheet vs battle is map res | Tahu + Kopaka Mata; rebuilt Matoran; Bohrok Swarm | Drop kit clones; later lower-res maps then lower-tri battle mesh                     |
| **D** | **InstancedMesh** for duplicate enemies                                    | Bohrok, Rahkshi, Vahki swarms                     | Compress N identical enemies toward 1 draw per breed × material group                |
| **E** | **Authoring** — merged Rahi GLBs (no kit sockets)                          | New Rahi creatures                                | Avoid clone overhead; merge small parts in Blender at export                         |

Phases B–E stack. B is necessary but not sufficient for the battle budget.

## Phase B — runtime kit geometry merge

See [`KIT_GEOMETRY_MERGE.md`](KIT_GEOMETRY_MERGE.md). Still applies to Mata Toa that kit-assemble (Gali, Lewa, …) and Rahkshi detailed LOD.

After materials are applied, rigid kit meshes sharing the same merge anchor bone, material instance, and render order are extracted, baked into anchor-local space, and merged with `BufferGeometryUtils.mergeGeometries`. Excluded: skinned meshes, multi-material meshes, transmissive brain gel, selective-bloom glow (MRT).

## Phase C — skinned packed body (Tahu Mata first)

### Principle

- **Character sheet / dex:** packed/skinned body (diminished and rebuilt Matoran, Tahu / Kopaka Mata, Bohrok Swarm). No kit attach.
- **Battle:** the **same mesh and skeleton** for now. LOD is **map resolution** (sheet maps; battle will bind lower-res copies when exported). After that, author a lower-tri battle mesh on the same armature.
- **Kanohi** still attach via `useMask` on `Masks`.

`CombatantModel` and `CharacterScene` both draw the skinned body. Rahkshi still kit-assembles on the sheet and toggles a merged battle LOD.

### Custom characters

Custom Toa on the Tahu rig share this packed body. Palette tinting uses the same `Battle_Body_*` slots.

### Authoring specs

| Rig                                  | Doc                                                              |
| ------------------------------------ | ---------------------------------------------------------------- |
| **Rahkshi** (kit sheet + battle LOD) | [`battle-lod/RAHKSHI.md`](battle-lod/RAHKSHI.md)                 |
| Toa Tahu (Mata) — packed skinned     | [`battle-lod/TAHU_MATA.md`](battle-lod/TAHU_MATA.md)             |
| Toa Kopaka (Mata) — skinned          | [`battle-lod/KOPAKA_MATA.md`](battle-lod/KOPAKA_MATA.md)         |
| Rebuilt Matoran — packed body        | [`battle-lod/REBUILT_MATORAN.md`](battle-lod/REBUILT_MATORAN.md) |
| Bohrok Swarm — packed chassis        | [`battle-lod/BOHROK.md`](battle-lod/BOHROK.md)                   |

Other Mata Toa still kit-assemble until they get a packed body. Reuse Tahu bucket names when they do.

## Phase D — enemy instancing

Good fit when geometry is identical and only **uniform color axes** change:

- **Bohrok** — packed swarm chassis + packed faceplate + per-breed shields; Krana tint. Kal still kit-assembles.
- **Rahkshi** — armor palette from Kraata type.
- **Vahki** — hive palette variants.

Use `InstancedMesh` (or `drei` `<Instances>`) per breed × material group with `instanceColor` or per-instance uniforms.

**Player Toa party:** usually six different rigs and palettes — instancing is not the primary lever; battle LOD (Phase C) is.

## Phase E — Rahi authoring

Follow the **Nui-Rama** pattern: self-contained GLB, merged sub-meshes in Blender, no kit sockets unless a part is genuinely shared technic. Battle and dex can share one asset early; add a battle LOD later only if needed.

## Measurement

| Tool                              | Use                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| Character sheet console log       | Stable scene-graph draws before/after each phase ([`3D_PERFORMANCE.md`](3D_PERFORMANCE.md)) |
| Settings → 3D Performance Monitor | Live FPS / `renderer.info` while fighting                                                   |
| `yarn test:ci`                    | `kitGeometryMerge.spec.ts` regression                                                       |

**Tahu kit baseline (historical):** `+82 draws (+29 materials, +120,343 tris)`.

**Tahu kit with Phase B merge (historical):** `+74 draws` (same materials/tris).

**Tahu packed skinned body:** ~8–9 draws (body + mask); sheet and combat share the mesh.

**Kopaka skinned body:** `Body` + transmissive `Brain` / `Sword` + mask; same mesh in sheet and combat.

**Rebuilt packed body:** `Body` + transmissive `Brain` + mask; character sheet only.

## Related code

| File                                          | Role                                           |
| --------------------------------------------- | ---------------------------------------------- |
| `src/rendering/3d/hooks/kitGeometryMerge.ts`  | Phase B merge pipeline                         |
| `src/rendering/3d/SceneCompileAsync.tsx`      | Yielding first-open TSL / pipeline compile     |
| `src/rendering/3d/kitMaterialBank.ts`         | CPU material instances for shipped LEGO colors |
| `src/rendering/3d/ShaderVariantBank.tsx`      | One-shot WebGPU compile of shared variants     |
| `src/rendering/3d/hooks/useKitAttachments.ts` | Kit clone + merge hook                         |
| `src/pages/Battle/CombatantModel.tsx`         | Battle model routing (Phase C branch point)    |
| `src/rendering/3d/CharacterScene/index.tsx`   | Dex / character sheet path                     |
