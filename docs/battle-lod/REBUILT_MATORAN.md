# Packed body — Rebuilt Matoran

Phase **C** for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Rebuilt Matoran no longer kit-assemble. The character sheet draws one packed body.

**Goal:** packed `Body_Baked` + transmissive brain + mask instead of ~20 kit clones.

Character sheet only — not a combat rig.

---

## GLB layout (`public/rebuilt.glb`)

One armature. Packed body and brain are siblings on `Matoran`. Empty kit sockets may still exist in the file but runtime never clones `kit_2001` / `kit_2003` onto them.

The `Matoran` object is translated (~Y 3.77) so the **scene origin stays at the feet**. Do not overwrite `Matoran.position` in React. Keep the authored translation and apply the Z framing offset on a parent group.

```
Matoran (armature, origin at feet)
├── Body_Baked — packed opaque body (Body / Limbs / Metal)
├── Brain — transmissive McToran gel + glowing eyes
└── Masks — runtime Kanohi (under `Head`)
```

Shipped clips: `Idle`, `Idle.001` (`REBUILT_IDLE_SWITCH`). `Tilt Head` is still missing — do not graduate the rebuilt idle-switch epic until it ships.

`CharacterScene` draws this body. There is no battle path.

---

## Mesh nodes

| Node         | Draws | Notes                                                                                      |
| ------------ | ----: | ------------------------------------------------------------------------------------------ |
| `Body_Baked` |     3 | One mesh (GLTFLoader may split into a Group of `Part-*` children), one draw per baked slot |
| `Brain`      |     2 | `Brain` (transmissive McToran gel) + `Glowing Eyes` (emissive, no bloom)                   |

Opaque body slots use packed `emissiveMap` (R roughness, G metalness, B wear) and tangent `normalMap` (`authoredPbrMaps: 'packed'`). Do not export glTF metallicRoughness — wear lives in packed **B** as sparse edge highlights, not a filled AO.

**Skin:** `Body_Baked` must be a skinned mesh (`JOINTS_0` / `WEIGHTS_0` + `skin`) so Idle deforms the body. Brain is already skinned. If Body exports as rigid, the idle pose will leave the body in bind pose while the brain / mask follow the skeleton.

---

## Body material slots (`Body_Baked`)

| Slot               | Runtime tint | Weathered                        | Notes                                                               |
| ------------------ | ------------ | -------------------------------- | ------------------------------------------------------------------- |
| `Body_Body_Baked`  | `body.main`  | Yes — packed PBR + bake + normal | Torso plastics                                                      |
| `Body_Limbs_Baked` | `arms.main`  | Yes                              | One atlas for arms + legs/feet — cannot tint `feet.main` separately |
| `Body_Metal_Baked` | `body.metal` | Yes (Mata metal PBR + packed)    | Studs / metal (defaults to LightGray when the palette omits metal)  |

There is no `Body_Face_Baked` / `Body_Feet_Baked`. Face color stays on 2D avatars; the 3D head is brain gel + Kanohi. Split Limbs (or add a feet slot) if feet need an independent 3D tint.

---

## Brain

| Slot           | Runtime tint                               | Notes                                                 |
| -------------- | ------------------------------------------ | ----------------------------------------------------- |
| `Brain`        | `eyes` + transmissive `mctoranFace` shader | Same `MeshPhysicalMaterial` path as kit `McToranFace` |
| `Glowing Eyes` | `eyes` emissive                            | Emissive only, **no** selective-bloom MRT             |

---

## Mask (runtime attach)

Keep **`useMask`** on `Masks` with `masks.glb`. The socket sits under `Head` with a +90° X rest. Do **not** apply `alignDiminishedMaskSocket` — rebuilt Head rest is not the diminished MataFace stack, and the previous kit path already wore Kanohi upright.

---

## Blender export checklist

1. **One armature** — `Matoran` only.
2. **Body_Baked** — one **skinned** mesh; material names above; **packed emissive** (R roughness, G metalness, B wear) + **normal** bakes. Packed **B** is edge wear (mostly black islands). Do not export metallicRoughness. Apply the Armature modifier so the GLB has `JOINTS_0` / `WEIGHTS_0` and a `skin`.
3. **Brain** — skinned `Brain` with `Brain` + `Glowing Eyes`.
4. Kit sockets can stay as empties; runtime ignores them. Pieces that only rebuilt cloned (`MatoranFoot`, `MatoranBody`, `PerpendicularLiftArm`) can leave `kit_2001` / `kit_2003` — confirm with `yarn kit-node-usage-report`. Keep `McToranFace` (KanohiMonument).
5. Keep the `Matoran` Y lift so origin stays at the feet.
6. Export; verify `Idle` / `Idle.001` drive both Body_Baked and Brain.

---

## Code map

| File                                                                                       | Role                                      |
| ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [`RebuiltMatoranModel.tsx`](../../src/rendering/3d/CharacterScene/RebuiltMatoranModel.tsx) | Packed body; idle switch; no kit attach   |
| [`rebuiltSheetMeshes.ts`](../../src/rendering/3d/CharacterScene/rebuiltSheetMeshes.ts)     | `Body_Baked` / `Brain` naming             |
| [`rebuiltLod.ts`](../../src/rendering/3d/CharacterScene/rebuiltLod.ts)                     | Show packed meshes; hide leftover kit geo |
| [`rebuiltSheetPalette.ts`](../../src/rendering/3d/kit/palettes/rebuiltSheetPalette.ts)     | Palette + packed weathered PBR            |

---

## Related docs

- [`battle-lod/KOPAKA_MATA.md`](KOPAKA_MATA.md) — same packed RGB emissive path
- [`3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md) — phased plan
