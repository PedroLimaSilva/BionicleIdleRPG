# Packed skinned body — Toa Tahu (Mata)

Phase **C** for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Tahu no longer kit-assembles on the character sheet. Sheet and combat share one packed skinned body; LOD is **map resolution** first, then a lower-tri battle mesh.

**Goal:** ~8–9 GPU draws for body + mask (vs ~74–82 kit clones).

---

## GLB layout (`public/Toa_Mata/tahu.glb`)

One armature. Packed body meshes are siblings on `Tahu`. Empty kit sockets may still exist in the file but runtime never clones `kit_2001` onto them.

The `Tahu` object is translated (~Y 9.48) so the **scene origin stays at the feet**. Do not overwrite `Tahu.position` in React (other Mata primitives use `[0, 0, -0.4]` because those armatures sit at the origin). Keep the authored translation and apply the Z framing offset on a parent group.

```
Tahu (armature, origin at feet)
├── Battle_Body — skinned packed body (sheet + battle until a lower-tri LOD ships)
├── Battle_Weapon — sword glow
├── Battle_Brain — brain gel + eyes
└── Masks — runtime Kanohi
```

Shared animation clips: `Idle`, `Attack`, `Hit`.

`CharacterScene` and `CombatantModel` both draw this body. `meshVariant: 'sheet' | 'battle'` currently shares the 1024 packed + normal maps; bind lower-res images on `'battle'` when they exist in the GLB.

---

## Battle mesh nodes

| Node            | Draws | Notes                                                                                                                |
| --------------- | ----: | -------------------------------------------------------------------------------------------------------------------- |
| `Battle_Body`   |     4 | One **skinned** mesh; slots `Battle_Body_Main_Baked`, `_Metal_Baked`, `_Black_Baked`, `_Secondary_Baked`             |
| `Battle_Weapon` |     1 | Sword glow (`Glow`); selective bloom.                                                                                |
| `Battle_Brain`  |     2 | Skinned; `TRANS-DARK_PINK` (transmissive brain) + `Tahu Eyes` (emissive, no bloom). Primitives may be named `Brain`. |

Unlike Rahkshi, opaque battle slots **keep baked maps**: packed `emissiveMap` (R roughness, G metalness, B wear) and tangent `normalMap`. Leftover glTF metallicRoughness textures are ignored (`authoredPbrMaps: 'packed'`).

---

## Body material slots (`Battle_Body`)

| Slot                          | Runtime tint            | Weathered                        | Notes                                   |
| ----------------------------- | ----------------------- | -------------------------------- | --------------------------------------- |
| `Battle_Body_Main_Baked`      | `body.main`             | Yes — packed PBR + bake + normal | Chest, hips, legs, left arm, feet, face |
| `Battle_Body_Secondary_Baked` | `body.secondary`        | Yes                              | Right arm / hand                        |
| `Battle_Body_Metal_Baked`     | `body.metal`            | Yes (Mata metal PBR + packed)    | Studs / metallic accents                |
| `Battle_Body_Black_Baked`     | Fixed `LegoColor.Black` | Yes (packed plastic)             | Axles, pins, ball joints                |
| `Glow`                        | `weapon.glow`           | No — emissive + selective bloom  | Sword glow on `Battle_Weapon`           |

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

## Target draw budget (Tahu packed body)

| Category                    |    Draws |
| --------------------------- | -------: |
| Opaque buckets + sword glow |        5 |
| Brain + eyes                |        2 |
| Mask                        |      1–2 |
| **Total character**         | **~8–9** |

Compare: Phase B kit path ≈ **74** draws on the character sheet subtree.

---

## Weathering contract

| Channel       | Source                                                   |
| ------------- | -------------------------------------------------------- |
| Albedo        | Player palette uniform                                   |
| Discoloration | Stolen packed `emissiveMap` **B**                        |
| Normal        | Authored `normalMap` (FBM dents skipped)                 |
| Roughness     | Packed `emissiveMap` **R** (`authoredPbrMaps: 'packed'`) |
| Metalness     | Packed `emissiveMap` **G**                               |

Rahkshi battle LOD tints GLTF materials in place and skips weathered TSL. Tahu applies cached weathered materials because the bake + normal maps need the shared TSL graph.

---

## Sheet vs battle LOD

| Variant  | Mesh                          | Maps                                     |
| -------- | ----------------------------- | ---------------------------------------- |
| `sheet`  | `Battle_*` (current export)   | High-res packed + normals (1024 today)   |
| `battle` | Same mesh until a low-tri LOD | Lower-res packed + normals when authored |

Do not kit-assemble either variant.

---

## Blender export checklist

1. **One armature** — `Tahu` only (no `Tahu_Battle` empty).
2. **Body** — one skinned mesh `Battle_Body` parented under `Tahu`; material names above; **packed emissive** (R roughness, G metalness, B wear) + **normal** bakes. Leftover glTF metallicRoughness textures are dropped at runtime.
3. **Brain** — `Battle_Brain` with `TRANS-DARK_PINK` + `Tahu Eyes`. Prefer skinning to `Head`.
4. **Weapon** — `Battle_Weapon` with unweathered `Glow`.
5. **Naming** — packed body mesh nodes use **`Battle_`** prefix.
6. Kit sockets can stay as empties for now; runtime ignores them. Strip on a later export.
7. Export; verify `Idle` / `Attack` / `Hit` drive the single `Tahu` skeleton.
8. Next authoring pass: duplicate packed/normal images at battle resolution and/or a lower-tri `Battle_Body`.

---

## Code map

| File                                                                                | Role                                                            |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`TahuMataModel.tsx`](../../src/rendering/3d/CharacterScene/Mata/TahuMataModel.tsx) | Packed skinned body; `meshVariant: 'sheet' \| 'battle'`         |
| [`tahuBattleMeshes.ts`](../../src/rendering/3d/CharacterScene/tahuBattleMeshes.ts)  | `Battle_*` naming                                               |
| [`tahuLod.ts`](../../src/rendering/3d/CharacterScene/tahuLod.ts)                    | Show `Battle_*`; hide leftover kit geo; reparent `Battle_Brain` |
| [`tahuBattlePalette.ts`](../../src/rendering/3d/kit/palettes/tahuBattlePalette.ts)  | Palette + packed weathered PBR                                  |
| [`CombatantModel.tsx`](../../src/pages/Battle/CombatantModel.tsx)                   | Passes `TAHU_COMBAT_MESH_VARIANT`                               |
| [`CharacterDex/Preview.tsx`](../../src/pages/CharacterDex/Preview.tsx)              | Packed-map toggles (no kit / Battle LOD switch)                 |

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
