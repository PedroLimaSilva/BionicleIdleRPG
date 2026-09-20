# Packed body — Bohrok Swarm

Phase **C** for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Swarm Bohrok no longer kit-assemble. Sheet and combat share one packed body.

**Goal:** packed `Body_Baked` + transmissive eyes + Krana + packed faceplate + all six baked shields.

**Kal stays on `bohrok_master.glb`** until a later pass packs Kal shields, faceplates, and silver symbols.

---

## What all six swarms need

| Piece                         | Shared across breeds? | Shipped in `Bohrok.glb` today             | Runtime                                                                  |
| ----------------------------- | --------------------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| Packed chassis (`Body_Baked`) | Yes                   | Yes                                       | Tint Main / Secondary / Black / Metal from dex                           |
| Eyes + Krana                  | Yes (palette)         | Yes                                       | `Trans_Color` crystal + `Glowing` iris + `Krana` from `colors.eyes`      |
| Faceplate                     | Yes (same mesh)       | Yes — packed shell                        | `Swarms_Baked` ← `body.main`; `Clear` viewport                           |
| Breed shield                  | **No** — unique LEGO  | All six                                   | Hide unused; instance the breed mesh onto `Shield_L` / `Shield_R`        |
| Combat clips                  | Yes                   | `Idle` only                               | Attack / Hit / Defeat procedural until clips transfer                    |
| Scale                         | Yes                   | ~11 units (already matches scaled master) | No extra clone scale. Sheet `4.5` is Kal-only; battle `0.175` is shared. |

Dex palettes already distinguish the six breeds (tahnok red/orange, gahlok blue, lehvak green, pahrak brown, nuhvok black, kohrak white).

---

## GLB layout (`public/Bohrok.glb`)

One armature. Packed body, eyes, Krana, faceplate, and the six shields are siblings on `Bohrok`. Shields are rigid local-space meshes (not skinned) — runtime parents clones onto the hand sockets.

```
Bohrok
├── Body_Baked — packed opaque body (Main / Secondary / Black / Metal)
├── Eyes — transmissive crystal + iris glow
├── FacePlate_Transparent — packed `Swarms_Baked` shell + trans-clear viewport
├── Krana — tinted from `colors.eyes`
├── Gahlok / Kohrak / Lehvak / Nuhvok / Pahrak / Tahnok — breed shields (`Swarms_Baked`)
└── ROOT — skeleton (`Shield_L` / `Shield_R` under `Hand.L` / `Hand.R`)
```

Shipped clip: `Idle`. Attack / Hit / Defeat use procedural combat motion until this export gains the master clips. Do not graduate `bohrok-packed-combat` until those ship.

`CharacterScene` and `CombatantModel` both draw this body for `MatoranStage.Bohrok`.

The packed export is already ~11 units tall (visual size of master's scaled `Bohrok` node). Do **not** apply `BOHROK_PACKED_MATCH_MASTER_SCALE` on the clone. Sheet wrapping `4.5` stays Kal-only; battle `0.175` is shared.

Draco: `yarn compress` now preflights UV/texture slots (`yarn diagnose-glb-draco`). Faceplate `Main` previously crashed Draco with `texCoord: -1` / `scratches-2` and no UVs — disconnect unused Image Textures or unwrap before export.

---

## Mesh nodes

| Node                    | Draws | Notes                                                                      |
| ----------------------- | ----: | -------------------------------------------------------------------------- |
| `Body_Baked`            |     4 | One skinned mesh, one draw per `Body_Original_*_Baked` slot                |
| `Eyes`                  |     2 | `Trans_Color` (crystal, blooms) + `Glowing` (emissive iris, no bloom)      |
| `FacePlate_Transparent` |     2 | Packed `Swarms_Baked` shell + `Clear` (colorless viewport)                 |
| `Krana`                 |     1 | `Krana` — `colors.eyes`                                                    |
| Breed shields (×6)      |     1 | Each `Swarms_Baked`. Hide unused; clone the active breed onto both sockets |

Opaque body slots and `Swarms_Baked` use packed `emissiveMap` (R roughness, G metalness, B wear) and tangent `normalMap` (`authoredPbrMaps: 'packed'`). Do not export glTF metallicRoughness — wear lives in packed **B** as sparse edge highlights, not a filled AO.

---

## Body material slots (`Body_Baked`)

| Slot                            | Runtime tint            | Weathered                        | Notes                                       |
| ------------------------------- | ----------------------- | -------------------------------- | ------------------------------------------- |
| `Body_Original_Main_Baked`      | `body.main`             | Yes — packed PBR + bake + normal | Shell / feet plastics                       |
| `Body_Original_Secondary_Baked` | `arms.main`             | Yes                              | Limb / accent atlas                         |
| `Body_Original_Metal_Baked`     | `body.metal`            | Yes (Mata metal PBR + packed)    | Defaults to LightGray when palette omits it |
| `Body_Original_Black_Baked`     | Fixed `LegoColor.Black` | Yes (packed plastic)             | Axles, pins                                 |

---

## Accessories

| Slot           | Runtime tint                  | Notes                                          |
| -------------- | ----------------------------- | ---------------------------------------------- |
| `Swarms_Baked` | `body.main`                   | Packed faceplate shell + all six breed shields |
| `Clear`        | colorless transmissive clear  | Faceplate viewport only; no bloom              |
| `Trans_Color`  | `eyes` + transmissive crystal | Same `crystal` preset as kit `BohrokEye` Brain |
| `Glowing`      | `eyes` emissive               | Intensity 5; **no** selective-bloom MRT        |
| `Krana`        | `eyes`                        | Unweathered                                    |

Master shield clones use kit `Main` / `Metal` via `BOHROK_PRIMARY_PALETTE` (Kal path only).

---

## Blender export checklist

1. **One armature** — `Bohrok` only.
2. **Body_Baked** — skinned (`JOINTS_0` / `WEIGHTS_0`); material names above; **packed emissive** + **normal** bakes. Packed **B** is edge wear. Do not export metallicRoughness.
3. **Faceplate** — skinned; packed `Swarms_Baked` shell + `Clear` viewport.
4. **Per-breed shields** — rigid local-space meshes named `Gahlok` / `Kohrak` / `Lehvak` / `Nuhvok` / `Pahrak` / `Tahnok`, `Swarms_Baked` atlas. Runtime parents them onto `Shield_L` / `Shield_R`.
5. **Eyes / Krana** may stay unpacked until Kal.
6. Export; verify `Idle` drives the `Bohrok` skeleton.
7. Re-introduce Attack / Hit / Defeat from `bohrok_master.glb` before graduating the packed-combat epic.

---

## Runtime

| File                                 | Role                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| `BohrokModel.tsx`                    | Swarm packed path (`Bohrok.glb` only) vs Kal kit path |
| `bohrokSheetMeshes.ts`               | Node / material names, sockets, shield attach         |
| `kit/palettes/bohrokSheetPalette.ts` | Packed body + swarm atlas + accessory tints           |
