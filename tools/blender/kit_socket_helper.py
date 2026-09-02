bl_info = {
    "name": "Bionicle Kit Socket Helper",
    "author": "Bionicle Idle RPG contributors",
    "version": (0, 3, 2),
    "blender": (3, 6, 0),
    "location": "View3D > Sidebar > Bionicle Kit",
    "description": "Automate shared-kit socket empties, kit preview attachment, and export prep.",
    "category": "Object",
}

import importlib.util
import json
import re
from pathlib import Path

import bpy
from mathutils import Matrix, Vector


def _load_infer_helpers():
    infer_path = Path(__file__).with_name("kit_socket_infer.py")
    if infer_path.exists():
        spec = importlib.util.spec_from_file_location("kit_socket_infer", infer_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module.infer_kit_node_name, module.strip_numeric_suffix

    def strip_numeric_suffix(name):
        base, dot, suffix = name.rpartition(".")
        if dot and len(suffix) == 3 and suffix.isdigit():
            return base
        return name

    def infer_kit_node_name(socket_name, kit_node_names):
        socket_name = strip_numeric_suffix(socket_name)
        kit_set = set(kit_node_names)
        if socket_name in kit_set:
            return socket_name
        for kit_name in sorted(kit_set, key=len, reverse=True):
            if not socket_name.startswith(kit_name):
                continue
            suffix = socket_name[len(kit_name) :]
            if suffix == "" or suffix[0] == "_" or suffix[0].isupper():
                return kit_name
        return None

    return infer_kit_node_name, strip_numeric_suffix


infer_kit_node_name, strip_numeric_suffix = _load_infer_helpers()

SOCKET_PROP = "bionicle_socket"
KIT_NODE_PROP = "bionicle_kit_node"
SOURCE_OBJECT_PROP = "bionicle_source_object"
KIT_PREVIEW_PROP = "bionicle_kit_preview"
KIT_COLLECTION_NAME = "Kit"

LEGO_COLORS = {
    "Black": (0.0196, 0.0745, 0.1137, 1.0),
    "Brown": (0.3451, 0.2235, 0.1529, 1.0),
    "Green": (0.1373, 0.4706, 0.2549, 1.0),
    "DarkTurquoise": (0.0, 0.5608, 0.6078, 1.0),
    "Red": (0.7882, 0.1020, 0.0353, 1.0),
    "Lime": (0.7333, 0.9137, 0.0431, 1.0),
    "Yellow": (0.9490, 0.8039, 0.2157, 1.0),
    "White": (1.0, 1.0, 1.0, 1.0),
    "LightGray": (0.6078, 0.6314, 0.6157, 1.0),
    "Blue": (0.0, 0.3333, 0.7490, 1.0),
    "MediumBlue": (0.3529, 0.5765, 0.8588, 1.0),
    "Orange": (0.9961, 0.5412, 0.0941, 1.0),
    "DarkGray": (0.4275, 0.4314, 0.3608, 1.0),
    "DarkOrange": (0.6627, 0.3333, 0.0, 1.0),
    "SandBlue": (0.3765, 0.4549, 0.6314, 1.0),
    "PearlGold": (0.6667, 0.4980, 0.1804, 1.0),
    "Purple": (0.5059, 0.0, 0.4824, 1.0),
    "FlatDarkGold": (0.7059, 0.5176, 0.3333, 1.0),
    "Tan": (0.8941, 0.8039, 0.6196, 1.0),
    "TransDarkBlue": (0.0, 0.1255, 0.6275, 0.5),
    "TransMediumBlue": (0.8118, 0.8863, 0.9686, 0.5),
    "TransNeonYellow": (0.8549, 0.6902, 0.0, 0.5),
    "TransGreen": (0.5176, 0.7137, 0.5529, 0.5),
    "TransNeonOrange": (1.0, 0.5020, 0.0510, 0.5),
    "TransNeonGreen": (0.9725, 0.9451, 0.5176, 0.5),
    "TransNeonRed": (1.0, 0.0, 0.2510, 0.5),
    "TransNeonPink": (1.0, 0.4118, 0.7059, 0.5),
}


def _strip_numeric_suffix(name):
    return strip_numeric_suffix(name)


def _active_scene(context):
    return context.scene


def _target_collection(context, source):
    if source.users_collection:
        return source.users_collection[0]
    return context.scene.collection


def _same_parent_label(source):
    if source.parent_type == "BONE" and source.parent_bone:
        return source.parent_bone
    if source.parent:
        return source.parent.name
    return source.name


def _socket_name(scene, source):
    mode = scene.bionicle_socket_name_mode
    if mode == "CUSTOM":
        return scene.bionicle_custom_socket_name.strip() or source.name
    if mode == "OBJECT":
        return source.name
    if mode == "OBJECT_BASE":
        return _strip_numeric_suffix(source.name)
    return _same_parent_label(source)


def _kit_node_name(scene, source):
    if scene.bionicle_kit_name_mode == "CUSTOM":
        return scene.bionicle_custom_kit_node_name.strip() or source.name
    if scene.bionicle_kit_name_mode == "OBJECT_BASE":
        return _strip_numeric_suffix(source.name)
    return source.name


def _copy_parenting(source, empty):
    empty.parent = source.parent
    empty.parent_type = source.parent_type
    if source.parent_type == "BONE":
        empty.parent_bone = source.parent_bone


def _copy_source_origin_transform(source, empty):
    location, rotation, _scale = source.matrix_world.decompose()
    empty.matrix_world = Matrix.LocRotScale(location, rotation, (1.0, 1.0, 1.0))


def _copy_source_world_transform(source, empty):
    empty.matrix_world = source.matrix_world.copy()


def _apply_empty_rotation_mode(scene, source, empty):
    mode = scene.bionicle_empty_rotation_mode
    if mode == "LOCAL_IDENTITY":
        if empty.parent:
            empty.matrix_parent_inverse = empty.parent.matrix_world.inverted()
        empty.location = Vector((0.0, 0.0, 0.0))
        empty.rotation_euler = (0.0, 0.0, 0.0)
        empty.scale = (1.0, 1.0, 1.0)
        if scene.bionicle_local_identity_keep_world_location:
            world_location, _, _ = source.matrix_world.decompose()
            empty.matrix_world = Matrix.Translation(world_location)
        return
    if scene.bionicle_preserve_source_transform:
        _copy_source_world_transform(source, empty)
    else:
        _copy_source_origin_transform(source, empty)


def _json_string(value):
    return json.dumps(value)


def _socket_empties(objects):
    return [
        obj
        for obj in objects
        if obj.type == "EMPTY" and KIT_NODE_PROP in obj and SOCKET_PROP in obj
    ]


def _tagged_source_objects(scene):
    return [
        obj
        for obj in scene.objects
        if obj.type != "EMPTY" and SOURCE_OBJECT_PROP in obj and SOCKET_PROP in obj
    ]


def _kit_preview_children(socket):
    return [child for child in socket.children if child.get(KIT_PREVIEW_PROP)]


def _runtime_socket_name(obj):
    return strip_numeric_suffix(obj.name)


def _list_kit_library_objects(kit_path):
    kit_path = bpy.path.abspath(kit_path)
    with bpy.data.libraries.load(kit_path, link=False) as (data_from, _data_to):
        return list(data_from.objects)


def _reset_socket_local_transform(socket):
    if socket.parent:
        socket.matrix_parent_inverse = socket.parent.matrix_world.inverted()
    socket.location = Vector((0.0, 0.0, 0.0))
    socket.rotation_euler = (0.0, 0.0, 0.0)
    socket.scale = (1.0, 1.0, 1.0)


def _candidate_socket_empties(objects, scope="SELECTED"):
    if scope == "SELECTED":
        return [obj for obj in objects if obj.type == "EMPTY"]
    return [
        obj
        for obj in objects
        if obj.type == "EMPTY"
        and (SOCKET_PROP in obj or KIT_NODE_PROP in obj or SOURCE_OBJECT_PROP in obj)
    ]


def sync_renamed_socket_properties(context, sockets, scene=None):
    scene = scene or _active_scene(context)
    kit_path = scene.bionicle_kit_library_path.strip()
    kit_catalog = _list_kit_library_objects(kit_path) if kit_path else []

    synced = []
    unresolved = []
    for socket in sockets:
        socket_name = _runtime_socket_name(socket)
        socket[SOCKET_PROP] = socket_name

        kit_node_name = None
        if scene.bionicle_infer_kit_from_socket_name and kit_catalog:
            kit_node_name = infer_kit_node_name(socket_name, kit_catalog)
        if not kit_node_name and KIT_NODE_PROP in socket:
            kit_node_name = socket[KIT_NODE_PROP]
        if kit_node_name:
            socket[KIT_NODE_PROP] = kit_node_name
            synced.append({"socket": socket_name, "kitNodeName": kit_node_name})
        else:
            unresolved.append(socket_name)

        if scene.bionicle_reset_socket_transforms_on_sync:
            _reset_socket_local_transform(socket)

    return {"synced": synced, "unresolved": unresolved, "kit_catalog": kit_catalog}


def sync_and_attach_kit_previews(context, sockets=None, scene=None, scope="SELECTED"):
    scene = scene or _active_scene(context)
    kit_path = scene.bionicle_kit_library_path.strip()
    if not kit_path:
        raise ValueError("Set Kit Library Path to a .blend file with shared kit objects")

    candidates = sockets
    if candidates is None:
        pool = context.selected_objects if scope == "SELECTED" else context.scene.objects
        candidates = _candidate_socket_empties(pool, scope=scope)
    if not candidates:
        raise ValueError("Select socket empties (or tag them with the addon) before syncing")

    sync_result = sync_renamed_socket_properties(context, candidates, scene)
    attached = []
    missing = list(sync_result["unresolved"])

    attachment_map = _load_attachment_map(scene)
    palette = json.loads(scene.bionicle_palette_json) if scene.bionicle_palette_json.strip() else {}

    for socket in candidates:
        kit_node_name = socket.get(KIT_NODE_PROP)
        row = attachment_map.get(socket[SOCKET_PROP], {})
        if isinstance(row, dict) and row.get("kitNodeName"):
            kit_node_name = row["kitNodeName"]
        if not kit_node_name:
            continue
        if kit_node_name not in sync_result["kit_catalog"]:
            missing.append(f"{socket[SOCKET_PROP]} → {kit_node_name} (not in kit library)")
            continue
        material_colors = row.get("materialColors") if isinstance(row, dict) else None
        preview = _attach_kit_preview(
            context, socket, kit_path, kit_node_name, material_colors, palette
        )
        if preview:
            attached.append(preview)

    return {
        "synced": sync_result["synced"],
        "attached": attached,
        "missing": missing,
    }


def _parse_attachment_map(raw):
    if not raw or not raw.strip():
        return {}
    text = raw.strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    entries = {}
    pattern = re.compile(
        r"""['"]?(?P<socket>[^'":\s]+)['"]?\s*:\s*\{\s*kitNodeName:\s*['"](?P<kit>[^'"]+)['"]""",
        re.MULTILINE,
    )
    for match in pattern.finditer(text):
        entries[match.group("socket")] = {"kitNodeName": match.group("kit")}
    return entries


def _resolve_color_source(source, palette):
    if not isinstance(source, dict):
        return None
    kind = source.get("kind")
    if kind == "lego":
        return LEGO_COLORS.get(source.get("value"))
    if kind == "palette":
        key = source.get("key")
        if key and palette:
            hex_color = palette.get(key)
            if hex_color and hex_color.startswith("#") and len(hex_color) >= 7:
                r = int(hex_color[1:3], 16) / 255.0
                g = int(hex_color[3:5], 16) / 255.0
                b = int(hex_color[5:7], 16) / 255.0
                return (r, g, b, 1.0)
    return None


def _normalize_slot_entry(entry):
    if isinstance(entry, dict) and "kind" in entry:
        return {"color": entry}
    return entry if isinstance(entry, dict) else {"color": entry}


def _apply_material_slot(material, spec, palette):
    if not material or not hasattr(material, "diffuse_color"):
        return
    spec = _normalize_slot_entry(spec)
    color_source = spec.get("color")
    if color_source:
        rgba = _resolve_color_source(color_source, palette)
        if rgba:
            material.diffuse_color = rgba
    emissive_source = spec.get("emissive")
    if emissive_source and hasattr(material, "node_tree") and material.node_tree:
        rgba = _resolve_color_source(emissive_source, palette)
        if rgba:
            for node in material.node_tree.nodes:
                if node.type == "EMISSION":
                    node.inputs["Color"].default_value = rgba
                    break


def _apply_material_colors_to_object(obj, material_colors, palette):
    if not material_colors:
        return 0
    updated = 0
    lookup = {name.strip().lower(): spec for name, spec in material_colors.items()}
    if obj.type == "MESH":
        mats = obj.data.materials if obj.data else []
        for mat in mats:
            if not mat:
                continue
            spec = lookup.get(mat.name.strip().lower())
            if spec:
                _apply_material_slot(mat, spec, palette)
                updated += 1
    for child in obj.children:
        updated += _apply_material_colors_to_object(child, material_colors, palette)
    return updated


def _load_attachment_map(scene):
    return _parse_attachment_map(scene.bionicle_attachment_map_json)


def _kit_library_filepath(kit_path):
    return bpy.path.abspath(kit_path)


def _matches_kit_node_name(obj, kit_node_name):
    return strip_numeric_suffix(obj.name) == kit_node_name


def _get_or_create_kit_collection(context):
    kit_collection = bpy.data.collections.get(KIT_COLLECTION_NAME)
    if kit_collection is None:
        kit_collection = bpy.data.collections.new(KIT_COLLECTION_NAME)
    if kit_collection.name not in context.scene.collection.children:
        context.scene.collection.children.link(kit_collection)
    return kit_collection


def _move_object_to_collection(obj, target_collection):
    for collection in obj.users_collection:
        collection.objects.unlink(obj)
    target_collection.objects.link(obj)


def _is_from_kit_library(obj, kit_path):
    if obj.library is None:
        return False
    return bpy.path.abspath(obj.library.filepath) == _kit_library_filepath(kit_path)


def _link_kit_object(kit_path, kit_node_name):
    abs_path = _kit_library_filepath(kit_path)
    with bpy.data.libraries.load(
        abs_path, link=True, create_liboverrides=True, relative=False
    ) as (data_from, data_to):
        if kit_node_name not in data_from.objects:
            return None
        data_to.objects = [kit_node_name]

    if not data_to.objects:
        return None
    return data_to.objects[0]


def _find_kit_collection_part(kit_collection, kit_path, kit_node_name):
    """Return (object, action) where action is reuse, duplicate, or link."""
    matches = []
    for obj in kit_collection.objects:
        if not _matches_kit_node_name(obj, kit_node_name):
            continue
        if kit_path and obj.library is not None and not _is_from_kit_library(obj, kit_path):
            continue
        matches.append(obj)

    if not matches:
        return None, "link"

    unparented = [obj for obj in matches if obj.parent is None]
    if unparented:
        return unparented[0], "reuse"

    return matches[0], "duplicate"


def _link_kit_object_to_collection(context, kit_path, kit_node_name, kit_collection):
    linked = _link_kit_object(kit_path, kit_node_name)
    if linked is None:
        return None
    _move_object_to_collection(linked, kit_collection)
    return linked


def _duplicate_linked_instance(context, source, kit_collection):
    view_layer = context.view_layer
    bpy.ops.object.select_all(action="DESELECT")
    source.select_set(True)
    view_layer.objects.active = source
    bpy.ops.object.duplicate()
    duplicate = view_layer.objects.active
    duplicate[KIT_PREVIEW_PROP] = True
    _move_object_to_collection(duplicate, kit_collection)
    return duplicate


def _ensure_object_in_view(context, obj):
    kit_collection = _get_or_create_kit_collection(context)
    if not obj.users_collection:
        kit_collection.objects.link(obj)
    elif kit_collection.name not in {coll.name for coll in obj.users_collection}:
        _move_object_to_collection(obj, kit_collection)


def _parent_preview_with_identity_local(preview, socket):
    preview.parent = socket
    preview.matrix_local = Matrix.Identity(4)


def _acquire_kit_preview_object(context, kit_path, kit_node_name):
    kit_collection = _get_or_create_kit_collection(context)
    source, action = _find_kit_collection_part(kit_collection, kit_path, kit_node_name)

    if action == "reuse":
        return source
    if action == "duplicate":
        return _duplicate_linked_instance(context, source, kit_collection)
    return _link_kit_object_to_collection(context, kit_path, kit_node_name, kit_collection)


def _attach_kit_preview(context, socket, kit_path, kit_node_name, material_colors, palette):
    for child in _kit_preview_children(socket):
        bpy.data.objects.remove(child, do_unlink=True)

    preview = _acquire_kit_preview_object(context, kit_path, kit_node_name)
    if not preview:
        return None

    preview[KIT_PREVIEW_PROP] = True
    preview.hide_viewport = False
    preview.hide_render = False
    _ensure_object_in_view(context, preview)
    _parent_preview_with_identity_local(preview, socket)
    _apply_material_colors_to_object(preview, material_colors, palette)
    return preview


def create_socket_empty_for_source(context, source, scene=None):
    scene = scene or _active_scene(context)
    socket_name = _socket_name(scene, source)
    kit_node_name = _kit_node_name(scene, source)

    empty = bpy.data.objects.new(socket_name, None)
    empty.empty_display_type = scene.bionicle_empty_display_type
    empty.empty_display_size = scene.bionicle_empty_size
    empty[SOCKET_PROP] = socket_name
    empty[KIT_NODE_PROP] = kit_node_name
    empty[SOURCE_OBJECT_PROP] = source.name

    _target_collection(context, source).objects.link(empty)

    if scene.bionicle_parent_mode == "SAME_PARENT":
        _copy_parenting(source, empty)
    _apply_empty_rotation_mode(scene, source, empty)

    if scene.bionicle_hide_source:
        source.hide_viewport = True
        source.hide_render = True

    source[SOCKET_PROP] = socket_name
    source[KIT_NODE_PROP] = kit_node_name
    source[SOURCE_OBJECT_PROP] = source.name
    return empty


def delete_tagged_sources(context, scene=None):
    scene = scene or _active_scene(context)
    deleted = []
    for source in list(_tagged_source_objects(scene)):
        if scene.bionicle_delete_only_hidden_sources and not source.hide_viewport:
            continue
        bpy.data.objects.remove(source, do_unlink=True)
        deleted.append(source.name)
    return deleted


def attach_kit_previews(context, sockets=None, scene=None):
    scene = scene or _active_scene(context)
    kit_path = scene.bionicle_kit_library_path.strip()
    if not kit_path:
        raise ValueError("Set Kit Library Path to a .blend file with shared kit objects")

    kit_catalog = _list_kit_library_objects(kit_path)
    attachment_map = _load_attachment_map(scene)
    palette = json.loads(scene.bionicle_palette_json) if scene.bionicle_palette_json.strip() else {}
    sockets = sockets or _socket_empties(context.scene.objects)
    attached = []
    missing = []

    for socket in sockets:
        socket_name = socket.get(SOCKET_PROP) or _runtime_socket_name(socket)
        kit_node_name = socket.get(KIT_NODE_PROP)
        if scene.bionicle_infer_kit_from_socket_name:
            inferred = infer_kit_node_name(socket_name, kit_catalog)
            if inferred:
                kit_node_name = inferred
                socket[KIT_NODE_PROP] = kit_node_name
        row = attachment_map.get(socket_name, {})
        if isinstance(row, dict) and row.get("kitNodeName"):
            kit_node_name = row["kitNodeName"]
        if not kit_node_name:
            missing.append(socket_name)
            continue
        if kit_node_name not in kit_catalog:
            missing.append(f"{socket_name} → {kit_node_name}")
            continue
        material_colors = row.get("materialColors") if isinstance(row, dict) else None
        preview = _attach_kit_preview(
            context, socket, kit_path, kit_node_name, material_colors, palette
        )
        if preview:
            attached.append(preview)
    if missing and not attached:
        raise ValueError("No kit previews attached; missing kit nodes: " + ", ".join(missing[:5]))
    return attached


def process_selected_kit_sockets(context, scene=None):
    scene = scene or _active_scene(context)
    sources = [obj for obj in context.selected_objects if obj.type != "EMPTY"]
    if not sources:
        raise ValueError("Select at least one non-empty object")

    created = []
    skipped = 0
    for source in sources:
        if scene.bionicle_skip_existing and source.get(SOURCE_OBJECT_PROP):
            skipped += 1
            continue
        created.append(create_socket_empty_for_source(context, source, scene))

    deleted = []
    if scene.bionicle_delete_sources_after:
        deleted = delete_tagged_sources(context, scene)

    attached = []
    if scene.bionicle_attach_kit_preview_after:
        attached = attach_kit_previews(context, created or _socket_empties(context.scene.objects), scene)

    return {
        "created": created,
        "skipped": skipped,
        "deleted": deleted,
        "attached": attached,
    }


class BIONICLE_OT_create_socket_empties(bpy.types.Operator):
    """Create one kit socket empty per selected object."""

    bl_idname = "bionicle.create_socket_empties"
    bl_label = "Create Socket Empties"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        scene = _active_scene(context)
        sources = [obj for obj in context.selected_objects if obj.type != "EMPTY"]
        if not sources:
            self.report({"WARNING"}, "Select at least one non-empty object")
            return {"CANCELLED"}

        created = []
        skipped = 0
        for source in sources:
            if scene.bionicle_skip_existing and source.get(SOURCE_OBJECT_PROP):
                skipped += 1
                continue
            created.append(create_socket_empty_for_source(context, source, scene))

        if scene.bionicle_select_created:
            bpy.ops.object.select_all(action="DESELECT")
            for empty in created:
                empty.select_set(True)
            if created:
                context.view_layer.objects.active = created[-1]

        message = f"Created {len(created)} socket empty/empties"
        if skipped:
            message += f"; skipped {skipped} already tagged object(s)"
        self.report({"INFO"}, message)
        return {"FINISHED"}


class BIONICLE_OT_process_kit_sockets(bpy.types.Operator):
    """Create sockets, optionally delete sources, and attach kit previews in one step."""

    bl_idname = "bionicle.process_kit_sockets"
    bl_label = "Process Selected (Full Pipeline)"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        scene = _active_scene(context)
        try:
            result = process_selected_kit_sockets(context, scene)
        except ValueError as exc:
            self.report({"WARNING"}, str(exc))
            return {"CANCELLED"}

        if scene.bionicle_select_created and result["created"]:
            bpy.ops.object.select_all(action="DESELECT")
            for empty in result["created"]:
                empty.select_set(True)
            context.view_layer.objects.active = result["created"][-1]

        message = (
            f"Created {len(result['created'])} socket(s); "
            f"deleted {len(result['deleted'])} source(s); "
            f"attached {len(result['attached'])} kit preview(s)"
        )
        if result["skipped"]:
            message += f"; skipped {result['skipped']} tagged object(s)"
        self.report({"INFO"}, message)
        return {"FINISHED"}


class BIONICLE_OT_delete_tagged_sources(bpy.types.Operator):
    """Delete original kit meshes already replaced by socket empties."""

    bl_idname = "bionicle.delete_tagged_sources"
    bl_label = "Delete Tagged Source Meshes"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        deleted = delete_tagged_sources(context)
        if not deleted:
            self.report({"WARNING"}, "No tagged source meshes to delete")
            return {"CANCELLED"}
        self.report({"INFO"}, f"Deleted {len(deleted)} source mesh(es)")
        return {"FINISHED"}


class BIONICLE_OT_sync_and_attach_kit_previews(bpy.types.Operator):
    """After manual renames: sync socket props, infer kit nodes, reset socket transforms, attach kit previews."""

    bl_idname = "bionicle.sync_and_attach_kit_previews"
    bl_label = "Sync Renamed Sockets & Attach Kit"
    bl_options = {"REGISTER", "UNDO"}

    scope: bpy.props.EnumProperty(
        name="Scope",
        items=(
            ("SELECTED", "Selected Empties", "Sync every selected empty object"),
            ("SCENE", "Scene Sockets", "Sync all addon-tagged socket empties in the scene"),
        ),
        default="SELECTED",
    )

    def execute(self, context):
        try:
            result = sync_and_attach_kit_previews(context, scope=self.scope)
        except ValueError as exc:
            self.report({"WARNING"}, str(exc))
            return {"CANCELLED"}

        message = (
            f"Synced {len(result['synced'])} socket(s); "
            f"attached {len(result['attached'])} kit preview(s)"
        )
        if result["missing"]:
            message += f"; skipped {len(result['missing'])} missing kit node(s)"
            self.report({"WARNING"}, message + " — see Blender system console")
            for entry in result["missing"]:
                print(f"[Bionicle Kit Sockets] missing kit node: {entry}")
        else:
            self.report({"INFO"}, message)
        return {"FINISHED"}


class BIONICLE_OT_attach_kit_previews(bpy.types.Operator):
    """Append kit pieces from the library .blend, parent to sockets, and reset transforms."""

    bl_idname = "bionicle.attach_kit_previews"
    bl_label = "Attach Kit Previews"
    bl_options = {"REGISTER", "UNDO"}

    scope: bpy.props.EnumProperty(
        name="Scope",
        items=(
            ("SELECTED", "Selected Sockets", "Only selected socket empties"),
            ("SCENE", "Scene", "All socket empties in the scene"),
        ),
        default="SELECTED",
    )

    def execute(self, context):
        candidates = context.selected_objects if self.scope == "SELECTED" else context.scene.objects
        sockets = _socket_empties(candidates)
        if not sockets:
            self.report({"WARNING"}, "No socket empties found")
            return {"CANCELLED"}
        try:
            attached = attach_kit_previews(context, sockets)
        except ValueError as exc:
            self.report({"WARNING"}, str(exc))
            return {"CANCELLED"}
        self.report({"INFO"}, f"Attached {len(attached)} kit preview object(s)")
        return {"FINISHED"}


class BIONICLE_OT_reset_kit_preview_transforms(bpy.types.Operator):
    """Reset kit preview children to identity local transform on their socket."""

    bl_idname = "bionicle.reset_kit_preview_transforms"
    bl_label = "Reset Kit Preview Transforms"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        sockets = _socket_empties(context.scene.objects)
        reset = 0
        for socket in sockets:
            for child in _kit_preview_children(socket):
                _parent_preview_with_identity_local(child, socket)
                reset += 1
        if not reset:
            self.report({"WARNING"}, "No kit preview children found")
            return {"CANCELLED"}
        self.report({"INFO"}, f"Reset {reset} kit preview transform(s)")
        return {"FINISHED"}


class BIONICLE_OT_apply_material_preview(bpy.types.Operator):
    """Apply materialColors from the attachment map JSON to kit preview meshes."""

    bl_idname = "bionicle.apply_material_preview"
    bl_label = "Apply Material Preview"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        attachment_map = _load_attachment_map(context.scene)
        if not attachment_map:
            self.report({"WARNING"}, "Attachment map JSON is empty or invalid")
            return {"CANCELLED"}

        palette = (
            json.loads(context.scene.bionicle_palette_json)
            if context.scene.bionicle_palette_json.strip()
            else {}
        )
        updated = 0
        for socket in _socket_empties(context.scene.objects):
            row = attachment_map.get(socket[SOCKET_PROP], {})
            material_colors = row.get("materialColors") if isinstance(row, dict) else None
            if not material_colors:
                continue
            for child in _kit_preview_children(socket):
                updated += _apply_material_colors_to_object(child, material_colors, palette)

        if not updated:
            self.report({"WARNING"}, "No kit preview materials updated")
            return {"CANCELLED"}
        self.report({"INFO"}, f"Updated {updated} material slot(s)")
        return {"FINISHED"}


class BIONICLE_OT_copy_attachment_map(bpy.types.Operator):
    """Copy a TypeScript socket attachment map for selected or scene socket empties."""

    bl_idname = "bionicle.copy_attachment_map"
    bl_label = "Copy Attachment Map"
    bl_options = {"REGISTER"}

    scope: bpy.props.EnumProperty(
        name="Scope",
        items=(
            ("SELECTED", "Selected", "Only selected socket empties"),
            ("SCENE", "Scene", "All socket empties in the scene"),
        ),
        default="SELECTED",
    )

    def execute(self, context):
        candidates = context.selected_objects if self.scope == "SELECTED" else context.scene.objects
        sockets = _socket_empties(candidates)
        if not sockets:
            self.report({"WARNING"}, "No socket empties found")
            return {"CANCELLED"}

        sync_renamed_socket_properties(context, sockets)

        socket_names = [obj[SOCKET_PROP] for obj in sockets]
        duplicate_names = sorted(
            {name for name in socket_names if socket_names.count(name) > 1}
        )
        if duplicate_names:
            self.report(
                {"WARNING"},
                "Duplicate socket names: " + ", ".join(duplicate_names),
            )
            return {"CANCELLED"}

        entries = []
        for obj in sorted(sockets, key=lambda item: _runtime_socket_name(item)):
            socket_name = obj[SOCKET_PROP]
            kit_node_name = obj.get(KIT_NODE_PROP) or socket_name
            entries.append(
                f"  {_json_string(socket_name)}: {{ kitNodeName: {_json_string(kit_node_name)} }},"
            )

        context.window_manager.clipboard = "{\n" + "\n".join(entries) + "\n}"
        self.report({"INFO"}, f"Copied {len(entries)} attachment entries")
        return {"FINISHED"}


class BIONICLE_PT_kit_socket_helper(bpy.types.Panel):
    bl_idname = "BIONICLE_PT_kit_socket_helper"
    bl_label = "Bionicle Kit Sockets"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Bionicle Kit"

    def draw(self, context):
        layout = self.layout
        scene = _active_scene(context)

        layout.separator()
        layout.label(text="After manual rename")
        layout.label(text="Rename empties (e.g. Axle2L_Head), then:")
        layout.prop(scene, "bionicle_kit_library_path")
        layout.prop(scene, "bionicle_infer_kit_from_socket_name")
        layout.prop(scene, "bionicle_reset_socket_transforms_on_sync")
        layout.prop(scene, "bionicle_attachment_map_json")
        layout.prop(scene, "bionicle_palette_json")
        row = layout.row(align=True)
        op = row.operator("bionicle.sync_and_attach_kit_previews", text="Sync Selected")
        op.scope = "SELECTED"
        op = row.operator("bionicle.sync_and_attach_kit_previews", text="Sync Scene")
        op.scope = "SCENE"

        layout.separator()
        layout.label(text="Create sockets from selected objects")
        layout.prop(scene, "bionicle_socket_name_mode")
        if scene.bionicle_socket_name_mode == "CUSTOM":
            layout.prop(scene, "bionicle_custom_socket_name")
        layout.prop(scene, "bionicle_kit_name_mode")
        if scene.bionicle_kit_name_mode == "CUSTOM":
            layout.prop(scene, "bionicle_custom_kit_node_name")

        layout.separator()
        layout.prop(scene, "bionicle_parent_mode")
        layout.prop(scene, "bionicle_empty_rotation_mode")
        if scene.bionicle_empty_rotation_mode == "LOCAL_IDENTITY":
            layout.prop(scene, "bionicle_local_identity_keep_world_location")
        layout.prop(scene, "bionicle_preserve_source_transform")
        layout.prop(scene, "bionicle_empty_display_type")
        layout.prop(scene, "bionicle_empty_size")
        layout.prop(scene, "bionicle_hide_source")
        layout.prop(scene, "bionicle_skip_existing")
        layout.prop(scene, "bionicle_select_created")
        layout.operator("bionicle.create_socket_empties", icon="EMPTY_AXIS")

        layout.separator()
        layout.label(text="Full pipeline")
        layout.prop(scene, "bionicle_delete_sources_after")
        if scene.bionicle_delete_sources_after:
            layout.prop(scene, "bionicle_delete_only_hidden_sources")
        layout.prop(scene, "bionicle_attach_kit_preview_after")
        layout.operator("bionicle.process_kit_sockets", icon="AUTO")

        layout.separator()
        layout.label(text="Kit preview tools (advanced)")
        row = layout.row(align=True)
        op = row.operator("bionicle.attach_kit_previews", text="Attach Selected")
        op.scope = "SELECTED"
        op = row.operator("bionicle.attach_kit_previews", text="Attach Scene")
        op.scope = "SCENE"
        layout.operator("bionicle.reset_kit_preview_transforms", icon="OBJECT_ORIGIN")
        layout.operator("bionicle.apply_material_preview", icon="MATERIAL")
        layout.operator("bionicle.delete_tagged_sources", icon="TRASH")

        layout.separator()
        layout.label(text="Attachment map")
        row = layout.row(align=True)
        op = row.operator("bionicle.copy_attachment_map", text="Copy Selected")
        op.scope = "SELECTED"
        op = row.operator("bionicle.copy_attachment_map", text="Copy Scene")
        op.scope = "SCENE"


def _register_scene_props():
    bpy.types.Scene.bionicle_socket_name_mode = bpy.props.EnumProperty(
        name="Socket Name",
        description="Name for each created empty; this becomes the attachment map key",
        items=(
            ("PARENT", "Parent Bone/Object", "Use parent bone, parent object, then object name"),
            ("OBJECT", "Object Name", "Use the selected object name"),
            ("OBJECT_BASE", "Object Name (No .001)", "Use object name without Blender numeric suffix"),
            ("CUSTOM", "Custom", "Use the same custom name for all selected objects"),
        ),
        default="PARENT",
    )
    bpy.types.Scene.bionicle_kit_name_mode = bpy.props.EnumProperty(
        name="Kit Node Name",
        description="Name of the shared kit object to clone at runtime",
        items=(
            ("OBJECT", "Object Name", "Use the selected object name"),
            ("OBJECT_BASE", "Object Name (No .001)", "Use object name without Blender numeric suffix"),
            ("CUSTOM", "Custom", "Use the same custom kit node name for all selected objects"),
        ),
        default="OBJECT_BASE",
    )
    bpy.types.Scene.bionicle_parent_mode = bpy.props.EnumProperty(
        name="Parent",
        items=(
            ("SAME_PARENT", "Same Parent", "Parent each empty to the same bone or object as the source"),
            ("WORLD", "World", "Leave created empties unparented"),
        ),
        default="SAME_PARENT",
    )
    bpy.types.Scene.bionicle_empty_rotation_mode = bpy.props.EnumProperty(
        name="Empty Rotation",
        description="How to orient created socket empties",
        items=(
            ("SOURCE", "Match Source", "Copy source rotation (or full transform when enabled below)"),
            (
                "LOCAL_IDENTITY",
                "Local Identity",
                "Zero rotation in parent space; matches runtime kit attachment",
            ),
        ),
        default="LOCAL_IDENTITY",
    )
    bpy.types.Scene.bionicle_local_identity_keep_world_location = bpy.props.BoolProperty(
        name="Keep Source World Location",
        description="When using Local Identity rotation, keep the source object's world location on the empty",
        default=True,
    )
    bpy.types.Scene.bionicle_preserve_source_transform = bpy.props.BoolProperty(
        name="Preserve Source Transform",
        description="When rotation mode is Match Source, copy full world transform including scale",
        default=False,
    )
    bpy.types.Scene.bionicle_custom_socket_name = bpy.props.StringProperty(name="Custom Socket")
    bpy.types.Scene.bionicle_custom_kit_node_name = bpy.props.StringProperty(name="Custom Kit Node")
    bpy.types.Scene.bionicle_empty_display_type = bpy.props.EnumProperty(
        name="Empty Display",
        items=(
            ("PLAIN_AXES", "Plain Axes", ""),
            ("ARROWS", "Arrows", ""),
            ("SINGLE_ARROW", "Single Arrow", ""),
            ("CUBE", "Cube", ""),
            ("SPHERE", "Sphere", ""),
        ),
        default="PLAIN_AXES",
    )
    bpy.types.Scene.bionicle_empty_size = bpy.props.FloatProperty(
        name="Empty Size", default=0.08, min=0.001, soft_max=1.0
    )
    bpy.types.Scene.bionicle_hide_source = bpy.props.BoolProperty(
        name="Hide Source Objects", default=True
    )
    bpy.types.Scene.bionicle_skip_existing = bpy.props.BoolProperty(
        name="Skip Already Tagged Objects",
        description="Do not create another empty for an object processed by this addon",
        default=True,
    )
    bpy.types.Scene.bionicle_select_created = bpy.props.BoolProperty(
        name="Select Created Empties", default=True
    )
    bpy.types.Scene.bionicle_delete_sources_after = bpy.props.BoolProperty(
        name="Delete Source Meshes After",
        description="Remove original kit meshes once socket empties are created",
        default=False,
    )
    bpy.types.Scene.bionicle_delete_only_hidden_sources = bpy.props.BoolProperty(
        name="Only Delete Hidden Sources",
        default=True,
    )
    bpy.types.Scene.bionicle_attach_kit_preview_after = bpy.props.BoolProperty(
        name="Attach Kit Previews After",
        description="Append kit pieces from the library .blend and parent them to new sockets",
        default=False,
    )
    bpy.types.Scene.bionicle_infer_kit_from_socket_name = bpy.props.BoolProperty(
        name="Infer Kit Node From Socket Name",
        description="Map Axle2L_Head → Axle2L using object names listed in the kit library .blend",
        default=True,
    )
    bpy.types.Scene.bionicle_reset_socket_transforms_on_sync = bpy.props.BoolProperty(
        name="Reset Socket Transforms On Sync",
        description="Zero each socket empty's local transform during sync (usually leave off after manual placement)",
        default=False,
    )
    bpy.types.Scene.bionicle_kit_library_path = bpy.props.StringProperty(
        name="Kit Library Path",
        description="Path to the shared kit .blend file (for preview attachment)",
        subtype="FILE_PATH",
        default="",
    )
    bpy.types.Scene.bionicle_attachment_map_json = bpy.props.StringProperty(
        name="Attachment Map JSON",
        description="Optional JSON or TypeScript attachment map snippet for kitNodeName and materialColors",
        default="",
    )
    bpy.types.Scene.bionicle_palette_json = bpy.props.StringProperty(
        name="Palette JSON",
        description='Optional palette for material preview, e.g. {"mask":"#FFFFFF","body":"#C91A09"}',
        default="",
    )


def _unregister_scene_props():
    del bpy.types.Scene.bionicle_socket_name_mode
    del bpy.types.Scene.bionicle_kit_name_mode
    del bpy.types.Scene.bionicle_parent_mode
    del bpy.types.Scene.bionicle_empty_rotation_mode
    del bpy.types.Scene.bionicle_local_identity_keep_world_location
    del bpy.types.Scene.bionicle_preserve_source_transform
    del bpy.types.Scene.bionicle_custom_socket_name
    del bpy.types.Scene.bionicle_custom_kit_node_name
    del bpy.types.Scene.bionicle_empty_display_type
    del bpy.types.Scene.bionicle_empty_size
    del bpy.types.Scene.bionicle_hide_source
    del bpy.types.Scene.bionicle_skip_existing
    del bpy.types.Scene.bionicle_select_created
    del bpy.types.Scene.bionicle_delete_sources_after
    del bpy.types.Scene.bionicle_delete_only_hidden_sources
    del bpy.types.Scene.bionicle_attach_kit_preview_after
    del bpy.types.Scene.bionicle_infer_kit_from_socket_name
    del bpy.types.Scene.bionicle_reset_socket_transforms_on_sync
    del bpy.types.Scene.bionicle_kit_library_path
    del bpy.types.Scene.bionicle_attachment_map_json
    del bpy.types.Scene.bionicle_palette_json


classes = (
    BIONICLE_OT_create_socket_empties,
    BIONICLE_OT_process_kit_sockets,
    BIONICLE_OT_delete_tagged_sources,
    BIONICLE_OT_sync_and_attach_kit_previews,
    BIONICLE_OT_attach_kit_previews,
    BIONICLE_OT_reset_kit_preview_transforms,
    BIONICLE_OT_apply_material_preview,
    BIONICLE_OT_copy_attachment_map,
    BIONICLE_PT_kit_socket_helper,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    _register_scene_props()


def unregister():
    _unregister_scene_props()
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)


if __name__ == "__main__":
    register()
