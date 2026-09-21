# Packed body — Bohrok swarm + Kal

Phase **C** for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Swarm and Kal no longer kit-assemble. Sheet and combat share one packed GLB.

**Goal:** packed swarm `Body` + packed Kal chassis + transmissive eyes + Krana + swarm faceplate + solid Kal faceplate + all twelve baked shields + Kal forehead symbols.

---

## What every breed needs

| Piece                | Shared across breeds? | Shipped in `Bohrok.glb` today             | Runtime                                                                              |
| -------------------- | --------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Packed swarm chassis | Yes                   | `Body` (`Body_*_Baked`)                   | Tint Main / Secondary / Black / Metal from dex                                       |
| Packed Kal chassis   | Yes                   | `Kal` (`Kal_*_Baked`)                     | Hide `Body`; tint Main / Black; Metal is silver                                      |
| Eyes + Krana         | Yes (palette)         | Yes                                       | `Trans_Color` crystal + `Glowing` iris + `Krana` from `colors.eyes`                  |
| Swarm faceplate      | Yes                   | `FacePlate_Transparent`                   | `Swarms_Baked` ← `body.main`; `Clear` viewport                                       |
| Kal faceplate        | Yes                   | `FacePlate_Kal`                           | Solid `KalShields_Baked` metal; no viewport                                          |
| Breed shield         | **No** — unique LEGO  | Six swarm + six `{Breed}.Kal`             | Instance the active mesh onto `Shield_L` / `Shield_R`                                |
| Kal symbol           | **No** — unique print | Six `{Breed}.Symbol` under `Face Plate`   | Toggle the active Kal print; hide the rest (and all for swarm)                       |
| Combat clips         | Yes                   | `Idle` (+ unused `Ball` / `Flying`)       | Attack / Hit / Defeat procedural until clips transfer                                |
| Scale                | Yes                   | ~11 units (already matches scaled master) | No extra clone scale. Sheet and Kal share the packed size; battle `0.175` is shared. |

Dex palettes already distinguish the six breeds (tahnok red/orange, gahlok blue, lehvak green, pahrak brown, nuhvok black, kohrak white). Kal `body.main` stays the breed color; Kal metal / shields / faceplate are LightGray.

---

## GLB layout (`public/Bohrok.glb`)

One armature. Packed swarm body, Kal body, eyes, Krana, and both faceplates are children of `Bohrok`. Shields are **scene-root** meshes — runtime clones them onto `Shield_L` / `Shield_R`. Symbols are already parented under the `Face Plate` bone; runtime only toggles visibility. GLTFLoader strips dots from live node names (`Tahnok.Kal` → `TahnokKal`).

```
Scene
├── Bohrok
│   ├── Body — packed swarm chassis (Main / Secondary / Black / Metal)
│   ├── Kal — packed Kal chassis (Main / Black / Metal)
│   ├── Eyes — transmissive crystal + iris glow
│   ├── FacePlate_Transparent — packed `Swarms_Baked` shell + trans-clear viewport
│   ├── FacePlate_Kal — packed `KalShields_Baked` metal, no viewport
│   ├── Krana — tinted from `colors.eyes`
│   └── ROOT — skeleton (`Shield_L` / `Shield_R` under `Hand.L` / `Hand.R`; `Face Plate` under `Head`)
│       └── Face Plate — Gahlok.Symbol … Tahnok.Symbol (toggle the active Kal print)
├── Gahlok / Kohrak / Lehvak / Nuhvok / Pahrak / Tahnok — swarm shields (`Swarms_Baked`)
└── {Breed}.Kal — Kal shields (`KalShields_Baked`)
```

Shipped clips: `Idle`, plus unused `Ball` and `Flying`. Attack / Hit / Defeat use procedural combat motion until this export gains the master clips. Do not graduate `bohrok-packed-combat` until those ship.

`CharacterScene` and `CombatantModel` both draw this body for `MatoranStage.Bohrok` and `MatoranStage.BohrokKal`.

