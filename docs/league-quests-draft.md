# Weekly quests: draft for CLY to approve

Status: **draft, not live.** Nothing here is on the site until CLY approves the content.
Applies to both leagues (S.3 and S.4). The timed weekly challenge is never changed or delayed by quests.

## The rules (approved 2026-11-18)

- Three quests each week, from four kinds. **Fix last week's mistakes** is always one of them; the other two rotate.
- The league marks every quest. A quest needs a pass mark; a wrong answer gets a hint, never the answer.
- Quests earn **shields** and **class points** only. They never change a student's score, place or league points.
- Every third quest finished earns a shield. A student holds two at most.
- A shield is used by itself on a missed week. The streak carries on, but that week earns no stamp and adds no week.
- A shield earned in a week only covers later weeks.
- Class points: each quest a student finishes adds to their class's quest total, shown beside the class table.

Built so far (branch `league-quests`): the shield rule `shieldedStreak()` in `apps-script/Logic.gs`, with tests.

## The four kinds

### 1. Fix last week's mistakes (every week)

The student answers again every blank or line they got wrong in last week's challenge. No time limit.
- **Pass:** every one right. After two wrong tries on the same item, the hint names the rule ("This blank needs a passive: the exams are held by someone else").
- **No mistakes, or didn't play last week:** the five hardest items from last week (the ones most students missed).
- **Why it works:** the student goes back to their own errors, which is where the marks are.

### 2. Proofreading sprint

Eight lines, five mistakes, five minutes. Tap the line, then type the correction.
- **Pass:** four of the five mistakes found and corrected, with no correct line "fixed".
- **Retry:** a new passage after a failed try, so the answers can't be memorised.

### 3. Words of the week

A new paragraph with six gaps, using the six words of the day from that week. The first letter is given.
- **Pass:** five of six, spelt exactly.
- **Why it works:** the words come back in a new context, so it isn't recognition but recall.

### 4. Level-up ladder

One Level 3 sentence and two rungs. At each rung, choose the better rewrite from three, then tick the reason it is better.
- **Pass:** both rungs right, rewrite and reason. A right rewrite with the wrong reason counts as wrong.
- **Why it works:** the reason is the lesson; a guess on the rewrite alone doesn't pass.

## Sample week for S.4 (week of 23 November 2026), for CLY to check

### Proofreading sprint: "Our class trip"

1. Last Friday, our class go to the Hong Kong Wetland Park. → *went*
2. We took the MTR to Tin Shui Wai and walked from the station.
3. Our teacher told us to keep quiet so that we would not frighten the birds.
4. I have never seen so much birds in one place. → *many*
5. One of my classmates were very excited when she saw a kingfisher. → *was*
6. We spent an hour in the hide, watching the mudflats.
7. After lunch, we visited the exhibition about the climate change. → *about climate change*
8. Everyone agreed that it was the most interesting trip we have ever went on. → *have ever been on*

Lines 2, 3 and 6 are correct.

### Words of the week

The six gaps use that week's six words of the day. Shape only (example words, not the real list):

> The new library has been a great (b) … *benefit* to students who have no quiet place to study. It is open until ten, which is a real (a) … *advantage* during the exam period. …

CLY approves each week's paragraph once its words are fixed.

### Level-up ladder

Level 3: *"Homework is bad for students."*

Rung 1 (to Level 5), choose the better rewrite:
- a) Homework is very bad for students.
- b) **Too much homework leaves students with no time to rest.** ✓
- c) Homework is not good for students at all.

Why is it better? ☐ It is longer · ☑ **It says how homework is bad** · ☐ It uses "too much"

Rung 2 (to 5**), choose the better rewrite:
- a) **When an S4 student finishes worksheets at midnight, the next morning's first lesson is already lost.** ✓
- b) Homework is extremely harmful to the health of students in Hong Kong.
- c) Many students think that homework is a big problem nowadays.

Why is it better? ☐ It uses a harder word · ☑ **It shows the cost in a scene the reader can see** · ☐ It mentions Hong Kong

## Questions for CLY

1. Are the four kinds and their pass marks right? **Yes, as drafted (CLY, 2026-11-18).**
2. Should S.3's quests be the same kinds, with easier passages? **Yes (CLY, 2026-11-18).**
3. May the league reuse last week's five hardest items for students with nothing to fix? **Yes (CLY, 2026-11-18).**
