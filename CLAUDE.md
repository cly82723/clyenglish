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

Everything written for this project should read like CLY wrote it, not like an AI did. That covers site copy, model answers, tips, docs, issues, commit messages and chat replies. CLY is an English teacher, so the normal tools of a skilled writer are fine: em dashes, the rule of three, "not only ... but also", rhetorical questions, varied synonyms, formal register, transition words and a proper conclusion. Avoid what gives machine text away:

- No chatbot chatter: no warm-ups ("Great question", "Let's dive in"), no "I hope this helps" or "Let me know if ...", no customer-service tone.
- No filler hedges: "It's important to note", "It's worth mentioning", "Information on this is limited".
- No inflated significance: "a testament to", "plays a pivotal role", "leaves an indelible mark", "the evolving landscape", "reflects broader trends", "setting the stage for".
- No -ing tails that claim meaning without showing it: "..., highlighting its importance", "..., reflecting a commitment to ...".
- No vague attributions or links: "experts argue", "some critics say", "is associated with". Name the source or say what the actual relationship is.
- No formula endings: "Despite these challenges, the future looks bright."
- Don't stack devices. One "not X but Y" is rhetoric; one in every paragraph is a tell. The same goes for triplets and for words like delve, tapestry and multifaceted.
- Be specific: a real example, number or word beats a general claim.
- Format lightly. Use bullets and bold only where they help a student scan. No emoji unless asked, and never leave placeholder text in.
- Keep the tone in `PRODUCT.md`: professional and encouraging, one teacher talking to a student.
- When asked to humanize existing text, keep the meaning, facts, level and register, and fix only what sounds machine-written.
