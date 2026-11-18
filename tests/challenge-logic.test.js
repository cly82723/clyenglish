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

test("proofreading scores fixes and lines marked \"No mistake\"; a line left blank scores nothing", () => {
  const answers = { 0: { type: "replace", at: 1, word: "have" }, 2: { type: "delete", at: 3 }, 3: { type: "insert", at: 4, word: "of" } };
  assert.strictEqual(L.markProofreading(proof, answers).score, 3);
  assert.strictEqual(L.markProofreading(proof, Object.assign({ 1: { type: "ok" } }, answers)).score, 4);
  assert.strictEqual(L.markProofreading(proof, {}).score, 0);
  assert.strictEqual(L.markProofreading(proof, {}).right[1], false, "a correct line left blank is not right");
});

test("proofreading: changing a correct line loses its mark, and so does junk", () => {
  assert.strictEqual(L.markProofreading(proof, { 1: { type: "delete", at: 3 } }).right[1], false);
  assert.strictEqual(L.markProofreading(proof, { 1: { type: "replace", at: 99, word: "x" } }).right[1], false);
});

test("proofreading: \"No mistake\" is right only on a correct line", () => {
  const ok = { type: "ok" }, all = {};
  proof.lines.forEach((_, i) => { all[i] = ok; });
  const correctLines = proof.lines.filter(l => !/\[\[/.test(l[0])).length;
  assert.strictEqual(L.markProofreading(proof, all).score, correctLines);
  assert.strictEqual(L.markProofreading(proof, { 1: ok }).right[1], true);
  assert.strictEqual(L.markProofreading(proof, { 0: ok }).right[0], false);
});

test("proofreading accepts a line's other listed fixes, and nothing else", () => {
  const p = Object.assign({}, proof, { alsoRight: { 3: ["She is in charge for the club."] } });
  const add = word => L.markProofreading(p, { 3: { type: "insert", at: 4, word } }).right[3];
  assert.deepStrictEqual([add("of"), add("for"), add("with")], [true, true, false]);
  assert.strictEqual(L.markProofreading(proof, { 3: { type: "insert", at: 4, word: "for" } }).right[3], false);
});

test("public challenge holds no answers", () => {
  const c = JSON.stringify(L.publicChallenge(cloze));
  assert.ok(!c.includes("are held"));
  assert.deepStrictEqual(L.publicChallenge(cloze).bank, ["give", "hold", "swim"]);
  const p = L.publicChallenge(proof);
  assert.deepStrictEqual(p.lines[0], ["I", "am", "been", "so", "busy."]);
  assert.ok(!/am>have|to>|>of/.test(JSON.stringify(p)));
});

test("weekly ranking: score, then time; the top five get 5 to 1 points; exact ties share points", () => {
  const ranked = L.rankWeek([
    { key: "4A-1", score: 12, timeMs: 500 }, { key: "4A-2", score: 14, timeMs: 900 },
    { key: "4A-3", score: 12, timeMs: 400 }, { key: "4A-4", score: 12, timeMs: 400 }, { key: "4A-5", score: 3, timeMs: 1 },
    { key: "4A-6", score: 10, timeMs: 100 }, { key: "4A-7", score: 9, timeMs: 100 }
  ]);
  assert.deepStrictEqual(ranked.map(a => [a.key, a.place, a.points]),
    [["4A-2", 1, 5], ["4A-3", 2, 4], ["4A-4", 2, 4], ["4A-1", 4, 2], ["4A-6", 5, 1], ["4A-7", 6, 0], ["4A-5", 7, 0]]);
});

test("the gap to the place above: marks behind, or seconds behind on the same score; none in first place", () => {
  const ranked = L.rankWeek([
    { key: "A", score: 14, timeMs: 400000 }, { key: "B", score: 12, timeMs: 500000 },
    { key: "C", score: 12, timeMs: 512400 }, { key: "D", score: 12, timeMs: 512400 }, { key: "E", score: 9, timeMs: 100000 }
  ]);
  assert.strictEqual(L.gapAbove(ranked, "A"), null);
  assert.deepStrictEqual(L.gapAbove(ranked, "B"), { place: 1, marks: 2, seconds: 0 });
  assert.deepStrictEqual(L.gapAbove(ranked, "C"), { place: 2, marks: 0, seconds: 12 });
  // level with C, so the place above is still 2nd, not C
  assert.deepStrictEqual(L.gapAbove(ranked, "D"), { place: 2, marks: 0, seconds: 12 });
  assert.deepStrictEqual(L.gapAbove(ranked, "E"), { place: 3, marks: 3, seconds: 0 });
  assert.strictEqual(L.gapAbove(ranked, "nobody"), null);
});

test("the class table: every student counts, those who haven't taken part as 0; level averages share a place", () => {
  const students = [
    { key: "a1", cls: "4A" }, { key: "a2", cls: "4A" }, { key: "a3", cls: "4A" }, { key: "a4", cls: "4A" },
    { key: "b1", cls: "4B" }, { key: "b2", cls: "4B" },
    { key: "c1", cls: "4C" }, { key: "c2", cls: "4C" }
  ];
  const ranked = [{ key: "a1", score: 15 }, { key: "a2", score: 13 }, { key: "b1", score: 8 }, { key: "b2", score: 6 }, { key: "c1", score: 14 }];
  assert.deepStrictEqual(L.classTable(students, ranked).map(c => [c.cls, c.took, c.size, c.average, c.place]),
    [["4A", 2, 4, 7, 1], ["4B", 2, 2, 7, 1], ["4C", 1, 2, 7, 1]]);
  const more = ranked.concat([{ key: "c2", score: 10 }]);
  assert.deepStrictEqual(L.classTable(students, more).map(c => [c.cls, c.average, c.place]), [["4C", 12, 1], ["4A", 7, 2], ["4B", 7, 2]]);
});

test("league: points add up and level points are joint", () => {
  const table = L.leagueTable({
    w1: [{ key: "A", place: 1, points: 5 }, { key: "B", place: 2, points: 4 }, { key: "C", place: 3, points: 3 }],
    w2: [{ key: "B", place: 1, points: 5 }, { key: "A", place: 2, points: 4 }, { key: "D", place: 6, points: 0 }]
  });
  assert.deepStrictEqual(table.map(r => [r.key, r.points, r.place]), [["A", 9, 1], ["B", 9, 1], ["C", 3, 3], ["D", 0, 4]]);
});

test("league: 4th and 5th places are counted and order the table after 1st to 3rd", () => {
  // All on 4 points, so all share 1st place; the order goes by 3rds, then 4ths, then 5ths.
  const table = L.leagueTable({
    w1: [{ key: "B", place: 4, points: 2 }, { key: "A", place: 5, points: 1 }, { key: "C", place: 5, points: 1 }],
    w2: [{ key: "B", place: 4, points: 2 }, { key: "A", place: 4, points: 2 }, { key: "C", place: 3, points: 3 }],
    w3: [{ key: "A", place: 5, points: 1 }]
  });
  assert.deepStrictEqual(table.map(r => [r.key, r.points, r.thirds, r.fourths, r.fifths, r.place]),
    [["C", 4, 1, 0, 1, 1], ["B", 4, 0, 2, 0, 1], ["A", 4, 0, 1, 2, 1]]);
});

test("streak: weeks in a row, still alive until a week is missed", () => {
  // Played the last three weeks and not yet this week: still a 3-week streak.
  assert.deepStrictEqual(L.streak(["2026-11-02", "2026-11-09", "2026-11-16"], "2026-11-23", false), { current: 3, best: 3 });
  // Doing this week's challenge adds to it.
  assert.deepStrictEqual(L.streak(["2026-11-16", "2026-11-02", "2026-11-09"], "2026-11-23", true), { current: 4, best: 4 });
  // Missed last week: the streak is gone, the best is kept.
  assert.deepStrictEqual(L.streak(["2026-11-02", "2026-11-09"], "2026-11-23", false), { current: 0, best: 2 });
  assert.deepStrictEqual(L.streak(["2026-11-02", "2026-11-09"], "2026-11-23", true), { current: 1, best: 2 });
  assert.deepStrictEqual(L.streak([], "2026-11-02", false), { current: 0, best: 0 });
  // Across a month and a year end.
  assert.deepStrictEqual(L.streak(["2026-12-21", "2026-12-28"], "2027-01-04", true), { current: 3, best: 3 });
});

test("time taken is capped at the limit", () => {
  assert.strictEqual(L.timeTaken(1000, 5000, 20 * 60000), 4000);
  assert.strictEqual(L.timeTaken(0, 30 * 60000, 20 * 60000), 20 * 60000);
});

const commaCloze = {
  format: "cloze", title: "C",
  blanks: {
    1: { verb: "a spicy Thai soup", answers: [", a spicy Thai soup,"], commas: true },
    2: { verb: "Kit", answers: ["Kit"], commas: true },
    3: { verb: "go", answers: ["went"] }
  },
  paragraphs: [["Tom yam ", 1, " is good. My friend ", 2, " ", 3, " home."]],
  distractors: []
};

test("a comma blank needs its commas, however they are spaced", () => {
  assert.strictEqual(L.markCloze(commaCloze, { 1: ", a spicy thai soup," }).right[1], true);
  assert.strictEqual(L.markCloze(commaCloze, { 1: " ,a spicy Thai soup , " }).right[1], true);
  assert.strictEqual(L.markCloze(commaCloze, { 1: "a spicy Thai soup" }).right[1], false);
  assert.strictEqual(L.markCloze(commaCloze, { 1: ", a spicy Thai soup" }).right[1], false);
});

test("a defining phrase in a comma blank loses the mark if commas are added", () => {
  assert.strictEqual(L.markCloze(commaCloze, { 2: "Kit" }).right[2], true);
  assert.strictEqual(L.markCloze(commaCloze, { 2: ", Kit," }).right[2], false);
});

test("other blanks and proofreading still ignore commas", () => {
  assert.strictEqual(L.markCloze(commaCloze, { 3: "went," }).right[3], true);
  assert.strictEqual(L.markCloze(cloze, { 1: "are, held" }).right[1], true);
});

test("the public challenge says commas count without saying which blanks", () => {
  const pub = L.publicChallenge(commaCloze);
  assert.strictEqual(pub.commas, true);
  assert.strictEqual(JSON.stringify(pub).includes("answers"), false);
  assert.strictEqual("commas" in L.publicChallenge(cloze), false);
});

test("a comma from a Chinese keyboard counts in a comma blank", () => {
  assert.strictEqual(L.markCloze(commaCloze, { 1: "，a spicy Thai soup，" }).right[1], true);
});

test("the public challenge splits verbs from phrases and names the kinds of word not in the box", () => {
  const ch = { format: "cloze", title: "T", paragraphs: [["x ", 1, " y ", 2, " z ", 3]], distractors: ["swim"], phraseDistractors: ["a tall tree"],
    blanks: { 1: { verb: "go", answers: ["went"] }, 2: { verb: "Kit", answers: ["Kit"], commas: true }, 3: { answers: ["someone", "somebody"], topic: "Indefinite pronouns" } } };
  const pub = L.publicChallenge(ch);
  assert.deepStrictEqual(pub.bank, ["go", "swim"]);
  assert.deepStrictEqual(pub.phrases, ["Kit", "a tall tree"]);
  assert.deepStrictEqual(pub.open, ["Indefinite pronouns"]);
  assert.strictEqual(JSON.stringify(pub).includes("someone"), false);
  assert.strictEqual(L.markCloze(ch, { 3: "somebody" }).right[3], true);
});

test("an S.4 challenge gets no new fields", () => {
  const pub = L.publicChallenge(cloze);
  assert.deepStrictEqual(pub.bank, ["give", "hold", "swim"]);
  assert.strictEqual("phrases" in pub, false);
  assert.strictEqual("open" in pub, false);
});

test("leaving the page: glances under 3 seconds are free, the second real switch is over the limit", () => {
  assert.deepStrictEqual(L.countAway({ switches: 0, awaySec: 0 }, 2999), { switches: 0, awaySec: 0, counted: false });
  const once = L.countAway({ switches: 0, awaySec: 0 }, 14400);
  assert.deepStrictEqual(once, { switches: 1, awaySec: 14, counted: true });
  assert.strictEqual(L.overSwitchLimit(once.switches), false);
  assert.strictEqual(L.overSwitchLimit(L.countAway(once, 3000).switches), true);
});

test("answer changes ignore cleared blanks and unmarked lines", () => {
  assert.deepStrictEqual(L.answerChanges({ 1: "a" }, { 1: "a", 2: "b", 3: "" }), ["2"]);
  assert.deepStrictEqual(L.answerChanges({ 0: { type: "ok" } }, { 0: { type: "ok" }, 1: { type: "replace", at: 2, word: "x" }, 2: {} }), ["1"]);
});

test("timing check: a quiet spell between answers then five in a minute, or 14+ in under 5 minutes", () => {
  const rush = [[30, ["1"]], [300, ["2", "3"]], [320, ["4"]], [350, ["5", "6"]], [900, ["7"]]];
  assert.strictEqual(L.timingCheck(rush, 9, 900000), "quiet 4:30, then 5 answers in 1 min (at 5:00)");
  // Reading the passage first is never a quiet spell: the gap only counts after the first answer.
  assert.strictEqual(L.timingCheck([[300, ["1", "2", "3", "4", "5"]]], 9, 600000), "");
  assert.strictEqual(L.timingCheck([[30, ["1"]]], 14, 299000), "14/15 in 4:59");
  assert.strictEqual(L.timingCheck([[30, ["1"]]], 13, 200000), "");
  assert.strictEqual(L.timingCheck([[30, ["1"]]], 15, 300000), "", "exactly 5 minutes is not under 5");
});

test("shieldedStreak: three quests earn a shield, and a shield covers one missed week", () => {
  const W = ["2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23", "2026-11-30"];
  // No quests: the same as streak(), with no shields.
  assert.deepStrictEqual(L.shieldedStreak([W[0], W[1]], {}, W[3], false), { current: 0, best: 2, shields: 0, toNext: 3, shielded: [] });
  // Three quests in week 1 earn a shield; week 3 is missed and covered, so the run carries on into week 4.
  const s = L.shieldedStreak([W[0], W[1], W[3]], { [W[0]]: 3 }, W[4], false);
  assert.deepStrictEqual(s, { current: 3, best: 3, shields: 0, toNext: 3, shielded: [W[2]] });
  // A shielded week keeps the run but adds no week to it.
  assert.strictEqual(L.shieldedStreak([W[0], W[2]], { [W[0]]: 3 }, W[3], false).current, 2);
});

test("shieldedStreak: shields are held two at most, and never spent on a streak of nothing", () => {
  const W = ["2026-11-02", "2026-11-09", "2026-11-16", "2026-11-23"];
  // Nine quests would be three shields, but only two can be held.
  assert.strictEqual(L.shieldedStreak([W[0]], { [W[0]]: 9 }, W[1], false).shields, 2);
  // Quests with no streak to protect: the missed week uses no shield.
  const idle = L.shieldedStreak([], { [W[0]]: 3 }, W[2], false);
  assert.deepStrictEqual([idle.current, idle.shields, idle.shielded], [0, 1, []]);
  // Two missed weeks in a row with one shield: the second still ends the run.
  assert.strictEqual(L.shieldedStreak([W[0]], { [W[0]]: 3 }, W[3], false).current, 0);
  // This week's quests count towards the next shield before the week is judged.
  assert.strictEqual(L.shieldedStreak([W[0]], { [W[1]]: 2 }, W[1], false).toNext, 1);
});

test("shieldedStreak: a shield earned in a week cannot cover that same week", () => {
  const W = ["2026-11-02", "2026-11-09", "2026-11-16"];
  // Played week 1, did 3 quests in week 2 but not the challenge: week 2 is missed, the shield comes too late.
  const s = L.shieldedStreak([W[0]], { [W[1]]: 3 }, W[2], false);
  assert.deepStrictEqual([s.current, s.shields, s.shielded], [0, 1, []]);
});
