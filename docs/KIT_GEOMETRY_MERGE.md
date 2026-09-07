# Kit geometry merge (Phase B)

`useKitAttachments` merges rigid kit meshes that share:

1. The same **merge anchor bone** (nearest `Bone` ancestor of the socket),
2. The same **final material instance** (cached weathered metal, shared technic black, etc.),
3. The same **render order** (transmissive / selective-bloom meshes are excluded).

Geometries are normalized to `position` / `normal` / `uv` before merging so kit GLB nodes with mismatched attribute layouts batch correctly (`normalizeKitGeometryForMerge`).

## What stays separate

| Category               | Reason                                |
| ---------------------- | ------------------------------------- |
| Skinned kit meshes     | Different deformation path            |
| Multi-material meshes  | One draw per material slot            |
| Transmissive brain gel | `MeshPhysicalMaterial` + render order |
| Selective-bloom glow   | MRT writes incompatible with batching |

Expect the largest wins on technic axles, pins, and gears that share `KIT_TECHNIC_MAIN_BLACK` / `KIT_TECHNIC_MAIN_METAL` on the same limb bone. Colored plastics, glow, and transmissive parts stay separate draws.

## Pipeline

```
socket clone → applyKitMaterialsToObject
            → extractMergeableMeshesFromClone (bake to anchor-local space)
            → buildMergedKitMeshes (group by bone + material + renderOrder)
            → parent merged Mesh(es) on anchor bone
```

Non-mergeable meshes remain on the socket clone hierarchy. Empty wrapper nodes are pruned.

## Measured impact

On the character sheet (scene-graph count, Tahu Mata):

| Build             | Draws | Materials | Kit tris |
| ----------------- | ----: | --------: | -------: |
| Master (no merge) |    82 |        29 |    ~120k |
| Phase B merge     |    74 |        29 |    ~120k |

~10% draw reduction; triangles and materials unchanged.

## Measuring before/after

Use the character sheet console log from [`3D_PERFORMANCE.md`](3D_PERFORMANCE.md). Open a character, note the `render cost` line in DevTools, then compare after this merge lands.

## Related code

| File                                              | Role                                    |
| ------------------------------------------------- | --------------------------------------- |
| `src/rendering/3d/hooks/kitGeometryMerge.ts`      | Merge pipeline + geometry normalization |
| `src/rendering/3d/hooks/kitGeometryMerge.spec.ts` | Unit tests                              |
| `src/rendering/3d/hooks/useKitAttachments.ts`     | Attach + merge hook                     |
| `src/test/mocks/bufferGeometryUtils.cjs`          | Jest mock for `mergeGeometries`         |
