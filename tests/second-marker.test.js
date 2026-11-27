// The blind second marker (tools/second-marker.js): the blind copy holds no answers, and the comparison flags every
// right answer the key would mark wrong.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { toMark, compareCloze, compareProof } = require("../tools/second-marker.js");

const TOOL = path.join(__dirname, "../tools/second-marker.js");

const cloze = {
  format: "cloze", title: "C", textType: "Blog post",
  paragraphs: [["My friend ", 1, " cooks it, and she ", 2, " it to me last week. I left early ", 3, " get a seat."]],
  blanks: {
    1: { verb: "Kit", answers: ["Kit"], commas: true, topic: "Noun phrases", why: "w" },
    2: { verb: "give", answers: ["gave"], topic: "Tenses", why: "w" },
    3: { answers: ["so as to"], topic: "So, so that, so as to", why: "w" }
  },
  distractors: ["sell"], phraseDistractors: ["a tall tree"]
};
const proof = {
  format: "proofreading", title: "P", textType: "Diary entry",
  lines: [["My mum let me [[to>]] choose the dessert.", "Bare infinitives", "w"], ["I have finished my homework before dinner."]]
};

function inFolder(bank, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "second-"));
  fs.writeFileSync(path.join(dir, "bank.json"), JSON.stringify(bank));
  try { return fn(dir); } finally { fs.rmSync(dir, { recursive: true }); }
}

test("toMark turns a corrected line into the one change a student would make", () => {
  const w = "My mum let me to choose".split(" ");
  assert.deepStrictEqual(toMark(w, "My mum let me choose".split(" ")), { type: "delete", at: 4 });
  assert.deepStrictEqual(toMark(w, "My mum allowed me to choose".split(" ")), { type: "replace", at: 2, word: "allowed" });
  assert.deepStrictEqual(toMark("I go home".split(" "), "I often go home".split(" ")), { type: "insert", at: 1, word: "often" });
  assert.strictEqual(toMark(w, "Mum allowed me choose".split(" ")), null);
});

test("cloze: a right answer the key rejects is flagged; agreeing answers are not", () => {
  const notes = compareCloze(cloze, { 1: ["Kit", ", Kit,"], 2: ["gave", "sold"], 3: ["so as to"] });
  assert.strictEqual(notes.filter((n) => n.includes("possibly unfair")).length, 2);
  assert.ok(notes.some((n) => n.includes("Blank 1") && n.includes(", Kit,")));
  assert.ok(notes.some((n) => n.includes("Blank 2") && n.includes("sold")));
  assert.deepStrictEqual(compareCloze(cloze, { 1: ["Kit"], 2: ["gave"], 3: ["so as to"] }), []);
});

test("cloze: a key answer the second marker would not accept is flagged for checking", () => {
  const notes = compareCloze(cloze, { 1: ["Kit"], 2: ["gives"], 3: ["so as to"] });
  assert.ok(notes.some((n) => n.includes("check the key") && n.includes("gave")));
});

test("proofreading: another right fix, and an accidental mistake on a 'correct' line, are flagged", () => {
  const notes = compareProof(proof, { 1: ["My mum let me choose the dessert.", "My mum allowed me to choose the dessert."], 2: ["I had finished my homework before dinner."] });
  assert.strictEqual(notes.filter((n) => n.includes("possibly unfair")).length, 2);
  assert.ok(notes.some((n) => n.includes("Line 1") && n.includes("allowed")));
  assert.ok(notes.some((n) => n.includes("Line 2") && n.includes("no mistake")));
  assert.deepStrictEqual(compareProof(proof, { 1: ["My mum let me choose the dessert."], 2: "ok" }), []);
});

test("the blind copy holds what students see and none of the answers", () => {
  inFolder([{ week: "", format: "cloze", title: "C", data: cloze }, { week: "", format: "proofreading", title: "P", data: proof }], (dir) => {
    const r = spawnSync("node", [TOOL, "blind", dir], { encoding: "utf8" });
    assert.strictEqual(r.status, 0, r.stderr);
    const one = fs.readFileSync(path.join(dir, "blind", "set-1.md"), "utf8");
    const two = fs.readFileSync(path.join(dir, "blind", "set-2.md"), "utf8");
    assert.match(one, /\(2\) ______/);
    assert.match(one, /give, sell/);
    assert.ok(!/gave/.test(one), "the cloze answer leaked");
    assert.match(two, /let me to choose/);
    assert.ok(!/\[\[|Bare infinitives/.test(two), "the proofreading key leaked");
    assert.ok(!/"w"|why/.test(one + two), "the explanations leaked");
  });
});

test("compare exits 1 and writes the report when something is possibly unfair", () => {
  inFolder([{ week: "", format: "cloze", title: "C", data: cloze }], (dir) => {
    fs.mkdirSync(path.join(dir, "blind"));
    fs.writeFileSync(path.join(dir, "blind", "set-1.answers.json"), JSON.stringify({ 1: ["Kit"], 2: ["gave", "sold"], 3: ["so as to"] }));
    const r = spawnSync("node", [TOOL, "compare", dir], { encoding: "utf8" });
    assert.strictEqual(r.status, 1);
    assert.match(fs.readFileSync(path.join(dir, "second-marker.md"), "utf8"), /sold/);
  });
});
