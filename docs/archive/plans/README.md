# Animation plans

Written by the `improve-animations` audit on 2026-11-18 at commit `59c6e2d`. Goal: moving through the site should
feel like flipping through a book, and every turn should look smooth. Each plan is self-contained and can be
handed to any agent.

| # | Plan | Severity | Status |
|---|---|---|---|
| 001 | [Turn the old page away on its spine instead of cross-fading two pages](001-page-turns-away.md) | HIGH | DONE |
| 002 | [Turn the page back when the reader goes back](002-turn-back-on-back.md) | HIGH | DONE |
| 003 | [Open a step as a page turning, from the side the reader came from](003-steps-open-as-a-page-turn.md) | MEDIUM | DONE |

## Order and dependencies

1. **001 first.** It fixes the double exposure between pages, which is the main reason turns look unsmooth.
2. **002 after 001.** It builds on 001's tokens (`--ease-turn`), its `pageswap`/`pagereveal` listeners and its
   `--turn-old-y` hinge.
3. **003 any time.** It touches different files (`guide.css`, `site.js`) and can run before, after or alongside 001.

## Not planned (from the same audit)

- The home notebook cover opens with a strong ease-out over 0.65s (`story.css:84`): it snaps open, then creeps.
  Suggested `cubic-bezier(0.32, 0.72, 0, 1)` at 0.5s, after a feel check on a phone.
- The level ladder's card flip is 0.38s (`motion.css:53`) on something tapped many times per lesson: suggested 0.28s.
- Ideas: turn a leaf on the notebook for "Next word" (`story.js:59-63`), and shade the notebook cover by its
  open angle (`story.css:104`).
