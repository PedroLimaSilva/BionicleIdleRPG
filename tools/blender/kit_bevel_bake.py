bl_info = {
    "name": "Bionicle Kit Bevel Bake (module)",
    "author": "Bionicle Idle RPG contributors",
    "version": (0, 1, 0),
    "blender": (3, 6, 0),
    "location": "View3D > Sidebar > Bionicle Kit > Kit Parts",
    "description": "Kit-part bevel bake module — install kit_socket_helper.py instead.",
    "category": "Object",
}

"""
Bake geometric bevel maps for kit GLB parts.

Runtime contract (see src/rendering/3d/CharacterScene/kitBevelMap.ts):
  public/{kit_stem}/{kitNodeName}_bevel.webp   (or .png)
  R = convex edge wear, G = concave cavity (non-color data)

Kit .blend collections map to export stems:
  2001 -> kit_2001
  2003 -> kit_2003
  2004 -> kit_2004
"""

import json
import os
import re
from typing import Iterable, List, Optional, Sequence, Tuple

import bpy
from bpy.props import (
    BoolProperty,
    EnumProperty,
    IntProperty,
    PointerProperty,
    StringProperty,
)
from bpy.types import AddonPreferences, Operator, Panel, PropertyGroup

UV_LAYER_NAME = "BevelUV"
COLLECTION_TO_STEM = {
    "2001": "kit_2001",
    "2003": "kit_2003",
    "2004": "kit_2004",
}
DEFAULT_SKIP_PARTS = {
    "Axle2L",
    "Axle3L",
    "Axle6L",
    "AxlePin",
    "Pin2L",
}

_SAMPLE_RE = re.compile(r"Sample\s+(\d+)/(\d+)", re.I)


def _is_object_bake_running() -> bool:
    if hasattr(bpy.app, "is_job_running"):
        try:
            return bool(bpy.app.is_job_running("OBJECT_BAKE"))
        except TypeError:
            pass
    return False


def _redraw_all_areas() -> None:
    try:
        for window in bpy.context.window_manager.windows:
            for area in window.screen.areas:
                area.tag_redraw()
    except Exception:
        pass


class BakeProgressReporter:
    """UI + console progress for long Cycles bakes."""

    def __init__(
        self,
        *,
        wm: Optional[bpy.types.WindowManager] = None,
        part_index: int = 0,
        part_count: int = 1,
        part_name: str = "",
        base_fraction: float = 0.0,
        span_fraction: float = 1.0,
    ) -> None:
        self.wm = wm
        self.part_index = part_index
        self.part_count = part_count
        self.part_name = part_name
        self.base_fraction = base_fraction
        self.span_fraction = span_fraction
        self._stats_handler = None
        self._pass_local_start = 0.0
        self._pass_local_end = 1.0
        self._last_pct = -1

    def _fraction(self, local: float) -> float:
        part_span = self.span_fraction / max(self.part_count, 1)
        return self.base_fraction + (self.part_index + local) * part_span

    @staticmethod
    def _wm_progress_update(
        wm: Optional[bpy.types.WindowManager], value: int, text: str = ""
    ) -> None:
        if wm is None:
            return
        try:
            wm.progress_update(value, text)
        except TypeError:
            wm.progress_update(value)
        _redraw_all_areas()

    def set_pass_range(self, local_start: float, local_end: float) -> None:
        self._pass_local_start = local_start
        self._pass_local_end = local_end

    def stage(self, local: float, message: str) -> None:
        frac = self._fraction(local)
        label = f"{self.part_name}: {message}" if self.part_name else message
        pct = int(frac * 100)
        self._last_pct = pct
        print(f"[Bionicle Kit Bevel] {label} ({pct}%)", flush=True)
        self._wm_progress_update(self.wm, pct, label)

    def update_pass_sample(self, done: int, total: int, label: str) -> None:
        total = max(total, 1)
        t = done / total
        local = self._pass_local_start + t * (self._pass_local_end - self._pass_local_start)
        frac = self._fraction(local)
        pct = int(frac * 100)
        if pct == self._last_pct:
            return
        self._last_pct = pct
        msg = f"{self.part_name}: {label} {done}/{total}" if self.part_name else f"{label} {done}/{total}"
        print(f"[Bionicle Kit Bevel]   {msg} ({pct}%)", flush=True)
        self._wm_progress_update(self.wm, pct, msg)

    def begin_cycles_watch(self, local_start: float = 0.0, local_end: float = 1.0) -> None:
        if self._stats_handler is not None:
            return
        self.set_pass_range(local_start, local_end)

        def on_stats(_scene, stats: str) -> None:
            text = stats.strip()
            if text and "Sample" not in text:
                print(f"[Bionicle Kit Bevel]   {text}", flush=True)
            match = _SAMPLE_RE.search(stats)
            if match:
                self.update_pass_sample(int(match.group(1)), int(match.group(2)), "Cycles")

        self._stats_handler = on_stats
        bpy.app.handlers.render_stats.append(on_stats)

    def end_cycles_watch(self) -> None:
        if self._stats_handler is None:
            return
        if self._stats_handler in bpy.app.handlers.render_stats:
            bpy.app.handlers.render_stats.remove(self._stats_handler)
        self._stats_handler = None


