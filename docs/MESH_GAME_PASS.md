# Mesh game pass (adapted assets + battle LOD)

Most character geometry in this project was authored for **offline Blender renders**, not real-time engines. Imports often carry too many triangles, hidden interior faces, and too many material splits for what actually appears on screen in the idle RPG (character sheet framing, battle scale, kit cloning).

This doc is a **repeatable checklist** for adapting those meshes. It also explains how **battle LOD** fits in: a deliberate **bake** parallel to the live kit path, not a one-time destructive join that breaks when the kit library changes.

**Related:**

| Doc                                                            | Role                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`3D_RENDERING_STRATEGY.md`](3D_RENDERING_STRATEGY.md)         | Dex vs battle tiers, draw-call budget                             |
| [`battle-lod/RAHKSHI.md`](battle-lod/RAHKSHI.md)               | Shipped Rahkshi `Battle_*` GLB layout                             |
| [`battle-lod/TAHU_MATA.md`](battle-lod/TAHU_MATA.md)           | Mata Toa material buckets + socket map                            |
| [`BLENDER_KIT_SOCKET_HELPER.md`](BLENDER_KIT_SOCKET_HELPER.md) | Linked kit + socket workflow                                      |
| [`KIT_GEOMETRY_MERGE.md`](KIT_GEOMETRY_MERGE.md)               | Runtime merge in dex (small win; not a substitute for battle LOD) |

---

## Fidelity tiers

| Tier                      | Where it runs                           | Goal                                          |
| ------------------------- | --------------------------------------- | --------------------------------------------- |
| **Dex / character sheet** | `CharacterScene`, full kit attach       | Hero fidelity; acceptable cost for one figure |
| **Battle LOD**            | `CombatantModel`, same skeleton + clips | Pre-merged meshes, ~10–30 draws per character |
| **Swarm / instancing**    | Bohrok, Rahkshi waves (Phase D)         | Identical geometry, palette variants          |

Do **not** expect one imported render mesh to serve all three without edits.

**Measured reference (Tahu Mata, kit path):** ~82 draws, ~120k kit tris on the sheet subtree ([`3D_RENDERING_STRATEGY.md`](3D_RENDERING_STRATEGY.md)). Battle LOD targets **~10–14 draws** for the same rig template ([`battle-lod/TAHU_MATA.md`](battle-lod/TAHU_MATA.md)).

---

## Game pass checklist (any imported mesh)

Use before exporting to `public/**/*.glb`.

1. **Apply transforms** — scale especially; unapplied scale breaks normals, shadows, and glTF skin bind matrices.
2. **Delete never-seen geometry** — internal shells, duplicate studs, Cycles-only holdout pieces, micro-bevel support loops.
3. **Manifold sanity** — fix non-manifold edges before subdivision or heavy booleans; 3D Print Toolbox / Mesh → Clean Up.
4. **Material slots** — merge zones that share the same runtime tint workflow; keep separate slots only when the engine must (emissive, transmissive brain, selective bloom).
5. **Triangle budget at game scale** — frame the model at sheet/battle distance; decimate or remove micro-faces before relying on a Decimate modifier on the whole body.
6. **Normals over micro-geo** — bake bevel/detail to a normal map when the silhouette already reads at target scale.
7. **Export** — one skinned armature per character file; Draco via `yarn compress` shrinks payload but does not remove useless triangles.

---

## Battle LOD: bake parallel to dex, not “live merged kit”

The engine **does not** rebuild battle meshes from kit at runtime. Battle LOD is **authored geometry** in the same GLB as dex:

- **Dex:** linked kit instances on sockets (see kit helper) — can track library updates.
- **Battle:** `Battle_*` nodes (Rahkshi) or `{Name}_Battle` (Mata Toa) — hidden in dex, shown in combat.

That split is intentional. There is **no fully non-destructive “always joined” mesh** that stays automatically in sync with every linked kit edit. What you _can_ do is make the join **repeatable** instead of **irreversible**:

