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

## Bone parent merge

Select the armature, or any mesh parented under it. In the same sidebar, **Bone Parent Merge → Join Bone-Parented Meshes**.

1. Meshes with a Curve modifier, and anything parented under them, stay as they are. A tread that follows a path keeps that animation instead of being baked into the merged mesh.
2. Other shape modifiers are applied. Smooth by Angle stays as shading on the merged mesh. Existing Armature vertex groups are kept.
3. Each remaining mesh is joined into its parent mesh, deepest first, so inner bricks land in the bone-parented part.
4. Every vertex of that part is weighted `1` to the parent bone.
5. Those parts, plus meshes already parented to the armature object, are joined into `{Armature}_Mesh` with one Armature modifier.

The operator switches the armature to Rest Position while it bakes transforms, then restores the pose. Run it once per armature when both creatures are in the file.

## Export

Export the character GLB with socket empties. Exclude `Kit` collection preview
meshes and original source meshes from export.

## Cursor / Blender MCP (optional)

`.cursor/mcp.json` is kept for future Cursor + Blender MCP work. It is not required
for the addon panel workflow. When set up, you can drive `bpy.ops.bionicle.*`
operators from Cursor against a live Blender session.

## Tests

```bash
python3 tools/blender/test_kit_socket_infer.py
python3 tools/blender/test_bone_parent_merge.py
```
