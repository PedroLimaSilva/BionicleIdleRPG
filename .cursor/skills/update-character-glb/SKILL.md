---
name: update-character-glb
description: >-
  Sync the character animation inventory and docs when the user adds or updates
  a GLB under public/. Run after any message about an updated, new, or re-exported
  character model, new animation clips, or rig changes. Parses shipped clips,
  updates characterAnimationInventory.ts, and verifies with tests.
environments: [cloud]
---

# Update Character GLB & Animation Inventory

When the user says they **updated, added, or re-exported a `.glb`** (or mentions new/changed animation clips for a character rig), read this skill **first** and follow the workflow below. Do not merge a GLB change without syncing the inventory.

## When to use (trigger phrases)

- "I updated the GLB for …"
- "New animation clips in …"
- "Re-exported `Toa_Metru/Vakama.glb`"
- "Added Attack/Hit to …"
- Any PR or commit that changes files under `public/**/*.glb` (character rigs, not kit/mask props unless they gained clips)

**Skip** for kit libraries (`kit_*.glb`), masks/armor props, and arena environment GLBs — they are mesh-only unless the user explicitly says otherwise.

## Required reading

1. [`docs/CHARACTER_ANIMATIONS.md`](../../docs/CHARACTER_ANIMATIONS.md) — epic backlog, status legend, Blender checklist
2. [`src/rendering/3d/CharacterScene/characterAnimationInventory.ts`](../../src/rendering/3d/CharacterScene/characterAnimationInventory.ts) — **source of truth** for expected clips and epic assignment

## Workflow

### 1. Identify the GLB path(s)

Normalize to a `public/`-relative path, e.g. `Toa_Metru/Vakama.glb`.

If the user did not name a file, inspect `git status` / the PR diff for changed `.glb` files under `public/`.

### 2. Inspect shipped clips

Run **`nvm use`** first (Node 20).

```bash
yarn animation-clip-inspect Toa_Metru/Vakama.glb
```

For multiple GLBs, run once per file (or loop).

The inspect report shows:

| Section                 | Action                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| **✅ Newly shipped**    | Clips now in the GLB that inventory still marks `backlog: 'missing'` → set to `'complete'`                |
| **❌ Still missing**    | Required clips not in the GLB — leave as `'missing'` unless the user says they intentionally skipped them |
| **💤 Unexpected**       | Clips in the GLB but not in inventory → add rows with `backlog: 'unused'` or wire them in React code      |
| **Epic graduation**     | All required clips present → move rig `epicId` to `'complete'`                                            |
| **⚠️ Not in inventory** | New rig — add a full `RigInventoryEntry` before merging                                                   |

Optional full matrix after updates:

```bash
yarn animation-clip-report
```

### 3. Update `characterAnimationInventory.ts`

For each affected rig:

1. **Clip backlog** — set `backlog: 'complete'` on every clip that is now shipped (Attack, Hit, Defeat, Idle, flavor, etc.).
2. **New clips** — add `ExpectedClip` entries for unexpected shipped clips (`backlog: 'unused'` until code plays them).
3. **Epic assignment** — when all **required** clips for a combat rig are shipped, set `epicId: 'complete'`.
4. **Revision** — if the user says a clip needs re-timing or weight fixes but is present, use `backlog: 'revision'`.
5. **New rig** — add a `RigInventoryEntry` with correct `reactComponent`, `role`, `epicId`, and `expectedClips`. Mirror a similar rig in the same family.

Do **not** hand-edit status emoji tables in the doc when the inventory change is sufficient — the report script derives live status from GLBs.

### 4. Update docs (when needed)

| Change                      | Update                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Rig graduated to `complete` | Adjust epic rig **counts** in the summary table in `docs/CHARACTER_ANIMATIONS.md`                |
| New rig family or epic      | Add epic section + row in summary table                                                          |
| New clip wired in code      | Document in the Animation pipeline table if it is a new contract (e.g. new transition clip name) |

