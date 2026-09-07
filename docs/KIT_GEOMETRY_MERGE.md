# Kit geometry merge (Phase B)

`useKitAttachments` merges rigid kit meshes that share:

1. The same **merge anchor bone** (nearest `Bone` ancestor of the socket),
2. The same **final material instance** (cached weathered metal, shared technic black, etc.),
3. The same **render order** (transmissive / selective-bloom meshes are excluded).

Geometries are normalized to `position` / `normal` / `uv` before merging so kit GLB nodes with mismatched attribute layouts batch correctly.

Expect the largest wins on technic axles, pins, and gears that share `KIT_TECHNIC_MAIN_BLACK` / `KIT_TECHNIC_MAIN_METAL` on the same limb bone. Glow, transmissive brain gel, and multi-material kit nodes stay separate draws.

## Measuring before/after

Use the **3D Performance Monitor** and character sheet console log from [`docs/3D_PERFORMANCE.md`](3D_PERFORMANCE.md) (separate PR). Open each character, note the `render cost` line in DevTools, then compare after this merge lands.

## Related code

| File                                          | Role                |
| --------------------------------------------- | ------------------- |
| `src/rendering/3d/hooks/kitGeometryMerge.ts`  | Merge pipeline      |
| `src/rendering/3d/hooks/useKitAttachments.ts` | Attach + merge hook |
