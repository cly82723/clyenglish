"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(read("assets/js/data/vocab-data.js"), ctx);
vm.runInContext(read("assets/js/data/vocab-cards.js"), ctx);
const plain = (x) => JSON.parse(JSON.stringify(x));
const decks = ctx.window.CLY_CARDS.decks;
const s3 = ctx.window.CLY_VOCAB.vocabLists.s3.units;
const s3Words = Object.values(s3).flat().map((w) => w.word);

test("the decks are Unit 1 (23), Unit 2 (22) and Phrases (31)", () => {
  assert.deepStrictEqual(plain(decks.map((d) => [d.id, d.cards.length])), [["unit1", 23], ["unit2", 22], ["phrases", 31]]);
});

test("every S.3 word has exactly one card, and every word card is an S.3 word", () => {
  const cards = decks.filter((d) => d.kind === "word").flatMap((d) => d.cards.map((c) => c.word));
  assert.deepStrictEqual(plain(cards.slice().sort()), plain(s3Words.slice().sort()));
  assert.strictEqual(new Set(cards).size, cards.length);
});

test("each card has a sentence that holds its hidden words exactly once, and three different wrong choices", () => {
  for (const d of decks) {
    for (const c of d.cards) {
      const id = d.id + ": " + c.word;
      const first = c.sentence.indexOf(c.blank);
      assert.ok(first >= 0, id + " the sentence does not contain its blank");
      assert.strictEqual(first, c.sentence.lastIndexOf(c.blank), id + " the blank appears twice, so it would give itself away");
      assert.strictEqual(c.distractors.length, 3, id);
      assert.strictEqual(new Set([c.blank].concat(c.distractors)).size, 4, id + " has a repeated choice");
      assert.ok(c.collocation || d.kind === "phrase", id + " has no collocation");
      assert.ok(c.types.length >= 1, id + " has no text type");
    }
  }
});

test("a choice that starts the sentence is capitalised like its blank, so the capital letter gives nothing away", () => {
  for (const d of decks) {
    for (const c of d.cards) {
      const capital = /^[A-Z]/.test(c.blank) && c.sentence.indexOf(c.blank) === 0;
      for (const x of c.distractors) assert.strictEqual(/^[A-Z]/.test(x), /^[A-Z]/.test(c.blank), d.id + ": " + c.word + " / " + x);
      if (capital) assert.ok(c.sentence.startsWith(c.blank));
    }
  }
});

test("only the informal S.3 idioms carry the informal note, and their text types leave out formal ones", () => {
  const flagged = decks.flatMap((d) => d.cards.filter((c) => c.note === "informal").map((c) => c.word)).sort();
  assert.deepStrictEqual(plain(flagged), ["hit a home run", "lend a hand"]);
});

test("the vocab hub, flashcards and quiz pages exist and the old passage anchor forwards", () => {
  for (const f of ["vocab.html", "vocab-cards.html", "vocab-quiz.html", "vocab-passage.html"]) assert.ok(fs.existsSync(path.join(root, f)), f);
  assert.ok(/"s3":"vocab-passage.html"/.test(read("vocab.html")), "vocab.html#s3 does not go to the passage");
  assert.ok(read("vocab-cards.html").includes("data-cards") && read("vocab-quiz.html").includes("data-quiz"));
});

test("the quiz counts a good round as a practice set through the existing badge key", () => {
  const code = read("assets/js/vocab-practice.js");
  assert.ok(code.includes("cly:sets-done:vocab-quiz") && code.includes("cly:set-done"));
});
