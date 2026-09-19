# Battle LOD authoring — Toa Tahu (Mata)

Phase **C** for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Same socket layout as the other Mata Toa (Gali, Kopaka, …); reuse this **bucket list** on every Mata rig template with rig-specific proportions only.

**Goal:** one battle skinned mesh set per rig template, **~10–14 GPU draws** for kit + embedded body (vs ~74–82 today), plus mask attach.

---

## GLB layout (`public/Toa_Mata/tahu.glb`)

One armature. Battle LOD meshes are siblings on `Tahu`. Dex sockets stay empty (kit attach). Runtime toggles visibility — no second skeleton.

The `Tahu` object is translated (~Y 9.48) so the **scene origin stays at the feet**. Do not overwrite `Tahu.position` in React (other Mata primitives use `[0, 0, -0.4]` because those armatures sit at the origin). Keep the authored translation and apply the Z framing offset on a parent group.

```
Tahu (armature, origin at feet)
├── Battle_Body — one skinned mesh, five material slots (see below)
├── Battle_Brain — rigid overlay (brain gel + eyes)
├── Body / sockets (MataChest, MataFace, …) — detailed kit attach
└── Masks — runtime Kanohi
```

Shared animation clips: `Idle`, `Attack`, `Hit`.

`CombatantModel` uses `meshVariant: 'battle'`. `CharacterScene` / dex default to detailed kit sockets; the dex **Battle LOD** toggle previews `Battle_*`.

---

## Battle mesh nodes

| Node           | Draws | Notes                                                                                                                |
| -------------- | ----: | -------------------------------------------------------------------------------------------------------------------- |
| `Battle_Body`  |     5 | One **skinned** mesh; slots `Battle_Body_Main_Baked`, `_Metal_Baked`, `_Black_Baked`, `_Secondary_Baked`, `Glow`     |
| `Battle_Brain` |     2 | Skinned; `TRANS-DARK_PINK` (transmissive brain) + `Tahu Eyes` (emissive, no bloom). Primitives may be named `Brain`. |

Unlike Rahkshi, opaque battle slots **keep baked maps**: grayscale `emissiveMap` (discoloration) and tangent `normalMap`. There is **no** metallicRoughness texture. Runtime weathered TSL applies metalness / roughness **noise** (`authoredPbrMaps: 'noise'`).

---

## Body material slots (`Battle_Body`)

| Slot                          | Runtime tint            | Weathered                       | Notes                                   |
| ----------------------------- | ----------------------- | ------------------------------- | --------------------------------------- |
| `Battle_Body_Main_Baked`      | `body.main`             | Yes — noise PBR + bake + normal | Chest, hips, legs, left arm, feet, face |
| `Battle_Body_Secondary_Baked` | `body.secondary`        | Yes                             | Right arm / hand; sword secondary       |
| `Battle_Body_Metal_Baked`     | `body.metal`            | Yes (Mata metal PBR + noise)    | Studs / metallic accents                |
| `Battle_Body_Black_Baked`     | Fixed `LegoColor.Black` | Yes (plastic noise)             | Axles, pins, ball joints                |
| `Glow`                        | `weapon.glow`           | No — emissive + selective bloom | Sword glow                              |

Custom characters on the Tahu rig reuse these slots; only uniform colors change.

---

## Brain overlay (`Battle_Brain`)

| Slot              | Runtime tint                       | Notes                                               |
| ----------------- | ---------------------------------- | --------------------------------------------------- |
| `TRANS-DARK_PINK` | `eyes` + transmissive brain shader | Same `MeshPhysicalMaterial` path as kit `MataBrain` |
| `Tahu Eyes`       | `eyes` emissive                    | Emissive only, **no** selective-bloom MRT           |

`Battle_Brain` is skinned to the `Tahu` armature in the current export (mesh name may be `Brain`). Runtime `reparentTahuBattleBrain` still `attach`es the `Battle_Brain` node to `Head` when it is not already parented there. Visibility matches any mesh under a `Battle_*` group, not only nodes whose own name starts with `Battle_`.

---

## Mask (runtime attach — not baked into battle body)

Keep **`useMask`** on `nodes.Masks` with `masks.glb`. Do **not** bake the Kanohi into `Battle_Body`.

---

## Target draw budget (Tahu battle LOD)

