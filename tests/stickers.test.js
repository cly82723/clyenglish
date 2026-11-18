"use strict";
const test = require("node:test");
const assert = require("node:assert");
const path = require("node:path");

const S = require(path.join(__dirname, "..", "assets", "js", "stickers.js"));
const week = (id, score, points) => ({ week: id, score, points: points || 0 });

test("counted weeks leave out disqualified ones and add this week once it is handed in", () => {
  // Arrange
  const history = [week("2026-11-09", 9), { week: "2026-11-02", disqualified: true }, week("2026-10-26", 7, 3)];

  // Act
  const before = S.countedWeeks(history, "2026-11-16", null);
  const after = S.countedWeeks(history, "2026-11-16", { score: 12 });

  // Assert
  assert.deepStrictEqual(before.map((w) => w.week), ["2026-10-26", "2026-11-09"]);
  assert.deepStrictEqual(after[2], { week: "2026-11-16", score: 12, points: 0 });
  assert.strictEqual(S.countedWeeks(undefined, "2026-11-16", null).length, 0);
});

test("a week already in the history is not counted twice", () => {
  assert.strictEqual(S.countedWeeks([week("2026-11-16", 9)], "2026-11-16", { score: 9 }).length, 1);
});

test("the first counted week earns the first-challenge badge and nothing else", () => {
  assert.deepStrictEqual(S.leagueIds([]), []);
  assert.deepStrictEqual(S.leagueIds([week("2026-11-02", 8)]), ["first-challenge"]);
});

test("a missed week followed by a challenge is a comeback", () => {
  assert.ok(!S.leagueIds([week("2026-11-02", 8), week("2026-11-09", 8)]).includes("comeback"));
  assert.ok(S.leagueIds([week("2026-11-02", 8), week("2026-11-16", 8)]).includes("comeback"));
});

test("climber is a higher score than the week before; personal best needs two earlier weeks to beat", () => {
  const two = S.leagueIds([week("2026-11-02", 8), week("2026-11-09", 10)]);
  assert.ok(two.includes("climber"));
  assert.ok(!two.includes("personal-best"));
  const three = S.leagueIds([week("2026-11-02", 10), week("2026-11-09", 8), week("2026-11-16", 11)]);
  assert.ok(three.includes("personal-best"));
  const notBest = S.leagueIds([week("2026-11-02", 10), week("2026-11-09", 8), week("2026-11-16", 10)]);
  assert.ok(notBest.includes("climber"));
  assert.ok(!notBest.includes("personal-best"));
});

test("full marks again counts as a personal best, since 15 out of 15 can't be beaten", () => {
  const again = S.leagueIds([week("2026-11-02", 15), week("2026-11-09", 12), week("2026-11-16", 15)]);
  assert.ok(again.includes("personal-best"));
  // but not before the third week, as for any personal best
  assert.ok(!S.leagueIds([week("2026-11-02", 15), week("2026-11-09", 15)]).includes("personal-best"));
});

test("full marks and a top-five finish are read from the score and the points", () => {
  assert.ok(S.leagueIds([week("2026-11-02", 15)]).includes("full-marks"));
  assert.ok(!S.leagueIds([week("2026-11-02", 14)]).includes("full-marks"));
  assert.ok(S.leagueIds([week("2026-11-02", 9, 2)]).includes("top-five"));
  assert.ok(!S.leagueIds([week("2026-11-02", 9, 0)]).includes("top-five"));
});

test("one streak badge is held at a time, by weeks in a row", () => {
  assert.strictEqual(S.streakId(0), null);
  assert.strictEqual(S.streakId(1), "streak-alive");
  assert.strictEqual(S.streakId(4), "streak-alive");
  assert.strictEqual(S.streakId(5), "streak-5");
  assert.strictEqual(S.streakId(9), "streak-5");
  assert.strictEqual(S.streakId(10), "streak-10");
  assert.strictEqual(S.streakId(15), "streak-15");
  assert.strictEqual(S.streakId(40), "streak-15");
});

test("weeks to the next streak badge count down to 5, 10 and 15", () => {
  assert.deepStrictEqual([0, 3, 5, 9, 10, 14, 15, 20].map(S.weeksToNextStreak), [5, 2, 5, 1, 5, 1, 0, 0]);
});

test("a streak stays alive to the end of the next week the student can still hand in", () => {
  const monday = Date.parse("2026-11-16T00:00:00Z"), day = 864e5;
  assert.strictEqual(S.streakEnds("2026-11-16", false), monday + 7 * day);
  assert.strictEqual(S.streakEnds("2026-11-16", true), monday + 14 * day);
});

