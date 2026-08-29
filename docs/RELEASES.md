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
- **Categories:** [`release.categories.json`](../release.categories.json) — keyword rules used to group merged PRs under themed headings in `CHANGELOG.md`. Edit this file when new areas of the game need their own section.
- **Script:** [`scripts/release.mts`](../scripts/release.mts) — computes the version, lists merged PRs since the last release, groups them by category, and updates `package.json` + `CHANGELOG.md`.
- **Workflow:** [`.github/workflows/release.yml`](../.github/workflows/release.yml) — runs every Saturday at 12:00 UTC; on biweekly release Saturdays it bumps the version, commits, tags, and publishes a GitHub Release with notes from `CHANGELOG.md`.

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

After the kickoff PR merges on a release Saturday, run **Actions → Biweekly Release → Run workflow** with date `2026-08-29` to publish the `v0.8.2` tag and GitHub Release (the version and changelog are already in `master`; the workflow skips the bump when unchanged and only publishes the tag).

## Changelog format

[`CHANGELOG.md`](../CHANGELOG.md) is the source of truth. Each section lists merged pull requests since the previous release (or since `0.1.0` for the kickoff), grouped automatically into categories such as **Quests & Story**, **Combat & Encounters**, and **Characters & Models**. The GitHub Release body is extracted from the matching section.

To tune grouping for future releases, edit [`release.categories.json`](../release.categories.json). Categories are matched top-to-bottom; the first matching pattern wins.
