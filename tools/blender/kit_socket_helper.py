bl_info = {
    "name": "Bionicle Kit Socket Helper",
    "author": "Bionicle Idle RPG contributors",
    "version": (0, 1, 0),
    "blender": (3, 6, 0),
    "location": "View3D > Sidebar > Bionicle Kit",
    "description": "Create shared-kit socket empties from selected Blender objects.",
    "category": "Object",
}

import json

import bpy
from mathutils import Matrix


SOCKET_PROP = "bionicle_socket"
KIT_NODE_PROP = "bionicle_kit_node"
SOURCE_OBJECT_PROP = "bionicle_source_object"


def _strip_numeric_suffix(name):
    base, dot, suffix = name.rpartition(".")
    if dot and len(suffix) == 3 and suffix.isdigit():
        return base
    return name


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


def _json_string(value):
    return json.dumps(value)


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
            if scene.bionicle_preserve_source_transform:
                _copy_source_world_transform(source, empty)
            else:
                _copy_source_origin_transform(source, empty)

            if scene.bionicle_hide_source:
                source.hide_viewport = True
                source.hide_render = True

            source[SOCKET_PROP] = socket_name
            source[KIT_NODE_PROP] = kit_node_name
            source[SOURCE_OBJECT_PROP] = source.name
            created.append(empty)

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
        sockets = [
            obj
            for obj in candidates
            if obj.type == "EMPTY" and KIT_NODE_PROP in obj and SOCKET_PROP in obj
        ]
        if not sockets:
            self.report({"WARNING"}, "No socket empties found")
            return {"CANCELLED"}

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
        for obj in sorted(sockets, key=lambda item: item[SOCKET_PROP]):
            socket_name = obj[SOCKET_PROP]
            kit_node_name = obj[KIT_NODE_PROP]
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

        layout.label(text="Create sockets from selected objects")
        layout.prop(scene, "bionicle_socket_name_mode")
        if scene.bionicle_socket_name_mode == "CUSTOM":
            layout.prop(scene, "bionicle_custom_socket_name")
        layout.prop(scene, "bionicle_kit_name_mode")
        if scene.bionicle_kit_name_mode == "CUSTOM":
            layout.prop(scene, "bionicle_custom_kit_node_name")

        layout.separator()
        layout.prop(scene, "bionicle_parent_mode")
        layout.prop(scene, "bionicle_preserve_source_transform")
        layout.prop(scene, "bionicle_empty_display_type")
        layout.prop(scene, "bionicle_empty_size")
        layout.prop(scene, "bionicle_hide_source")
        layout.prop(scene, "bionicle_skip_existing")
        layout.prop(scene, "bionicle_select_created")
        layout.operator("bionicle.create_socket_empties", icon="EMPTY_AXIS")

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
    bpy.types.Scene.bionicle_preserve_source_transform = bpy.props.BoolProperty(
        name="Preserve Source Transform",
        description="Copy the source object's full world transform, including scale; otherwise keep source origin and rotation only",
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


def _unregister_scene_props():
    del bpy.types.Scene.bionicle_socket_name_mode
    del bpy.types.Scene.bionicle_kit_name_mode
    del bpy.types.Scene.bionicle_parent_mode
    del bpy.types.Scene.bionicle_preserve_source_transform
    del bpy.types.Scene.bionicle_custom_socket_name
    del bpy.types.Scene.bionicle_custom_kit_node_name
    del bpy.types.Scene.bionicle_empty_display_type
    del bpy.types.Scene.bionicle_empty_size
    del bpy.types.Scene.bionicle_hide_source
    del bpy.types.Scene.bionicle_skip_existing
    del bpy.types.Scene.bionicle_select_created


classes = (
    BIONICLE_OT_create_socket_empties,
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
