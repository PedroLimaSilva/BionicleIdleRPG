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
- **Workflow:** [`.github/workflows/release.yml`](../.github/workflows/release.yml) — three triggers, two roles:
  - **Schedule / manual run:** bumps `package.json` + `CHANGELOG.md` and opens a **`release/vX.Y.Z` pull request** (does not push to `master`; branch protection requires a PR).
  - **Push to `master`:** **publish-only** — never bumps. Runs on every merge but exits immediately unless `package.json` has a version whose `vX.Y.Z` tag is missing **and** `CHANGELOG.md` has a matching `## [X.Y.Z]` section (typical after merging a release PR).

#### Repository setting (required for automated release PRs)

In **Settings → Actions → General → Workflow permissions**, enable:

**Allow GitHub Actions to create and approve pull requests**

Without this, the workflow can still push the `release/vX.Y.Z` branch but `gh pr create` fails with `GitHub Actions is not permitted to create or approve pull requests`. Open the PR manually from the compare link in the job log, or enable the setting and re-run.

Re-runs are safe: if the release branch already exists from a partial run, the workflow updates it with `--force-with-lease` and opens the PR if one is still missing. If the PR already exists, the job exits successfully without pushing again.

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

### Catch up after a failed or missed Saturday run

1. **Actions → Biweekly Release → Run workflow** on `master`.
2. Leave **date** empty to target the latest scheduled release Saturday on or before today, **or** set **date** explicitly (e.g. `2026-09-12` for the September first release).
3. Merge the **`release/vX.Y.Z`** PR the bot opens; the following push to `master` creates the GitHub Release.

If a manual run **failed on `git push` to `master`** with `GH006` / “Changes must be made through a pull request”, the bump succeeded on the runner but never landed — re-run after the PR-based workflow fix, or run `yarn release:bump` locally and open the release PR yourself.

## Changelog format

[`CHANGELOG.md`](../CHANGELOG.md) is the source of truth. Each section lists merged pull requests since the previous release (or since `0.1.0` for the kickoff), grouped into categories such as **Quests & Story**, **Combat & Encounters**, and **Characters & Models**. The GitHub Release body is extracted from the matching section.

**Categorization order:** (1) `release/*` label on the PR ([guidelines](PR_LABELS.md)), (2) keyword rules in [`release.categories.json`](../release.categories.json) when no release label is present. Add exactly one release label to every PR before merge for accurate notes.
