# 3D rendering strategy

**Budget:** ≤ 50 draw calls per battle frame ([`UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md)).

Kit-based Toa builds currently land around **~80 draws per character** on the character sheet (e.g. Tahu: 82 draws, 29 materials, ~120k kit tris). Six combatants at that cost cannot fit the battle budget. This document tracks the phased plan to cut draw calls without sacrificing dex fidelity.

## Problem

`useKitAttachments` clones one kit GLB subtree per socket (~50+ sockets on Mata Toa). Each clone may contain multiple meshes and per-slot materials. The shared `kit_2001.glb` library optimizes **asset reuse and authoring**, not **GPU submission count**.

Runtime geometry merge (Phase B) only batches meshes that already share a bone anchor, material instance, and render order — typically technic axles/pins on the same limb. Measured win on Tahu: **82 → 74 draws (~10%)**. Triangles and material count are unchanged.

## Phased plan

| Phase | What                                                                       | Where it applies                                 | Expected impact                                                                      |
| ----- | -------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **A** | Performance monitor + stable render-cost logger                            | Dev / character sheet                            | Baseline measurement ([`3D_PERFORMANCE.md`](3D_PERFORMANCE.md)) — **shipped** (#468) |
| **B** | Runtime `BufferGeometry` merge in `useKitAttachments`                      | All kit-attached characters (dex + battle today) | Small incremental win (~10% draws); no asset re-export — **this PR**                 |
| **C** | **Battle LOD** — pre-merged skinned mesh per rig template in character GLB | `CombatantModel` only                            | Large per-character win (target ~1 draw per material bucket, ~15–30 draws vs ~80)    |
| **D** | **InstancedMesh** for duplicate enemies                                    | Bohrok, Rahkshi, Vahki swarms                    | Compress N identical enemies toward 1 draw per breed × material group                |
| **E** | **Authoring** — merged Rahi GLBs (no kit sockets)                          | New Rahi creatures                               | Avoid clone overhead; merge small parts in Blender at export                         |

Phases B–E stack. B is necessary but not sufficient for the battle budget.

## Phase B — runtime kit geometry merge (current work)

See [`KIT_GEOMETRY_MERGE.md`](KIT_GEOMETRY_MERGE.md).

After materials are applied, rigid kit meshes sharing the same merge anchor bone, material instance, and render order are extracted, baked into anchor-local space, and merged with `BufferGeometryUtils.mergeGeometries`. Excluded: skinned meshes, multi-material meshes, transmissive brain gel, selective-bloom glow (MRT).

**Why ship a small win:** every draw saved helps dex and battle until Phase C lands; the merge pipeline is isolated in `kitGeometryMerge.ts` and covered by unit tests.

## Phase C — battle LOD (next major step)

### Principle

- **Character sheet / dex:** full rig + kit attachment maps (current fidelity).
- **Battle:** a pre-merged skinned mesh on the **same skeleton** and animation clips, parented under a `*_Battle` node in the character GLB.

`CombatantModel` loads the battle node; `CharacterScene` keeps the full kit path.

### Custom characters

Custom Toa are **not** excluded from battle. They already resolve a rig template via `mataRenderModelId` / `resolveCustomToaBuildId`. Battle LOD is authored **per rig template** (e.g. one `Toa_Tahu_Battle` mesh for all Tahu-rig builds). Runtime palette tinting uses the same color system with fewer material slots on the merged mesh.

### Optional intermediate

A **battle attachment map** can reference fewer, pre-merged kit nodes on the same rig before full GLB bake — same skeleton, simplified kit wiring in `CombatantModel` only.

### Authoring specs

| Rig                                   | Doc                                                  |
| ------------------------------------- | ---------------------------------------------------- |
| **Rahkshi** (recommended first pilot) | [`battle-lod/RAHKSHI.md`](battle-lod/RAHKSHI.md)     |
| Toa Tahu (Mata)                       | [`battle-lod/TAHU_MATA.md`](battle-lod/TAHU_MATA.md) |

Other Mata Toa reuse the Tahu bucket names; only proportions and weapon sockets differ.

## Phase D — enemy instancing

Good fit when geometry is identical and only **uniform color axes** change:

- **Bohrok** — breed geometry + Krana tint (`kranaMaterialCache` today).
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

**Tahu baseline (master, no merge):** `+82 draws (+29 materials, +120,343 tris)`.

**Tahu with Phase B merge:** `+74 draws` (same materials/tris).

## Related code

| File                                          | Role                                           |
| --------------------------------------------- | ---------------------------------------------- |
| `src/rendering/3d/hooks/kitGeometryMerge.ts`  | Phase B merge pipeline                         |
| `src/rendering/3d/SceneCompileAsync.tsx`      | Yielding first-open TSL / pipeline compile     |
| `src/rendering/3d/kitMaterialBank.ts`         | CPU material instances for shipped LEGO colors |
| `src/rendering/3d/ShaderVariantBank.tsx`      | One-shot WebGPU compile of shared variants     |
| `src/rendering/3d/hooks/useKitAttachments.ts` | Kit clone + merge hook                         |
| `src/pages/Battle/CombatantModel.tsx`         | Battle model routing (Phase C branch point)    |
| `src/rendering/3d/CharacterScene/index.tsx`   | Dex / full-detail path                         |
