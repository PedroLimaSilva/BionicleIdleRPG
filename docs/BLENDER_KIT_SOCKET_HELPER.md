# Blender Kit Socket Helper

`tools/blender/kit_socket_helper.py` automates the shared-mesh model refactor: replacing
per-character kit objects with named socket empties, optionally previewing shared kit
pieces in Blender, and exporting attachment maps for the game runtime.

Install **`kit_socket_helper.py`** (required). Keep **`kit_socket_infer.py`** in the
same folder when installing from the repo so kit-name inference stays in sync with
unit tests; the addon falls back to an embedded copy if the sibling file is missing.

## Recommended workflow (visual matching + automated attach)

The step that **cannot** be automated is identifying which embedded mesh corresponds
to which shared kit piece — that still requires visually comparing the character mesh
to kit library objects (and sometimes the kit piece is not in the library yet).

Everything **after** you rename socket empties can be automated:

### Phase 1 — Create placeholders

1. Select embedded kit meshes on the character.
2. Click **Create Socket Empties** (parent to bone, hide sources).

### Phase 2 — Manual rename (visual matching)

Rename each empty to the standardized socket name used in attachment maps. Examples
from `src/rendering/3d/kit/attachments/`:

| Rig socket (empty name) | Shared kit node |
| ----------------------- | --------------- |
| `Axle2L_Head`           | `Axle2L`        |
| `Axle2L_Chest`          | `Axle2L`        |
| `Pin2L_Head_B`          | `Pin2L`         |
| `GearM_ShoulderL`       | `GearM`         |
| `AxleMod2L_ArmUpperL`   | `AxleMod2L`     |

Pattern: `{KitNodeName}` when unique on the rig, or `{KitNodeName}_{Location}` /
`{KitNodeName}{Location}` when the same kit piece appears more than once.

### Phase 3 — Sync & attach (automated)

1. Set **Kit Library Path** to your shared kit `.blend` (e.g. `kit_2001.blend`).
2. Select the renamed empties (or use **Sync Scene** for all tagged sockets).
3. Click **Sync Renamed Sockets & Attach Kit** (socket empties keep their transforms;
   only the linked kit preview gets identity local transform).

This step:

- copies each empty's **object name** into `bionicle_socket`;
- **infers** `bionicle_kit_node` by longest-prefix match against object names in the
  kit library (`Axle2L_Head` → `Axle2L`);
- **resets kit preview local transforms** to identity in parent space (matches runtime);
- **preserves socket empty transforms** unless **Reset Socket Transforms On Sync** is enabled;
- **links** kit pieces from the library with overrides (does not append copies);
- **skips** sockets whose kit node is not in the library yet (logged to the console).

Optional: paste attachment-map `materialColors` into **Attachment Map JSON** for
preview tinting. Use **Copy Scene** to export the TypeScript snippet when done.

## What it does

### Socket creation

For every selected non-empty object, the addon can:

- create an empty at the object's origin with matching or identity-local rotation;
- parent the empty to the same object or armature bone as the source object;
- name the empty from the source object's parent bone/object, source object name,
  source object base name, or a custom value;
- store metadata on the empty for export tooling;
- optionally hide the original source object; and
- copy a TypeScript attachment map snippet.

### Full pipeline (optional)

**Process Selected (Full Pipeline)** combines socket creation with optional source
deletion and kit preview attachment in one step — useful when names are already known.
When you need visual matching first, prefer the two-phase workflow above.

## Install

1. Open Blender.
2. Go to `Edit > Preferences > Add-ons > Install...`.
3. Pick `tools/blender/kit_socket_helper.py` (keep `kit_socket_infer.py` alongside it).
4. Enable `Bionicle Kit Socket Helper`.

The panel appears in `View3D > Sidebar > Bionicle Kit`.

## Export

Export the character GLB with socket empties included. Exclude kit preview objects
(`bionicle_kit_preview`) and deleted/hidden source meshes from export.

## Kit GLB workflow

For the shared kit file itself, keep one visible mesh per reusable asset and name
it to match `kitNodeName` values from the attachment map (`MataFoot`,
`MataLegModThigh`, `Axle3L`, and so on).

## Cursor / Blender MCP

Drive the post-rename step from Cursor via [Blender MCP](https://github.com/ahujasid/blender-mcp).

### Setup

1. **Cursor** — `.cursor/mcp.json` includes the `blender-mcp` server (requires [uv](https://docs.astral.sh/uv/)).
2. **Blender** — `uvx blender-mcp install-addon`, then **Start MCP Server**.
3. Re-install the addon after pulling updates.

### Example (after manual rename)

```python
import bpy
import sys
sys.path.insert(0, "/path/to/BionicleIdleRPG")
from tools.blender import mcp_kit_pipeline as kit

kit.configure_scene(
    kit_library_path="/path/to/kit_2001.blend",
    attach_kit_preview_after=False,
)
bpy.context.scene.bionicle_reset_socket_transforms_on_sync = True
bpy.context.scene.bionicle_infer_kit_from_socket_name = True
print(kit.sync_and_attach(scope="SELECTED"))
```

Or: `bpy.ops.bionicle.sync_and_attach_kit_previews(scope='SELECTED')`

See `tools/blender/mcp_kit_pipeline.py`.

## Attachment map JSON

Accepts strict JSON or a pasted TypeScript snippet (`kitNodeName` lines are parsed).
**Palette JSON** supports `{ kind: "palette", key: "mask" }` entries during preview.

## Inference tests

```bash
python3 tools/blender/test_kit_socket_infer.py
```

## Notes

- Custom properties: `bionicle_socket`, `bionicle_kit_node`, `bionicle_source_object`,
  `bionicle_kit_preview` (preview meshes only).
- When a kit node is missing from the library, fix the library or rename the socket
  after adding the asset — re-run **Sync & Attach**.
- Default **Empty Rotation** on create is **Local Identity** (matches runtime attach).
