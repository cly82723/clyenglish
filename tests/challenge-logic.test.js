// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert");
const L = require("../apps-script/Logic.gs");

const cloze = {
  format: "cloze", title: "T",
  blanks: { 1: { verb: "hold", answers: ["are held"] }, 2: { verb: "give", answers: ["aren't given"] } },
  paragraphs: [["The exams ", 1, " in May and we ", 2, " enough time."]],
  distractors: ["swim"]
};
const proof = {
  format: "proofreading", title: "P",
  lines: [["I [[am>have]] been so busy."], ["Our teacher is kind."], ["He made me [[to>]] stand up."], ["She is in charge [[>of]] the club."]]
};

test("weekId gives the Monday in Hong Kong time", () => {
  assert.strictEqual(L.weekId(Date.parse("2026-11-04T12:00:00+08:00")), "2026-11-02");
  assert.strictEqual(L.weekId(Date.parse("2026-11-08T23:59:00+08:00")), "2026-11-02");
  // Sunday 16:30 UTC is already Monday 00:30 in Hong Kong
  assert.strictEqual(L.weekId(Date.parse("2026-11-08T16:30:00Z")), "2026-11-09");
});

test("a week closes at Monday 00:00 Hong Kong time", () => {
  assert.strictEqual(L.isClosed("2026-11-02", Date.parse("2026-11-08T23:59:59+08:00")), false);
  assert.strictEqual(L.isClosed("2026-11-02", Date.parse("2026-11-09T00:00:00+08:00")), true);
});

test("formats alternate from the season start, cloze first", () => {
  assert.strictEqual(L.formatDue("2026-11-04", "2026-11-02"), "cloze");
  assert.strictEqual(L.formatDue("2026-11-04", "2026-11-09"), "proofreading");
  assert.strictEqual(L.formatDue("2026-11-04", "2026-11-16"), "cloze");
});

test("cloze accepts the same spellings as practice", () => {
  const r = L.markCloze(cloze, { 1: "Are held", 2: "are not given" });
  assert.strictEqual(r.score, 2);
  assert.strictEqual(L.markCloze(cloze, { 1: "held", 2: "arent given" }).score, 1);
  assert.strictEqual(L.markCloze(cloze, {}).score, 0);
});

test("proofreading scores fixes and untouched correct lines", () => {
  const answers = { 0: { type: "replace", at: 1, word: "have" }, 2: { type: "delete", at: 3 }, 3: { type: "insert", at: 4, word: "of" } };
  assert.strictEqual(L.markProofreading(proof, answers).score, 4);
  assert.strictEqual(L.markProofreading(proof, {}).score, 1);
});

test("proofreading: changing a correct line loses its mark, junk counts as untouched", () => {
  assert.strictEqual(L.markProofreading(proof, { 1: { type: "delete", at: 3 } }).right[1], false);
  assert.strictEqual(L.markProofreading(proof, { 1: { type: "replace", at: 99, word: "x" } }).right[1], true);
});

test("public challenge holds no answers", () => {
  const c = JSON.stringify(L.publicChallenge(cloze));
  assert.ok(!c.includes("are held"));
  assert.deepStrictEqual(L.publicChallenge(cloze).bank, ["give", "hold", "swim"]);
  const p = L.publicChallenge(proof);
  assert.deepStrictEqual(p.lines[0], ["I", "am", "been", "so", "busy."]);
  assert.ok(!/am>have|to>|>of/.test(JSON.stringify(p)));
});

test("weekly ranking: score, then time; exact ties share points", () => {
  const ranked = L.rankWeek([
    { key: "4A-1", score: 12, timeMs: 500 }, { key: "4A-2", score: 14, timeMs: 900 },
    { key: "4A-3", score: 12, timeMs: 400 }, { key: "4A-4", score: 12, timeMs: 400 }, { key: "4A-5", score: 3, timeMs: 1 }
  ]);
  assert.deepStrictEqual(ranked.map(a => [a.key, a.place, a.points]),
    [["4A-2", 1, 3], ["4A-3", 2, 2], ["4A-4", 2, 2], ["4A-1", 4, 0], ["4A-5", 5, 0]]);
});

test("league: points add up and level points are joint", () => {
  const table = L.leagueTable({
    w1: [{ key: "A", place: 1, points: 3 }, { key: "B", place: 2, points: 2 }, { key: "C", place: 3, points: 1 }],
    w2: [{ key: "B", place: 1, points: 3 }, { key: "A", place: 2, points: 2 }, { key: "D", place: 4, points: 0 }]
  });
  assert.deepStrictEqual(table.map(r => [r.key, r.points, r.place]), [["A", 5, 1], ["B", 5, 1], ["C", 1, 3], ["D", 0, 4]]);
});

test("time taken is capped at the limit", () => {
  assert.strictEqual(L.timeTaken(1000, 5000, 20 * 60000), 4000);
  assert.strictEqual(L.timeTaken(0, 30 * 60000, 20 * 60000), 20 * 60000);
});
