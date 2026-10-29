// Checks the S.3 grammar content is self-consistent and every link it makes lands on s3-grammar.html.
// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/data/grammar-data.js"), "utf8") + "\n" +
  fs.readFileSync(path.join(root, "assets/js/data/s3-grammar-data.js"), "utf8"), { window });
const G = window.CLY_GRAMMAR, S3 = window.CLY_S3_GRAMMAR;
const html = fs.readFileSync(path.join(root, "s3-grammar.html"), "utf8");
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const sets = new Set([...html.matchAll(/data-set="([^"]+)"/g)].map(m => m[1]));

test("every topic's rules and every lesson's practice button point at a part of the page", () => {
  Object.entries(S3.topics).forEach(([name, t]) => assert.ok(ids.has(t.review), name + " → #" + t.review));
  Object.entries(S3.lessons).forEach(([key, l]) => assert.ok(ids.has(l.practice.id), key + " → #" + l.practice.id));
});

test("each topic has a lesson and a quiz on the page", () => {
  Object.keys(S3.lessons).forEach(k => assert.ok(sets.has(k) && S3.quizzes[k], k));
  Object.values(S3.quizzes).forEach(q => assert.ok(S3.topics[q.topic], q.topic));
});

test("quiz questions have four different options and a valid answer, hint and explanation", () => {
  Object.entries(S3.quizzes).forEach(([key, quiz]) => quiz.sets.forEach(set => set.forEach((q, i) => {
    const where = key + " Q" + (i + 1);
    assert.strictEqual(q.options.length, 4, where);
    assert.strictEqual(new Set(q.options).size, 4, where + " has a repeated option");
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, where);
    assert.ok(q.hint && q.explanation, where);
  })));
});

test("cloze blanks and paragraph gaps match one to one", () => {
  S3.cloze.forEach(p => {
    const gaps = p.paragraphs.flat().filter(x => typeof x === "number");
    // joined to strings: the data's arrays come from another realm, so their prototypes differ
    assert.strictEqual(gaps.map(String).sort().join(), Object.keys(p.blanks).sort().join(), p.title);
    Object.entries(p.blanks).forEach(([n, b]) => {
      assert.ok(b.answers.length && b.why && b.hint && b.form, p.title + " blank " + n);
      assert.ok(S3.topics[b.focus], p.title + " blank " + n + " focus");
    });
    p.lookFor.forEach(t => assert.ok(S3.topics[t], t));
  });
});

test("proofreading lines parse, and every mistake has a topic, explanation and hint", () => {
  S3.proofreading.forEach(p => p.lines.forEach((l, i) => {
    const r = G.parseProofLine(l[0]);
    const where = p.title + " line " + (i + 1);
    if (!r.error) { assert.strictEqual(l.length, 1, where + " has notes but no mistake"); return; }
    assert.ok(S3.topics[l[1]] && l[2] && l[3], where);
    assert.notDeepStrictEqual(r.words, r.fixed, where);
  }));
});