| Category                    |    Draws |
| --------------------------- | -------: |
| Opaque buckets + sword glow |        5 |
| Brain + eyes                |        2 |
| Mask                        |      1–2 |
| **Total character**         | **~8–9** |

Compare: Phase B kit path ≈ **74** draws on the character sheet subtree.

---

## Weathering contract

| Channel               | Source                                               |
| --------------------- | ---------------------------------------------------- |
| Albedo                | Player palette uniform                               |
| Discoloration         | Stolen `emissiveMap` bake (where the mask is bright) |
| Normal                | Authored `normalMap` (FBM dents skipped)             |
| Metalness / roughness | Weathered FBM noise (`authoredPbrMaps: 'noise'`)     |

Rahkshi battle LOD tints GLTF materials in place and skips weathered TSL. Tahu applies cached weathered materials because the bake + normal maps need the shared TSL graph.

---

## Socket → kit map (detailed LOD)

Sockets on this export are named after the kit node they receive (`MataChest`, `MataFootHeel_L`, …). See [`tahu.ts`](../../src/rendering/3d/kit/attachments/Toa%20Mata/tahu.ts).

---

## Blender export checklist

1. **One armature** — `Tahu` only (no `Tahu_Battle` empty).
2. **Battle body** — one skinned mesh `Battle_Body` parented under `Tahu`; material names above; **emissive + normal** bakes; no metallicRoughness maps.
3. **Battle brain** — `Battle_Brain` with `TRANS-DARK_PINK` + `Tahu Eyes`. Prefer skinning to `Head` on the next export.
4. **Naming** — battle LOD mesh nodes use **`Battle_`** prefix.
5. Empty kit sockets keep kit-node names so `useKitAttachments` can find them.
6. Export; verify `Idle` / `Attack` / `Hit` drive the single `Tahu` skeleton.

---

## Code map

| File                                                                                | Role                                                            |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`TahuMataModel.tsx`](../../src/rendering/3d/CharacterScene/Mata/TahuMataModel.tsx) | `meshVariant: 'detailed' \| 'battle'`; combat default `battle`  |
| [`tahuBattleMeshes.ts`](../../src/rendering/3d/CharacterScene/tahuBattleMeshes.ts)  | `Battle_*` naming                                               |
| [`tahuLod.ts`](../../src/rendering/3d/CharacterScene/tahuLod.ts)                    | Toggle `Battle_*` visibility; reparent `Battle_Brain` to `Head` |
| [`tahuBattlePalette.ts`](../../src/rendering/3d/kit/palettes/tahuBattlePalette.ts)  | Palette + weathered noise PBR                                   |
| [`CombatantModel.tsx`](../../src/pages/Battle/CombatantModel.tsx)                   | Passes `TAHU_COMBAT_MESH_VARIANT`                               |
| [`CharacterDex/Preview.tsx`](../../src/pages/CharacterDex/Preview.tsx)              | Battle LOD toggle                                               |

---

## Canonical Tahu colors (reference)

From [`src/data/dex/toa.ts`](../../src/data/dex/toa.ts) — custom builds override these at runtime; buckets stay the same.

| Bucket                          | Tahu canonical  |
| ------------------------------- | --------------- |
| `Battle_Body_Main_Baked`        | Red             |
| `Battle_Body_Secondary_Baked`   | Orange          |
| `Battle_Body_Metal_Baked`       | Light gray      |
| `Battle_Body_Black_Baked`       | Black           |
| `Tahu Eyes` / `TRANS-DARK_PINK` | Trans neon red  |
| `Glow`                          | Orange emissive |
| Mask (runtime)                  | Red Hau         |

---

## Reuse on other Mata Toa

| Rig template | GLB        | Battle node     | Attachment map           |
| ------------ | ---------- | --------------- | ------------------------ |
| Tahu         | `tahu.glb` | `Battle_Body`   | `tahu.ts`                |
| Gali         | `gali.glb` | `Gali_Battle`   | `gali.ts` (same sockets) |
| …            | …          | `{Name}_Battle` | same bucket rules        |

Weapon sockets differ (hooks, axes, etc.) but bucket rules are identical: plastics → Main/Secondary/Metal, technic → black, glow → `Glow` slot, brain/eyes → separate mesh.

---

## Related docs

- [`battle-lod/RAHKSHI.md`](RAHKSHI.md) — Rahkshi battle LOD (no weathered TSL on skinned slots)
- [`3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md) — phased plan
