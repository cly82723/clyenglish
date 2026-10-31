// Checks the S.3 practice cloze follows the league's rules, and that its marking agrees with the web app's.
// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const L = require("../apps-script/Logic.gs");

const root = path.join(__dirname, "..");
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/word-box.js"), "utf8") + "\n" +
  fs.readFileSync(path.join(root, "assets/js/data/s3-practice-data.js"), "utf8"), { window });
const W = window.CLY_WORD_BOX, sets = window.CLY_S3_PRACTICE;
const html = fs.readFileSync(path.join(root, "s3-grammar.html"), "utf8");
const asCloze = set => Object.assign({ format: "cloze", title: set.title }, set);

test("every listed answer is right, in the page's marking and the web app's", () => {
  sets.forEach(set => Object.entries(set.blanks).forEach(([id, b]) => b.answers.forEach(a => {
    assert.ok(W.isRight(b, a), set.title + " " + id + " " + a);
    assert.ok(L.markCloze(asCloze(set), { [id]: a }).right[id], set.title + " " + id + " " + a);
  })));
});

test("the page and the web app agree on commas, negatives and wrong answers", () => {
  const b = { answers: [", a Thai soup,"], commas: true }, plain = { answers: ["doesn't have to"] };
  const ch = { format: "cloze", title: "T", paragraphs: [[1, 2]], blanks: { 1: b, 2: plain } };
  [", a Thai soup,", " ,a thai soup , ", "，a Thai soup，", "a Thai soup", ", a Thai soup"].forEach(t =>
    assert.strictEqual(W.isRight(b, t), L.markCloze(ch, { 1: t }).right[1], t));
  ["doesn't have to", "does not have to", "doesnt have to", "Doesn't, have to", "has to"].forEach(t =>
    assert.strictEqual(W.isRight(plain, t), L.markCloze(ch, { 2: t }).right[2], t));
});

test("each set follows the league's rules", () => {
  const open = ["Indefinite pronouns", "So, so that, so as to", "Must, have to, need to", "Linking words"];
  sets.forEach(set => {
    const blanks = Object.values(set.blanks);
    assert.ok(new Set(blanks.map(b => b.topic)).size <= 3, set.title + " has more than 3 topics");
    assert.strictEqual(set.distractors.length + (set.phraseDistractors || []).length, 3, set.title);
    blanks.forEach(b => {
      assert.strictEqual(!b.verb, open.includes(b.topic), set.title + ": " + b.answers[0]);
      assert.ok(b.why && !b.answers.some(a => /\bnever\b/i.test(a)), b.answers[0]);
      assert.ok(!(b.answers.includes("so") && b.answers.includes("so that")), b.answers[0]);
      if (b.topic === "Indefinite pronouns") b.answers.forEach(a => assert.ok(W.RANGES[b.topic].words.includes(a), a));
    });
    assert.strictEqual(JSON.stringify(set.paragraphs.flat().filter(p => typeof p === "number")), JSON.stringify(Object.keys(set.blanks).map(Number)), set.title);
  });
});

test("nothing is in the league's indefinite pronoun group, and the page links to the practice", () => {
  assert.ok(W.RANGES["Indefinite pronouns"].words.includes("nothing"));
  assert.ok(/id="practice-cloze"/.test(html) && /id="tenses"/.test(html) && /data-grammar="s3practice"/.test(html));
  ["assets/js/word-box.js", "assets/js/data/s3-practice-data.js"].forEach(f => assert.ok(html.includes(f), f));
});
