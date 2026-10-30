// The checker's S.3 rules, run on small banks in a temp folder. Without "s3" the S.4 rules apply, unchanged.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const TOOL = path.join(__dirname, "../tools/challenge-bank.js");

function run(bank, form) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "league-"));
  fs.writeFileSync(path.join(dir, "bank.json"), JSON.stringify(bank));
  const r = spawnSync("node", [TOOL, dir].concat(form ? [form] : []), { encoding: "utf8" });
  const review = fs.existsSync(path.join(dir, "review.html")) ? fs.readFileSync(path.join(dir, "review.html"), "utf8") : "";
  fs.rmSync(dir, { recursive: true });
  return { ok: r.status === 0, out: r.stdout + r.stderr, review };
}

// 15 blanks over the given topics, in turn.
function clozeSet(topics, week, change) {
  const blanks = {}, parts = [];
  for (let i = 1; i <= 15; i++) {
    blanks[i] = { verb: "word" + i, answers: ["word" + i + "s"], why: "because", topic: topics[(i - 1) % topics.length] };
    parts.push("Text ", i, " ");
  }
  const data = { textType: "Blog post", paragraphs: [parts], blanks, distractors: ["x1", "x2", "x3"] };
  if (change) change(data);
  return { week: week || "", format: "cloze", title: "C", data };
}

// 15 lines: `topics` gives the focus of each of the 12 mistakes, in turn.
function proofSet(topics, week, change) {
  const lines = [];
  for (let i = 0; i < 12; i++) lines.push(["The cat [[are>is]] line " + i, topics[i % topics.length], "because"]);
  for (let i = 12; i < 15; i++) lines.push(["Correct line " + i]);
  const data = { textType: "Diary entry", lines };
  if (change) change(data);
  return { week: week || "", format: "proofreading", title: "P", data };
}

test("a cloze with 3 topics passes", () => {
  const r = run([clozeSet(["Tenses", "Participles", "Bare infinitives"])], "s3");
  assert.ok(r.ok, r.out);
  assert.match(r.review, /Word box/);
});

test("a cloze with 4 topics fails", () => {
  const r = run([clozeSet(["Tenses", "Participles", "Bare infinitives", "Indefinite pronouns"])], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /4 grammar topics/);
});

test("a cloze has no natural-English marks", () => {
  const r = run([clozeSet(["Tenses", "Natural English"])], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /Natural English/);
});

test("proofreading allows 3 topics plus up to 2 natural-English marks", () => {
  const twelve = ["Tenses", "Participles", "Bare infinitives", "Tenses", "Participles", "Bare infinitives", "Tenses", "Participles", "Bare infinitives", "Tenses", "Natural English", "Natural English"];
  const r = run([proofSet(twelve)], "s3");
  assert.ok(r.ok, r.out);
});

test("proofreading with 3 natural-English marks fails", () => {
  const twelve = ["Tenses", "Tenses", "Tenses", "Tenses", "Tenses", "Tenses", "Tenses", "Tenses", "Tenses", "Natural English", "Natural English", "Natural English"];
  const r = run([proofSet(twelve)], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /3 natural-English/);
});

test("an unknown topic fails", () => {
  const r = run([clozeSet(["Tenses", "Relative clauses"])], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /Relative clauses/);
});

test("Unit 4 topics are refused before 7 Dec and in backups", () => {
  assert.ok(!run([clozeSet(["Tenses", "Linking words"], "2026-11-30")], "s3").ok);
  assert.ok(!run([clozeSet(["Tenses", "Linking words"])], "s3").ok);
});

test("from 7 Dec a set needs a Unit 4 topic", () => {
  const without = run([clozeSet(["Tenses"], "2026-12-14")], "s3");
  assert.ok(!without.ok);
  assert.match(without.out, /Unit 4/);
  assert.ok(run([clozeSet(["Tenses", "Reported statements"], "2026-12-14")], "s3").ok);
});

test("perfect continuous answers fail", () => {
  const r = run([clozeSet(["Tenses"], "", d => { d.blanks[1].answers = ["has been waiting"]; })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /perfect continuous/);
});

test("a proofreading fix that only changes a comma fails", () => {
  const r = run([proofSet(["Tenses"], "", d => { d.lines[0] = ["Sushi, a dish [[is>is,]] easy to find", "Tenses", "because"]; })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /comma/);
});

test("a cloze noun-phrase blank must count commas", () => {
  const without = run([clozeSet(["Tenses", "Noun phrases"])], "s3");
  assert.ok(!without.ok);
  assert.match(without.out, /commas/);
  const flagged = clozeSet(["Tenses", "Noun phrases"], "", d => {
    Object.values(d.blanks).forEach(b => { if (b.topic === "Noun phrases") b.commas = true; });
  });
  assert.ok(run([flagged], "s3").ok);
});

test("without s3 the S.4 rules apply and topics aren't needed", () => {
  const set = clozeSet(["Tenses"]);
  Object.values(set.data.blanks).forEach(b => { delete b.topic; });
  const r = run([set]);
  assert.ok(r.ok, r.out);
  assert.match(r.review, /Verb box/);
});

test("an answer longer than the web app's 60-character cut fails", () => {
  const r = run([clozeSet(["Tenses"], "", d => { d.blanks[1].answers = ["x".repeat(61)]; })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /over 60 characters/);
});

function openBlank(d, id, topic, answers) {
  d.blanks[id] = { answers, why: "because", topic };
}

test("indefinite pronouns, so and must are not in the box", () => {
  const boxed = run([clozeSet(["Tenses", "Indefinite pronouns"])], "s3");
  assert.ok(!boxed.ok);
  assert.match(boxed.out, /must not be in the box/);
  const open = clozeSet(["Tenses"], "", d => { openBlank(d, 2, "Indefinite pronouns", ["someone", "somebody"]); openBlank(d, 3, "So, so that, so as to", ["so that"]); });
  const r = run([open], "s3");
  assert.ok(r.ok, r.out);
  assert.match(r.review, /not in the box/);
});

test("an indefinite pronoun outside the list fails", () => {
  const r = run([clozeSet(["Tenses"], "", d => { openBlank(d, 2, "Indefinite pronouns", ["somewhere"]); })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /somewhere/);
});

test("a negative with never fails, in a cloze and in proofreading", () => {
  const c = run([clozeSet(["Tenses"], "", d => { d.blanks[1].answers = ["had never held"]; })], "s3");
  assert.ok(!c.ok);
  assert.match(c.out, /never/);
  const p = run([proofSet(["Tenses"], "", d => { d.lines[0] = ["I [[have>had]] never been there", "Tenses", "because"]; })], "s3");
  assert.ok(!p.ok);
  assert.match(p.out, /never/);
});

test("the box needs exactly 3 distractors", () => {
  const r = run([clozeSet(["Tenses"], "", d => { d.distractors = ["x1", "x2"]; })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /2 distractors/);
});

test("a blank can't accept both so and so that", () => {
  const r = run([clozeSet(["Tenses"], "", d => { openBlank(d, 2, "So, so that, so as to", ["so that", "so"]); })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /both so and so that/);
});

test("no-one with a hyphen is not on the list", () => {
  const r = run([clozeSet(["Tenses"], "", d => { openBlank(d, 2, "Indefinite pronouns", ["nobody", "no-one"]); })], "s3");
  assert.ok(!r.ok);
  assert.match(r.out, /no-one/);
});
