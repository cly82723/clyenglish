# CLY English

Static HKDSE English Paper 2 site. See `PRODUCT.md` for purpose and constraints and `DESIGN.md` for the design system.

This file is the instructions for every coding agent (Codex reads it directly; `CLAUDE.md` imports it), so edit it here, not in `CLAUDE.md`.

## Checking your work

- Run `node --test tests/*.test.js` before you commit. GitHub runs the same checks on every pull request (`.github/workflows/tests.yml`), so a pull request with a red cross is not ready to merge.
- A change a student will see is not done until it has been looked at on a phone-width screen (360px), not only in the tests.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on cly82723/clyenglish, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