test("days in a row are found whatever order they were saved in", () => {
  assert.strictEqual(S.hasRun([3, 1, 2], 3), true);
  assert.strictEqual(S.hasRun([1, 2, 4, 5], 3), false);
  assert.strictEqual(S.hasRun([1, 1, 2, 2, 3], 3), true);
  assert.strictEqual(S.hasRun([], 3), false);
});

test("a guide is read once every one of its rows has been opened, and only its own rows count", () => {
  const rows = ["choose", "method", "crei", "language", "check"];
  assert.ok(!S.allRead(["choose", "method", "crei", "language"], rows));
  assert.ok(S.allRead(["check", "choose", "language", "method", "crei"], rows));
  // steps saved under the old contents list, or rows from another page, don't make up the number
  assert.ok(!S.allRead(["0", "1", "2", "3", "choose"], rows));
  // a page with no rows is never "read"
  assert.ok(!S.allRead(["choose"], []));
});

test("Part B's five steps and the S.6 final reminders are the rows those pages really have", () => {
  const fs = require("node:fs"), path = require("node:path");
  const rowsOf = (file) => [...fs.readFileSync(path.join(__dirname, "..", file), "utf8").matchAll(/<details class="row" id="([^"]+)"/g)].map((m) => m[1]);
  assert.strictEqual(rowsOf("part-b.html").length, 5);
  assert.ok(rowsOf("final.html").length > 0);
});

test("the line about badges is for new students: their first four days, until they tap it", () => {
  assert.ok(S.isNewStudent([1], false));
  assert.ok(S.isNewStudent([1, 2, 3, 4], false));
  assert.ok(!S.isNewStudent([1, 2, 3, 4, 5], false));
  assert.ok(!S.isNewStudent([1], true));
});

test("practice badges come from finished sets, days visited and tips seen", () => {
  assert.deepStrictEqual(S.practiceIds({}), []);
  assert.deepStrictEqual(S.practiceIds({ setsDone: { a: 1 } }), ["first-set"]);
  assert.deepStrictEqual(S.practiceIds({ setsDone: { a: 4, b: 3, c: 3 } }), ["first-set", "ten-sets"]);
  assert.deepStrictEqual(S.practiceIds({ setsDone: { a: 5 } }), ["first-set", "whole-exercise"]);
  assert.deepStrictEqual(S.practiceIds({ days: [1, 3, 5, 7] }), []);
  assert.deepStrictEqual(S.practiceIds({ days: [1, 3, 5, 7, 9] }), ["five-days"]);
  assert.deepStrictEqual(S.practiceIds({ days: [4, 5, 6] }), ["three-in-a-row"]);
  assert.deepStrictEqual(S.practiceIds({ tips: [1, 2, 3, 4, 5, 6, 7, 8, 9] }), []);
  assert.deepStrictEqual(S.practiceIds({ tips: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }), ["tip-collector"]);
});

test("an item is added once, and the list it was given is left alone", () => {
  const days = [10, 11];
  assert.deepStrictEqual(S.addOnce(days, 11), [10, 11]);
  assert.deepStrictEqual(S.addOnce(days, 12), [10, 11, 12]);
  assert.deepStrictEqual(days, [10, 11]);
});

test("what another tab saved is kept when this tab saves, and the later streak wins", () => {
  // Arrange
  const mine = { earned: { "first-set": 10 }, days: [10], steps: ["Step 0"], final: ["a"], tips: [1], streak: { n: 3, ends: 200 } };
  const saved = { earned: { climber: 11 }, days: [10, 11], steps: ["Step 1"], final: ["b"], tips: [2], streak: { n: 2, ends: 100 } };

  // Act
  const both = S.merge(mine, saved);

  // Assert
  assert.deepStrictEqual(both, {
    earned: { climber: 11, "first-set": 10 }, days: [10, 11], steps: ["Step 0", "Step 1"], final: ["a", "b"], tips: [1, 2], streak: { n: 3, ends: 200 }, pages: [], visits: 0, fixes: 0
  });
  assert.deepStrictEqual(S.merge({ ...mine, streak: null }, saved).streak, { n: 2, ends: 100 });
  assert.deepStrictEqual(mine.days, [10]);
});

/* ---------- The meme badges ---------- */

