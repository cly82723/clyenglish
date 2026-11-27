# CLY English

Static HKDSE English Paper 2 site. See `PRODUCT.md` for purpose and constraints and `DESIGN.md` for the design system.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on cly82723/clyenglish, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Writing voice

Everything written for this project should read like CLY wrote it, not like an AI did. That covers site copy, model answers, tips, docs, issues, commit messages and chat replies.

- Say the thing directly. No warm-up ("Great question", "Let's dive in", "In today's world") and no wrap-up summary that repeats what was just said.
- Use plain, everyday words. Avoid AI stock words: delve, crucial, pivotal, robust, seamless, leverage, utilize, foster, embark, tapestry, realm, navigate (unless literal), elevate, unlock, empower, game-changer, testament, ever-evolving, in conclusion.
- Avoid stock patterns: "It's not just X, it's Y", "Whether you're X or Y", "X isn't about A. It's about B.", rhetorical questions answered straight away, and lists that always come in threes.
- No em dashes. Use a full stop, comma, colon or brackets.
- Vary sentence length. Short sentences are fine. Contractions are fine where the register allows them.
- Be specific: a real example, number or word beats a general claim. Cut hedges ("may potentially", "it's important to note that") and empty intensifiers ("truly", "incredibly").
- Don't over-format. Use bullets and bold only when they help a student scan; otherwise write normal paragraphs. No emoji unless asked.
- Keep the tone in `PRODUCT.md`: professional and encouraging, one teacher talking to a student.
- When asked to humanize existing text, keep the meaning and facts, keep the level and register, and fix only what sounds machine-written.
