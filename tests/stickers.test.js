"use strict";
const test = require("node:test");
const assert = require("node:assert");
const path = require("node:path");

const S = require(path.join(__dirname, "..", "assets", "js", "stickers.js"));

test("stamps count every week that counted, and this week once it is handed in", () => {
  // Arrange
  const history = [{ week: "2026-11-02" }, { week: "2026-11-09", disqualified: true }, { week: "2026-11-16" }];

  // Act and assert
  assert.strictEqual(S.countStamps(history, "2026-11-23", false), 2);
  assert.strictEqual(S.countStamps(history, "2026-11-23", true), 3);
  assert.strictEqual(S.countStamps([], "2026-11-23", false), 0);
  assert.strictEqual(S.countStamps(undefined, "2026-11-23", true), 1);
});

test("a week already in the history is not stamped twice", () => {
  assert.strictEqual(S.countStamps([{ week: "2026-11-16" }], "2026-11-16", true), 1);
});

test("the first counted week earns the first-challenge sticker straight away", () => {
  assert.deepStrictEqual(S.leagueIds(0), []);
  assert.deepStrictEqual(S.leagueIds(1), ["league-first"]);
});

test("every second counted week earns the next sticker in the fox's school year", () => {
  assert.deepStrictEqual(S.leagueIds(2), ["league-first", "year-1"]);
  assert.deepStrictEqual(S.leagueIds(3), ["league-first", "year-1"]);
  assert.deepStrictEqual(S.leagueIds(5), ["league-first", "year-1", "year-2"]);
  assert.strictEqual(S.leagueIds(24).length, 1 + S.SERIES_LENGTH);
});

test("after twelve stickers the series starts again in gold", () => {
  const ids = S.leagueIds(28);
  assert.deepStrictEqual(ids.slice(-2), ["year-1-gold", "year-2-gold"]);
});

test("a missed week does not take away progress to the next sticker", () => {
  assert.strictEqual(S.stampsToNext(0), 2);
  assert.strictEqual(S.stampsToNext(1), 1);
  assert.strictEqual(S.stampsToNext(2), 2);
  assert.strictEqual(S.stampsToNext(7), 1);
});

test("practice stickers come from finished sets, days visited, steps read and vocab", () => {
  assert.deepStrictEqual(S.practiceIds({}), []);
  assert.deepStrictEqual(S.practiceIds({ setsDone: { a: 1 } }), ["first-set"]);
  assert.deepStrictEqual(S.practiceIds({ setsDone: { a: 4, b: 3, c: 3 } }), ["first-set", "ten-sets"]);
  assert.deepStrictEqual(S.practiceIds({ setsDone: { a: 5 } }), ["first-set", "whole-exercise"]);
  assert.deepStrictEqual(S.practiceIds({ vocabDone: true }), ["vocab"]);
  assert.deepStrictEqual(S.practiceIds({ days: [1, 2, 3, 4] }), []);
  assert.deepStrictEqual(S.practiceIds({ days: [1, 2, 3, 4, 9] }), ["five-days"]);
  assert.deepStrictEqual(S.practiceIds({ stepsRead: ["0", "1", "2", "3"] }), []);
  assert.deepStrictEqual(S.practiceIds({ stepsRead: ["0", "1", "2", "3", "4"] }), ["part-b-steps"]);
});

test("a day is counted once, and the list it was given is left alone", () => {
  const days = [10, 11];
  assert.deepStrictEqual(S.addDay(days, 11), [10, 11]);
  assert.deepStrictEqual(S.addDay(days, 12), [10, 11, 12]);
  assert.deepStrictEqual(days, [10, 11]);
});
