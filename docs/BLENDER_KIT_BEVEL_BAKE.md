# Blender Kit Bevel Bake

Part of the unified **Bionicle Kit** addon (`tools/blender/kit_socket_helper.py`).
The **Kit Parts → Bevel Maps** subpanel lives in the sibling module
`tools/blender/kit_bevel_bake.py`, loaded automatically at enable time.
See [BLENDER_KIT_ADDON.md](./BLENDER_KIT_ADDON.md).

`kit_bevel_bake.py` bakes **packed geometric bevel maps** for shared kit
parts used by weathered metal in the game.

## Runtime contract

When a part is listed in `KIT_*_BEVEL_NODES`, the client loads:

```text
public/{kit_stem}/{kitNodeName}_bevel.webp   (or .png)
```

| Channel | Meaning                     |
| ------- | --------------------------- |
| **R**   | Convex edge wear            |
| **G**   | Concave cavity / grime bias |

Names must match kit GLB object names (`MataChest`, not inner mesh data-block names).
The map is **not** an albedo — slot colors still come from attachment palettes.

See also:

- `src/rendering/3d/CharacterScene/kitBevelMap.ts`
- `src/rendering/3d/kit/kitBevelNodes.ts`
- Runtime visual target (no bake): `src/rendering/3d/CharacterScene/runtimeGeometricBevel.ts`
- Color-specific mix: `src/rendering/3d/kit/palettes/legoColorDiscoloration.ts`

## Baked emissive discoloration (current pipeline)

Blender Simple Bake writes a **grayscale discoloration** into the glTF **emissive** slot
(bevel + noise on sharp angles). The game does **not** emit that as light:

| Asset      | Bake                                    | Runtime                                                        |
| ---------- | --------------------------------------- | -------------------------------------------------------------- |
| Mata masks | roughness, metalness, normals, emissive | Keep PBR maps; mix albedo toward `discolorationForColor(mask)` |
| Kit parts  | emissive only                           | Weathered noise for roughness/metalness; same albedo mix       |

Tune tints in `LEGO_COLOR_DISCOLORATION`. Unknown hexes get a derived scuff.

## Runtime spike (visual target)

Blender bakes have not yet matched the intended look. Tahu Mata currently draws a
**runtime geometric bevel** so we can judge the RG target in-game first:

1. CPU dihedrals on position-welded edges (convex vs concave)
2. Vertex varyings: barycentric, per-edge sharpness, triangle altitude
3. Fragment: object-space distance to sharp edges → R wear / G cavity

Enable on a model with `runtimeBevel: true` and `debugBevelAsColor: true` (red =
convex wear, green = concave). TSL graph (not wired to the WebGL canvas):
`runtimeGeometricBevelTsl.ts` (`three/nodes` / `tslFn` in three r160).

Do not expand the Blender bake allowlist until this debug view looks right.

## Kit `.blend` collections

The source kit file groups exportable parts by year collection:

| Collection | GLB stem   | Notes                        |
| ---------- | ---------- | ---------------------------- |
| `2001`     | `kit_2001` | Includes nested `MataTools`  |
| `2003`     | `kit_2003` | Includes nested `NuvaTools`  |
| `2004`     | `kit_2004` | Includes nested `MetruTools` |

When exporting kit GLBs you already activate one collection and export only that
tree. Use the same collection when batching bevel bakes.

## Install

1. Open the kit `.blend` (keep a working copy — do not bake directly into iCloud
   unless you intend to save UV layers there).
2. `Edit > Preferences > Add-ons > Install...`
3. Pick `tools/blender/kit_socket_helper.py`
4. Enable **Bionicle Kit**

Panel: `View3D > Sidebar > Bionicle Kit > Kit Parts > Bevel Maps`

## Typical workflow (single part)

Example: **`MataChest`** on **`kit_2001`**.

1. Activate collection **`2001`** in the Outliner (same as GLB export).
2. In **Bevel Maps**:
   - Click **Use Active Collection Stem** → sets `kit_2001`
   - **Targets** = `Selected Meshes` (select `MataChest`)  
     — or **Active Collection** + **Part List** = `MataChest`
   - **Output Directory** = repo path, e.g.  
     `/Users/.../BionicleIdleRpg/public/kit_2001`
   - **Format** = `WEBP` (default; ~75% smaller than PNG)
   - Leave **Auto UV (BevelUV)** enabled if the part has no UVs yet
3. Click **Bake Bevel Maps**

Output:

```text
public/kit_2001/MataChest_bevel.png
public/kit_2001/bevel_manifest.json
```

4. Re-export `kit_2001.glb` from collection `2001` so the baked **`BevelUV`**
   layer ships with the mesh.
5. In code, opt in:

```ts
export const KIT_2001_BEVEL_NODES = {
  MataChest: true,
};
```

6. Verify in-game with `debugBevelAsColor: true` on weathered metal (red = wear,
   green = cavity).

## Batch workflow (several parts)

Use a comma/newline part list and **Active Collection** or **Named Collection**:

```text
MataChest, MataAbdomen, MataHip, MataLegModThigh
```

Keep **Skip Low-Detail Connectors** enabled to ignore axles/pins that stay
procedural (`KIT_2001_BEVEL_SKIP_CONNECTORS`).

Bake time scales with part count × resolution × samples. Long runs are normal.

**Progress:** The bake operator runs as a **modal** job so Blender stays responsive.
The status bar shows part name + stage; during each Cycles pass it advances on
`Sample N/M` lines. Open **Window → Toggle System Console** (macOS: launch Blender
from Terminal) to see the same log — required when driving bakes through MCP, since
the MCP host may not stream Blender’s UI progress.

Smart UV Project on a new part can sit at “preparing UVs” for a while with no
sample lines yet; that step runs before the first Cycles pass.

## What the bake does

For each target mesh:

1. Ensures a **`BevelUV`** layer (Smart UV Project when missing)
2. Duplicates with a temporary **Edge Split** (45°) for sharper wear signal
3. **Cavity pass** — short-range AO → normalized → **G**
4. **Wear pass** — geometry pointiness → normalized → **R**
5. Writes `{part}_bevel.{png|webp}` and appends to `bevel_manifest.json`

Original materials are restored; only the UV layer persists on the source object.

## MCP / headless (optional)

With Blender MCP connected you can install/reload the addon and trigger bakes via
`execute_blender_code`. **Watch the System Console** for `[Bionicle Kit Bevel]`
lines — MCP does not mirror the status bar. Prefer invoking
`bpy.ops.bionicle.bake_bevel_maps('INVOKE_DEFAULT')` (not a blocking custom loop).

For unattended runs:

```bash
/Applications/Blender.app/Contents/MacOS/Blender \
  --background "/path/to/kit_bevel_work.blend" \
  --python tools/blender/kit_bevel_bake.py
```

Then invoke `bpy.ops.bionicle.bake_bevel_maps()` from a small wrapper script once
scene properties are set.

## Checklist before merging a bake

- [ ] Map exists at `public/{kit_stem}/{Part}_bevel.webp` (or `.png`)
- [ ] Part name matches `KIT_*_NODES` exactly
- [ ] `KIT_*_BEVEL_NODES` allowlist updated
- [ ] Kit GLB re-exported with **BevelUV** on that mesh
- [ ] Visual pass on a weathered Toa Mata / Nuva using that part
