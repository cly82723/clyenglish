# Weekly Grammar Challenge

Agreed with the user on 2026-10-28. This is the spec for the S.4 weekly grammar league.

## What students do

- A new page, `challenge.html`, linked from the grammar page's Practice section and the S.4 card on the home page.
- One challenge a week, alternating format: week 1 cloze, week 2 proofreading, and so on.
  - **Cloze**: 15 blanks and a word box of 18 verbs (15 used once each, 3 distractors). A blank is right only when the verb and its form are both right, marked with the same forgiving rules as the practice cloze (`bothNegatives`, `normalise`).
  - **Proofreading**: 15 lines, about 11–12 with a mistake. One mark per line; every line needs a mark: a fix, or “No mistake” (sent as `{ type: "ok" }`). A line with no mark scores nothing, even when it is correct. Same marker format and `isRightLine` rule as the practice proofreading.
- 15 marks maximum. One submission, no hints, a 20-minute limit with auto-submit when time runs out.
- A week runs Monday 00:00 to Sunday 23:59, Hong Kong time, every week of the season including holidays. The page says so clearly.

## Who can enter

- S.4 students on the teacher's class list only (Students tab: school email, class, class number). One attempt per student per week.
- Sign-in (changed 2026-10-28, so the school is not involved): the student types their school email and gets a 6-digit code by email. The code lasts 10 minutes and allows 5 tries. At most one code a minute and 5 an hour per student. The right code gives that device a sign-in token until it signs out or the data is wiped.
- Fallback if student mailboxes don't accept mail from outside the school: a personal code per student, given out on printed slips.

## Ranking

- Each week is ranked by score, with time taken breaking ties.
- League points: 1st 3, 2nd 2, 3rd 1.
- Students level on points at the end of the season are joint winners, so there may be more than three prize-winners.
- The season ends on the date the teacher types into the sheet's "Season" tab; the standings freeze then.

## What students see

- A live weekly board showing the top three places by class-number (e.g. "4C-12"), score and time, plus the student's own row, and how many took part. Other students' scores are never shown (changed 2026-10-28, so weaker students aren't exposed).
- The season league table: everyone with points, plus the student's own row.
- Their own personal best and weekly rank, visible only to them.
- During the week they see only their score. Answers and explanations appear after the week closes.

## Switching tab or app

- Detected with the page visibility API. Switches under 3 seconds are ignored; longer ones are counted and flagged in the sheet.
- Nobody is disqualified automatically; the teacher decides.
- The start screen warns that leaving the page is recorded.

## Behind the scenes

- A Google Sheet and Apps Script web app owned by the teacher's personal Gmail. Codes are sent from it with MailApp (about 100 a day).
- The script checks the sign-in token on every request (the sheet stores only its SHA-256 hash), holds the answer keys and marks every submission, so answers never ship in the page.
- A notice on the page about stored data (school email, class, number, results). All data is deleted by 31 August each year.

## Each week

- Every Thursday a scheduled routine drafts next week's challenge in the format due, opens it as a GitHub issue on `cly82723/clyenglish`, and emails a reminder to the teacher.
- If the teacher has not approved it by Sunday night, an approved backup goes live. The bank holds 2 backups of each format.

## Teacher's one-off setup

1. Check that an email from the personal Gmail reaches a student's school inbox.
2. Set up the Sheet and web app (`apps-script/README.md`) and paste in the class list.
3. Approve the first challenge and the four backup sets.

## The S.3 league

Agreed with the user on 2026-10-31. Everything above applies, with its own Sheet and web app, page (`s3-challenge.html`) and sign-in, so the two leagues don't touch. Different for S.3:

- **Season**: Monday 2 November 2026 to Sunday 10 January 2027.
- **What's tested**: Units 1–3. From the week of 7 December, each set also includes at least one Unit 4 topic. The page lists the topics from `topics` in `s3-challenge.html`; a new topic goes there and in `S3_TOPICS` in `tools/challenge-bank.js`.
- **Each set**: at most 3 grammar topics, and natural passages come first. Tenses count as one topic (no perfect continuous and no passive; negatives stay in). Present and past participles count as one topic.
- **Cloze**: grammar items only. The word box, shown as a table, holds the verbs and noun phrases, plus 3 distractors, to cross off. When a set tests indefinite pronouns, so/so that/so as to, must/have to/need to or linking words, the box also shows the whole group for that topic (`RANGES` in `assets/js/word-box.js`), never just the answers: students choose the word, can use it more than once, and every correct choice is accepted. How the paper works, with worked examples, shows before Start now, so reading it costs no time. A Box button in the clock bar opens the box over the passage and it stays open while typing. S.4's cloze has the same Box button and growing blanks. `s3-grammar.html#practice-cloze` is the same kind of paper with no clock. Blanks start short and grow as the student types. Indefinite pronouns come only from: somebody, someone, no one, nobody, everyone, everybody, everything, something, anyone, anybody, anything, nothing. A so or so that blank is written so that only one of them fits. Linking words may appear in either format. A negative means not or n't, never "never". A blank with `commas: true` also marks its commas, for noun phrases: a phrase in the box is typed with any commas it needs. A reminder shows on those weeks. Every blank is wider, so its width gives nothing away.
- **Proofreading**: commas are ignored, as in S.4. Of the 11–12 mistakes, 1–2 may be natural English (agreement, collocation, phrasal verbs), tagged `Natural English`, outside the 3 topics.
- **Each week**: a separate routine drafts the set on Thursdays and emails it with the subject "CLY S.3 League draft". The private bank is `cly-league-bank\s3`, checked with `node tools/challenge-bank.js <folder> s3`.
