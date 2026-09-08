# Battle LOD authoring — Toa Tahu (Mata)

Phase **C** spec for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Same socket layout as the other Mata Toa (Gali, Kopaka, …); reuse this **bucket list** on every Mata rig template with rig-specific proportions only.

**Goal:** one battle skinned mesh set per rig template, **~10–14 GPU draws** for kit + embedded body (vs ~74–82 today), plus mask attach.

---

## Export target

| Item          | Value                                                       |
| ------------- | ----------------------------------------------------------- |
| GLB           | `public/Toa_Mata/tahu.glb` (same file as dex)               |
| Armature      | Unchanged — same bones and animation clips                  |
| Dex node      | `Tahu` (existing — full detail or simplified rig mesh only) |
| Battle root   | `Tahu_Battle` — parented under the same armature            |
| Battle meshes | See tables below (opaque buckets + separate pass meshes)    |

`CombatantModel` will load `Tahu_Battle` + `useMask` (mask swaps stay runtime). `CharacterScene` keeps `useKitAttachments` + full `Tahu`.

---

## Material buckets (opaque — merge globally)

Join **all** geometry (embedded `Tahu` body + every kit socket) that shares a bucket into **one skinned mesh per bucket**, weighted to the correct bones. Per-bone joining is fine as an intermediate step; the final export should be **one object per bucket** (or one object with one material slot per bucket).

Name Blender materials **exactly** as below so a future `applyBattlePalette` can map 1:1 to dex colors.

|   # | Blender material name  | Runtime tint (`matoran.colors`) | Weathered metal | Collapses kit slots                                        | Notes                                                                                  |
| --: | ---------------------- | ------------------------------- | --------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
|   1 | `Battle_Main`          | `body.main`                     | Yes             | `Main` on sockets using `MATA_KIT_PLAYER_PALETTE_PLASTICS` | Chest, hips, legs, arms (L), feet, hands (L), face shell, waist, pistons, sword `Main` |
|   2 | `Battle_Secondary`     | `body.secondary`                | Yes             | `Main` where attachment overrides to Secondary             | `Arm_Lower_R_1`, `Arm_Upper_R_1`, `HandR`; sword `Secondary`                           |
|   3 | `Battle_Metal`         | `body.metal`                    | Yes (metal PBR) | `Metal` on plastic parts                                   | Studs / metallic accents on Mata parts; sword `Metal`                                  |
|   4 | `Battle_Face`          | `face`                          | Yes             | `Face`                                                     | McToran-style face plate plastic                                                       |
|   5 | `Battle_Technic_Black` | Fixed `LegoColor.Black`         | Light or none   | `Main` on `KIT_TECHNIC_MAIN_BLACK`                         | Axles, pins, ball joints, black connectors (see socket list)                           |
|   6 | `Battle_Technic_Metal` | Fixed light-gray technic PBR    | Metal PBR       | `Main` on `KIT_TECHNIC_MAIN_METAL`                         | Gears, spacers                                                                         |

**Estimated opaque draws:** 6.

Custom characters on the Tahu rig reuse these six buckets; only uniform colors change.

---

## Separate meshes (do not merge into opaque buckets)

|   # | Blender material name | Runtime tint                       | Why separate                                                                     |
| --: | --------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
|   7 | `Battle_Eyes`         | `eyes` (emissive)                  | `Glowing Eyes` — emissive only, **no** selective-bloom MRT                       |
|   8 | `Battle_Weapon_Glow`  | `weapon.glow` (emissive)           | Sword `Glow` — selective-bloom MRT (`isSelectiveBloomKitGlowName`)               |
|   9 | `Battle_Brain`        | `eyes` + transmissive brain shader | `Brain` on `MataBrain` — `MeshPhysicalMaterial` transmission, fixed render order |

**Estimated special-pass draws:** 3.

---

## Mask (runtime attach — not baked into battle body)

Keep **`useMask`** on `nodes.Masks` with `masks.glb` (Hau, gold Hau, infected, etc.). Do **not** bake the Kanohi into `Tahu_Battle` unless you are willing to lose quest-driven mask swaps.

|   # | Source                    | Runtime tint                              | Draws |
| --: | ------------------------- | ----------------------------------------- | ----: |
|  10 | `masks.glb` via `useMask` | `mask` (+ optional glow / power emissive) |  ~1–2 |

---

## Target draw budget (Tahu battle LOD)

| Category                                          |      Draws |
| ------------------------------------------------- | ---------: |
| Opaque buckets (1–6)                              |          6 |
| Eyes + weapon glow + brain (7–9)                  |          3 |
| Mask (10)                                         |        1–2 |
| Embedded rig leftovers (merge into buckets above) |          0 |
| **Total character**                               | **~10–12** |

Compare: Phase B kit path ≈ **74** draws on the character sheet subtree.

---

## Socket → bucket map (kit attachments)

Reference: [`src/rendering/3d/kit/attachments/Toa Mata/tahu.ts`](../../src/rendering/3d/kit/attachments/Toa%20Mata/tahu.ts).

