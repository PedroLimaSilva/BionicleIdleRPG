# Pull request labels for release notes

Every merged PR should carry **one** `release/*` label so biweekly release notes land in the right changelog section. Labels are the preferred source for categorization; [`release.categories.json`](../release.categories.json) keyword rules are the fallback when a PR has no release label.

## Quick rules

1. Add **exactly one** `release/*` label before merge — pick the category that best describes the **player-facing purpose** of the change.
2. If a PR spans multiple areas, choose the **primary** outcome (what would a player notice first?).
3. Use the label list below — do not invent new `release/*` names without updating `release.categories.json` and this doc.
4. Non-release labels (bug, enhancement, dependencies, etc.) are optional and do not replace the release label.

## Label reference

| Label                                                                                                               | Changelog section            | Use when the PR…                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`release/documentation`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fdocumentation)         | Documentation                | Updates README, agent docs, roadmap, architecture notes, or other markdown-only guidance.                                              |
| [`release/telemetry`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Ftelemetry)                 | Telemetry & Analytics        | Adds or changes anonymous usage analytics (PostHog, telemetry consent, snapshots).                                                     |
| [`release/infrastructure`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Finfrastructure)       | Infrastructure, CI & Tooling | Touches CI/CD, lint/format tooling, dependency audits, repo layout, dev environment, or build pipeline — no direct gameplay change.    |
| [`release/testing`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Ftesting)                     | Testing                      | Adds or fixes tests, Playwright/E2E coverage, snapshots, or test infrastructure.                                                       |
| [`release/persistence`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fpersistence)             | Persistence & Save           | Changes save/load, IndexedDB/Dexie, migrations, or game-state editing tools.                                                           |
| [`release/pwa`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fpwa)                             | PWA & Notifications          | Changes installability, service worker, offline behavior, app icons, or push/local notifications.                                      |
| [`release/custom-characters`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fcustom-characters) | Custom Characters & Sharing  | Covers custom Toa/Matoran creation, share/redeem codes, or import flows.                                                               |
| [`release/quests-story`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fquests-story)           | Quests & Story               | Adds or changes quests, cutscenes, visual novel dialogue, chronicles, saga progression, or story unlocks.                              |
| [`release/combat`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fcombat)                       | Combat & Encounters          | Changes battles, encounters, mask powers in combat, arenas, waves, Kraata/Rahkshi/Vahki fights, or combat UI flow.                     |
| [`release/jobs-economy`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fjobs-economy)           | Jobs, Economy & Progression  | Changes jobs, protodermis, recruitment costs, evolution requirements, XP/currency loops, or idle rewards.                              |
| [`release/ui-ux`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fui-ux)                         | UI & UX                      | Changes layouts, navigation, modals, lists, settings screens, motion/transitions, or general app chrome — not tied to one game system. |
| [`release/rendering`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Frendering)                 | Rendering & Materials        | Changes shaders, PBR/materials, lighting, bloom, canvas behavior, or visual effects — not new character geometry.                      |
| [`release/characters-models`](https://github.com/PedroLimaSilva/BionicleIdleRPG/labels/release%2Fcharacters-models) | Characters & Models          | Adds or updates 3D/2D models, rigs, kits, GLBs, animations, avatars, or character-specific attachments.                                |

## Decision guide

When unsure between two labels, use this order of precedence:

```text
Story content (quests-story)
  → Combat gameplay (combat)
  → Character assets (characters-models)
  → Visual tech (rendering)
  → Economy/progression (jobs-economy)
  → App shell (ui-ux)
  → Supporting systems (persistence, pwa, custom-characters, telemetry)
  → Repo hygiene (infrastructure, testing, documentation)
```

### Common edge cases

| Situation                                   | Label                                                                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New Toa Metru GLB + quest that unlocks them | `release/characters-models` if the PR is mostly asset work; `release/quests-story` if the PR is mostly narrative/unlocks. Split into two PRs when possible. |
| Battle UI restyle (HP bars, layout)         | `release/combat` if battle-specific; `release/ui-ux` if it affects shared components used outside battle.                                                   |
| E2E snapshot update after a model change    | `release/testing` when the PR only updates snapshots; label the original feature PR with the gameplay category.                                             |
| CI workflow + gameplay fix in one PR        | Prefer splitting. If combined, label by the **main** intent of the PR title/description.                                                                    |
| `docs:` prefix but also code changes        | Never `release/documentation` — pick the functional category.                                                                                               |

## Examples

| PR title                                                     | Label                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| Add Vahki opponent (six hives, kit-assembled chassis)        | `release/combat`                                        |
| Wire Toa Nokama Metru model                                  | `release/characters-models`                             |
| Add Kapura Morbuzakh quest and Metru Nui recruitment unlock  | `release/quests-story`                                  |
| Migrate analytics from Supabase to PostHog                   | `release/telemetry`                                     |
| Redesign PWA update notification as bottom banner            | `release/pwa`                                           |
| Reorganize src by concern: mechanics, rendering, persistence | `release/infrastructure`                                |
| Give metallic LEGO colors metal PBR on every kit slot        | `release/rendering`                                     |
| Pause job ticks during battle                                | `release/combat` (primary player impact is combat flow) |

## Setup (maintainers)

Release labels are defined in [`.github/labels.yml`](../.github/labels.yml). Sync them to GitHub with:

```bash
# Requires gh 2.78+ and admin access on the repo
gh label sync --file .github/labels.yml
```

If `gh label sync` is unavailable, create labels manually from the table above (name, color, and description are in `labels.yml`).

## Related docs

- [Release schedule & automation](RELEASES.md)
- [Category keyword fallbacks](../release.categories.json) — used when no release label is present