The packed export is already ~11 units tall (visual size of master's scaled `Bohrok` node). Do **not** apply `BOHROK_PACKED_MATCH_MASTER_SCALE` on the clone. Battle `0.175` is shared.

Draco: `yarn compress` now preflights UV/texture slots (`yarn diagnose-glb-draco`). Faceplate `Main` previously crashed Draco with `texCoord: -1` / `scratches-2` and no UVs — disconnect unused Image Textures or unwrap before export.

---

## Mesh nodes

| Node                    | Draws | Notes                                                                             |
| ----------------------- | ----: | --------------------------------------------------------------------------------- |
| `Body`                  |     4 | One skinned mesh, one draw per `Body_*_Baked` slot                                |
| `Kal`                   |     3 | One skinned mesh, one draw per `Kal_*_Baked` slot                                 |
| `Eyes`                  |     2 | `Trans_Color` (crystal, blooms) + `Glowing` (emissive iris, no bloom)             |
| `FacePlate_Transparent` |     2 | Packed `Swarms_Baked` shell + `Clear` (colorless viewport)                        |
| `FacePlate_Kal`         |     1 | Packed `KalShields_Baked` metal                                                   |
| `Krana`                 |     1 | `Krana` — `colors.eyes`                                                           |
| Swarm shields (×6)      |     1 | Each `Swarms_Baked`. Clone the active breed onto both sockets                     |
| Kal shields (×6)        |     1 | Each `KalShields_Baked`. Same sockets                                             |
| Kal symbols (×6)        |     1 | Under `Face Plate`. Toggle the active print; do not remap leftover material names |

Opaque chassis slots, `Swarms_Baked`, and `KalShields_Baked` use packed `emissiveMap` (R roughness, G metalness, B wear) and tangent `normalMap` (`authoredPbrMaps: 'packed'`). Do not export glTF metallicRoughness — wear lives in packed **B** as sparse edge highlights, not a filled AO.

---

## Swarm body material slots (`Body`)

| Slot                   | Runtime tint            | Weathered                        | Notes                                       |
| ---------------------- | ----------------------- | -------------------------------- | ------------------------------------------- |
| `Body_Main_Baked`      | `body.main`             | Yes — packed PBR + bake + normal | Shell / feet plastics                       |
| `Body_Secondary_Baked` | `arms.main`             | Yes                              | Limb / accent atlas                         |
| `Body_Metal_Baked`     | `body.metal`            | Yes (Mata metal PBR + packed)    | Defaults to LightGray when palette omits it |
| `Body_Black_Baked`     | Fixed `LegoColor.Black` | Yes (packed plastic)             | Axles, pins                                 |

## Kal body material slots (`Kal`)

| Slot              | Runtime tint                | Weathered                     | Notes                   |
| ----------------- | --------------------------- | ----------------------------- | ----------------------- |
| `Kal_Main_Baked`  | `body.main`                 | Yes — packed PBR + bake       | Breed-colored Kal shell |
| `Kal_Black_Baked` | Fixed `LegoColor.Black`     | Yes                           | Axles, pins             |
| `Kal_Metal_Baked` | Fixed `LegoColor.LightGray` | Yes (Mata metal PBR + packed) | Silver extras           |

---

## Accessories

| Slot               | Runtime tint                  | Notes                                                       |
| ------------------ | ----------------------------- | ----------------------------------------------------------- |
| `Swarms_Baked`     | `body.main`                   | Packed swarm faceplate shell + all six swarm shields        |
| `KalShields_Baked` | Fixed `LegoColor.LightGray`   | Packed Kal faceplate + all six Kal shields (Mata metal PBR) |
| `Clear`            | colorless transmissive clear  | Swarm faceplate viewport only; no bloom                     |
| `Trans_Color`      | `eyes` + transmissive crystal | Same `crystal` preset as kit `BohrokEye` Brain              |
| `Glowing`          | `eyes` emissive               | Intensity 5; **no** selective-bloom MRT                     |
| `Krana`            | `eyes`                        | Unweathered                                                 |

Kal `{Breed}.Symbol` meshes keep their authored materials (including leftover Blender names). Runtime only toggles visibility.

---

## Blender export checklist

1. **One armature** — `Bohrok` only. Accessory shields stay scene roots; symbols stay under `Face Plate`.
2. **Body** — skinned swarm chassis; `Body_*_Baked`; **packed emissive** + **normal** bakes. Packed **B** is edge wear. Do not export metallicRoughness.
3. **Kal** — skinned replacement chassis (not an overlay); `Kal_*_Baked`. Hide `Body` at runtime for Kal.
4. **Swarm faceplate** — skinned; packed `Swarms_Baked` shell + `Clear` viewport.
5. **Kal faceplate** — skinned; solid `KalShields_Baked` metal, no viewport.
6. **Per-breed swarm shields** — rigid local-space meshes named `Gahlok` / `Kohrak` / `Lehvak` / `Nuhvok` / `Pahrak` / `Tahnok`, `Swarms_Baked` atlas. Runtime parents them onto `Shield_L` / `Shield_R`. Export in pose mode so socket-local space matches the swarm shields.
7. **Per-breed Kal shields** — `{Breed}.Kal`, `KalShields_Baked`, same sockets and the same local-space attach as swarm.
8. **Kal symbols** — `{Breed}.Symbol` parented under `Face Plate`. Runtime toggles the active print.
9. **Eyes / Krana** may stay unpacked.
10. Export; verify `Idle` drives the `Bohrok` skeleton.
11. Re-introduce Attack / Hit / Defeat from `bohrok_master.glb` before graduating the packed-combat epic.

---

## Runtime

| File                                 | Role                                                              |
| ------------------------------------ | ----------------------------------------------------------------- |
| `BohrokModel.tsx`                    | Single packed path (`Bohrok.glb`) for swarm and Kal               |
| `bohrokSheetMeshes.ts`               | Node / material names, variant swap, shield attach, symbol toggle |
| `kit/palettes/bohrokSheetPalette.ts` | Packed swarm + Kal atlases + accessory tints                      |
