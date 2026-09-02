# Blender Bionicle Kit addon

`tools/blender/kit_socket_helper.py` is the **single installable addon** for shared-kit
authoring. It loads the sibling `kit_bevel_bake.py` module automatically.

Install via `Edit → Preferences → Add-ons → Install…` → pick **`kit_socket_helper.py`**.

Panel: `View3D → Sidebar → Bionicle Kit`

| Section                    | Use in             | Purpose                                                   |
| -------------------------- | ------------------ | --------------------------------------------------------- |
| **Character Sockets**      | Character `.blend` | Socket empties, kit preview attach, attachment map export |
| **Kit Parts → Bevel Maps** | Kit `.blend`       | Bevel sidecar bakes, kit GLB export                       |

See also:

- [BLENDER_KIT_SOCKET_HELPER.md](./BLENDER_KIT_SOCKET_HELPER.md) — character socket workflow
- [BLENDER_KIT_BEVEL_BAKE.md](./BLENDER_KIT_BEVEL_BAKE.md) — bevel bake workflow and runtime contract

## Tests

```bash
python3 tools/blender/test_kit_socket_infer.py
python3 -m py_compile tools/blender/kit_socket_helper.py tools/blender/kit_bevel_bake.py
```

## Headless bevel bake

Background bakes still import `kit_bevel_bake.py` directly:

```bash
blender --background kit.blend --python tools/blender/headless_bake_export.py
```
