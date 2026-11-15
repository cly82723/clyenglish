# Motion and stickers: what was built, and what was not possible

Branch `motion-3d-book`, started 2026-11-16. Nothing here is on the live site.

## Not possible, or done differently from the plan

1. **GitHub issues were not filed.** The `gh` command is not installed on this computer, so the four issues could not be created. Their text is at the end of this file, ready to paste. To install: `winget install GitHub.cli`, then `gh auth login`.
2. **"The clock starts only when the flip ends" cannot be done from the page.** The league (the Apps Script web app) starts the clock when it receives the start request, and the plan was not to redeploy it. Instead the turn plays during the wait for the league's answer, which students already sat through as "Opening the challenge…", and the paper's face arrives in 0.26 seconds. No student loses more time than before, apart from that quarter of a second while the face turns in.
3. **Ticks and crosses cannot be shown at hand-in.** The league gives only the score when a paper is handed in; answers come out on Monday. So at hand-in the score counts up and is underlined twice, and the one-by-one marking plays when a student opens a closed week's answers.
4. **The "stamp bounce" is on the set's square, not the whole sheet.** Bouncing the sheet would move the text being read, which breaks the rule that reading text stays still.
5. **"A flawless grammar topic" became "all five sets of one exercise".** The pages record that a set is finished, not whether it was right first time.
6. **"A vocab passage in each junior form" became one sticker for one passage.** The home page now lists S.3 to S.6 and does not link to the vocab page, so a sticker per junior form would be out of reach for most students.
7. **The stickers sit under the directory, not around the fox.** Nineteen stickers above the directory would push "Pick your form" off a phone's first screen and break "two taps to any guide".
8. **Chiikawa characters were not used.** They are another artist's copyright. Note that the existing cover pictures (for example `assets/img/cover/steps-*.jpg`) already contain small white characters that look like them; that is worth reviewing separately.
9. **Page turns do not play in Firefox,** which has no cross-page view transitions. Pages load at once there, as before.

## Not verified

- **Safari and real iPads or iPhones.** Everything was checked in the app's Chromium browser at phone (375px), iPad (768px) and laptop (1280px) widths. The raised "you" row in the league tables uses a drop shadow on a table row, which Safari may not draw; the row is still mint-filled if so.
- **A slow phone.** The plan was to test with the browser slowed down; the preview browser has no CPU throttle, so this was not done. All effects use only `transform` and `opacity`.
- **The live league.** The league screens were checked in test mode (`challenge.html?test` on localhost), not against the real web app.
- **The real page-turn animation** was not observed frame by frame; the pages load and report no errors with it on.

## What was built

| Step | What | Files |
| --- | --- | --- |
| 1 | Home book leans and opens once a day; page turns between pages and sections | `assets/css/motion.css`, `assets/js/motion.js`, `index.html` |
| 2 | League: paper turns over, hand-in, returned result, stamp card, dealt-in boards, marked answers | `assets/js/challenge.js`, `assets/css/challenge.css` |
| 3 | Held controls tilt, tabs hinge, ladder flips, set squares are stamped | `assets/css/motion.css`, `assets/js/motion.js`, `assets/js/site.js`, `assets/js/sets.js` |
| 4 | Nineteen fox stickers, the sheet on the home page, the corner note | `assets/js/stickers.js`, `tests/stickers.test.js`, `assets/js/practice-core.js` |

`DESIGN.md` records the new rules ("flat at rest", "still text") and components.

## Issue drafts

**1. Home book and page turns.** The home hub leans towards a mouse, the cover opens on the first visit of the day (never on Back, skipped by a tap, off with reduced motion), and pages turn between and within pages. Done when: checked on a real iPhone and iPad in Safari.

**2. League motion and stamp card.** Paper turns over on Start, is passed away on hand-in, the result returns with an underlined score, the streak line becomes a stamp card, boards deal in. Done when: checked against the live league on a school iPad, and the switch rule still behaves as before.

**3. Paper interactions.** Held controls lift and tilt, cover tabs hinge, the level ladder flips, finished sets are stamped. Done when: checked on a low-end Android phone for stutter.

**4. Fox stickers.** Six practice stickers, one first-challenge sticker, twelve league stickers with a gold repeat. Done when: CLY has approved the drawings, and a decision is made on moving practice stickers between devices.
