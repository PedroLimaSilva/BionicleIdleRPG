# Blender Kit Socket Helper

`tools/blender/kit_socket_helper.py` automates the shared-mesh model refactor.

Install **`kit_socket_helper.py`** only (via `Edit → Preferences → Add-ons → Install`).
The panel is in `View3D → Sidebar → Bionicle Kit`.

## Workflow

### 1. Create placeholders

Select embedded kit meshes → **Create Socket Empties**.

Defaults (not shown in the panel):

- Parent empties to the same bone/object as the source mesh
- Local-identity rotation, keep source world location
- Do not hide or skip source meshes

### 2. Manual rename (visual matching)

Rename each empty to the standardized socket name (`Axle2L_Head`, `MataHip`, …).
See `src/rendering/3d/kit/attachments/` for examples.

### 3. Sync kit previews

Set **Kit Library** to your shared `kit.blend` → **Sync Selected** or **Sync Scene**.

This syncs socket names, infers kit nodes (`Axle2L_Head` → `Axle2L`), links kit
parts into a **`Kit`** collection (reusing unparented matches), parents previews to
empties with zeroed transforms, and skips parts not yet in the library.

### 4. Attachment map (optional)

Paste a `*KitAttach.ts` snippet into **JSON** for material preview during sync.
**Copy Scene** exports a TypeScript attachment map to the clipboard when done.

## Export

Export the character GLB with socket empties. Exclude `Kit` collection preview
meshes and original source meshes from export.

## MCP

See `.cursor/mcp.json` and `tools/blender/mcp_kit_pipeline.py`. Operators remain
available via `bpy.ops.bionicle.*` even though they are not in the simplified panel.

## Tests

```bash
python3 tools/blender/test_kit_socket_infer.py
```
