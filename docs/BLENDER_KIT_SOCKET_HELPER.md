# Blender Kit Socket Helper

Part of the unified **Bionicle Kit** addon. Install **`kit_socket_helper.py`** only
(via `Edit → Preferences → Add-ons → Install`). See [BLENDER_KIT_ADDON.md](./BLENDER_KIT_ADDON.md).

Use this **Character Sockets** panel when authoring character rigs that attach shared kit
meshes at runtime.

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
```
