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

### Related design docs

| Document | Purpose |
| -------- | ------- |
| [`docs/SAVE_PERSISTENCE_PLAN.md`](docs/SAVE_PERSISTENCE_PLAN.md) | Detailed plan for [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333) and [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331) |
| [`docs/UI_UX_STRATEGY.md`](docs/UI_UX_STRATEGY.md) | Portrait-first UI/UX direction and phased 3D expansion |
| [`docs/DESIGN_UI_MOTION_ROLLOUT.md`](docs/DESIGN_UI_MOTION_ROLLOUT.md) | UI motion rollout notes |

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