def _kit_stem_from_collection_name(name: str) -> Optional[str]:
    return COLLECTION_TO_STEM.get(name)


def _mesh_objects_in_collection(collection: bpy.types.Collection) -> List[bpy.types.Object]:
    out: List[bpy.types.Object] = []
    for obj in collection.objects:
        if obj.type == "MESH":
            out.append(obj)
    for child in collection.children:
        out.extend(_mesh_objects_in_collection(child))
    return out


def _parse_part_list(text: str) -> List[str]:
    parts: List[str] = []
    seen = set()
    for chunk in text.replace("\n", ",").split(","):
        name = chunk.strip()
        if not name or name in seen:
            continue
        seen.add(name)
        parts.append(name)
    return parts


def _normalize_channel(values: Sequence[float], invert: bool = False) -> List[float]:
    """Stretch to 0-1, then crush mid-tones so flats stay dark."""
    lo = min(values)
    hi = max(values)
    span = hi - lo if hi > lo else 1.0
    out: List[float] = []
    for v in values:
        t = (v - lo) / span
        if invert:
            t = 1.0 - t
        # Keep wear/cavity on edges and recesses, not across whole faces.
        t = t**1.75
        out.append(t)
    return out


def _mesh_edit_context(obj: bpy.types.Object) -> dict:
    ctx = bpy.context.copy()
    ctx["active_object"] = obj
    ctx["object"] = obj
    ctx["selected_objects"] = [obj]
    ctx["selected_editable_objects"] = [obj]
    ctx["editable_objects"] = [obj]
    return ctx


def _ensure_bevel_uv(obj: bpy.types.Object, uv_name: str = UV_LAYER_NAME) -> None:
    mesh = obj.data
    if uv_name not in mesh.uv_layers:
        mesh.uv_layers.new(name=uv_name)
    mesh.uv_layers.active = mesh.uv_layers[uv_name]
    mesh.uv_layers[uv_name].active_render = True

    print(f"[Bionicle Kit Bevel] Smart UV Project on {obj.name}…", flush=True)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    with bpy.context.temp_override(**_mesh_edit_context(obj)):
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.smart_project(angle_limit=66, island_margin=0.03)
        bpy.ops.object.mode_set(mode="OBJECT")
    print(f"[Bionicle Kit Bevel] UV ready on {obj.name}", flush=True)


