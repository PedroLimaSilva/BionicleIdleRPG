# Battle LOD authoring — Rahkshi

Phase **C** pilot for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md).

---

## GLB layout (`public/rahkshi.glb`)

Two armatures in one file:

| Rig        | Node             | Used by                                | Contents                                                                                                            |
| ---------- | ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Live**   | `Rahkshi`        | Inventory, dex default, combat (today) | Kit + baked textures — [`Rahkshi.tsx`](../../src/rendering/3d/CharacterScene/Rahkshi.tsx) `meshVariant: 'detailed'` |
| **Battle** | `Rahkshi_Battle` | Dex toggle, combat target              | Merged battle LOD — no kit attach (`meshVariant: 'battle'`)                                                         |

Shared animation clips at file scope (`Attack`, `Empty`, `Idle` as of the first battle export). `Hit` is still required for combat — re-export when ready.

---

## `Rahkshi_Battle` mesh tree (shipped)

```
Rahkshi_Battle (armature)
├── SkinnedMesh   — one SkinnedMesh, six material slots (opaque buckets below)
├── Guurahk       — species overlay (first breed authored; add Panrahk … Turahk)
├── Leg.IK.L / Leg.IK.R / Waist …  — same bone names as live rig
└── Head
    └── Battle_Glow   — merged eyes + kraata disk; material `Eyes` (selective bloom MRT)
```

### Target draw count (battle, when all six species meshes ship)

| Mesh                               |  Draws |
| ---------------------------------- | -----: |
| `SkinnedMesh` (6 material slots)   |      6 |
| `Battle_Glow`                      |      1 |
| One visible species (`Guurahk`, …) |      1 |
| **Total**                          | **~8** |

Compare to live kit path: **40+** draws per Rahkshi.

---

## Body material slots (`SkinnedMesh`)

| Slot             | Runtime tint         | Notes                                        |
| ---------------- | -------------------- | -------------------------------------------- |
| `Battle_Armor`   | kraata **armor** hex | Tinted at runtime via `rahkshiBattleTintMap` |
| `Battle_Joint`   | kraata **joint** hex | Tinted at runtime                            |
| `Battle_Chassis` | Authored in GLB      | Not re-tinted                                |
| `Battle_Black`   | Authored in GLB      | Not re-tinted                                |
| `Battle_Metal`   | Authored in GLB      | Not re-tinted (species overlay uses armor)   |
| `Battle_Tan`     | Authored in GLB      | Not re-tinted                                |

[`rahkshiBattleTintMap`](../../src/rendering/3d/kit/palettes/rahkshiKitPalette.ts) touches **armor + joint only** — no weathered TSL (skinned meshes keep stock materials for WebGPU skinning).

---

## Head bloom (`Battle_Glow`)

| Item            | Detail                                                                                                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mesh**        | `Battle_Glow` under `Head`                                                                                                                                                                                 |
| **Material**    | `Eyes` — emissive kraata glow + selective bloom MRT ([`isSelectiveBloomRahkshiEyeName`](../../src/rendering/3d/CharacterScene/selectiveBloom.ts)). Optional rename to `Battle_Bloom` is supported in code. |
| **Kraata lerp** | Same as live `Eyes` — lerp to black when empty; `Empty` idle until glow completes                                                                                                                          |

---

## Species overlays

One mesh per staff breed at the **armature root** (sibling of `SkinnedMesh`), named after the staff prefix:

| Mesh name | `staff` prefix | Kraata examples                     |
| --------- | -------------- | ----------------------------------- |
| `Guurahk` | `Guurahk`      | Disintegration                      |
| `Panrahk` | `Panrahk`      | Fragmentation, Molecular Disruption |
| `Lerahk`  | `Lerahk`       | Poison                              |
| `Vorahk`  | `Vorahk`       | Hunger                              |
| `Kurahk`  | `Kurahk`       | Anger                               |
| `Turahk`  | `Turahk`       | Fallback — most other powers        |

**Shipped today:** `Guurahk` only. Add the other five meshes before battle becomes default in combat.

Runtime: [`shouldShowRahkshiBattleSpeciesMesh`](../../src/rendering/3d/CharacterScene/rahkshiBattleMeshes.ts) — `meshName === staffPrefix`.

Species overlays tint with the armor hex on their material slot (`Battle_Metal` in the first export).

---

## Live rig (`Rahkshi`) — for comparison

```
Rahkshi → clone bodyInstance → weathered baked meshes
       → kit_2003 (7 sockets) + kit_2001 (34 sockets)
       → eye / head-socket glow lerp
       → show 3 of 18 variant meshes per staff prefix
```

Character dex defaults to this path; toggle **Battle LOD** on Rahkshi specimens to preview `Rahkshi_Battle`.

---

## Behaviors to preserve (battle code)

| Behavior        | Live (`detailed`)                                | `Rahkshi_Battle` (`battle`)        |
| --------------- | ------------------------------------------------ | ---------------------------------- |
| No kraata       | Eyes (+ head kit) lerp black; `Empty` until glow | Lerp `Battle_Glow` / `Eyes` only   |
| Kraata inserted | Glow lerp → `Idle`                               | Same                               |
| Staff breed     | 3 of 18 variant meshes visible                   | 1 species overlay visible          |
| Kraata tint     | `getRahkshiArmorColors` → weathered              | Tint `SkinnedMesh` slots + species |
| Bloom           | `Eyes` MRT                                       | `Eyes` on `Battle_Glow`            |
| Animations      | Shared file clips                                | Same                               |

---

## Code map

| File                                                                                     | Role                                         |
| ---------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`Rahkshi.tsx`](../../src/rendering/3d/CharacterScene/Rahkshi.tsx)                       | `meshVariant: 'detailed' \| 'battle'`        |
| [`rahkshiBattleMeshes.ts`](../../src/rendering/3d/CharacterScene/rahkshiBattleMeshes.ts) | Rig node + species visibility constants      |
| [`rahkshiKitPalette.ts`](../../src/rendering/3d/kit/palettes/rahkshiKitPalette.ts)       | `rahkshiBattleTintMap` (armor + joint only)  |
| [`data/dex/rahkshi.ts`](../../src/data/dex/rahkshi.ts)                                   | `RahkshiDexMeshVariant` type for dex preview |
| [`CharacterDex/Preview.tsx`](../../src/pages/CharacterDex/Preview.tsx)                   | Battle LOD toggle                            |

---

## Blender export checklist

1. **Live collection** — `Rahkshi` armature + kit instances (unchanged).
2. **Battle collection** — `Rahkshi_Battle` armature:
   - Join opaque geometry into **`SkinnedMesh`**; assign six `Battle_*` slots; skin to bones.
   - Join eyes + head disk → **`Battle_Glow`** under `Head`; material **`Eyes`** (or `Battle_Bloom`).
   - Per breed: spine + staff → **`{Breed}`** mesh at armature root (`Guurahk`, `Panrahk`, …).
3. Export both armatures; verify shared actions on both skins.
4. Re-export **`Hit`** (and `Defeat` when ready) — required for combat / dex animation buttons.

---

## Instancing (Phase D)

Same `Rahkshi_Battle` geometry for all instances; per-instance armor + joint on `SkinnedMesh` slots. Batch by identical kraata power in a wave.

---

## Related docs

- [`battle-lod/TAHU_MATA.md`](TAHU_MATA.md) — Mata Toa bucket spec
- [`3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md) — phased plan
