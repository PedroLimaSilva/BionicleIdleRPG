# Architecture Roadmap

## Purpose

This document indexes known technical debt, inconsistencies, and architectural improvements for the Bionicle Idle RPG project.

**Tracking:** Open work is tracked as [GitHub issues](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues). Use issues for status, discussion, and acceptance criteria — not this file.

**Important:** Items describe _potential_ improvements. Implement only when explicitly prioritized and approved.

---

## Open backlog

| Area | Issue | Summary |
| ---- | ----- | ------- |
| Consistency | [#334](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/334) | Standardize variable naming conventions (camelCase for locals) |
| Consistency | [#337](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/337) | Unified non-blocking feedback component (toast/activity log) |
| Persistence | [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333) | Save migration & persistence — Phase A (localStorage) |
| Persistence | [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331) | Save migration & persistence — Phase B (IndexedDB) |
| Game logic | [#332](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/332) | Quest prerequisite cycle detection |
| Testing | [#338](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/338) | Expand unit test coverage for game logic |
| Code quality | [#341](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/341) | Item system (deferred) — design before reintroduction |
| Code quality | [#336](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/336) | Clarify character tags system (implement or remove unused tags) |
| Code quality | [#340](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/340) | Standardize timestamp units to milliseconds |
| Performance | [#335](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/335) | Lazy loading for 3D character models |
| Performance | [#339](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/339) | Memoization for expensive derived-state computations |
| Combat | [#344](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/344) | Implement Matatu mask power (immobilize / skip enemy turn) |

### UI/UX and motion

| Area | Issue | Summary |
| ---- | ----- | ------- |
| 3D / canvas | [#343](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/343) | Phase 1 — persistent canvas and remaining battle 3D polish |
| 3D / canvas | [#346](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/346) | Phase 2 — environmental 3D backdrops per route |
| 3D / canvas | [#349](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/349) | Phase 3 — advanced combat feedback and idle ambient life |
| Portrait UX | [#345](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/345) | Nav label size and orientation lock |
| Stretch | [#348](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/348) | Phase 4+ — explorable world and advanced 3D features |
| Motion | [#347](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/347) | UI motion Phase 2 — interactive panel animations |
| Motion | [#350](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/350) | UI motion Phase 3 — navigation and list choreography |

### Bohrok Kal arc

| Issue | Summary |
| ----- | ------- |
| [#351](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/351) | Nuva symbols sequestered stat modifier |
| [#352](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/352) | Scripted outcome story battles |
| [#353](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/353) | Quest-triggered battle flow |
| [#354](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/354) | Combatants, encounters, and quest content |
| [#355](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/355) | Optional First Strikes scripted-loss battle |

### Related design docs

| Document | Purpose |
| -------- | ------- |
| [`docs/SAVE_PERSISTENCE_PLAN.md`](docs/SAVE_PERSISTENCE_PLAN.md) | Technical design for [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333) and [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331) |
| [`docs/UI_UX_STRATEGY.md`](docs/UI_UX_STRATEGY.md) | Portrait-first UI/UX direction — tracked via issues [#343](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/343)–[#349](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/349) |
| [`docs/DESIGN_UI_MOTION_ROLLOUT.md`](docs/DESIGN_UI_MOTION_ROLLOUT.md) | UI motion rollout — tracked via [#347](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/347), [#350](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/350) |
| [`docs/DESIGN_BOHROK_KAL_QUEST_LINE.md`](docs/DESIGN_BOHROK_KAL_QUEST_LINE.md) | Bohrok Kal arc design — tracked via [#351](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/351)–[#355](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/355) |
| [`docs/BATTLE_SYSTEM_SPEC.md`](docs/BATTLE_SYSTEM_SPEC.md) | Combat system reference |
| [`docs/COMBAT_TEST_COVERAGE.md`](docs/COMBAT_TEST_COVERAGE.md) | Combat test reference |

---

## Implementation guidelines

### Before starting any item

1. **Get explicit approval** — pick up a GitHub issue; do not implement roadmap ideas without authorization
2. **Review dependencies** — check whether the issue depends on other open work
3. **Check AGENT_GUIDELINES.md** — ensure changes do not violate architectural rules
4. **Create a plan** — outline specific files and changes in the issue or a linked comment
5. **Consider backward compatibility** — will this break existing saves or features?

### During implementation

1. **Make incremental changes** — small PRs are easier to review and safer to merge
2. **Test thoroughly** — verify both new functionality and existing features
3. **Update documentation** — keep `AGENT_GUIDELINES.md` in sync with changes
4. **Add tests** — especially for bug fixes and new game logic

### After implementation

1. **Close the GitHub issue** — link the PR in the issue
2. **Document decisions** — if you deviate from the plan, explain why in the issue or PR
3. **File new issues** — add newly discovered technical debt as GitHub issues instead of expanding this file

---

## Non-goals

This roadmap does NOT include:

- **Major architectural rewrites** — the current architecture is sound
- **Framework migrations** — React, Vite, TypeScript are appropriate choices
- **State management library adoption** — custom hooks pattern works well
- **Backend / cloud database** — client-side IndexedDB for saves is planned (see `docs/SAVE_PERSISTENCE_PLAN.md`); no server-side persistence
- **Multiplayer features** — out of scope for idle game
- **Mobile app conversion** — PWA support is adequate

---

## Maintenance

- **New technical debt** → open a GitHub issue
- **Completed work** → close the issue; remove it from the table above when the PR merges
- **Priorities** → use GitHub labels, milestones, or project boards — not status fields in this file
