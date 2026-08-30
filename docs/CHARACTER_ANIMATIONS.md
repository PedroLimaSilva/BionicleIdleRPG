# Character Animations — Rig & Clip Tracker

Technical reference and **animation epic backlog** for 3D character rigs: which GLBs exist, which clips the game expects, and what still needs authoring or revision.

**Machine-readable source:** [`src/rendering/3d/CharacterScene/characterAnimationInventory.ts`](../src/rendering/3d/CharacterScene/characterAnimationInventory.ts)

**Agent skill (updated GLBs):** [`.cursor/skills/update-character-glb/SKILL.md`](../.cursor/skills/update-character-glb/SKILL.md) — run when a rig is added or re-exported.

**Regenerate tables:** `yarn animation-clip-report` · **Inspect one GLB:** `yarn animation-clip-inspect Toa_Metru/Vakama.glb`

**Related:** [`docs/UI_UX_STRATEGY.md`](UI_UX_STRATEGY.md) §7 (animation strategy), [`docs/ARENA_ENVIRONMENTS.md`](ARENA_ENVIRONMENTS.md) (environment GLB workflow), [#349](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/349) (Phase 3 combat feedback & ambient life).

---

## How to use this doc

| Audience          | Workflow                                                                                                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Art / rigging** | Pick an epic below → author clips in Blender → export GLB → run `yarn animation-clip-inspect <glb>` → follow [update-character-glb skill](../.cursor/skills/update-character-glb/SKILL.md) → open PR with `release/characters-models`. |
| **Engineering**   | When code starts playing a new clip name, add it to `characterAnimationInventory.ts` first so CI and this report stay accurate.                                                                                                        |
| **PM / triage**   | Epics group related rigs. Open a GitHub issue per epic (or per rig) for discussion and acceptance criteria — same pattern as [`ARCHITECTURE_ROADMAP.md`](../ARCHITECTURE_ROADMAP.md).                                                  |

### Status legend

| Symbol         | Meaning                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------- |
| ✅             | Clip is shipped in the GLB and matches the code contract                                    |
| ❌             | Clip is expected but missing — game uses procedural fallback (combat) or skips (flavor)     |
| 🔧             | Clip exists but needs revision (timing, weight, export fix)                                 |
| 💤             | Clip is authored but unused in code (candidate for wiring or cleanup)                       |
| _(procedural)_ | Combat motion works via root-group procedural animation in `useModelProceduralCombatMotion` |

---

## Story progression priority

Epics are **prioritized by when the player meets each rig**, not by how many clips are missing. Work top-to-bottom in the table below — early-game Mask Hunt and MNOG content before Metru Nui flashback rigs.

Macro arc order (see `src/data/quests/index.ts`): **Mask Hunt → MNOG → Bohrok Swarm → Bohrok Kal → Mask of Light → Metru Nui**.

| Order | Rig family (first appearance)   | Story arc                                        |
| ----: | ------------------------------- | ------------------------------------------------ |
|     1 | Diminished Matoran              | Game start                                       |
|     2 | Toa Mata                        | Mask Hunt — `story_toa_arrival`                  |
|     3 | Nui-Rama, generic Rahi          | MNOG / early combat                              |
|     4 | Toa Nuva                        | Bohrok Swarm — `bohrok_evolve_toa_nuva`          |
|     5 | Rebuilt Matoran                 | Bohrok Kal — `bohrok_kal_naming_day`             |
|     6 | Rahkshi                         | Mask of Light                                    |
|     7 | Metru Matoran, Vahki, Toa Metru | Metru Nui flashback (latest implemented content) |

Set `storyOrder` and `storyArc` on new epics in `characterAnimationInventory.ts` to match quest unlock order. Lower `storyOrder` = animate sooner.

---

## Epic backlog (summary)

Sorted by story progression. Run `yarn animation-clip-report` for the live matrix parsed from shipped GLBs.

|   # | Epic                                                         | Story arc        | Rigs | Goal                                                          |
| --: | ------------------------------------------------------------ | ---------------- | ---: | ------------------------------------------------------------- |
|   1 | [Toa Mata — Hit clip gaps](#epic-toa-mata-polish)            | Mask Hunt        |    2 | Author Hit for Tahu and Pohatu Mata                           |
|   2 | [Nui-Rama — combat clips](#epic-rahi-nui-rama)               | MNOG             |    1 | Skeletal combat beyond Wings ambient loop                     |
|   3 | [Generic Rahi — GLB-backed rig](#epic-rahi-placeholder)      | Mask Hunt / MNOG |    1 | Replace procedural capsule placeholder                        |
|   4 | [Toa Nuva — combat clip rollout](#epic-toa-nuva-combat)      | Bohrok Swarm     |    5 | Extend Tahu/Pohatu-quality combat clips to remaining Nuva     |
|   5 | [Rebuilt Matoran — idle & flavor](#epic-rebuilt-idle-switch) | Bohrok Kal       |    1 | Idle transition + Tilt Head flavor                            |
|   6 | [Rahkshi — Defeat clip](#epic-rahkshi-defeat)                | Mask of Light    |    1 | Optional authored knockdown (procedural works today)          |
|   7 | [Metru Matoran — flavor overlays](#epic-village-flavor)      | Metru Nui        |    1 | Add Tilt Head to Metru village GLB                            |
|   8 | [Vahki — combat clips](#epic-vahki-combat)                   | Metru Nui        |    1 | Add combat clips while preserving biped/quadruped idle switch |
|   9 | [Toa Metru — skeletal combat clips](#epic-toa-metru-combat)  | Metru Nui        |    7 | Add Attack / Hit / Defeat to all Toa Metru GLBs               |
|  10 | [Bohrok — unused authored clips](#epic-bohrok-extras)        | Stretch          |    1 | Wire or remove Ball / Flying / Flying Pose                    |

---

## Animation pipeline (code)

```
CharacterScene / CombatantModel
  └── Per-model component (e.g. TahuMataModel, VahkiModel)
        └── useCombatAnimations (combat models)
              ├── useIdleAnimation → GLTF clips via @react-three/drei
              │     └── useIdleSwitchController (Vahki, Rebuilt)
              ├── usePlayAnimation (one-shot Attack / Hit / Defeat)
              └── useModelProceduralCombatMotion (missing-clip fallback)
        └── useAnimationController (village flavor overlays, e.g. Tilt Head)
```

| Clip                            | Role                                      | Hook                            |
| ------------------------------- | ----------------------------------------- | ------------------------------- |
| `Idle`                          | Looping default pose                      | `useIdleAnimation`              |
| `Attack`                        | Attacker lunge; resolves at contact frame | `usePlayAnimation` / procedural |
| `Hit`                           | Defender reaction                         | `usePlayAnimation` / procedural |
| `Defeat`                        | Knockdown before sink/fade                | `usePlayAnimation` / procedural |
| `Empty`                         | Rahkshi pre-Kraata pose                   | `Rahkshi.tsx` idle swap         |
| `Tilt Head`                     | Random village flavor overlay             | `useAnimationController`        |
| `Idle_Biped` / `Idle_Quadruped` | Vahki dual idle modes                     | `idleSwitchConfigs.ts`          |
| `Switch_BQ` / `Switch_QB`       | Vahki reconfiguration                     | `idleSwitchConfigs.ts`          |
| `Wings`                         | Nui-Rama ambient loop                     | `NuiRamaModel`                  |

Character Dex preview buttons use the same combat contract: `Attack`, `Hit`, `Defeat` (`dexEntries.ts`).

---

## Rig families

### Shipped character GLBs (35 total in `public/`)

| Family          | GLB path pattern                                         | React components       | Combat support                          |
| --------------- | -------------------------------------------------------- | ---------------------- | --------------------------------------- |
| Toa Mata        | `Toa_Mata/<name>.glb`                                    | `Mata/*MataModel`      | Full clips (except Tahu/Pohatu Hit)     |
| Toa Nuva        | `Toa_Nuva/<name>.glb`                                    | `Nuva/*Model`          | Tahu + Pohatu only; others procedural   |
| Toa Metru       | `Toa_Metru/<name>.glb`                                   | `Metru/*Model`         | Idle only — all combat procedural       |
| Bohrok          | `bohrok_master.glb`                                      | `BohrokModel`          | Full combat set (reference rig)         |
| Vahki           | `Vahki.glb` + kit attachments                            | `VahkiModel`           | Idle switch complete; combat procedural |
| Rahkshi         | `rahkshi.glb`                                            | `Rahkshi`              | Attack + Hit; Defeat procedural         |
| Village Matoran | `matoran_master.glb`, `matoran_metru.glb`, `rebuilt.glb` | `*MatoranModel`        | Non-combat; flavor overlays             |
| Rahi            | `Rahi/NuiRama.glb`                                       | `NuiRamaModel`         | Wings ambient; combat procedural        |
| Placeholder     | _(none)_                                                 | `RahiPlaceholderModel` | Fully procedural capsule                |

Kit libraries (`kit_2001.glb`, `kit_2003.glb`, `kit_2004.glb`) and mask/armor props are mesh-only — no animation clips.

---

## Epics (detailed, story order)

### Epic: Toa Mata — Hit clip gaps {#epic-toa-mata-polish}

**Story:** Mask Hunt · `story_toa_arrival` · **Rigs:** 2 · **Epic id:** `toa-mata-polish`

| Rig             | GLB                   | Idle | Attack | Hit           | Defeat                |
| --------------- | --------------------- | ---- | ------ | ------------- | --------------------- |
| Toa Tahu Mata   | `Toa_Mata/tahu.glb`   | ✅   | ✅     | ❌ procedural | ✅ _(via Attack set)_ |
| Toa Pohatu Mata | `Toa_Mata/pohatu.glb` | ✅   | ✅     | ❌ procedural | ✅ _(via Attack set)_ |

Other Mata Toa (Gali, Kopaka, Lewa, Onua) ship full Attack + Hit. Extra clips in Mata GLBs (Gear, Hand, Leg, etc.) are 💤 unused export artifacts.

---

### Epic: Nui-Rama — combat clips {#epic-rahi-nui-rama}

**Story:** MNOG · `early_rahi_nui_rama` · **Rigs:** 1 · **Epic id:** `rahi-nui-rama`

| Rig      | GLB                | Ambient  | Attack        | Hit           | Defeat        |
| -------- | ------------------ | -------- | ------------- | ------------- | ------------- |
| Nui-Rama | `Rahi/NuiRama.glb` | ✅ Wings | ❌ procedural | ❌ procedural | ❌ procedural |

---

### Epic: Generic Rahi — GLB-backed rig {#epic-rahi-placeholder}

**Story:** Mask Hunt / MNOG · `early_rahi_muaka` · **Rigs:** 1 · **Epic id:** `rahi-placeholder`

`RahiPlaceholderModel` is a procedural capsule for generic Rahi encounters (Muaka, Nui-Jaga). Replace with a shared low-poly GLB when art bandwidth allows.

---

### Epic: Toa Nuva — combat clip rollout {#epic-toa-nuva-combat}

**Story:** Bohrok Swarm · `bohrok_evolve_toa_nuva` · **Rigs:** 5 · **Epic id:** `toa-nuva-combat`

| Rig             | GLB                     | Idle | Attack | Hit | Defeat | Notes                |
| --------------- | ----------------------- | ---- | ------ | --- | ------ | -------------------- |
| Toa Gali Nuva   | `Toa_Nuva/gali.glb`     | ✅   | ❌     | ❌  | ❌     |                      |
| Toa Kopaka Nuva | `Toa_Nuva/kopaka.glb`   | ✅   | ❌     | ❌  | ❌     |                      |
| Toa Lewa Nuva   | `Toa_Nuva/lewa.glb`     | ✅   | ❌     | ❌  | ❌     | 💤 `Idle.001` unused |
| Toa Onua Nuva   | `Toa_Nuva/onua.glb`     | ✅   | ❌     | ❌  | ❌     |                      |
| Toa Takanuva    | `Toa_Nuva/takanuva.glb` | ✅   | ❌     | ❌  | ❌     | MOL unlock           |

**Reference:** Toa Tahu Nuva and Toa Pohatu Nuva already ship full combat clips.

---

### Epic: Rebuilt Matoran — idle & flavor {#epic-rebuilt-idle-switch}

**Story:** Bohrok Kal · `bohrok_kal_naming_day` · **Rigs:** 1 · **Epic id:** `rebuilt-idle-switch`

Rebuilt Matoran crossfade between `Idle` and `Idle.001` (`REBUILT_IDLE_SWITCH`). Vahki uses dedicated `Switch_*` transition clips — same pattern recommended here. Also missing `Tilt Head` flavor (Diminished Matoran reference).

| Rig             | GLB           | Idle switch | Tilt Head |
| --------------- | ------------- | ----------- | --------- |
| Rebuilt Matoran | `rebuilt.glb` | ✅ / ✅     | ❌        |

---

### Epic: Rahkshi — Defeat clip {#epic-rahkshi-defeat}

**Story:** Mask of Light · `mol_fall_of_ta_koro` · **Rigs:** 1 · **Epic id:** `rahkshi-defeat`

| Rig     | GLB           | Idle                 | Attack | Hit | Defeat        |
| ------- | ------------- | -------------------- | ------ | --- | ------------- |
| Rahkshi | `rahkshi.glb` | ✅ Empty → Idle swap | ✅     | ✅  | ❌ procedural |

Defeat is intentionally procedural today so knockdown timing stays aligned with sink/fade VFX.

---

### Epic: Metru Matoran — flavor overlays {#epic-village-flavor}

**Story:** Metru Nui · `story_metru_nui_saga_begin` · **Rigs:** 1 · **Epic id:** `village-flavor`

Metru-stage village Matoran call `useAnimationController` with `Tilt Head`; Diminished Matoran already ship this clip on `matoran_master.glb`.

| Rig           | GLB                 | Idle | Tilt Head |
| ------------- | ------------------- | ---- | --------- |
| Metru Matoran | `matoran_metru.glb` | ✅   | ❌        |

---

### Epic: Vahki — combat clips {#epic-vahki-combat}

**Story:** Metru Nui · `metru_vakama_dume_and_the_great_temple` · **Rigs:** 1 · **Epic id:** `vahki-combat`

| Rig               | GLB         | Idle switch                         | Attack | Hit | Defeat |
| ----------------- | ----------- | ----------------------------------- | ------ | --- | ------ |
| Vahki (all hives) | `Vahki.glb` | ✅ Biped / Quadruped + Switch_BQ/QB | ❌     | ❌  | ❌     |

Preserve existing idle-switch clips when adding combat — see `idleSwitchConfigs.ts`.

---

### Epic: Toa Metru — skeletal combat clips {#epic-toa-metru-combat}

**Story:** Metru Nui · `metru_great_temple_transformation` · **Rigs:** 7 · **Epic id:** `toa-metru-combat`

All Toa Metru share the same gap: `Idle` is authored; `Attack`, `Hit`, and `Defeat` fall back to procedural root motion (`useCombatAnimations.spec.tsx` documents the Lhikan pattern).

| Rig              | GLB                    | Idle | Attack        | Hit           | Defeat        |
| ---------------- | ---------------------- | ---- | ------------- | ------------- | ------------- |
| Toa Lhikan       | `Toa_Metru/Lhikan.glb` | ✅   | ❌ procedural | ❌ procedural | ❌ procedural |
| Toa Vakama Metru | `Toa_Metru/Vakama.glb` | ✅   | ❌            | ❌            | ❌            |
| Toa Nokama Metru | `Toa_Metru/Nokama.glb` | ✅   | ❌            | ❌            | ❌            |
| Toa Matau Metru  | `Toa_Metru/Matau.glb`  | ✅   | ❌            | ❌            | ❌            |
| Toa Onewa Metru  | `Toa_Metru/Onewa.glb`  | ✅   | ❌            | ❌            | ❌            |
| Toa Whenua Metru | `Toa_Metru/Whenua.glb` | ✅   | ❌            | ❌            | ❌            |
| Toa Nuju Metru   | `Toa_Metru/Nuju.glb`   | ✅   | ❌            | ❌            | ❌            |

**Suggested approach:** Author on one master Metru rig, retarget to each Toa GLB (same pattern recommended in UI/UX strategy for Mata/Nuva families).

---

### Epic: Bohrok — unused authored clips {#epic-bohrok-extras}

**Story:** Stretch / polish · **Rigs:** 1 · **Epic id:** `bohrok-extras`

`bohrok_master.glb` is the **reference-complete** combat rig (Bohrok Swarm arc). It also ships `Ball`, `Flying`, and `Flying Pose` — 💤 unused. Either wire these for flying enemies / ball mode or strip on next export pass.

---

## Blender export checklist

1. **Clip names must match exactly** — `Attack`, `Hit`, `Defeat`, `Idle` (case-sensitive). Rahkshi uses `Empty` for the pre-glow pose.
2. **One Action per clip** — name the Action before export; glTF exporter uses Action names as clip names.
3. **Loop flags** — mark `Idle`, `Wings`, and idle-switch clips as looping in the exporter.
4. **Root motion** — combat clips should include forward lunge on Attack; procedural fallback assumes ~50% contact frame in `usePlayAnimation`.
5. **Verify locally** — after export, run `yarn animation-clip-report` and `yarn test:ci --testPathPattern=characterIdleClips`.
6. **Compress** — run `yarn compress` on large GLBs before commit (see README).

---

## CI & automation

| Check                       | Location                                                       |
| --------------------------- | -------------------------------------------------------------- |
| Required idle clips per GLB | `characterIdleClips.spec.ts`                                   |
| Inventory completeness      | `characterAnimationInventory.ts`                               |
| Markdown report             | `yarn animation-clip-report`                                   |
| Single-GLB inspect          | `yarn animation-clip-inspect <glb>`                            |
| E2E model snapshots         | `e2e/modelRendering.spec.ts` (mixers paused via `testMode.ts`) |

When adding a new playable rig:

1. Add GLB under `public/`.
2. Add a row to `RIG_INVENTORY` with epic assignment and expected clips.
3. Wire the React model component to `useCombatAnimations` or `useIdleAnimation`.
4. Extend `characterIdleClips.spec.ts` if the idle clip name is non-standard.

---

## Maintenance

- **New missing clip discovered in code** → update inventory + run report in the same PR.
- **Clip shipped** → set `backlog: 'complete'` on the clip entry; epic moves toward done.
- **New rig or epic** → set `storyOrder` / `storyArc` / `storyBeat` from quest unlock order in `src/data/quests/`.
- **Per-epic GitHub issues** → open from this doc when scheduling art sprints (do not duplicate status in `ARCHITECTURE_ROADMAP.md`).