Keep edits minimal — prefer inventory + report over duplicating per-rig tables in markdown.

### 5. GLB hygiene (when the binary is in the commit)

```bash
yarn compress          # if the GLB is large (see README)
yarn sum-glb-sizes     # optional size check
```

### 6. Verify

```bash
yarn test:ci --testPathPatterns=characterIdleClips
yarn lint
yarn format:check
```

If the GLB affects battle/Character Dex visuals, also run model E2E when feasible:

```bash
yarn test:e2e:models
```

(Snapshots are platform-sensitive; use `yarn test:e2e:docker:models:update` only when intentionally refreshing.)

### 7. Pull request

- GLB + inventory in one PR is fine.
- Read [`.cursor/skills/open-pull-request/SKILL.md`](../open-pull-request/SKILL.md) before opening/updating the PR.
- **Release label:** `release/characters-models` when the PR ships or updates character GLBs/animations; `release/infrastructure` when inventory/docs/tooling only (no binary change).

Include in **Testing**:

- `yarn animation-clip-inspect <glb>` output (before/after summary)
- `yarn test:ci --testPathPatterns=characterIdleClips` result
- Note any E2E model snapshot updates

## Inventory field reference

```ts
{
  id: 'toa-metru-vakama',
  epicId: 'toa-metru-combat', // or 'complete' when done
  glb: 'Toa_Metru/Vakama.glb',
  displayName: 'Toa Vakama Metru',
  reactComponent: 'VakamaModel',
  role: 'combat', // combat | village | enemy | placeholder
  expectedClips: [
    { kind: 'idle', name: 'Idle', required: true, backlog: 'complete' },
    { kind: 'combat', name: 'Attack', required: true, backlog: 'missing' },
    // ...
  ],
}
```

**Clip names are case-sensitive** and must match Blender Action names exactly (`Attack`, `Hit`, `Defeat`, `Idle`, `Tilt Head`, `Idle_Biped`, etc.).

## Common rig → GLB map

| Family          | GLB pattern                                              | Component dir           |
| --------------- | -------------------------------------------------------- | ----------------------- |
| Toa Mata        | `Toa_Mata/<name>.glb`                                    | `CharacterScene/Mata/`  |
| Toa Nuva        | `Toa_Nuva/<name>.glb`                                    | `CharacterScene/Nuva/`  |
| Toa Metru       | `Toa_Metru/<Name>.glb`                                   | `CharacterScene/Metru/` |
| Bohrok          | `bohrok_master.glb`                                      | `BohrokModel.tsx`       |
| Vahki           | `Vahki.glb`                                              | `VahkiModel.tsx`        |
| Rahkshi         | `rahkshi.glb`                                            | `Rahkshi.tsx`           |
| Village Matoran | `matoran_master.glb`, `matoran_metru.glb`, `rebuilt.glb` | `*MatoranModel.tsx`     |
| Nui-Rama        | `Rahi/NuiRama.glb`                                       | `NuiRamaModel.tsx`      |

## Checklist before finishing the turn

- [ ] Ran `yarn animation-clip-inspect` for every changed character GLB
- [ ] Updated `characterAnimationInventory.ts` (backlog / epic / new entries)
- [ ] Ran `characterIdleClips` tests + lint
- [ ] Updated `docs/CHARACTER_ANIMATIONS.md` epic counts if a rig graduated or epic scope changed
- [ ] PR labeled appropriately (`release/characters-models` vs `release/infrastructure`)

## Related commands

| Command                             | Purpose                     |
| ----------------------------------- | --------------------------- |
| `yarn animation-clip-inspect <glb>` | Diff one GLB vs inventory   |
| `yarn animation-clip-report`        | Full epic + rig matrix      |
| `yarn glb-size-report`              | GLB size diff vs merge-base |
| `yarn compress`                     | Draco-compress large GLBs   |
