# Battle LOD authoring — Rahkshi

Phase **C** pilot for [`docs/3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md).

---

## GLB layout (`public/rahkshi.glb`)

Two armatures in one file:

| Rig        | Node             | Used by                     | Contents                                                                                                 |
| ---------- | ---------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Live**   | `Rahkshi`        | Inventory preview, fallback | Original kit + baked textures — [`Rahkshi.tsx`](../../src/rendering/3d/CharacterScene/Rahkshi.tsx) today |
| **Battle** | `rahkshi_battle` | Combat (target)             | Merged battle LOD — no kit attach                                                                        |

Same animation clips on both armatures (`Empty`, `Idle`, `Attack`, `Hit`, `Defeat`).

---

## `rahkshi_battle` mesh tree

```
rahkshi_battle (armature)
├── Body          — one SkinnedMesh, multiple material slots (opaque buckets below)
│                   includes shared / common staff geometry
├── Head          — one mesh, material `Battle_Bloom` (emissive + selective bloom)
└── Species_*     — six meshes, one material slot each (only one visible at runtime)
    ├── Species_Guurahk   — spine + staff
    ├── Species_Turahk
    ├── Species_Panrahk
    ├── Species_Lerahk
    ├── Species_Vorahk
    └── Species_Kurahk
```

### Why this shape

| Piece                          | Rationale                                                                                                                                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Body** (multi-slot skinned)  | Six opaque tint buckets as **material slots on one mesh** — same draw cost as six separate skinned meshes, simpler export. Shared staff parts that do not vary by breed live here.                                                |
| **Head** (single bloom mesh)   | Merges baked `Eyes` + kit `Socket_Head` disk into **one emissive mesh with bloom MRT**. Drops a draw vs separate eyes / head-ring passes and matches the visual (glow reads as one unit).                                         |
| **Species\_\*** (six overlays) | Spine armor + staff shape differ per breed ([`rahkshiVariantMeshes.ts`](../../src/rendering/3d/CharacterScene/rahkshiVariantMeshes.ts)). One material each; runtime shows **one** mesh via `getRahkshiArmorColors(kraata).staff`. |

### Target draw count (battle)

| Mesh                      |  Draws |
| ------------------------- | -----: |
| `Body` (6 material slots) |      6 |
| `Head` (bloom)            |      1 |
| One visible `Species_*`   |      1 |
| **Total**                 | **~8** |

Compare to live kit path: **40+** draws per Rahkshi.

---

## Body material slots

Name slots on the **`Body`** skinned mesh exactly as below so `applyRahkshiBattlePalette` can map kraata colors.

| Slot                   | Runtime tint                              | Weathered | Source geometry (live rig)                                                  |
| ---------------------- | ----------------------------------------- | --------- | --------------------------------------------------------------------------- |
| `Battle_Armor`         | `body.main` / `face` (= kraata **armor**) | Yes       | Baked `Back`, `Face`; spine sockets; feet secondary; **common staff** parts |
| `Battle_Joint`         | `feet.main` (= kraata **joint**)          | Yes       | Feet kit; limb sockets; `TechnicArmPistonN`                                 |
| `Battle_Chassis`       | Fixed `LegoColor.DarkBluishGray`          | Yes       | Body, legs, limbs, technic arms, cradle, shoulders                          |
| `Battle_Technic_Black` | Fixed black                               | Light     | Black axles, `TechnicArmPistonT`                                            |
| `Battle_Technic_Metal` | Fixed technic metal                       | Metal PBR | `GearM`, shoulder axle connectors                                           |
| `Battle_Tan`           | Fixed tan                                 | Light     | `AxlePin_*`                                                                 |

Single-color kraata (armor === joint): slots 1 and 2 may share the same hex at runtime; keep both slots unless you merge them in Blender when armor always equals joint.

Palette rules: [`rahkshiKitPalette.ts`](../../src/rendering/3d/kit/palettes/rahkshiKitPalette.ts). Socket reference: [`rahkshi.ts`](../../src/rendering/3d/kit/attachments/rahkshi.ts).

---

## Head mesh

| Item            | Detail                                                                                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Merge**       | Baked eye slits + head socket / kraata disk (`Socket_Head` kit) → **one** mesh                                                                                                                        |
| **Material**    | `Battle_Bloom` — emissive from `colors.eyes`, **selective bloom MRT** ([`isSelectiveBloomRahkshiEyeName`](../../src/rendering/3d/CharacterScene/selectiveBloom.ts) matches `Eyes` and `Battle_Bloom`) |
| **Kraata lerp** | No kraata: lerp emissive/color to black; `Empty` idle until glow completes — same as live [`Rahkshi.tsx`](../../src/rendering/3d/CharacterScene/Rahkshi.tsx), but **one** material to animate         |

No separate non-bloom head ring mesh.

---

## Species meshes

One mesh per staff breed; **one material slot** each (tint with `Battle_Armor` / armor hex unless authored otherwise).

| Mesh name (suggested) | `staff` prefix | Kraata examples                     |
| --------------------- | -------------- | ----------------------------------- |
| `Species_Guurahk`     | `Guurahk`      | Disintegration                      |
| `Species_Panrahk`     | `Panrahk`      | Fragmentation, Molecular Disruption |
| `Species_Lerahk`      | `Lerahk`       | Poison                              |
| `Species_Vorahk`      | `Vorahk`       | Hunger                              |
| `Species_Kurahk`      | `Kurahk`       | Anger                               |
| `Species_Turahk`      | `Turahk`       | Fallback — most other powers        |

Each mesh contains that breed’s **spine (S) + staff hands (L/R)** geometry merged for export. Replaces the live rig’s eighteen separate variant meshes (`GuurahkL`, `GuurahkR`, …).

Runtime: `shouldShowRahkshiVariantMesh` logic becomes **show `Species_{staff}`, hide the other five**.

---

## Live rig (unchanged) — for comparison

```
Rahkshi → clone bodyInstance → weathered baked meshes
       → kit_2003 (7 sockets) + kit_2001 (34 sockets)
       → eye / head-socket glow lerp
       → show 3 of 18 variant meshes per staff prefix
```

Keep this path for inventory preview until battle visuals are signed off.

---

## Behaviors to preserve (battle code)

| Behavior        | Live                                             | `rahkshi_battle`                        |
| --------------- | ------------------------------------------------ | --------------------------------------- |
| No kraata       | Eyes (+ head kit) lerp black; `Empty` until glow | Lerp **`Battle_Bloom`** only            |
| Kraata inserted | Glow lerp → `Idle`                               | Same, one `Battle_Bloom` material       |
| Staff breed     | 3 of 18 variant meshes visible                   | 1 of 6 `Species_*` visible              |
| Kraata tint     | `getRahkshiArmorColors` → weathered              | Tint `Body` slots + visible `Species_*` |
| Bloom           | `Eyes` MRT                                       | **`Battle_Bloom`** MRT                  |
| Animations      | Shared clips                                     | Same armature actions                   |

---

## Blender export checklist

1. **Live collection** — `Rahkshi` armature + kit instances (unchanged from current ship).
2. **Battle collection** — `rahkshi_battle` armature:
   - Join opaque geometry into **`Body`**; assign six `Battle_*` slots; skin to bones; include common staff pieces.
   - Join eyes + head disk → **`Head`**; material **`Battle_Bloom`**.
   - Per breed: join spine + staff L/R → **`Species_{Breed}`**; one material each.
3. Export both armatures in `rahkshi.glb`; verify actions on both.
4. Visual QA: Disintegration (Guurahk), Poison (Lerahk), Hunger (Vorahk) vs live kit build.

---

## Code follow-up (separate PR from GLB)

| File                      | Change                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| `Rahkshi.tsx`             | Battle: clone `rahkshi_battle`, skip `useKitAttachments`; palette + head lerp + species visibility |
| `rahkshiVariantMeshes.ts` | Map `staff` → `Species_*` mesh name (or replace with simple visibility helper)                     |
| `selectiveBloom.ts`       | `isSelectiveBloomRahkshiEyeName` matches `Eyes` and `Battle_Bloom`                                 |
| `rahkshiKitPalette.ts`    | `applyRahkshiBattlePalette(body, speciesMesh, dex)`                                                |

Preview route can keep live `Rahkshi` until battle path is default everywhere.

---

## Instancing (Phase D)

Same `rahkshi_battle` geometry for all instances; `instanceColor` or uniforms for armor + joint on `Body` slots. Batch by identical kraata power in a wave.

---

## Related docs

- [`battle-lod/TAHU_MATA.md`](TAHU_MATA.md) — Mata Toa (separate dex + battle split)
- [`3D_RENDERING_STRATEGY.md`](../3D_RENDERING_STRATEGY.md) — phased plan
