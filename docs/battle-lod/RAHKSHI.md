# Battle LOD authoring — Rahkshi

Phase **C** pilot for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md). Rahkshi is a good **first Blender target** before Mata Toa:

- **Battle-first** — no dex `CharacterScene` split; used in combat + Rahkshi inventory preview only.
- **Two tint axes** — kraata `armor` + `joint` hex (from [`rahkshiArmorColors.ts`](../../src/data/rahkshiArmorColors.ts)); chassis/technic colors are fixed.
- **Natural instancing** — one `rahkshi.glb` rig, many combatants differing only by palette ([`cloneGltfInstance`](../../src/rendering/3d/utils/cloneGltfInstance.ts) today).
- **Smaller kit surface** — 41 kit sockets (34× `kit_2001` + 7× `kit_2003`) vs ~53 on Mata Tahu.

**Main perf problem today:** `uniqueMaterials: true` on weathered metal gives **one material instance per baked mesh**, and ~41 kit clones add many more draws. Battle LOD + later `InstancedMesh` fixes both.

---

## Current architecture (what you are replacing)

```
rahkshi.glb → clone bodyInstance (baked meshes)
           → weathered metal per mesh (uniqueMaterials)
           → kit_2003 attach (7 sockets)
           → kit_2001 attach (34 sockets)
           → kraata eye/head glow lerp in useFrame
```

| Layer          | Source                                                                           | Notes                                                                                                               |
| -------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Baked rig      | `Back`, `Face`, `KraataCradle`, `KraataCradleHolder`, `RahkshiShoulders`, `Eyes` | Stay on GLB — not from kit                                                                                          |
| Staff variants | `GuurahkL/R/S`, `TurahkL/R/S`, … (18 meshes)                                     | Only one breed visible ([`rahkshiVariantMeshes.ts`](../../src/rendering/3d/CharacterScene/rahkshiVariantMeshes.ts)) |
| Kit 2003       | Body, feet, legs, limbs                                                          | [`RAHKSHI_KIT_2003_ATTACHMENTS`](../../src/rendering/3d/kit/attachments/rahkshi.ts)                                 |
| Kit 2001       | Sockets, technic arms, axles, gears                                              | [`RAHKSHI_KIT_2001_ATTACHMENTS`](../../src/rendering/3d/kit/attachments/rahkshi.ts)                                 |

Kit attachment reference: [`rahkshi.ts`](../../src/rendering/3d/kit/attachments/rahkshi.ts). Palette rules: [`rahkshiKitPalette.ts`](../../src/rendering/3d/kit/palettes/rahkshiKitPalette.ts).

---

## Recommended pilot scope

Do **not** merge all six staff breeds in pass 1.

| Pass  | Goal                                                                                                        |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| **1** | One staff breed (suggest **Guurahk** — `KraataPower.Disintegration`, common in story) + full body merge     |
| **2** | Duplicate staff battle meshes for Turahk / Panrahk / Lerahk / Vorahk / Kurahk (or author visibility groups) |
| **3** | Code: `Rahkshi_Battle` in `CombatantModel`, drop kit attach in battle                                       |
| **4** | `InstancedMesh` for duplicate kraata in one wave (Phase D)                                                  |

Inventory preview (`/test/model/rahkshi/...`) can switch to battle LOD once visuals match; no separate dex fidelity requirement.

---

## Export target

| Item           | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| GLB            | `public/rahkshi.glb`                                               |
| Armature       | Unchanged — `Empty` → `Idle` kraata glow gate stays on same clips  |
| Live node      | `Rahkshi` (keep for preview / fallback during transition)          |
| Battle root    | `Rahkshi_Battle` — grouped battle meshes under same armature       |
| Staff (pass 1) | `Rahkshi_Battle_Staff_Guurahk` — merged L + R + S for Guurahk only |

Later: `Rahkshi_Battle_Staff_Turahk`, etc., toggled by `getRahkshiArmorColors(kraata).staff`.

---

## Material buckets

### Opaque — merge globally (one skinned mesh per bucket)

|   # | Blender material       | Runtime tint                                                       | Weathered | Collapses                                                                                        |
| --: | ---------------------- | ------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------ |
|   1 | `Battle_Armor`         | `rahkshiKitColors` → `body.main` / `face` (= kraata **armor** hex) | Yes       | Baked `Back`, `Face`; spine sockets `Socket_SL/SR`; feet `Secondary`; kit spine palette          |
|   2 | `Battle_Joint`         | `feet.main` / `feet.glow` (= kraata **joint** hex)                 | Yes       | Feet kit; limb sockets; `TechnicArmPistonN`                                                      |
|   3 | `Battle_Chassis`       | Fixed `LegoColor.DarkBluishGray`                                   | Yes       | `RahkshiBody`, legs, limbs, technic arm main/joint, `AxleConnRidged_B`; baked cradle + shoulders |
|   4 | `Battle_Technic_Black` | Fixed black                                                        | Light     | Black axles, `TechnicArmPistonT`                                                                 |
|   5 | `Battle_Technic_Metal` | Fixed technic metal PBR                                            | Metal PBR | `GearM`, `AxleConnRidged_SL/SR`                                                                  |
|   6 | `Battle_Tan`           | Fixed tan                                                          | Light     | `AxlePin_*`                                                                                      |

