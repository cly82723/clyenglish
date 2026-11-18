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

**4. Fox stickers.** Six practice stickers, one first-challenge sticker, twelve league stickers with a gold repeat. The drawings were approved on 2026-11-16. Done when: a decision is made on moving practice stickers between devices.

## Badges, second version (branch `new-badges`, not live)

Started 2026-11-16. The live site still has the first set (one sticker every two weeks).

- The "fox's school year" series, the two-week rule and the vocab sticker are gone. There are now 21 badges; the list and rules are in `assets/js/stickers.js`.
- Six have CLY's drawings, cut from the badge sheet into `images/stickers/`: `streak-alive`, `streak-15`, `personal-best`, `step-by-step`, `final-lap`, `five-days`. The other fifteen show a stand-in fox until their drawings arrive; to add one, save it as `images/stickers/<badge id>.png` and add the id to `DRAWN`.
- Dropped because the league does not store what they need: Stayed put, Both papers, Early bird, Beat the clock.
- "Personal best" needs two earlier weeks to beat, so it is not the same moment as "Climber".
- "Tip collector" counts tips asked for with "Another tip"; the tip already showing when the page opens is not counted.
- Not checked in a browser: this session had no browser tools. The rules are covered by `tests/stickers.test.js` and a headless run of the script.
- Anyone who earned a first-set sticker on the live site keeps the badges whose ids did not change (first set, ten sets, whole exercise, five days); the school-year stickers disappear.

## Meme badges (branch `meme-badges`, not live)

Started 2026-11-18. Ten more badges, one for each reaction picture CLY drew, so the sheet now has 31. The rules are in `assets/js/stickers.js`; the drawings are in `images/stickers/<badge id>.png`, resized to 512 pixels like the others.

| Badge | id | Earned by | Where it is detected |
| --- | --- | --- | --- |
| Hehe, again | `hehe-again` | Handing in the weekly challenge two weeks in a row, with no missed week between | League history (`leagueIds`) |
| Shake it off | `shake-it-off` | A lower score than the week before, then the very next week handed in too | League history (`leagueIds`) |
| Last-minute prayer | `last-minute` | Handing in during the last 24 hours before the week closes | `challenge.js` tells the league call that the paper was handed in just now and when the week closes |
| Saved it | `saved-it` | Fixing three wrong answers with one press of Check | `practice-core.js` sends `cly:fixed-many` |
| Potato | `potato` | Finishing 25 practice sets | Set counts already kept by the pages |
| Call me | `call-me` | Earning 10 other badges | Worked out when a badge is given |
| Thinking it through | `thinking` | Fixing an answer after its hint, 5 times | Counts `cly:second-try`, which the badge "Second try" already used once |
| Sniffer | `sniffer` | Opening 8 different pages | A list of page names, saved with the badges |
| Six seven | `six-seven` | Opening the site 67 times | A visit counter, saved with the badges |
| Shh (secret) | `shh` | Asking the fox for another tip 15 times in one visit to the home page | Counted in `stickers.js` from `cly:tip` |

Choices worth knowing:

- **A visit is a browser session.** Opening five pages in a sitting is one visit, and a reload is not a visit, so 67 takes about two months of daily use. If the browser cannot say whether a session was already counted, it is not counted.
- **Pages are named, not addressed.** `grammar`, `grammar.html` and `/site/grammar` are the same page, and any folder is the home page, so the same page opened two ways counts once.
- **The two league badges only count weeks that were handed in one after the other.** "Hehe, again" and "Shake it off" both need the weeks to be exactly seven days apart, so a missed week gives "Comeback" and neither of these.
- **The secret badge has no name on the sheet** until it is earned. Its circle reads "Secret badge" to screen readers and its caption says to keep exploring.
- **Hints are shown automatically after a wrong Check.** There is nothing for a student to "open", so no badge is earned by opening hints. "Thinking it through" is earned by what they do with the hint.
- **"Hehe, again" and "Shake it off" have their caption** ("hehe", "not hehe") drawn into the picture, the only badges with writing on them. At 64 pixels on the sheet the words are tiny; the site has no larger view of a badge yet, so they read properly only in the picture file.
- **Nothing is awarded for late-night use**, since the students are 14 to 18.
- **Existing students keep what they have.** The saved record gains `pages`, `visits` and `fixes`; an older saved record without them reads as empty, and two tabs merge by union and by the larger count.

The two captioned drawings came from pictures with a solid black background, which was cut out to transparent (the white die-cut edge is kept); the cut-out was checked on the sheet but not at the edge of every curve.

Not verified: Safari and real phones, and the live league. Last-minute prayer relies on `closesAt` from the league's week data (already sent to the page); it was tested as a rule, not against the live league. The tests are in `tests/stickers.test.js`.

## Meme swaps (branch `meme-badges`, not live)

Started 2026-11-18. Ten finished meme pictures took over ten of the original badges, so the sheet stays at 31. The badge ids do not change, so what students have already earned stays; only the drawing and name change.

| Badge id | Now called | Meme | Rule |
| --- | --- | --- | --- |
| `full-marks` | An IQ too high? | the chalkboard fox | unchanged: 15 out of 15 |
| `streak-10` | Tung Tung (secret) | the wooden guard with a bat | unchanged: 10 weeks in a row, but secret |
| `comeback` | Son | "son" with the crying emoji | unchanged: miss a week, then come back |
| `second-try` | Sad second try | the grey tearful face | unchanged |
| `top-five` | Gyat | tongue out | unchanged |
| `to-the-top` | Oh god | looking up in fear | unchanged: Level 2 to Level 5** |
| `tip-collector` | Thinker | finger on the temple | unchanged: ten tips |
| `final-lap` | I guess, bro | pinching the nose | unchanged |
| `whole-exercise` | Dum | the Patrick body | unchanged |
| `checklist-done` becomes `low-cortisol` | Low cortisol | arms behind the head | **new rule:** hand in the weekly challenge in the first 48 hours of the week |

- **Checklist badge:** the self-study checklist no longer gives a badge. A student who already had it keeps one, because `legacyEarned` turns it into `low-cortisol` when the saved record is read, once, and it counts once toward "Call me". Low cortisol is the calm opposite of Last-minute prayer. It is worked out at hand-in, from `closesAt` (the week starts seven days before it).
- **Shaped stickers:** none of the ten pictures is a circle, so each badge is cut in its own shape: a rounded white die-cut border and a thin navy ring around the picture. The sheet shows it at the picture's own proportions (the sizes are in `SHAPES` in `stickers.js` and are checked against each file by a test). Until it is earned, a shaped badge shows a dashed outline of the same shape, so the slot hints at what it will be.
- **A secret streak step:** at 10 weeks the sheet shows an empty outline called "Secret badge", and the league page's note about the next badge says "A secret badge is waiting further on" instead of naming 10 weeks (`nextStreakText`). The name appears only once it is held. Shh is secret in the same way.
- **The old drawings:** the ten replaced pictures are kept as small copies in `images/fox/badge-<id>.png` (256 pixels, about 100 KB each) and drift in the home page's background with the fox stickers: four soft ones in the far layer, three in the middle, three near. Phones are unchanged (still the three stickers), and they are lazy-loaded.
- **Not verified:** Safari and real phones; the live league (low-cortisol is tested as a rule). The background was checked at 375, 768 and 1280 pixels in the app's browser, not on a slow phone.
