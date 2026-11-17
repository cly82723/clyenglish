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
    earned: { climber: 11, "first-set": 10 }, days: [10, 11], steps: ["Step 0", "Step 1"], final: ["a", "b"], tips: [1, 2], streak: { n: 3, ends: 200 }
  });
  assert.deepStrictEqual(S.merge({ ...mine, streak: null }, saved).streak, { n: 2, ends: 100 });
  assert.deepStrictEqual(mine.days, [10]);
});
