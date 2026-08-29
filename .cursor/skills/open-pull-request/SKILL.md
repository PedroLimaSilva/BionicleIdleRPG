---
name: open-pull-request
description: >-
  Open or update pull requests targeting master using the repository PR template,
  release label rules, and ManagePullRequest. Use before create_pr or update_pr,
  when the PR base branch is master (or changes to master), or when asked to open
  or refresh a PR.
environments: [cloud]
---

# Open Pull Requests (master)

Every PR into **`master`** must follow this repository's template and release-label rules. Read this skill **before** calling `ManagePullRequest` or `EditPullRequestLabels`.

## When to use

- Creating a new PR with `base_branch: master`
- Updating an existing PR's body or title after new commits
- Changing a PR's base branch to `master` (re-read the template and refresh the body if needed)
- Finishing a Cloud Agent turn that made code changes (create or update the PR before summarizing)

## Required reading (every time)

1. [`.github/pull_request_template.md`](../../.github/pull_request_template.md) — structure the PR body from this template
2. [`docs/PR_LABELS.md`](../../docs/PR_LABELS.md) — pick **exactly one** `release/*` label

If the checkout is stale, `git fetch origin master` and read these files from the branch you are targeting.

## Workflow

### 1. Preconditions

- Changes are **committed and pushed** to the feature branch (`git push -u origin <branch>`)
- Branch name follows Cloud Agent convention when applicable: `cursor/<descriptive-name>-5bfa`

### 2. Choose the release label

From [`docs/PR_LABELS.md`](../../docs/PR_LABELS.md):

- Add **exactly one** `release/*` label — the primary **player-facing** outcome
- Use the decision guide and edge-case table when unsure
- Do **not** invent new `release/*` names
- Code + docs in one PR → never `release/documentation`; pick the functional category

Common agent work:

| Change type                               | Label                                           |
| ----------------------------------------- | ----------------------------------------------- |
| Agent docs, AGENTS.md, skills, CI/tooling | `release/infrastructure`                        |
| Tests or snapshots only                   | `release/testing`                               |
| Gameplay / UI / models                    | Match the affected system (see PR_LABELS table) |

### 3. Write the PR body

Fill **every** section from the template. Do not leave HTML comments or placeholders.

```markdown
## Summary

<What changed and why. Link issues with "Fixes #123" when applicable.>

## Release notes category

- [x] I added a `release/*` label matching the [PR label guide](../docs/PR_LABELS.md)

**Label used:** release/<category>

## Testing

<Commands run and results — e.g. yarn lint, yarn test:ci, manual/browser testing.
Include walkthrough artifacts when UI changed: use HTML img/video tags with absolute
paths under /opt/cursor/artifacts/ so they upload with the PR.>
```

Rules for the body:

- Provide **raw markdown only** — do not include `<!-- CURSOR_AGENT_PR_BODY_* -->` markers (the tool adds metadata)
- Keep the checklist item checked and **Label used** filled with the same label you will apply on GitHub
- Preserve human edits in an existing PR unless they are clearly wrong
- When updating after testing, refresh **Testing** with new evidence

### 4. Create or update the PR

Use **`ManagePullRequest`**, not `gh pr create`:

| Action             | Tool call                                                                               |
| ------------------ | --------------------------------------------------------------------------------------- |
| New PR             | `create_pr` with `title`, `body`, `branch_name`, `base_branch: master`                  |
| Body/title refresh | `update_pr` with `branch_name` (or `pr_url`) and updated fields                         |
| Ready for review   | `update_pr` with `draft: false` when the user wants review (draft is default on create) |

Default **`base_branch`** is `master` — set it explicitly when creating.

### 5. Apply the release label

After create/update, call **`EditPullRequestLabels`**:

```json
{
  "pr_url": "<PR URL>",
  "add_labels": ["release/<category>"]
}
```

- Apply **exactly one** `release/*` label
- If the wrong release label is present, `remove_labels` the old one when adding the new one
- Optional labels (`bug`, `enhancement`, etc.) do not replace the release label

### 6. Verify before ending the turn

- [ ] Body has Summary, Release notes category (checked box + **Label used**), and Testing
- [ ] Exactly one `release/*` label on the PR
- [ ] `base_branch` is `master`
- [ ] Branch is pushed and PR link is valid

## Updating an existing PR

1. Read the current PR title and body — **preserve** human edits unless inaccurate
2. Re-read the template and [`docs/PR_LABELS.md`](../../docs/PR_LABELS.md) if the change scope shifted
3. `update_pr` with only the fields that need to change (often `body` after new testing)
4. Confirm labels still match; fix with `EditPullRequestLabels` if not

## Related docs

- [`docs/RELEASES.md`](../../docs/RELEASES.md) — biweekly release schedule and automation
- [`release.categories.json`](../../release.categories.json) — keyword fallbacks when no label is present
- [`.github/labels.yml`](../../.github/labels.yml) — canonical label names