| Approach                                                             | Kit stays linked in dex? | Battle updates when kit changes?            |
| -------------------------------------------------------------------- | ------------------------ | ------------------------------------------- |
| Join all kit into one mesh in the dex file (destructive)             | No — local copies        | Manual redo                                 |
| **Separate `Battle` collection + documented rebake**                 | Yes                      | Re-run bake steps (minutes, not re-rigging) |
| Runtime kit merge ([`KIT_GEOMETRY_MERGE.md`](KIT_GEOMETRY_MERGE.md)) | Yes                      | Automatic but ~10% draw savings only        |

**Recommendation:** keep dex on **linked kit**; maintain battle in a **`Battle` collection** (or separate `.blend` that links the character + kit library) and treat battle as a **versioned bake** you regenerate when sockets or kit parts change.

---

## Repeatable Blender workflow (linked kit + battle bake)

### File layout

1. **`kit_*.blend` library** — canonical parts; edit here once.
2. **Character `.blend`** — armature, sockets, embedded body, **`Kit` collection** (linked previews per [`BLENDER_KIT_SOCKET_HELPER.md`](BLENDER_KIT_SOCKET_HELPER.md)).
3. **`Battle` collection** in the same file (or a child blend linked in) — **only** battle targets; safe to duplicate, join, and decimate here.

Never join battle geometry into objects that dex export still needs as separate kit instances.

### Rebake steps (when kit or sockets change)

1. **Dex unchanged** — sync sockets / kit via the addon; verify dex export still excludes `Kit` preview meshes from GLB if that is your rule.
2. **Battle collection** — delete previous `Battle_*` mesh objects (or entire `Battle` collection contents), **not** the armature or dex hierarchy.
3. **Duplicate for battle** — duplicate kit instances + embedded body **into `Battle`** (object duplicates). Use **linked mesh data** (`Alt+D`) until you intentionally apply; battle copies can become single-user at bake time without touching dex copies.
4. **Assign bucket materials** — rename materials to `Battle_Main`, `Battle_Armor`, etc. ([`battle-lod/TAHU_MATA.md`](battle-lod/TAHU_MATA.md), [`battle-lod/RAHKSHI.md`](battle-lod/RAHKSHI.md)).
5. **Weights** — see next section; rigid kit → 100% vertex group per bone **before** join.
6. **Join per bucket** — join all `Battle_Main` into one mesh, all `Battle_Secondary` into one, etc. **Do not** join opaque buckets with glow/brain/bloom meshes.
7. **Parent / armature** — one Armature modifier on each joined object, same `Rahkshi` / `Tahu` armature; bind **Vertex Groups**.
8. **Export** — same armature, shared actions; battle nodes sibling to dex root per species doc.

Optional: keep a **`battle_bake_notes.txt`** in the blend (or commit message template) listing last kit revision synced.

### Blender “non-destructive” tools (expectations)

| Tool                             | Useful for                       | Limitation for battle LOD                                                |
| -------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| **Linked kit + socket helper**   | Dex stays live to library        | Battle still needs its own duplicate bake                                |
| **Library overrides**            | Per-file mesh/material overrides | Overrides are easy to break across library edits; prefer explicit rebake |
| **Geometry Nodes**               | Procedural cleanup               | Poor fit for skinned export + bone weights                               |
| **Modifiers (Mirror, Decimate)** | Battle-only copies               | Apply on battle copies only, then join                                   |

Hard Ops / BoxCutter are best for **new** panels you author; for legacy render meshes, delete hidden geo + per-bucket join usually wins first.

---

## Skinning: rigid kit parts, joins, and “automatic weights”

### What the engine needs

glTF export expects **skinned meshes** on the **same armature** as dex. A kit part “parented to a bone” in Blender as an **object parent** does **not** merge cleanly into a single skinned battle mesh unless you convert that relationship to **vertex groups**.

### Rigid kit part (one bone, 100% weight)

For each mesh that should move with exactly one bone (typical technic / rigid plastic):

