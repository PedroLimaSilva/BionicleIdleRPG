# Skinned body — Toa Kopaka (Mata)

Phase **C** for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Kopaka no longer kit-assembles. Sheet and combat share one skinned body.

**Goal:** body + transmissive brain/sword + mask instead of ~74–82 kit clones.

---

## GLB layout (`public/Toa_Mata/kopaka.glb`)

One armature. Skinned meshes are siblings on `Kopaka`. Empty kit sockets may still exist in the file but runtime never clones `kit_2001` onto them.

The `Kopaka` object is translated (~Y 9.45) so the **scene origin stays at the feet**. Do not overwrite `Kopaka.position` in React. Keep the authored translation and apply the Z framing offset on a parent group.

```
Kopaka (armature, origin at feet)
├── Body — skinned opaque body
├── Brain — transmissive gel + glowing eyes
├── Sword — transmissive ice blade (same gel as brain, selective bloom)
└── Masks — runtime Kanohi (under `MataFace` / `Head`)
```

Shipped clip: `Idle`. Attack / Hit use procedural combat motion until re-authored.

`CharacterScene` and `CombatantModel` both draw this body.

---

## Mesh nodes

| Node    | Draws | Notes                                                                                                 |
| ------- | ----: | ----------------------------------------------------------------------------------------------------- |
| `Body`  |     4 | **Group** of skinned children (one draw per `Body_*_Baked` slot). Children use Blender `Part-*` names |
| `Brain` |     2 | Group; `Brain` (transmissive gel) + `Glowing Eyes` (emissive, no bloom)                               |
| `Sword` |     1 | Skinned `Sword`; `Weapon Transparent` — same transmissive **brain** preset, so it **blooms**          |

Opaque body slots use packed `emissiveMap` (R roughness, G metalness, B wear) and tangent `normalMap` (`authoredPbrMaps: 'packed'`). Do not export glTF metallicRoughness — wear lives in packed **B** as sparse edge highlights, not a filled AO.

The ice sword is **not** an emissive `Glow` slot. Bind `transmissive: 'brain'` so it matches the head gel and joins the bloom MRT (`shouldSelectiveBloomTransmissiveKind`).

---

## Body material slots (`Body`)

| Slot                   | Runtime tint            | Weathered                        | Notes          |
| ---------------------- | ----------------------- | -------------------------------- | -------------- |
| `Body_Main_Baked`      | `body.main`             | Yes — packed PBR + bake + normal | Armor plastics |
| `Body_Secondary_Baked` | `body.secondary`        | Yes                              | Accents        |
| `Body_Metal_Baked`     | `body.metal`            | Yes (Mata metal PBR + packed)    | Studs / metal  |
| `Body_Black_Baked`     | Fixed `LegoColor.Black` | Yes (packed plastic)             | Axles, pins    |

---

## Brain and sword

| Slot                 | Runtime tint                       | Notes                                               |
| -------------------- | ---------------------------------- | --------------------------------------------------- |
| `Brain`              | `eyes` + transmissive brain shader | Same `MeshPhysicalMaterial` path as kit `MataBrain` |
| `Glowing Eyes`       | `eyes` emissive                    | Emissive only, **no** selective-bloom MRT           |
| `Weapon Transparent` | `eyes` + transmissive brain shader | Same gel as `Brain`; **does** bloom                 |

---

## Mask (runtime attach)

Keep **`useMask`** on `Masks` with `masks.glb`. The socket still sits under `MataFace` (Mata rest pose), unlike diminished village Matoran.

---

## Blender export checklist

1. **One armature** — `Kopaka` only.
2. **Body** — one skinned mesh `Body`; material names above; **packed emissive** (R roughness, G metalness, B wear) + **normal** bakes. Packed **B** is edge wear (mostly black islands). Do not export metallicRoughness.
3. **Brain** — skinned `Brain` with `Brain` + `Glowing Eyes`.
4. **Sword** — skinned `Sword` with `Weapon Transparent` (transmissive, not Glow).
5. Kit sockets can stay as empties; runtime ignores them.
6. Export; verify `Idle` drives the `Kopaka` skeleton.

---

## Code map

| File                                                                                    | Role                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------ |
| [`KopakaMataModel.tsx`](../../src/rendering/3d/CharacterScene/Mata/KopakaMataModel.tsx) | Skinned body; no kit attach                |
| [`kopakaSheetMeshes.ts`](../../src/rendering/3d/CharacterScene/kopakaSheetMeshes.ts)    | `Body` / `Brain` / `Sword` naming          |
| [`kopakaLod.ts`](../../src/rendering/3d/CharacterScene/kopakaLod.ts)                    | Show skinned meshes; hide leftover kit geo |
| [`kopakaSheetPalette.ts`](../../src/rendering/3d/kit/palettes/kopakaSheetPalette.ts)    | Palette + packed weathered PBR             |

---

## Related docs

- [`battle-lod/TAHU_MATA.md`](TAHU_MATA.md) — packed RGB emissive path
- [`3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md) — phased plan