### `Battle_Technic_Black`

`Axle6L`, `AxleMod2L`, `AxleModHips`, `AxleSocket1L`, `BallJoint`, `ArmJointStopper`, `FingerB`, `FingerF`, `Hip_Joint_L_1`, `Hip_Joint_R_1`, `Neck_1`, `Shoulder_Joint_L_1`, `Shoulder_Joint_R_1`, `Shoulder_L_1`, `Shoulder_R_1`

### `Battle_Technic_Metal`

`GearB`, `GearMM`, `GearMR`, `Spacer1LB`, `Spacer1LF`

### `Battle_Secondary` (Main slot tinted as secondary)

`Arm_Lower_R_1`, `Arm_Upper_R_1`, `HandR`

### `Battle_Main` + `Battle_Metal` + `Battle_Face` (full `TAHU_PALETTE_COLORS`)

All remaining plastic sockets: ankles, arms (L), chest, waist, legs, feet, hands (L), `MataHip`, pistons, `Face`, `TahuSword` (`Main` / `Metal` / `Secondary` — not `Glow`).

### Separate passes

| Socket         | Kit node          | Bucket                                    |
| -------------- | ----------------- | ----------------------------------------- |
| `Brain`        | `MataBrain`       | `Battle_Brain`                            |
| `Glowing_Eyes` | `MataGlowingEyes` | `Battle_Eyes`                             |
| `TahuSword`    | `TahuSword`       | `Battle_Weapon_Glow` for `Glow` slot only |

---

## Blender workflow

### 1. Prepare battle collection

1. Duplicate the posed rig + all kit instances (or append from `kit_2001.glb` + `tahu.glb`).
2. Hide dex-only detail if needed; keep the **same armature**.

### 2. Assign bucket materials

Replace per-part materials with the six opaque `Battle_*` names above. Assign special materials on eyes, sword glow, and brain **before** joining.

### 3. Join geometry

**Recommended order:**

1. Per bone: join meshes that already share the **same** `Battle_*` material (optional cleanup).
2. **Globally:** join all `Battle_Main` into one object, all `Battle_Secondary` into one, etc.
3. Leave **separate objects** for `Battle_Eyes`, `Battle_Weapon_Glow`, `Battle_Brain`.

One skinned mesh per bucket is the export target. A single mesh with multiple material slots is equivalent for draw count (one draw per slot).

### 4. Skinning

- Rigid kit parts parented to a bone: weight **100%** to that bone.
- Embedded `Tahu` body pieces: preserve existing weights.
- After global joins, each bucket object is one armature parent with one skin modifier.

### 5. Export

- Node name: `Tahu_Battle` (empty or armature child grouping all battle meshes).
- Same actions/clips as dex (`Idle`, `Attack`, `Hit`, `Defeat`, …).
- glTF: export skinned meshes; material names must match the table above.

### 6. Verify in-engine (when code lands)

- Battle: `CombatantModel` → `Tahu_Battle` + palette + `useMask`.
- Dex: unchanged full kit path.
- Console: `[character:Toa_Tahu] render cost` should **not** run on battle path; use perf overlay draw count instead.

---

## Canonical Tahu colors (reference)

From [`src/data/dex/toa.ts`](../../src/data/dex/toa.ts) — custom builds override these at runtime; buckets stay the same.

| Bucket                         | Tahu canonical   |
| ------------------------------ | ---------------- |
| `Battle_Main`                  | Red              |
| `Battle_Secondary`             | Orange           |
| `Battle_Metal`                 | Light gray       |
| `Battle_Face`                  | Light gray       |
| `Battle_Eyes` / `Battle_Brain` | Trans neon red   |
| `Battle_Weapon_Glow`           | Orange emissive  |
| `Battle_Technic_Black`         | Black            |
| `Battle_Technic_Metal`         | Light gray metal |
| Mask (runtime)                 | Red Hau          |

---

## Reuse on other Mata Toa

| Rig template | GLB        | Battle node     | Attachment map           |
| ------------ | ---------- | --------------- | ------------------------ |
| Tahu         | `tahu.glb` | `Tahu_Battle`   | `tahu.ts`                |
| Gali         | `gali.glb` | `Gali_Battle`   | `gali.ts` (same sockets) |
| …            | …          | `{Name}_Battle` | same bucket rules        |

Weapon sockets differ (hooks, axes, etc.) but bucket rules are identical: plastics → Main/Secondary/Metal/Face, technic → black/metal, glow → separate mesh.

---

## Related code (future Phase C)

| File                                                     | Role                                      |
| -------------------------------------------------------- | ----------------------------------------- |
| `src/pages/Battle/CombatantModel.tsx`                    | Branch to battle GLB node                 |
| `src/rendering/3d/CharacterScene/Mata/TahuMataModel.tsx` | Dex path (unchanged)                      |
| `src/rendering/3d/kit/attachments/Toa Mata/tahu.ts`      | Source of truth for socket → slot mapping |
| `src/rendering/3d/kit/palettes/mataKitPlayerPalette.ts`  | Dex palette → kit slot names              |
