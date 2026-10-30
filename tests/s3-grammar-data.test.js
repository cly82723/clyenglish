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

test("nothing on the S.3 page teaches or tests 'unless'", () => {
  ["s3-grammar.html", "assets/js/s3-grammar.js", "assets/js/data/s3-grammar-data.js", "assets/js/data/s3-consolidation-data.js"].forEach(f =>
    assert.ok(!/\bunless\b/i.test(fs.readFileSync(path.join(root, f), "utf8")), f));
});

test("every lesson diagram exists in s3-grammar.js", () => {
  const code = fs.readFileSync(path.join(root, "assets/js/s3-grammar.js"), "utf8");
  const visuals = code.slice(code.indexOf("window.CLY_S3_VISUALS"));
  const used = Object.values(S3.lessons).map(l => l.visual).concat([...html.matchAll(/data-grammar="s3visual" data-set="([^"]+)"/g)].map(m => m[1]));
  used.forEach(v => assert.ok(v && visuals.includes('"' + v + '"'), "missing diagram: " + v));
});

test("the page has no Challenge or Three versions left", () => {
  assert.ok(!/id="challenge"|s3cloze|s3proof|class="versions"/.test(html));
  assert.ok(!S3.cloze && !S3.proofreading);
  assert.ok(!/class="versions"/.test(fs.readFileSync(path.join(root, "grammar.html"), "utf8")), "S.4 grammar still has a Three versions box");
});
