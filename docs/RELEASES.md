# Release schedule

This project ships a biweekly release every other **Saturday**. Version numbers encode the calendar month and which release that month is:

| Position in month                    | `minor`              | `patch` | Example               |
| ------------------------------------ | -------------------- | ------- | --------------------- |
| First release Saturday in the month  | current month (1–12) | `1`     | `0.9.1` on 2026-09-12 |
| Second release Saturday in the month | same month           | `2`     | `0.9.2` on 2026-09-26 |

The schedule anchor is **2026-08-29** (every 14 days after that). The kickoff release on that date is **`0.8.2`** and its notes cover everything merged since **`0.1.0`**.

## Upcoming releases

| Date       | Version           |
| ---------- | ----------------- |
| 2026-08-29 | `0.8.2` (kickoff) |
| 2026-09-12 | `0.9.1`           |
| 2026-09-26 | `0.9.2`           |
| 2026-10-10 | `0.10.1`          |
| 2026-10-24 | `0.10.2`          |

## Automation

- **Config:** [`release.config.json`](../release.config.json) — anchor date, interval, kickoff version, baseline for the first changelog.
- **Categories:** [`release.categories.json`](../release.categories.json) — maps `release/*` PR labels (preferred) and keyword fallbacks to changelog sections. See [PR label guidelines](PR_LABELS.md).
- **Script:** [`scripts/release.mts`](../scripts/release.mts) — computes the version, lists merged PRs since the last release, groups them by category, and updates `package.json` + `CHANGELOG.md`.
- **Workflow:** [`.github/workflows/release.yml`](../.github/workflows/release.yml) — on release Saturdays, bumps version and pushes to `master`; every push to `master` publishes a GitHub Release when `CHANGELOG.md` has a section for the current `package.json` version but the `vX.Y.Z` tag is still missing.

### Local commands

```bash
# Preview the version for a date
yarn release:plan --date 2026-09-12

# Print release notes without writing files
yarn release:notes --date 2026-09-12

# Bump package.json and prepend CHANGELOG.md (uses last GitHub Release as baseline)
yarn release:bump --date 2026-09-12

# Reformat an existing changelog section (e.g. after editing release.categories.json)
yarn release:refresh --version 0.8.2 --date 2026-08-29 --since 0.1.0
```

After a release PR merges to `master`, the workflow publishes the GitHub Release automatically when `package.json` and `CHANGELOG.md` are updated but the matching `vX.Y.Z` tag does not exist yet.

For a scheduled release Saturday where the version was already bumped in a merged PR, the workflow skips the bump and only publishes the tag/release.

## Changelog format

[`CHANGELOG.md`](../CHANGELOG.md) is the source of truth. Each section lists merged pull requests since the previous release (or since `0.1.0` for the kickoff), grouped into categories such as **Quests & Story**, **Combat & Encounters**, and **Characters & Models**. The GitHub Release body is extracted from the matching section.

**Categorization order:** (1) `release/*` label on the PR ([guidelines](PR_LABELS.md)), (2) keyword rules in [`release.categories.json`](../release.categories.json) when no release label is present. Add exactly one release label to every PR before merge for accurate notes.
