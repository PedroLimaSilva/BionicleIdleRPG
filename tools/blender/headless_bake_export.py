"""
Headless bake + kit GLB export for collection 2001.

Usage:
  Blender --background kit_bevel_work.blend --python tools/blender/headless_bake_export.py
"""
import os
import sys

import bpy

REPO = os.environ.get(
    "BIONICLE_REPO",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")),
)
OUTPUT_DIR = os.path.join(REPO, "public", "kit_2001")
EXPORT_PATH = os.path.join(REPO, ".work", "blender", "kit_2001_export.glb")
PARTS = os.environ.get("BIONICLE_BEVEL_PARTS", "MataChest").split(",")


def _load_addon():
    addon_path = os.path.join(REPO, "tools", "blender", "kit_bevel_bake.py")
    import importlib.util

    spec = importlib.util.spec_from_file_location("kit_bevel_bake", addon_path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["kit_bevel_bake"] = mod
    spec.loader.exec_module(mod)
    return mod


def main():
    mod = _load_addon()
    bake = mod.bake_bevel_map_for_object
    save = mod.save_bevel_image
    export = mod.export_kit_collection_glb

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(EXPORT_PATH), exist_ok=True)

    parts = [p.strip() for p in PARTS if p.strip()]
    print(f"[Bionicle Kit Bevel] Baking {len(parts)} part(s)…", flush=True)

    for index, part in enumerate(parts):
        obj = bpy.data.objects.get(part)
        if not obj or obj.type != "MESH":
            print(f"[Bionicle Kit Bevel] SKIP missing mesh: {part}", flush=True)
            continue
        progress = mod.BakeProgressReporter(
            part_index=index,
            part_count=len(parts),
            part_name=part,
            span_fraction=0.9,
        )
        img = bake(obj, resolution=1024, samples=16, ensure_uv=True, progress=progress)
        path = save(img, OUTPUT_DIR, part, file_format="WEBP")
        print(f"[Bionicle Kit Bevel] SAVED {path}", flush=True)

    print("[Bionicle Kit Bevel] Exporting collection 2001…", flush=True)
    count = export("2001", EXPORT_PATH)
    print(f"[Bionicle Kit Bevel] EXPORTED {count} objects -> {EXPORT_PATH}", flush=True)


if __name__ == "__main__":
    main()
