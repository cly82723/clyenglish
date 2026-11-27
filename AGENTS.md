# CLY English

Static HKDSE English Paper 2 site. See `PRODUCT.md` for purpose and constraints and `DESIGN.md` for the design system.

This file is the instructions for every coding agent (Codex reads it directly; `CLAUDE.md` imports it), so edit it here, not in `CLAUDE.md`.

## Checking your work

- Run `node --test tests/*.test.js` before you commit. GitHub runs the same checks on every pull request (`.github/workflows/tests.yml`), so a pull request with a red cross is not ready to merge.
- `tests/phone-layout.test.js` opens every page at 360px and fails if a page scrolls sideways or a tap target is under 24px. It needs Playwright; without it that check is skipped locally but still runs on GitHub.
- A change a student will see is not done until it has been looked at on a phone-width screen (360px), not only in the tests.

## Planning work

- **Small change** (wording, a style fix, one page): just do it, on its own branch.
- **Bigger feature** (new page type, new exercise, anything over a few files): grill first (`/grill-me`), then write the plan as one GitHub issue (the PRD), then split it into small issues, each a thin slice a student could try, labelled `ready-for-agent` or `ready-for-human`. Say which issues block which.
- **Grill anything that judges or limits a student** (scores, the weekly league, timers, warnings, locks, anything that could treat a student who did nothing wrong as cheating) before building it. Ask: what could go wrong for a student on a phone, on a slow connection, with a pop-up keyboard?
- Before building an issue, check its premise against the code as it is now (issues quote numbers and line references that go stale). If it no longer holds, comment on the issue with what you found instead of building it.
- Proposals CLY must review go in `docs/` as a draft. Once built and merged, move it to `docs/archive/` and add a row to its README. Never plan from `docs/archive/`: the site and `tests/` are the source of truth.

## Working in parallel

When several agents or sessions work at once, give each its own files and say which in its task, so no two edit the same file. Shared files (`assets/css/site.css`, `assets/js/site.js`, the header and menu) belong to one session at a time. Plan a merge step at the end and run the tests after it.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on cly82723/clyenglish, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
