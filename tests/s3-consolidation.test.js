// Checks the S.3 consolidation rewrites: the data is complete, every listed answer is accepted,
// real mistakes are not, and capital or punctuation slips pass with a reminder.
// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/rewrite-check.js"), "utf8") + "\n" +
  fs.readFileSync(path.join(root, "assets/js/data/s3-consolidation-data.js"), "utf8"), { window });
const C = window.CLY_S3_CONSOLIDATION, R = window.CLY_REWRITE_CHECK;
const html = fs.readFileSync(path.join(root, "s3-grammar.html"), "utf8");
// every set, named "key" or "key #2" when an exercise has several
const SETS = Object.entries(C).flatMap(([k, v]) => [].concat(v).map((s, i) => [k + (Array.isArray(v) ? " #" + (i + 1) : ""), s]));
const item = (set, n) => [].concat(C[set.split("#")[0]])[set.includes("#") ? Number(set.split("#")[1]) - 1 : 0].items[n];
const judge = (set, n, typed) => R.judge(typed, item(set, n));

test("every exercise on the page has data, and every exercise is on the page", () => {
  const onPage = [...html.matchAll(/data-grammar="s3rewrite" data-set="([^"]+)"/g)].map(m => m[1]);
  assert.deepStrictEqual(onPage.slice().sort(), Object.keys(C).sort());
});

test("each item is used once in its text and has a frame, answers, hint and explanation", () => {
  SETS.forEach(([key, set]) => {
    // joined to strings: the data's arrays come from another realm, so their prototypes differ
    const refs = set.paragraphs.flat().filter(x => typeof x === "number").map(String);
    assert.strictEqual(refs.sort().join(), Object.keys(set.items).sort().join(), key);
    assert.ok(set.title && set.textType && set.task, key);
    Object.entries(set.items).forEach(([n, it]) => {
      const where = key + " " + n;
      assert.strictEqual(it.frame.split("___").length, 2, where + ": the frame needs one gap");
      assert.ok(it.original && it.answers.length && it.hint && it.why, where);
      if (it.kind) assert.ok(["present", "past"].includes(it.kind), where);
    });
  });
  C.participles.forEach(s => {
    const kinds = Object.values(s.items).map(it => it.kind);
    assert.ok(kinds.includes("present") && kinds.includes("past"), s.title + " mixes both kinds");
  });
  assert.ok(C.participles.length >= 5, "five mixed sets");
});

test("every listed answer is accepted with no reminders", () => {
  SETS.forEach(([key, set]) => Object.entries(set.items).forEach(([n, it]) => {
    it.answers.flatMap(R.expand).forEach(a => {
      const r = R.judge(a, it);
      assert.ok(r.ok, key + " " + n + ": " + a);
      assert.deepStrictEqual([...r.reminders], [], key + " " + n + ": " + a);
    });
  }));
});

test("answer patterns expand into every choice", () => {
  assert.deepStrictEqual([...R.expand("[if|whether] she (had) left.")], ["if she had left.", "if she left.", "whether she had left.", "whether she left."]);
  assert.strictEqual(R.expand(item("questionsB", 8).answers[0]).length, 8);
});

test("other correct versions are accepted", () => {
  [
    ["presentA", 8, "Realizing the judges liked our robot,"],
    ["presentA", 3, "Having opened the toolbox,"],
    ["presentA", 2, "While testing the motor,"],
    ["pastB", 6, "Uninterested in games,"],
    ["statementsA", 1, "that she is a doctor at Queen Mary Hospital now."],
    ["statementsA", 6, "he'd just moved back to Hong Kong from Canada."],
    ["statementsA", 8, "her daughter started S.1 there the following day."],
    ["statementsA", 10, "we must work hard if we want to succeed."],
    ["questionsB", 1, "whether she dove every day."],
    ["statementsA", 1, "she's a doctor at Queen Mary Hospital now."],
    ["questionsB", 10, "if it's safe to swim at Repulse Bay."],
    ["questionsB", 8, "if the fish would come back if they stopped polluting the sea."]
  ].forEach(([set, n, typed]) => assert.ok(judge(set, n, typed).ok, set + " " + n + ": " + typed));
});

test("real mistakes are marked wrong", () => {
  [
    ["presentA", 4, "Don't knowing where it was,"],
    ["presentA", 1, "Wanted to win the inter-school robot contest,"],
    ["pastB", 2, "Confusing by all the buttons,"],
    ["participles#1", 1, "Starting by a Form 3 student,"],
    ["participles#1", 2, "Wanted to protect the sea turtles,"],
    ["statementsA", 6, "he has just moved back to Hong Kong from Canada."],
    ["statementsA", 8, "her daughter started S.1 there tomorrow."],
    ["statementsA", 2, "I would never forget my S.3 English teacher."],
    ["questionsB", 3, "where did pink dolphins live?"],
    ["questionsB", 2, "that if she had ever seen a shark."],
    ["questionsB", 9, "who did pay for her research."]
  ].forEach(([set, n, typed]) => assert.ok(!judge(set, n, typed).ok, set + " " + n + ": " + typed));
});

test("capital and punctuation slips are accepted with a reminder", () => {
  const remind = (set, n, typed, pattern) => {
    const r = judge(set, n, typed);
    assert.ok(r.ok, typed);
    assert.ok(r.reminders.some(x => pattern.test(x)), typed + " → " + r.reminders.join(" | "));
  };
  remind("presentA", 7, "Laughing loudly", /comma/);
  remind("presentA", 7, "laughing loudly,", /capital/);
  remind("statementsA", 2, "He would never forget his S.3 English teacher.", /No capital/);
  remind("statementsA", 2, "he would never forget his S.3 English teacher", /full stop/);
  remind("questionsB", 4, "why the coral reefs were dying?", /question mark/);
  remind("questionsB", 10, "if it was safe to swim at repulse bay.", /capital/);
  remind("questionsB", 1, "Ben asked Dr Kwan if she dived every day.", /missing part/);
});

test("an empty answer is not marked", () => {
  assert.strictEqual(judge("pastB", 1, "  ").ok, false);
});

test("whole-sentence practices accept every full sentence and reject the phrase alone", () => {
  ["presentA", "pastB"].forEach(key => {
    assert.ok(C[key].whole, key + " asks for the whole sentence");
    Object.entries(C[key].items).forEach(([n, it]) => {
      const whole = R.wholeSentence(it);
      whole.answers.flatMap(R.expand).forEach(a => {
        const r = R.judge(a, whole);
        assert.ok(r.ok && r.reminders.length === 0, key + " " + n + ": " + a);
      });
      assert.ok(!R.judge(R.expand(it.answers[0])[0], whole).ok, key + " " + n + ": the phrase alone is not enough");
    });
  });
  const robot = R.wholeSentence(item("presentA", 7));
  assert.ok(R.judge("Laughing loudly, Mr Lam told us not to worry.", robot).ok);
  assert.strictEqual(R.judge("laughing loudly Mr Lam told us not to worry", robot).reminders.length, 3, "capital, comma and full stop reminders");
  assert.ok(!R.judge("Laughed loudly, Mr Lam told us not to worry.", robot).ok);
});