**Opaque draws (pass 1):** 6.

### Separate meshes — do not merge

|   # | Blender material  | Runtime                                | Why separate                                                                                                                   |
| --: | ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
|   7 | `Battle_Eyes`     | `colors.eyes` + bloom MRT              | Baked `Eyes` — [`isSelectiveBloomRahkshiEyeName`](../../src/rendering/3d/CharacterScene/selectiveBloom.ts); kraata on/off lerp |
|   8 | `Battle_HeadRing` | `colors.eyes` emissive, **no** bloom   | `Socket_Head` kit — synced with eyes in [`Rahkshi.tsx`](../../src/rendering/3d/CharacterScene/Rahkshi.tsx)                     |
|   9 | `Battle_Staff`    | `Battle_Armor` (usually same as armor) | Guurahk `L` + `R` + `S` merged for pass 1                                                                                      |

**Special draws:** 3.

### Target total (pass 1)

| Category                 |  Draws |
| ------------------------ | -----: |
| Opaque buckets 1–6       |      6 |
| Eyes + head ring + staff |      3 |
| **Total**                | **~9** |

Compare to full kit path: likely **40+** draws per Rahkshi (41 sockets + baked meshes with `uniqueMaterials`).

---

## Kraata color mapping (for Blender verification)

`rahkshiKitColors(dex)` maps lore armor/joint onto kit slots:

| Bucket                            | Source on Chameleon example                  |
| --------------------------------- | -------------------------------------------- |
| `Battle_Armor`                    | Red (`dex.armor`)                            |
| `Battle_Joint`                    | Gold (`dex.joint`)                           |
| `Battle_Chassis`                  | `#6B5A5A` DBG (fixed)                        |
| `Battle_Eyes` / `Battle_HeadRing` | Orange (`colors.eyes` — fixed in code today) |

Single-color kraata (e.g. Hunger): armor === joint → buckets 1 and 2 share the same hex; **still keep two materials** if you want per-channel instancing later, or merge to one draw when equal.

---

## Socket → bucket map

### `Battle_Technic_Black`

`Axle2_LKL`, `Axle2L_B`, `Axle2L_F`, `Axle2L_KR`, `Axle2LL`, `Axle2LR`, `Axle3L_B`, `Axle3L_H`, `TechnicArmPistonT_L`, `TechnicArmPistonT_R`

### `Battle_Technic_Metal`

`GearM`, `AxleConnRidged_SL`, `AxleConnRidged_SR`

### `Battle_Tan`

`AxlePin_KL`, `AxlePin_KR`, `AxlePin_T`

### `Battle_Chassis`

`RahkshiBody`, `RahkshiLeg_L/R`, `RahkshiLimb_L/R`, `TechnicArmMain_L/R`, `TechnicArmJoint_L/R`, `AxleConnRidged_B`, baked `KraataCradle`, `KraataCradleHolder`, `RahkshiShoulders`

### `Battle_Armor`

Baked `Back`, `Face`; `Socket_SL`, `Socket_SR`; `RahkshiFoot_L/R` (secondary slot); **staff Guurahk L/R/S** (pass 1)

### `Battle_Joint`

`Socket_FL`, `Socket_FR`, `Socket_HipL`, `Socket_HipR`, `Socket_HR`, `Socket_KL`, `Socket_KR`, `SocketHL`; `RahkshiFoot_L/R` (main); `TechnicArmPistonN_L/R`

### Separate

| Part                               | Bucket                  |
| ---------------------------------- | ----------------------- |
| Baked `Eyes`                       | `Battle_Eyes`           |
| `Socket_Head`                      | `Battle_HeadRing`       |
| `GuurahkL`, `GuurahkR`, `GuurahkS` | `Battle_Staff` (pass 1) |

---

## Behaviors to preserve (code checklist)

When wiring `Rahkshi_Battle` in `CombatantModel` / slimmed `Rahkshi.tsx`:

| Behavior                       | Today                                                     | Battle LOD                                                      |
| ------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------- |
| No kraata (`hasKraata: false`) | Eyes + head ring lerped to black; `Empty` idle until glow | Same lerp on `Battle_Eyes` + `Battle_HeadRing` materials        |
| Kraata inserted                | Emissive lerp → idle                                      | Unchanged logic, fewer materials to iterate                     |
| Staff breed                    | Show `{staff}L/R/S`, hide other 17 variant meshes         | Toggle `Rahkshi_Battle_Staff_{staff}` group visibility          |
| Kraata tint                    | `getRahkshiArmorColors` → weathered                       | Tint `Battle_Armor` + `Battle_Joint` (+ staff if armor-colored) |
| Bloom                          | `Eyes` only on baked mesh                                 | `Battle_Eyes` keeps bloom MRT; head ring does **not**           |
| Animations                     | `Empty`, `Idle`, `Attack`, `Hit`, `Defeat`                | Same armature / clips                                           |

---

## Blender workflow (pass 1 — Guurahk)

### 1. Setup

1. Open `rahkshi.glb` + append kit pieces (or use existing linked rig with kit instances).
2. Hide / delete the 15 non-Guurahk staff variant meshes (`Turahk*`, `Kurahk*`, …) from the **battle** collection only — keep them on the live `Rahkshi` node for inventory until pass 2.

### 2. Assign `Battle_*` materials

Replace per-part materials using the bucket table. Match names **exactly** for future `applyRahkshiBattlePalette`.

### 3. Join geometry

1. Optional: per-bone joins within each bucket.
2. **Global join** — one object per opaque bucket (6 objects).
3. Separate objects for `Battle_Eyes`, `Battle_HeadRing`, `Battle_Staff` (Guurahk L+R+S joined).

### 4. Skinning

- Kit rigid parts: **100% weight** to parent bone (`FootL`, `HandL`, …).
- Baked pieces: keep existing weights.
- Staff variants: weight to hand / spine bones as authored today.

### 5. Export

- Parent group: `Rahkshi_Battle` under armature.
- Staff sub-object: `Rahkshi_Battle_Staff_Guurahk` (or mesh inside group).
- Re-export `rahkshi.glb`; verify clips unchanged.

### 6. Visual QA

Compare side-by-side with live kit build for **Disintegration** kraata:

- `/test/model/rahkshi/Disintegration` (preview)
- Battle encounter with Guurahk-staff rahkshi

---

## Staff breeds (pass 2)

| `staff` prefix | Kraata powers (examples)            | Variant meshes |
| -------------- | ----------------------------------- | -------------- |
| `Guurahk`      | Disintegration                      | `GuurahkL/R/S` |
| `Panrahk`      | Fragmentation, Molecular Disruption | `PanrahkL/R/S` |
| `Lerahk`       | Poison                              | `LerahkL/R/S`  |
| `Vorahk`       | Hunger                              | `VorahkL/R/S`  |
| `Kurahk`       | Anger                               | `KurahkL/R/S`  |
| `Turahk`       | Most other powers (fallback staff)  | `TurahkL/R/S`  |

Each breed adds **~1 draw** (`Battle_Staff` mesh per breed, visibility toggle) unless you merge all breeds into one GLB with shape keys (not recommended).

---

## Instancing (Phase D — after battle LOD)

Once all combat Rahkshi use `Rahkshi_Battle`:

```
InstancedMesh(rahkshiBattleGeometry, battleMaterial, waveCount)
  └─ instanceColor or per-instance uniform: armor + joint hex
```

Batch instances that share **identical** armor + joint colors (same kraata power in a wave). Mixed powers in one wave = multiple instance groups or unique draws — still far below 41× kit clones.

---

## Code follow-up (not in this doc’s scope)

| File                           | Change                                                         |
| ------------------------------ | -------------------------------------------------------------- |
| `Rahkshi.tsx`                  | Battle branch: load `Rahkshi_Battle`, skip `useKitAttachments` |
| `CombatantModel.tsx`           | Already routes `rahkshi` model                                 |
| `rahkshiKitPalette.ts`         | Extract `applyRahkshiBattlePalette(mesh, dex)`                 |
| `docs/battle-lod/TAHU_MATA.md` | Mata Toa after Rahkshi pilot validates pipeline                |

---

## Suggested order of work

1. **Measure** — perf overlay in a multi-Rahkshi wave (baseline draws).
2. **Blender pass 1** — Guurahk + 6 opaque buckets + eyes/head/staff (~9 draws).
3. **PR: GLB only** — E2E Rahkshi snapshots update; kit path still default until code lands.
4. **PR: battle code** — switch `CombatantModel` / battle `RahkshiModel` to `Rahkshi_Battle`.
5. **Blender pass 2** — remaining five staff breeds.
6. **Instancing** — same geometry, kraata tint uniforms.

---

## Related docs

- [`battle-lod/TAHU_MATA.md`](TAHU_MATA.md) — Mata Toa bucket spec (more buckets, mask runtime)
- [`KIT_GEOMETRY_MERGE.md`](../KIT_GEOMETRY_MERGE.md) — Phase B incremental merge (ships before battle LOD)
