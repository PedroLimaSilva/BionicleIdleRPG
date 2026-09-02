"""
MCP-friendly entry points for the Bionicle Kit Socket Helper.

Use with Blender MCP (https://github.com/ahujasid/blender-mcp) from Cursor:

1. Install Blender MCP in Cursor (`.cursor/mcp.json` in this repo).
2. Install the Blender MCP bridge add-on in Blender and start the server.
3. Ask Cursor to run Python in Blender, e.g.:

   import bpy
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

Or invoke operators directly:

   bpy.ops.bionicle.process_kit_sockets()
   bpy.ops.bionicle.attach_kit_previews(scope="SCENE")
   bpy.ops.bionicle.delete_tagged_sources()
"""

from __future__ import annotations

import json
import sys
from pathlib import Path


def _ensure_addon_loaded():
    repo_root = Path(__file__).resolve().parents[2]
    addon_path = repo_root / "tools" / "blender" / "kit_socket_helper.py"
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))

    import bpy

    module_name = "kit_socket_helper"
    if module_name not in sys.modules:
        import importlib.util

        spec = importlib.util.spec_from_file_location(module_name, addon_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if not hasattr(bpy.types.Scene, "bionicle_socket_name_mode"):
            module.register()
    return bpy, sys.modules[module_name]


def configure_scene(
    *,
    kit_library_path: str = "",
    attachment_map_json: str = "",
    palette_json: str = "",
    socket_name_mode: str = "PARENT",
    kit_name_mode: str = "OBJECT_BASE",
    parent_mode: str = "SAME_PARENT",
    empty_rotation_mode: str = "LOCAL_IDENTITY",
    local_identity_keep_world_location: bool = True,
    preserve_source_transform: bool = False,
    hide_source: bool = True,
    delete_sources_after: bool = False,
    delete_only_hidden_sources: bool = True,
    attach_kit_preview_after: bool = False,
    skip_existing: bool = True,
):
    bpy, _addon = _ensure_addon_loaded()
    scene = bpy.context.scene
    scene.bionicle_kit_library_path = kit_library_path
    scene.bionicle_attachment_map_json = attachment_map_json
    scene.bionicle_palette_json = palette_json
    scene.bionicle_socket_name_mode = socket_name_mode
    scene.bionicle_kit_name_mode = kit_name_mode
    scene.bionicle_parent_mode = parent_mode
    scene.bionicle_empty_rotation_mode = empty_rotation_mode
    scene.bionicle_local_identity_keep_world_location = local_identity_keep_world_location
    scene.bionicle_preserve_source_transform = preserve_source_transform
    scene.bionicle_hide_source = hide_source
    scene.bionicle_delete_sources_after = delete_sources_after
    scene.bionicle_delete_only_hidden_sources = delete_only_hidden_sources
    scene.bionicle_attach_kit_preview_after = attach_kit_preview_after
    scene.bionicle_skip_existing = skip_existing


def process_selected():
    bpy, addon = _ensure_addon_loaded()
    return addon.process_selected_kit_sockets(bpy.context)


def attach_previews(scope: str = "SCENE"):
    bpy, addon = _ensure_addon_loaded()
    candidates = bpy.context.selected_objects if scope == "SELECTED" else bpy.context.scene.objects
    sockets = addon._socket_empties(candidates)
    return addon.attach_kit_previews(bpy.context, sockets)


def delete_sources(only_hidden: bool = True):
    bpy, addon = _ensure_addon_loaded()
    bpy.context.scene.bionicle_delete_only_hidden_sources = only_hidden
    return addon.delete_tagged_sources(bpy.context)


def load_attachment_map_from_file(path: str):
    bpy, addon = _ensure_addon_loaded()
    text = Path(bpy.path.abspath(path)).read_text(encoding="utf-8")
    bpy.context.scene.bionicle_attachment_map_json = text
    return addon._parse_attachment_map(text)


def summarize_scene():
    bpy, addon = _ensure_addon_loaded()
    scene = bpy.context.scene
    sockets = addon._socket_empties(scene.objects)
    sources = addon._tagged_source_objects(scene)
    previews = [obj for obj in scene.objects if obj.get(addon.KIT_PREVIEW_PROP)]
    return {
        "socket_count": len(sockets),
        "tagged_source_count": len(sources),
        "kit_preview_count": len(previews),
        "sockets": [
            {
                "name": obj.name,
                "socket": obj[addon.SOCKET_PROP],
                "kitNodeName": obj[addon.KIT_NODE_PROP],
            }
            for obj in sockets
        ],
    }
