# Blender Kit Socket Helper

`tools/blender/kit_socket_helper.py` is a small Blender addon for the shared-mesh
model refactor. It automates the tedious step of replacing per-character kit
objects with named empties that the app can use as attachment sockets.

## What it does

For every selected non-empty object, the addon can:

- create an empty at the object's origin with identity rotation and scale, or
  preserve the source object's full transform when enabled;
- parent the empty to the same object or armature bone as the source object;
- name the empty from the source object's parent bone/object, source object name,
  source object base name, or a custom value;
- store the source kit object name on the empty;
- optionally hide the original source object so it does not export with the
  character GLB; and
- copy a TypeScript attachment map snippet like:

```ts
{
  "Arm_Lower_L_1": { kitNodeName: "MataLegModThigh" },
  "Brain": { kitNodeName: "MataBrain" },
}
```

That snippet matches the current `Record<string, KitSocketAttachment>` shape used
by `useKitAttachments`.

## Install

1. Open Blender.
2. Go to `Edit > Preferences > Add-ons > Install...`.
3. Pick `tools/blender/kit_socket_helper.py`.
4. Enable `Bionicle Kit Socket Helper`.

The panel appears in `View3D > Sidebar > Bionicle Kit`.

## Typical character GLB workflow

1. Open the character `.blend`.
2. Select the kit mesh objects that should come from `kit_2001.glb`.
3. In `Bionicle Kit`:
   - set `Socket Name` to `Parent Bone/Object` when the empty should be named
     after the bone or object the original was parented to;
   - set `Kit Node Name` to `Object Name (No .001)` for repeated instances of the
     same kit asset;
   - keep `Parent` as `Same Parent`;
   - enable `Preserve Source Transform` only when the socket should keep the
     source object's rotation and scale;
   - keep `Hide Source Objects` enabled if the selected meshes should be removed
     from the exported character GLB.
4. Click `Create Socket Empties`.
5. Export the character GLB with empties included and hidden source meshes
   excluded.
6. Click `Copy Scene` in the attachment map section and paste the snippet into the
   character's `*MataKitAttach.ts` file, adding material colors where needed.

## Kit GLB workflow

For the shared kit file itself, keep one visible mesh per reusable asset and name
it to match `kitNodeName` values from the attachment map (`MataFoot`,
`MataLegModThigh`, `Axle3L`, and so on). The runtime walks the kit GLB scene by
object name, clones the matching node, and attaches it to the exported character
socket.

## Notes

- The addon marks generated empties with custom properties:
  - `bionicle_socket`
  - `bionicle_kit_node`
  - `bionicle_source_object`
- `Copy Selected` and `Copy Scene` only include empties with those properties.
- Blender may still display duplicate object names with `.001` suffixes. Use
  `Object Name (No .001)` for kit node names when multiple character instances
  point to the same shared kit asset.