test("hehe-again: handing in two weeks running, with no gap between them", () => {
  assert.ok(!S.leagueIds([week("2026-11-02", 8)]).includes("hehe-again"));
  assert.ok(S.leagueIds([week("2026-11-02", 8), week("2026-11-09", 8)]).includes("hehe-again"));
  // a missed week in between is not two in a row
  assert.ok(!S.leagueIds([week("2026-11-02", 8), week("2026-11-16", 8)]).includes("hehe-again"));
});

test("shake-it-off: a lower score than the week before, then the very next week handed in", () => {
  const dipThenNext = S.leagueIds([week("2026-11-02", 10), week("2026-11-09", 6), week("2026-11-16", 6)]);
  assert.ok(dipThenNext.includes("shake-it-off"));
  // the same score is not a dip
  assert.ok(!S.leagueIds([week("2026-11-02", 10), week("2026-11-09", 10), week("2026-11-16", 10)]).includes("shake-it-off"));
  // a dip with nothing handed in afterwards earns nothing yet
  assert.ok(!S.leagueIds([week("2026-11-02", 10), week("2026-11-09", 6)]).includes("shake-it-off"));
  // a missed week after the dip is a comeback, not this badge
  assert.ok(!S.leagueIds([week("2026-11-02", 10), week("2026-11-09", 6), week("2026-11-23", 8)]).includes("shake-it-off"));
});

test("last-minute: handed in during the last 24 hours before the week closes, and not after it", () => {
  const closes = Date.parse("2026-11-23T00:00:00Z"), hour = 36e5;
  assert.strictEqual(S.lastMinute(closes, closes - 2 * hour), true);
  assert.strictEqual(S.lastMinute(closes, closes - 24 * hour), true);
  assert.strictEqual(S.lastMinute(closes, closes - 25 * hour), false);
  assert.strictEqual(S.lastMinute(closes, closes + hour), false);
  assert.strictEqual(S.lastMinute(undefined, closes), false);
});

test("potato, sniffer, thinking and six-seven come from sets, pages, fixes and visits", () => {
  assert.ok(!S.practiceIds({ setsDone: { a: 12, b: 12 } }).includes("potato"));
  assert.ok(S.practiceIds({ setsDone: { a: 12, b: 13 } }).includes("potato"));
  assert.ok(!S.practiceIds({ pages: ["a", "b", "c", "d", "e", "f", "g"] }).includes("sniffer"));
  assert.ok(S.practiceIds({ pages: ["a", "b", "c", "d", "e", "f", "g", "h"] }).includes("sniffer"));
  assert.ok(!S.practiceIds({ fixes: 4 }).includes("thinking"));
  assert.ok(S.practiceIds({ fixes: 5 }).includes("thinking"));
  assert.ok(!S.practiceIds({ visits: 66 }).includes("six-seven"));
  assert.ok(S.practiceIds({ visits: 67 }).includes("six-seven"));
});

test("call-me: ten other badges earned, and the badge itself is not one of the ten", () => {
  const nine = Object.fromEntries(["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((id) => [id, 1]));
  assert.deepStrictEqual(S.collectorIds(nine), []);
  assert.deepStrictEqual(S.collectorIds({ ...nine, j: 1 }), ["call-me"]);
  assert.deepStrictEqual(S.collectorIds({ ...nine, "call-me": 1 }), []);
});

test("a page is named the same whatever way it was opened", () => {
  assert.strictEqual(S.pageName("/cly-english-v2/grammar.html"), "grammar");
  assert.strictEqual(S.pageName("/cly-english-v2/grammar"), "grammar");
  assert.strictEqual(S.pageName("/"), "index");
  assert.strictEqual(S.pageName("/cly-english-v2/"), "index");
  assert.strictEqual(S.pageName("/cly-english-v2/index.html"), "index");
});

test("visits, pages and fixes from two tabs are merged by union and by the larger count", () => {
  const a = { earned: {}, days: [], steps: [], final: [], tips: [], streak: null, pages: ["grammar"], visits: 4, fixes: 2 };
  const b = { earned: {}, days: [], steps: [], final: [], tips: [], streak: null, pages: ["index"], visits: 6, fixes: 1 };
  const both = S.merge(a, b);
  assert.deepStrictEqual(both.pages, ["grammar", "index"]);
  assert.strictEqual(both.visits, 6);
  assert.strictEqual(both.fixes, 2);
});

test("every meme badge has a picture, a name and a way to earn it in the badge list", () => {
  const fs = require("node:fs"), path = require("node:path");
  const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "stickers.js"), "utf8");
  for (const id of ["hehe-again", "shake-it-off", "shh", "last-minute", "saved-it", "potato", "call-me", "thinking", "sniffer", "six-seven"]) {
    assert.ok(src.includes('["' + id + '",'), id + " is in the badge list");
    assert.ok(fs.existsSync(path.join(__dirname, "..", "images", "stickers", id + ".png")), id + ".png exists");
  }
});

