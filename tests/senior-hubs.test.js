"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

test("Senior is one flat list of six doors, with no group headings, and two papers still to come", () => {
  const html = read("senior.html");
  assert.ok(!/class="rows-group"/.test(html), "Senior still has group headings");
  const links = [...html.matchAll(/<a class="row step-link" href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(links, ["paper-2.html", "paper-3.html", "grammar.html", "before-the-exam.html"]);
  assert.strictEqual((html.match(/step-soon/g) || []).length, 2);
});

test("Paper 2 and Before the exam are their own hubs, and their pages say so in the breadcrumb", () => {
  const p2 = [...read("paper-2.html").matchAll(/<a class="row step-link" href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(p2, ["part-a.html", "part-b.html", "toolkit.html", "text-types.html", "questions.html"]);
  const exam = [...read("before-the-exam.html").matchAll(/<a class="row step-link" href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(exam, ["cutoffs.html", "final.html"]);
  for (const f of ["part-a.html", "part-b-choose.html", "toolkit-linking.html", "text-types-letter.html", "questions-part-b.html", "past-questions/2025-part-b.html"]) {
    assert.ok(/<li><a href="(\.\.\/)?paper-2\.html">Paper 2<\/a><\/li>/.test(read(f)), f + " has no Paper 2 crumb");
  }
  for (const f of ["cutoffs.html", "final.html"]) assert.ok(read(f).includes('<li><a href="before-the-exam.html">Before the exam</a></li>'), f);
});
