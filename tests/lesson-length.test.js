"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "grammar.js"), "utf8").replace(/\r\n/g, "\n");
const lesson = src.slice(src.indexOf("function Lesson(root, lesson) {"), src.indexOf("// ---------- Proofreading exercise ----------"));

test("a lesson is short by default: the picture and 'when to use it' sit behind a tap, the mistakes and tip do not", () => {
  const folds = [...lesson.matchAll(/h[(]"details", [{] class: "why lesson-fold" [}], h[(]"summary", null, "([^"]+)"[)]/g)].map((m) => m[1]);
  assert.deepStrictEqual(folds, ["See a picture of it", "When to use it"]);
  const at = (s) => lesson.indexOf(s);
  assert.ok(at("See a picture of it") < at("When to use it") && at("When to use it") < at("Common mistakes: spot the error"), "the folds come before the mistakes");
  // the form, the mistakes and the tip are still drawn directly, not inside a fold
  assert.ok(lesson.includes('root.appendChild(h("h3", null, "Form"));'));
  assert.ok(lesson.includes('root.appendChild(h("h3", null, "Common mistakes: spot the error"));'));
  assert.ok(lesson.includes('h("div", { class: "tip" }'));
  // nothing the lesson used to show was dropped: the comparison and the second diagram moved into the folds
  assert.ok(lesson.includes("lesson.compare.title") && lesson.includes("lesson.extraTitle") && lesson.includes("lesson.functions.map"));
});
