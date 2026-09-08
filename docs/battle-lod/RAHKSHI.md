# Battle LOD authoring — Rahkshi

Phase **C** pilot for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md).

---

## GLB layout (`public/rahkshi.glb`)

One armature. Battle LOD meshes are siblings on `Rahkshi`. Most battle nodes are named `Battle_*`; the body bucket is a `Battle_Body` **Group** whose skinned children use `Part-*` names (see below). Runtime toggles visibility — no second skeleton.

```
Rahkshi (armature)
├── … detailed sockets, baked meshes, kit attach points (visible in detailed LOD)
├── Battle_Body (Group) — six skinned children, one per material slot (see below)
├── Battle_Glow      — under `Head`; one `Battle_Bloom` material
└── Battle_Guurahk / Battle_Panrahk / … — species overlays (one visible)
```

Shared animation clips at file scope (`Attack`, `Empty`, `Idle`). `Hit` is still required for combat — re-export when ready.

---

## Battle mesh nodes

| Node             | Draws | Notes                                                                 |
| ---------------- | ----: | --------------------------------------------------------------------- |
| `Battle_Body`    |     6 | **Group** of skinned children (one draw per `Battle_*` slot)          |
| `Battle_Glow`    |     1 | Merged eyes + kraata disk under `Head`                                |
| `Battle_{Breed}` |     1 | Species overlay (`Battle_Guurahk`, `Battle_Panrahk`, …) — one visible |

**Shipped today:** `Battle_Guurahk` only. Add `Battle_Panrahk` … `Battle_Turahk` before battle becomes default in combat.

Compare to live kit path: **40+** draws per Rahkshi.

---

## Body material slots (`Battle_Body`)

Blender exports `Battle_Body` as an **empty Group** parented under `Rahkshi`, not as a single merged `SkinnedMesh`. Each material slot becomes its own skinned child (for example `Part-44136_dot_dat003` … `_5`). Those children are **not** named with the `Battle_` prefix.

Runtime code treats any mesh under the `Battle_Body` group as battle LOD via [`isRahkshiBattleBodyPartMesh`](../../src/rendering/3d/CharacterScene/rahkshiBattleMeshes.ts) — do not rely on the group node itself being renderable.

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

| Item            | Detail                                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mesh**        | `Battle_Glow` under `Head` — **one** mesh object, **one** draw call                                                                                                     |
| **Material**    | **`Battle_Bloom` only** — emissive kraata glow + selective bloom MRT ([`isSelectiveBloomRahkshiGlowMaterial`](../../src/rendering/3d/CharacterScene/selectiveBloom.ts)) |
| **Kraata lerp** | Same as live `Glow` — lerp to black when empty; `Empty` idle until glow completes                                                                                       |

**Authoring rule:** join every eye / kraata-disk face into a **single** `Battle_Glow` mesh with **one** `Battle_Bloom` material slot.

---

## Species overlays

One mesh per staff breed, named `Battle_{Breed}` at the armature root (sibling of `Battle_Body`):

| Mesh name        | `staff` prefix | Kraata examples                     |
| ---------------- | -------------- | ----------------------------------- |
| `Battle_Guurahk` | `Guurahk`      | Disintegration                      |
| `Battle_Panrahk` | `Panrahk`      | Fragmentation, Molecular Disruption |
| `Battle_Lerahk`  | `Lerahk`       | Poison                              |
| `Battle_Vorahk`  | `Vorahk`       | Hunger                              |
| `Battle_Kurahk`  | `Kurahk`       | Anger                               |
| `Battle_Turahk`  | `Turahk`       | Fallback — most other powers        |

Runtime: [`shouldShowRahkshiBattleSpeciesMesh`](../../src/rendering/3d/CharacterScene/rahkshiBattleMeshes.ts) — `meshName === Battle_{staffPrefix}`.

Species overlays tint with the armor hex on their `Battle_Metal` slot.

---

## Live rig (`Rahkshi`) — for comparison

```
Rahkshi → clone bodyInstance → weathered baked meshes
       → kit_2003 (7 sockets) + kit_2001 (34 sockets)
       → eye / head-socket glow lerp
       → show 3 of 18 variant meshes per staff prefix
```

Character dex defaults to this path; toggle **Battle LOD** on Rahkshi specimens to preview `Battle_*` meshes.

---

## Behaviors to preserve (battle code)

| Behavior        | Live (`detailed`)                                | Battle (`battle`)                  |
| --------------- | ------------------------------------------------ | ---------------------------------- |
| No kraata       | Eyes (+ head kit) lerp black; `Empty` until glow | Lerp `Battle_Glow` only            |
| Kraata inserted | Glow lerp → `Idle`                               | Same                               |
| Staff breed     | 3 of 18 variant meshes visible                   | 1 `Battle_{Breed}` overlay visible |
| Kraata tint     | `getRahkshiArmorColors` → weathered              | Tint `Battle_Body` slots + species |
| Bloom           | `Glow` MRT on baked mesh                         | `Battle_Bloom` on `Battle_Glow`    |
| Animations      | Shared file clips                                | Same                               |

---

## Code map

| File                                                                                     | Role                                                       |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [`Rahkshi.tsx`](../../src/rendering/3d/CharacterScene/Rahkshi.tsx)                       | `meshVariant: 'detailed' \| 'battle'`                      |
| [`rahkshiBattleMeshes.ts`](../../src/rendering/3d/CharacterScene/rahkshiBattleMeshes.ts) | `Battle_*` naming, body group children, species visibility |
| [`rahkshiLod.ts`](../../src/rendering/3d/CharacterScene/rahkshiLod.ts)                   | Toggle `Battle_*` mesh visibility                          |
| [`rahkshiKitPalette.ts`](../../src/rendering/3d/kit/palettes/rahkshiKitPalette.ts)       | `rahkshiBattleTintMap` (armor + joint only)                |
| [`data/dex/rahkshi.ts`](../../src/data/dex/rahkshi.ts)                                   | `RahkshiDexMeshVariant` type for dex preview               |
| [`CharacterDex/Preview.tsx`](../../src/pages/CharacterDex/Preview.tsx)                   | Battle LOD toggle                                          |

---

## Blender export checklist

1. **One armature** — `Rahkshi` only (no `Rahkshi_Battle`).
2. **Battle body** — parent opaque geometry under a **`Battle_Body` Group**; one skinned mesh per `Battle_*` material slot; skin to `Rahkshi` bones with **vertex groups** (Armature modifier → `Rahkshi`, bind to **Vertex Groups**). Merging all slots into one mesh is fine too, but the current export uses a group of six skinned parts.
3. **Battle glow** — join eyes + head disk → **`Battle_Glow`** under `Head`; **one** material **`Battle_Bloom`**.
4. **Species** — per breed: spine + staff → **`Battle_{Breed}`** (`Battle_Guurahk`, `Battle_Panrahk`, …).
5. **Naming** — battle LOD mesh nodes use **`Battle_`** prefix, **except** the skinned children inside `Battle_Body` (runtime matches by parent group).
6. Export; verify shared actions drive the single `Rahkshi` skeleton.
7. Re-export **`Hit`** (and `Defeat` when ready) — required for combat / dex animation buttons.

---

## Instancing (Phase D)

Same `Battle_*` geometry for all instances; per-instance armor + joint on `Battle_Body` slots. Batch by identical kraata power in a wave.

---

## Related docs

- [`battle-lod/TAHU_MATA.md`](TAHU_MATA.md) — Mata Toa bucket spec
- [`3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md) — phased plan
