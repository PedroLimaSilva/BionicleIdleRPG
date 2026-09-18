# Blender Kit Socket Helper

`tools/blender/kit_socket_helper.py` automates the shared-mesh model refactor.

Install **`kit_socket_helper.py`** only (via `Edit → Preferences → Add-ons → Install`).
The panel is in `View3D → Sidebar → Bionicle Kit`.

## Workflow

### 1. Create socket empties

Select embedded kit meshes → **Create Socket Empties**.

### 2. Manually rename

Match kit parts visually, then rename each empty (`Axle2L_Head`, `MataHip`, …).

### 3. Sync to kit library

Set **Kit Library** → **Sync Selected** or **Sync Scene**.

This syncs socket names, infers kit nodes (`Axle2L_Head` → `Axle2L`), links kit
parts into a **`Kit`** collection (reusing unparented matches), parents previews to
empties with zeroed transforms, and skips parts not yet in the library.

### 4. Attachment map (optional)

Paste a `*KitAttach.ts` snippet into **JSON** for material preview during sync.
**Copy Scene** exports a TypeScript attachment map to the clipboard when done.

### 5. Battle LOD bake (optional)

On **battle-only duplicates** in a `Battle` collection ([`MESH_GAME_PASS.md`](MESH_GAME_PASS.md)):

1. Assign bucket materials (`Battle_Main`, `Battle_Armor`, …).
2. **Rigid Weights (Bone Parent)** — for kit parts still parented to a bone: 100% vertex group, Armature modifier, clear bone parent (keep transform).
3. **Join Battle Buckets** — joins selected meshes that share the same material; only `Battle_*` opaque slots (skips `Battle_Bloom`, `Battle_Brain`, `Battle_Eyes`, `Battle_Weapon_Glow`).
4. **Join By Material** — same as (3) but includes any shared material name (useful for one-off joins).

Joined objects are renamed to the material bucket (e.g. `Battle_Main`). Run once per bucket group; select all battle copies that should collapse together.

## Export

Export the character GLB with socket empties. Exclude `Kit` collection preview
meshes and original source meshes from export.

## Cursor / Blender MCP (optional)

`.cursor/mcp.json` is kept for future Cursor + Blender MCP work. It is not required
for the addon panel workflow. When set up, you can drive `bpy.ops.bionicle.*`
operators from Cursor against a live Blender session.

## Tests

```bash
cd tools/blender
python3 test_kit_socket_infer.py
python3 test_battle_lod_join.py
```