def _prep_bake_material(
    mat_name: str,
    img_name: str,
    resolution: int,
    link_emit_color,
) -> Tuple[bpy.types.Material, bpy.types.Image]:
    mat = bpy.data.materials.get(mat_name)
    if mat:
        bpy.data.materials.remove(mat)
    img = bpy.data.images.get(img_name)
    if img:
        bpy.data.images.remove(img)

    mat = bpy.data.materials.new(mat_name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    emit = nt.nodes.new("ShaderNodeEmission")
    nt.links.new(emit.outputs["Emission"], out.inputs["Surface"])
    link_emit_color(nt, emit)

    img = bpy.data.images.new(img_name, resolution, resolution, alpha=True, float_buffer=False)
    img_node = nt.nodes.new("ShaderNodeTexImage")
    img_node.image = img
    img_node.select = True
    nt.nodes.active = img_node
    return mat, img


def _assign_single_material(obj: bpy.types.Object, mat: bpy.types.Material) -> List[Optional[bpy.types.Material]]:
    original = [slot.material for slot in obj.material_slots]
    while obj.material_slots:
        bpy.ops.object.material_slot_remove()
    obj.data.materials.append(mat)
    return original


def _restore_materials(obj: bpy.types.Object, materials: Sequence[Optional[bpy.types.Material]]) -> None:
    while obj.material_slots:
        bpy.ops.object.material_slot_remove()
    for mat in materials:
        if mat:
            obj.data.materials.append(mat)


def _pixel_channel(img: bpy.types.Image, channel: int = 0) -> List[float]:
    px = img.pixels
    return [px[i * 4 + channel] for i in range(len(px) // 4)]


def _configure_scene_for_bake(scene: bpy.types.Scene, samples: int) -> None:
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.render.bake.use_pass_direct = False
    scene.render.bake.use_pass_indirect = False
    scene.render.bake.margin = 6
    scene.render.bake.margin_type = "ADJACENT_FACES"


def _hide_all_except(scene: bpy.types.Scene, keep_name: str) -> None:
    for obj in scene.objects:
        hide = obj.name != keep_name
        obj.hide_render = hide
        obj.hide_set(hide)


def _restore_visibility(scene: bpy.types.Scene) -> None:
    for obj in scene.objects:
        obj.hide_render = False
        obj.hide_set(False)


def _link_cavity_emit(nt, emit):
    ao = nt.nodes.new("ShaderNodeAmbientOcclusion")
    ao.inputs["Distance"].default_value = 0.025
    ao.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
    nt.links.new(ao.outputs["Color"], emit.inputs["Color"])


def _link_wear_emit(nt, emit):
    geom = nt.nodes.new("ShaderNodeNewGeometry")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.45
    ramp.color_ramp.elements[0].color = (0.0, 0.0, 0.0, 1.0)
    ramp.color_ramp.elements[1].position = 0.95
    ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1.0)
    nt.links.new(geom.outputs["Pointiness"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], emit.inputs["Color"])


def bake_bevel_map_for_object(
    obj: bpy.types.Object,
    *,
    resolution: int = 1024,
    samples: int = 16,
    uv_name: str = UV_LAYER_NAME,
    edge_split_angle_deg: float = 45.0,
    ensure_uv: bool = True,
    progress: Optional[BakeProgressReporter] = None,
) -> bpy.types.Image:
    """Return a packed RG image (R=wear, G=cavity) for one kit mesh object."""
    if obj.type != "MESH":
        raise ValueError(f"{obj.name} is not a mesh")

    scene = bpy.context.scene
    _configure_scene_for_bake(scene, samples)

    if progress:
        progress.stage(0.0, "preparing UVs")

    if ensure_uv:
        _ensure_bevel_uv(obj, uv_name)
    else:
        mesh = obj.data
        if uv_name not in mesh.uv_layers:
            raise ValueError(f"{obj.name} is missing UV layer {uv_name}")
        mesh.uv_layers.active = mesh.uv_layers[uv_name]
        mesh.uv_layers[uv_name].active_render = True

    _hide_all_except(scene, obj.name)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    scene.view_layers[0].objects.active = obj

    bpy.ops.object.duplicate()
    work = bpy.context.active_object
    work.name = f"{obj.name}_BEVEL_BAKE_TMP"
    split = work.modifiers.new("EdgeSplit", "EDGE_SPLIT")
    split.split_angle = edge_split_angle_deg * 3.14159265 / 180.0
    bpy.ops.object.modifier_apply(modifier=split.name)

    if progress:
        progress.stage(0.1, "baking cavity pass")

    mat_c, img_c = _prep_bake_material(
        f"{obj.name}_TMP_CAVITY",
        f"{obj.name}_TMP_CAVITY_IMG",
        resolution,
        _link_cavity_emit,
    )
    _assign_single_material(work, mat_c)
    if progress:
        progress.begin_cycles_watch(0.12, 0.48)
    try:
        bpy.ops.object.bake(type="EMIT")
    finally:
        if progress:
            progress.end_cycles_watch()
    cavity_src = _pixel_channel(img_c)

    if progress:
        progress.stage(0.5, "baking wear pass")

    mat_w, img_w = _prep_bake_material(
        f"{obj.name}_TMP_WEAR",
        f"{obj.name}_TMP_WEAR_IMG",
        resolution,
        _link_wear_emit,
    )
    work.data.materials[0] = mat_w
    if progress:
        progress.begin_cycles_watch(0.52, 0.88)
    try:
        bpy.ops.object.bake(type="EMIT")
    finally:
        if progress:
            progress.end_cycles_watch()
    wear_src = _pixel_channel(img_w)

    if progress:
        progress.stage(0.9, "packing RG channels")

    wear = _normalize_channel(wear_src, invert=False)
    cavity = _normalize_channel(cavity_src, invert=True)

    combined_name = f"{obj.name}_bevel"
    existing = bpy.data.images.get(combined_name)
    if existing:
        bpy.data.images.remove(existing)
    combined = bpy.data.images.new(combined_name, resolution, resolution, alpha=True, float_buffer=False)

    pixels = [0.0] * (resolution * resolution * 4)
    for i in range(resolution * resolution):
        pixels[i * 4] = wear[i]
        pixels[i * 4 + 1] = cavity[i]
        pixels[i * 4 + 2] = 0.0
        pixels[i * 4 + 3] = 1.0
    combined.pixels = pixels
    combined.update()

    bpy.data.objects.remove(work, do_unlink=True)
    for mat_name in (f"{obj.name}_TMP_CAVITY", f"{obj.name}_TMP_WEAR"):
        mat = bpy.data.materials.get(mat_name)
        if mat:
            bpy.data.materials.remove(mat)
    for img_name in (f"{obj.name}_TMP_CAVITY_IMG", f"{obj.name}_TMP_WEAR_IMG"):
        img = bpy.data.images.get(img_name)
        if img:
            bpy.data.images.remove(img)

    _restore_visibility(scene)
    if progress:
        progress.stage(1.0, "done")
    return combined


def save_bevel_image(
    image: bpy.types.Image,
    output_dir: str,
    kit_node_name: str,
    file_format: str = "PNG",
) -> str:
    os.makedirs(output_dir, exist_ok=True)
    ext = ".webp" if file_format == "WEBP" else ".png"
    path = os.path.join(output_dir, f"{kit_node_name}_bevel{ext}")
    image.filepath_raw = path
    image.file_format = file_format
    image.save()
    return path


def _invoke_emit_bake() -> bool:
    """Start an EMIT bake without blocking the UI when supported."""
    try:
        result = bpy.ops.object.bake({"INVOKE_DEFAULT"}, type="EMIT")
    except Exception:
        bpy.ops.object.bake(type="EMIT")
        return False
    return "RUNNING_MODAL" in result or "FINISHED" in result


class PartBevelAsyncRunner:
    """Drives one part through prep + two Cycles EMIT passes without freezing Blender."""

    def __init__(
        self,
        obj: bpy.types.Object,
        *,
        resolution: int,
        samples: int,
        ensure_uv: bool,
        uv_name: str = UV_LAYER_NAME,
        edge_split_angle_deg: float = 45.0,
        progress: Optional[BakeProgressReporter] = None,
    ) -> None:
        self.obj = obj
        self.resolution = resolution
        self.samples = samples
        self.ensure_uv = ensure_uv
        self.uv_name = uv_name
        self.edge_split_angle_deg = edge_split_angle_deg
        self.progress = progress
        self.state = "prep"
        self.work: Optional[bpy.types.Object] = None
        self.img_c: Optional[bpy.types.Image] = None
        self.img_w: Optional[bpy.types.Image] = None
        self.cavity_src: Optional[List[float]] = None
        self.combined: Optional[bpy.types.Image] = None
        self._async_bake = False

    def tick(self, context) -> None:
        scene = context.scene
        obj = self.obj
        progress = self.progress

        if self.state == "prep":
            if progress:
                progress.stage(0.0, "preparing UVs")
            _configure_scene_for_bake(scene, self.samples)
            if self.ensure_uv:
                _ensure_bevel_uv(obj, self.uv_name)
            else:
                mesh = obj.data
                if self.uv_name not in mesh.uv_layers:
                    raise ValueError(f"{obj.name} is missing UV layer {self.uv_name}")
                mesh.uv_layers.active = mesh.uv_layers[self.uv_name]
                mesh.uv_layers[self.uv_name].active_render = True

            _hide_all_except(scene, obj.name)
            bpy.ops.object.select_all(action="DESELECT")
            obj.select_set(True)
            scene.view_layers[0].objects.active = obj

            bpy.ops.object.duplicate()
            self.work = context.active_object
            self.work.name = f"{obj.name}_BEVEL_BAKE_TMP"
            split = self.work.modifiers.new("EdgeSplit", "EDGE_SPLIT")
            split.split_angle = self.edge_split_angle_deg * 3.14159265 / 180.0
            bpy.ops.object.modifier_apply(modifier=split.name)

            if progress:
                progress.stage(0.08, "baking cavity pass")
            _mat_c, self.img_c = _prep_bake_material(
                f"{obj.name}_TMP_CAVITY",
                f"{obj.name}_TMP_CAVITY_IMG",
                self.resolution,
                _link_cavity_emit,
            )
            _assign_single_material(self.work, _mat_c)
            self.state = "cavity_bake"
            return

        if self.state == "cavity_bake":
            if progress:
                progress.begin_cycles_watch(0.12, 0.48)
            self._async_bake = _invoke_emit_bake()
            if not self._async_bake and progress:
                progress.end_cycles_watch()
            self.state = "cavity_wait" if self._async_bake else "cavity_capture"
            return

        if self.state == "cavity_wait":
            if _is_object_bake_running():
                return
            if progress:
                progress.end_cycles_watch()
            self.state = "cavity_capture"
            return

        if self.state == "cavity_capture":
            self.cavity_src = _pixel_channel(self.img_c)
            if progress:
                progress.stage(0.5, "baking wear pass")
            _mat_w, self.img_w = _prep_bake_material(
                f"{obj.name}_TMP_WEAR",
                f"{obj.name}_TMP_WEAR_IMG",
                self.resolution,
                _link_wear_emit,
            )
            self.work.data.materials[0] = _mat_w
            self.state = "wear_bake"
            return

        if self.state == "wear_bake":
            if progress:
                progress.begin_cycles_watch(0.52, 0.88)
            self._async_bake = _invoke_emit_bake()
            if not self._async_bake and progress:
                progress.end_cycles_watch()
            self.state = "wear_wait" if self._async_bake else "wear_capture"
            return

        if self.state == "wear_wait":
            if _is_object_bake_running():
                return
            if progress:
                progress.end_cycles_watch()
            self.state = "wear_capture"
            return

        if self.state == "wear_capture":
            wear_src = _pixel_channel(self.img_w)
            if progress:
                progress.stage(0.9, "packing RG channels")
            wear = _normalize_channel(wear_src, invert=False)
            cavity = _normalize_channel(self.cavity_src or [], invert=True)

            combined_name = f"{obj.name}_bevel"
            existing = bpy.data.images.get(combined_name)
            if existing:
                bpy.data.images.remove(existing)
            combined = bpy.data.images.new(
                combined_name, self.resolution, self.resolution, alpha=True, float_buffer=False
            )
            pixels = [0.0] * (self.resolution * self.resolution * 4)
            for i in range(self.resolution * self.resolution):
                pixels[i * 4] = wear[i]
                pixels[i * 4 + 1] = cavity[i]
                pixels[i * 4 + 2] = 0.0
                pixels[i * 4 + 3] = 1.0
            combined.pixels = pixels
            combined.update()
            self.combined = combined
            self._cleanup_temp()
            _restore_visibility(scene)
            if progress:
                progress.stage(1.0, "done")
            self.state = "done"
            return

    def _cleanup_temp(self) -> None:
        obj = self.obj
        if self.work:
            bpy.data.objects.remove(self.work, do_unlink=True)
            self.work = None
        for mat_name in (f"{obj.name}_TMP_CAVITY", f"{obj.name}_TMP_WEAR"):
            mat = bpy.data.materials.get(mat_name)
            if mat:
                bpy.data.materials.remove(mat)
        for img_name in (f"{obj.name}_TMP_CAVITY_IMG", f"{obj.name}_TMP_WEAR_IMG"):
            img = bpy.data.images.get(img_name)
            if img:
                bpy.data.images.remove(img)

    @property
    def done(self) -> bool:
        return self.state == "done"


class BakeBatchRunner:
    """Modal batch: one part per timer tick, async Cycles bakes keep the UI alive."""

    def __init__(self, context, settings, targets: Sequence[bpy.types.Object]) -> None:
        self.context = context
        self.settings = settings
        self.targets = list(targets)
        self.output_dir = resolve_output_dir(settings)
        self.part_index = 0
        self.part_runner: Optional[PartBevelAsyncRunner] = None
        self.baked: List[dict] = []
        self.errors: List[str] = []
        self.export_after = settings.export_after_bake
        self.export_pending = False
        self.finished = False
        self.wm = context.window_manager
        bake_span = 0.9 if self.export_after else 1.0
        self._progress = BakeProgressReporter(
            wm=self.wm,
            part_index=0,
            part_count=len(targets),
            span_fraction=bake_span,
        )

    def tick(self) -> str:
        if self.finished:
            return "FINISHED"

        if self.export_pending:
            return self._run_export()

        if self.part_runner is None:
            if self.part_index >= len(self.targets):
                return self._finish_batch()
            obj = self.targets[self.part_index]
            self._progress.part_index = self.part_index
            self._progress.part_name = obj.name
            print(
                f"[Bionicle Kit Bevel] Part {self.part_index + 1}/{len(self.targets)}: {obj.name}",
                flush=True,
            )
            self.part_runner = PartBevelAsyncRunner(
                obj,
                resolution=self.settings.resolution,
                samples=self.settings.samples,
                ensure_uv=self.settings.ensure_uv,
                progress=self._progress,
            )

        try:
            self.part_runner.tick(self.context)
        except Exception as exc:  # noqa: BLE001
            self.errors.append(f"{self.targets[self.part_index].name}: {exc}")
            self.part_runner = None
            self.part_index += 1
            return "RUNNING"

        if not self.part_runner.done:
            return "RUNNING"

        obj = self.targets[self.part_index]
        try:
            path = save_bevel_image(
                self.part_runner.combined,
                self.output_dir,
                obj.name,
                file_format=self.settings.file_format,
            )
            self.baked.append({"part": obj.name, "path": path})
            print(f"[Bionicle Kit Bevel] SAVED {path}", flush=True)
        except Exception as exc:  # noqa: BLE001
            self.errors.append(f"{obj.name}: {exc}")

        self.part_runner = None
        self.part_index += 1
        return "RUNNING"

    def _finish_batch(self) -> str:
        if self.baked:
            manifest = os.path.join(self.output_dir, "bevel_manifest.json")
            with open(manifest, "w", encoding="utf-8") as handle:
                json.dump(
                    {"kit_stem": self.settings.kit_stem, "files": self.baked},
                    handle,
                    indent=2,
                )
        if self.baked and self.export_after:
            self.export_pending = True
            return self._run_export()
        self.finished = True
        return "FINISHED" if not self.errors else "FINISHED_WITH_ERRORS"

    def _run_export(self) -> str:
        settings = self.settings
        context = self.context
        coll_name = settings.source_collection
        if settings.target_mode == "ACTIVE_COLLECTION":
            coll_name = context.view_layer.active_layer_collection.collection.name
        export_path = bpy.path.abspath(settings.export_glb_path.strip())
        if not export_path:
            blend_dir = os.path.dirname(bpy.data.filepath) if bpy.data.filepath else "//"
            export_path = os.path.join(bpy.path.abspath(blend_dir), f"{settings.kit_stem}.glb")
        try:
            BakeProgressReporter._wm_progress_update(self.wm, 92, "Exporting kit GLB…")
            print("[Bionicle Kit Bevel] Exporting kit GLB…", flush=True)
            count = export_kit_collection_glb(coll_name, export_path)
            BakeProgressReporter._wm_progress_update(self.wm, 100, f"Exported {count} object(s)")
            print(f"[Bionicle Kit Bevel] EXPORTED {count} object(s) -> {export_path}", flush=True)
        except Exception as exc:  # noqa: BLE001
            self.errors.append(f"GLB export: {exc}")
        self.export_pending = False
        self.finished = True
        return "FINISHED" if not self.errors else "FINISHED_WITH_ERRORS"

    def summary(self) -> str:
        if self.baked and not self.errors:
            return f"Baked {len(self.baked)} map(s) to {self.output_dir}"
        if self.baked:
            return f"Baked {len(self.baked)}; {len(self.errors)} error(s). See console."
        return "No maps baked."


def _objects_in_collection_tree(collection: bpy.types.Collection) -> List[bpy.types.Object]:
    """All exportable objects in a collection and nested child collections."""
    out: List[bpy.types.Object] = []
    seen = set()

    def walk(coll: bpy.types.Collection) -> None:
        for obj in coll.objects:
            if obj.type not in {"MESH", "EMPTY", "ARMATURE"}:
                continue
            if obj.name in seen:
                continue
            seen.add(obj.name)
            out.append(obj)
        for child in coll.children:
            walk(child)

    walk(collection)
    return out


def export_kit_collection_glb(collection_name: str, filepath: str) -> int:
    """Export one kit collection tree to GLB. Returns exported object count."""
    coll = bpy.data.collections.get(collection_name)
    if not coll:
        raise ValueError(f"Missing collection {collection_name}")

    targets = _objects_in_collection_tree(coll)
    if not targets:
        raise ValueError(f"Collection {collection_name} has no exportable objects")

    bpy.ops.object.select_all(action="DESELECT")
    for obj in targets:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = targets[0]

    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_yup=True,
    )
    return len(targets)


def resolve_output_dir(settings) -> str:
    if settings.output_dir.strip():
        return bpy.path.abspath(settings.output_dir.strip())
    stem = settings.kit_stem or "kit_2001"
    blend_dir = os.path.dirname(bpy.data.filepath) if bpy.data.filepath else "//"
    return os.path.join(bpy.path.abspath(blend_dir), "bevel_bakes", stem)


def _collection_enum_items(self, context):
    return [(c.name, c.name, "") for c in bpy.data.collections]


def resolve_target_objects(settings, context) -> List[bpy.types.Object]:
    mode = settings.target_mode
    if mode == "SELECTED":
        return [obj for obj in context.selected_objects if obj.type == "MESH"]

    if mode == "ACTIVE_COLLECTION":
        coll = context.view_layer.active_layer_collection.collection
        objs = _mesh_objects_in_collection(coll)
    elif mode == "NAMED_COLLECTION":
        coll = bpy.data.collections.get(settings.source_collection)
        if not coll:
            return []
        objs = _mesh_objects_in_collection(coll)
    else:
        objs = []

    if settings.use_custom_part_list:
        allow = set(_parse_part_list(settings.custom_part_list))
        objs = [obj for obj in objs if obj.name in allow]

    if settings.skip_connectors:
        objs = [obj for obj in objs if obj.name not in DEFAULT_SKIP_PARTS]

    return objs


class BionicleKitBevelSettings(PropertyGroup):
    kit_stem: EnumProperty(
        name="Kit Stem",
        items=(
            ("kit_2001", "kit_2001 (2001 collection)", ""),
            ("kit_2003", "kit_2003 (2003 collection)", ""),
            ("kit_2004", "kit_2004 (2004 collection)", ""),
        ),
        default="kit_2001",
    )
    target_mode: EnumProperty(
        name="Targets",
        items=(
            ("SELECTED", "Selected Meshes", "Bake selected mesh objects only"),
            ("ACTIVE_COLLECTION", "Active Collection", "Bake mesh objects in the active collection tree"),
            ("NAMED_COLLECTION", "Named Collection", "Bake mesh objects in a chosen kit collection"),
        ),
        default="SELECTED",
    )
    source_collection: EnumProperty(
        name="Collection",
        items=_collection_enum_items,
        description="Kit collection to scan when Target = Named Collection",
    )
    use_custom_part_list: BoolProperty(
        name="Filter To Part List",
        default=True,
        description="Only bake objects whose names appear in the part list",
    )
    custom_part_list: StringProperty(
        name="Part List",
        default="MataChest",
        description="Comma- or newline-separated kit node names (must match GLB object names)",
    )
    output_dir: StringProperty(
        name="Output Directory",
        subtype="DIR_PATH",
        default="",
        description="Leave empty to write under //bevel_bakes/{kit_stem} next to the .blend file",
    )
    file_format: EnumProperty(
        name="Format",
        items=(("WEBP", "WEBP", "Smaller sidecar files (preferred by the game client)"), ("PNG", "PNG", "")),
        default="WEBP",
    )
    resolution: IntProperty(name="Resolution", default=1024, min=256, max=4096)
    samples: IntProperty(name="Cycles Samples", default=16, min=1, max=256)
    skip_connectors: BoolProperty(
        name="Skip Low-Detail Connectors",
        default=True,
        description="Skip axles/pins that stay procedural in the game",
    )
    ensure_uv: BoolProperty(
        name="Auto UV (BevelUV)",
        default=True,
        description="Smart-project a BevelUV layer when missing",
    )
    export_glb_path: StringProperty(
        name="Kit GLB Export Path",
        subtype="FILE_PATH",
        default="",
        description="Optional .glb output after baking (e.g. public/kit_2001.glb)",
    )
    export_after_bake: BoolProperty(
        name="Export Kit GLB After Bake",
        default=False,
        description="Re-export the active/named kit collection when baking finishes",
    )


class BIONICLE_OT_export_kit_glb(Operator):
    bl_idname = "bionicle.export_kit_glb"
    bl_label = "Export Kit GLB"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        settings = context.scene.bionicle_bevel
        coll_name = settings.source_collection
        if settings.target_mode == "ACTIVE_COLLECTION":
            coll_name = context.view_layer.active_layer_collection.collection.name
        if not coll_name:
            self.report({"ERROR"}, "Choose a kit collection to export")
            return {"CANCELLED"}

        export_path = bpy.path.abspath(settings.export_glb_path.strip())
        if not export_path:
            stem = _kit_stem_from_collection_name(coll_name) or settings.kit_stem
            blend_dir = os.path.dirname(bpy.data.filepath) if bpy.data.filepath else "//"
            export_path = os.path.join(bpy.path.abspath(blend_dir), f"{stem}.glb")

        try:
            count = export_kit_collection_glb(coll_name, export_path)
        except Exception as exc:  # noqa: BLE001
            self.report({"ERROR"}, str(exc))
            return {"CANCELLED"}

        self.report({"INFO"}, f"Exported {count} object(s) to {export_path}")
        return {"FINISHED"}


class BIONICLE_OT_sync_stem_from_collection(Operator):
    bl_idname = "bionicle.sync_stem_from_collection"
    bl_label = "Use Active Collection Stem"
    bl_options = {"REGISTER", "UNDO"}

    def execute(self, context):
        coll = context.view_layer.active_layer_collection.collection.name
        stem = _kit_stem_from_collection_name(coll)
        if not stem:
            self.report({"WARNING"}, f"No kit stem mapped for collection '{coll}'")
            return {"CANCELLED"}
        context.scene.bionicle_bevel.kit_stem = stem
        context.scene.bionicle_bevel.source_collection = coll
        self.report({"INFO"}, f"Kit stem set to {stem}")
        return {"FINISHED"}


class BIONICLE_OT_list_target_parts(Operator):
    bl_idname = "bionicle.list_target_parts"
    bl_label = "List Target Parts"
    bl_options = {"REGISTER"}

    def execute(self, context):
        settings = context.scene.bionicle_bevel
        objs = resolve_target_objects(settings, context)
        names = [obj.name for obj in objs]
        context.window_manager.clipboard = ", ".join(names)
        self.report({"INFO"}, f"{len(names)} target(s): {', '.join(names[:8])}{'…' if len(names) > 8 else ''}")
        return {"FINISHED"}


class BIONICLE_OT_bake_bevel_maps(Operator):
    bl_idname = "bionicle.bake_bevel_maps"
    bl_label = "Bake Bevel Maps"
    bl_options = {"REGISTER", "UNDO"}

    _timer = None
    _runner: Optional[BakeBatchRunner] = None

    def invoke(self, context, _event):
        settings = context.scene.bionicle_bevel
        targets = resolve_target_objects(settings, context)
        if not targets:
            self.report({"WARNING"}, "No target mesh objects found")
            return {"CANCELLED"}

        self._runner = BakeBatchRunner(context, settings, targets)
        wm = context.window_manager
        wm.progress_begin(0, 100)
        BakeProgressReporter._wm_progress_update(wm, 0, "Starting bevel bake…")
        self._timer = wm.event_timer_add(0.1, window=context.window)
        wm.modal_handler_add(self)
        print(f"[Bionicle Kit Bevel] Baking {len(targets)} part(s)…", flush=True)
        return {"RUNNING_MODAL"}

    def modal(self, context, event):
        if event.type != "TIMER":
            return {"PASS_THROUGH"}

        runner = self._runner
        if runner is None:
            return self._finish(context, {"CANCELLED"})

        status = runner.tick()
        if status == "RUNNING":
            return {"RUNNING_MODAL"}

        for line in runner.errors:
            print("[Bionicle Kit Bevel Bake]", line, flush=True)

        if status == "FINISHED_WITH_ERRORS" and not runner.baked:
            self.report({"ERROR"}, runner.summary())
            return self._finish(context, {"CANCELLED"})

        if runner.errors:
            self.report({"WARNING"}, runner.summary())
        else:
            self.report({"INFO"}, runner.summary())
        return self._finish(context, {"FINISHED"})

    def _finish(self, context, result):
        wm = context.window_manager
        if self._timer is not None:
            wm.event_timer_remove(self._timer)
            self._timer = None
        wm.progress_end()
        self._runner = None
        return result

    def execute(self, context):
        return self.invoke(context, None)


class BIONICLE_PT_kit_parts(Panel):
    bl_label = "Kit Parts"
    bl_idname = "BIONICLE_PT_kit_parts"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Bionicle Kit"
    bl_order = 10

    def draw(self, context):
        layout = self.layout
        layout.label(text="Work on shared kit meshes in the kit .blend:", icon="MESH_DATA")
        layout.label(text="bake bevel sidecars, export kit GLBs.")
        coll = context.view_layer.active_layer_collection.collection.name
        layout.label(text=f"Active collection: {coll}", icon="OUTLINER_COLLECTION")


class BIONICLE_PT_bevel_bake(Panel):
    bl_label = "Bevel Maps"
    bl_idname = "BIONICLE_PT_bevel_bake"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "Bionicle Kit"
    bl_parent_id = "BIONICLE_PT_kit_parts"
    bl_options = {"DEFAULT_CLOSED"}

    def draw(self, context):
        layout = self.layout
        settings = context.scene.bionicle_bevel

        box = layout.box()
        box.label(text="Kit Export Stem")
        box.prop(settings, "kit_stem")
        box.operator("bionicle.sync_stem_from_collection", icon="OUTLINER_COLLECTION")

        box = layout.box()
        box.label(text="Targets")
        box.prop(settings, "target_mode")
        if settings.target_mode == "NAMED_COLLECTION":
            box.prop(settings, "source_collection")
        box.prop(settings, "use_custom_part_list")
        if settings.use_custom_part_list:
            box.prop(settings, "custom_part_list")
        box.prop(settings, "skip_connectors")
        box.operator("bionicle.list_target_parts", icon="COPYDOWN")

        box = layout.box()
        box.label(text="Bake / Export")
        box.prop(settings, "output_dir")
        box.prop(settings, "file_format")
        box.prop(settings, "resolution")
        box.prop(settings, "samples")
        box.prop(settings, "ensure_uv")
        box.prop(settings, "export_after_bake")
        box.prop(settings, "export_glb_path")
        layout.operator("bionicle.bake_bevel_maps", icon="RENDER_STILL")
        layout.operator("bionicle.export_kit_glb", icon="EXPORT")


classes = (
    BionicleKitBevelSettings,
    BIONICLE_OT_sync_stem_from_collection,
    BIONICLE_OT_list_target_parts,
    BIONICLE_OT_bake_bevel_maps,
    BIONICLE_OT_export_kit_glb,
    BIONICLE_PT_kit_parts,
    BIONICLE_PT_bevel_bake,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.bionicle_bevel = PointerProperty(type=BionicleKitBevelSettings)


def unregister():
    del bpy.types.Scene.bionicle_bevel
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)


if __name__ == "__main__":
    register()
