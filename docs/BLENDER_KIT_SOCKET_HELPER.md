# Blender Kit Socket Helper

`tools/blender/kit_socket_helper.py` automates the shared-mesh model refactor: replacing
per-character kit objects with named socket empties, optionally previewing shared kit
pieces in Blender, and exporting attachment maps for the game runtime.

## What it does

### Socket creation (existing)

For every selected non-empty object, the addon can:

- create an empty at the object's origin with matching or identity-local rotation;
- parent the empty to the same object or armature bone as the source object;
- name the empty from the source object's parent bone/object, source object name,
  source object base name, or a custom value;
- store the source kit object name on the empty;
- optionally hide the original source object so it does not export with the
  character GLB; and
- copy a TypeScript attachment map snippet.

### Full pipeline (v0.2)

**Process Selected (Full Pipeline)** runs the steps you were doing manually:

1. **Rename / socket naming** — uses Socket Name + Kit Node Name modes (default: parent
   bone name + shared kit object base name).
2. **Reparent** — copies the source object's bone/object parenting onto each empty.
3. **Fix empty orientation** — default **Local Identity** rotation (zero rotation in
   parent space, same as runtime `useKitAttachments`); optional **Match Source**.
4. **Delete original meshes** — optional `Delete Source Meshes After` (with
   `Only Delete Hidden Sources` safety).
5. **Add kit parts** — optional append from a shared kit `.blend`, parent to each
   socket, reset local transform to identity.
6. **Material preview** — optional `materialColors` from Attachment Map JSON (Lego hex
   or palette keys) applied to preview meshes.

Individual operators are also available under **Kit preview tools** in the panel.

## Install

1. Open Blender.
2. Go to `Edit > Preferences > Add-ons > Install...`.
3. Pick `tools/blender/kit_socket_helper.py`.
4. Enable `Bionicle Kit Socket Helper`.

The panel appears in `View3D > Sidebar > Bionicle Kit`.

## Typical character GLB workflow

### One-click export prep

1. Open the character `.blend`.
2. Select the kit mesh objects that should come from `kit_2001.glb`.
3. In `Bionicle Kit`:
   - **Socket Name** → `Parent Bone/Object` (empty named after the rig bone).
   - **Kit Node Name** → `Object Name (No .001)` for shared kit assets.
   - **Empty Rotation** → `Local Identity` (matches runtime attachment).
   - **Parent** → `Same Parent`.
   - Enable **Delete Source Meshes After** if you want originals removed (not just hidden).
   - Enable **Attach Kit Previews After** only for in-Blender validation (do not export previews).
   - Set **Kit Library Path** to your shared `kit_2001.blend` when using previews.
   - Paste character `*MataKitAttach.ts` contents (or JSON) into **Attachment Map JSON** for
     material preview and kit node overrides.
4. Click **Process Selected (Full Pipeline)**.

### Manual step-by-step

Same settings as above, but use:

- **Create Socket Empties** — sockets only;
- **Delete Tagged Source Meshes** — remove replaced originals;
- **Attach Kit Previews** — append kit pieces and reset transforms;
- **Apply Material Preview** — tint preview meshes from the attachment map;
- **Copy Scene** — paste the TypeScript snippet into `*MataKitAttach.ts`, adding
  `materialColors` where needed.

5. Export the character GLB with empties included. Exclude kit preview objects and
   deleted/hidden source meshes from export.

## Kit GLB workflow

For the shared kit file itself, keep one visible mesh per reusable asset and name
it to match `kitNodeName` values from the attachment map (`MataFoot`,
`MataLegModThigh`, `Axle3L`, and so on). The runtime walks the kit GLB scene by
object name, clones the matching node, and attaches it to the exported character
socket.

## Cursor / Blender MCP

You can drive the same operators from Cursor via [Blender MCP](https://github.com/ahujasid/blender-mcp).

### Setup

1. **Cursor** — this repo includes `.cursor/mcp.json` with the `blender-mcp` server.
   Enable it in Cursor Settings → MCP (requires [uv](https://docs.astral.sh/uv/) installed locally).
2. **Blender** — install the Blender MCP bridge add-on (`uvx blender-mcp install-addon`)
   and click **Start MCP Server** in the 3D View sidebar.
3. **Re-install** `tools/blender/kit_socket_helper.py` in Blender after pulling updates.

### Example prompts

Ask Cursor (with Blender open and MCP connected):

> Run the Bionicle kit socket full pipeline on my current selection. Kit library is
> `/path/to/kit_2001.blend`. Use parent bone names for sockets, object base names for kit
> nodes, local identity rotation, delete hidden sources after, and attach kit previews.

Cursor can execute:

```python
import bpy
import sys
sys.path.insert(0, "/path/to/BionicleIdleRPG")
from tools.blender import mcp_kit_pipeline as kit

kit.configure_scene(
    kit_library_path="/path/to/kit_2001.blend",
    socket_name_mode="PARENT",
    kit_name_mode="OBJECT_BASE",
    empty_rotation_mode="LOCAL_IDENTITY",
    delete_sources_after=True,
    attach_kit_preview_after=True,
)
kit.process_selected()
print(kit.summarize_scene())
```

Or call operators directly:

```python
bpy.ops.bionicle.process_kit_sockets()
bpy.ops.bionicle.attach_kit_previews(scope='SCENE')
bpy.ops.bionicle.apply_material_preview()
bpy.ops.bionicle.delete_tagged_sources()
```

See `tools/blender/mcp_kit_pipeline.py` for helper functions MCP can import.

## Attachment map JSON

The **Attachment Map JSON** field accepts:

- strict JSON (`{"Ankle_L": {"kitNodeName": "MataLegModThigh", "materialColors": {...}}}`), or
- a pasted TypeScript snippet from **Copy Scene** (kitNodeName lines are parsed).

**Palette JSON** is optional for preview tinting when using `{ kind: "palette", key: "mask" }`
entries, e.g. `{"mask":"#FFFFFF","body":"#C91A09","arms":"#FE8A18"}`.

Lego color names in `materialColors` match `src/types/Colors.ts` (`Red`, `LightGray`, etc.).

## Notes

- Custom properties on generated empties:
  - `bionicle_socket`
  - `bionicle_kit_node`
  - `bionicle_source_object`
- Kit preview children are tagged with `bionicle_kit_preview` and are meant for
  viewport validation only — exclude them from character GLB export.
- `Copy Selected` and `Copy Scene` only include empties with socket properties.
- Blender may still display duplicate object names with `.001` suffixes. Use
  `Object Name (No .001)` for kit node names when multiple character instances
  point to the same shared kit asset.
- Default **Empty Rotation** changed to **Local Identity** in v0.2 to match runtime
  behavior (`position/rotation/scale` reset on attach). Use **Match Source** when
  a socket must preserve the original mesh orientation.