/* ---------- The meme swaps: early hand-in, secret steps, shaped stickers ---------- */

test("low-cortisol: handed in during the first 48 hours of the week, and not after", () => {
  const day = 864e5, closes = Date.parse("2026-11-23T00:00:00Z"), starts = closes - 7 * day;
  assert.strictEqual(S.earlyHandIn(closes, starts + 1), true);
  assert.strictEqual(S.earlyHandIn(closes, starts + 2 * day), true);
  assert.strictEqual(S.earlyHandIn(closes, starts + 2 * day + 1), false);
  assert.strictEqual(S.earlyHandIn(closes, closes - 3 * 36e5), false);
  // before the week has started, or with no closing time, is not early
  assert.strictEqual(S.earlyHandIn(closes, starts - 1), false);
  assert.strictEqual(S.earlyHandIn(undefined, starts), false);
});

test("a student who ticked the whole checklist keeps a badge: it becomes low-cortisol, once, and counts once", () => {
  const before = { "checklist-done": 20700, "first-set": 20701 };
  const after = S.legacyEarned(before);
  assert.deepStrictEqual(after, { "low-cortisol": 20700, "first-set": 20701 });
  // the list it was given is left alone, and a badge already earned is not written over
  assert.deepStrictEqual(before, { "checklist-done": 20700, "first-set": 20701 });
  assert.deepStrictEqual(S.legacyEarned({ "checklist-done": 20700, "low-cortisol": 20800 }), { "low-cortisol": 20800 });
  assert.deepStrictEqual(S.legacyEarned({ "first-set": 1 }), { "first-set": 1 });
});

test("the ten-week streak step is a secret: the note about the next badge never names it", () => {
  assert.ok(S.secret.includes("streak-10"));
  assert.strictEqual(S.nextStreakText(3), "2 more weeks in a row for the 5-week badge.");
  assert.strictEqual(S.nextStreakText(4), "1 more week in a row for the 5-week badge.");
  for (const n of [5, 6, 9]) {
    const note = S.nextStreakText(n);
    assert.ok(!/10/.test(note), "week " + n + " does not give the secret away: " + note);
    assert.ok(/secret/i.test(note));
  }
  assert.strictEqual(S.nextStreakText(10), "5 more weeks in a row for the 15-week badge.");
  assert.strictEqual(S.nextStreakText(15), "That is the top streak badge.");
});

test("a badge drawn in its picture's own shape is listed with that shape, and the shape is the file's", () => {
  const fs = require("node:fs"), path = require("node:path");
  const ids = Object.keys(S.shapes);
  assert.ok(ids.length >= 10, "the ten memes are shaped");
  for (const id of ids) {
    const png = fs.readFileSync(path.join(__dirname, "..", "images", "stickers", id + ".png"));
    const wide = png.readUInt32BE(16), high = png.readUInt32BE(20);
    assert.deepStrictEqual(S.shapes[id], [wide, high], id + " is " + wide + "x" + high);
    assert.ok(Math.max(wide, high) <= 512, id + " is no larger than 512");
  }
});

test("the swapped badges keep their ids, so what students already earned stays", () => {
  const fs = require("node:fs"), path = require("node:path");
  const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "stickers.js"), "utf8");
  for (const id of ["full-marks", "streak-10", "comeback", "second-try", "top-five", "to-the-top", "tip-collector", "final-lap", "whole-exercise", "low-cortisol"]) {
    assert.ok(src.includes('["' + id + '",'), id + " is in the badge list");
    assert.ok(S.shapes[id], id + " is drawn in its picture's shape");
  }
  assert.ok(!src.includes('["checklist-done",'), "the checklist badge is gone from the list");
});

test("the secret list is the two secret badges, and each of them has a hint in the badge list", () => {
  const fs = require("node:fs"), path = require("node:path");
  const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "stickers.js"), "utf8");
  assert.deepStrictEqual(S.secret, ["streak-10", "shh"]);
  assert.match(src, /\["streak-10", "Tung Tung", [^\]]*"A secret\. [^\]]*"\]/);
  assert.match(src, /\["shh", "Shh", [^\]]*"A secret\. [^\]]*"\]/);
  assert.ok(!src.includes('"10 weeks in a row"'), "the secret step never names itself as 10 weeks");
});