1. Mesh has **Armature modifier**, target = character armature.
2. Create vertex group named like the bone (e.g. `Shoulder_L_1`).
3. Assign **all vertices** weight **1.0** to that group (Select All → Assign).
4. **Remove** other groups on that mesh if any.

Do **not** rely on **Automatic Weights** for assembled kit scenes — it is for single organic meshes and will mis-assign rigid parts.

### Embedded body (organic)

Keep existing weights from the original rig. When merging body fragments, join only meshes that already share the **same armature modifier** and compatible vertex groups.

### Joining meshes without losing weights

Blender preserves vertex groups when joining if:

- All pieces use the **same armature object**.
- Group **names** do not collide with different meanings (rename `Group` junk before join).
- You join in **Object mode** with all selected objects active on the same armature.

Order of operations that usually works:

1. Assign **100% bone groups** on every rigid kit piece.
2. Replace materials with battle bucket materials.
3. Join **within one bucket** (e.g. all `Battle_Technic_Black`).
4. Verify Armature modifier still deforms correctly in pose mode.
5. Repeat per bucket; leave glow/brain as separate objects.

### Rahkshi: you do not need one mega-mesh

The shipped Rahkshi battle body is a **`Battle_Body` group** with **six skinned children** (one per material slot), not a single joined mesh ([`battle-lod/RAHKSHI.md`](battle-lod/RAHKSHI.md)). That is **less destructive** than joining everything into one object:

- Join **per material slot** inside `Battle_Body`, not kit + species + glow in one step.
- Species overlays stay separate `Battle_{Breed}` meshes.
- `Battle_Glow` stays one mesh, one `Battle_Bloom` material.

If you already joined all Rahkshi kit into one mesh locally, you can split the workflow on the next kit update by rebaking into the six-slot layout above.

---

## Mata Toa battle buckets (summary)

Full socket → bucket tables live in [`battle-lod/TAHU_MATA.md`](battle-lod/TAHU_MATA.md). Join order:

1. Optional: join per bone **within** the same bucket material.
2. **Global** join per bucket → one object per `Battle_Main`, `Battle_Secondary`, …
3. Keep **separate** objects: `Battle_Eyes`, `Battle_Weapon_Glow`, `Battle_Brain`, mask via runtime `useMask` (not baked into battle body).

Custom Toa on the same rig template reuse the **same bucket names**; only palette colors change at runtime.

---

## When to rebake battle LOD

| Event                                          | Action                                               |
| ---------------------------------------------- | ---------------------------------------------------- |
| Kit library part renamed or reshaped           | Rebake affected buckets only if possible             |
| Socket map change (`*KitAttach.ts`)            | Rebake; update attachment doc                        |
| Dex-only visual tweak (no battle export nodes) | No battle work                                       |
| New species overlay (Rahkshi)                  | Add `Battle_{Breed}` mesh; do not rejoin entire body |

---

## Verification in-engine

| Check          | How                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Dex unchanged  | Character sheet / model preview route                                                                                                  |
| Battle visible | Rahkshi dex toggle **Battle LOD**; combat uses battle by default ([`rahkshiLod.ts`](../src/rendering/3d/CharacterScene/rahkshiLod.ts)) |
| Draw count     | Settings → 3D Performance Monitor ([`3D_PERFORMANCE.md`](3D_PERFORMANCE.md))                                                           |
| GLB layout     | `yarn animation-clip-inspect public/….glb` for clips + node names                                                                      |

---

## Quick decision tree

```text
Import render mesh
  → Game pass (delete hidden, transforms, materials, decimate at sheet scale)
  → Used only as static prop? → Export merged, single material if possible
  → Character with kit?
       → Dex: linked kit + sockets (keep maintainable)
       → Battle: duplicate to Battle collection → bucket materials → rigid weights → join per bucket → export Battle_* nodes
  → Kit library updated?
       → Sync dex → rebake Battle collection (do not edit joined dex meshes in place)
```
