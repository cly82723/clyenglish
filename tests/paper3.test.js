"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const PAGES = [
  ["task", "paper-3-b2-task-lines.html"], ["datafile", "paper-3-b2-data-file.html"], ["notes", "paper-3-b2-notes.html"],
  ["charts", "paper-3-b2-charts.html"], ["words", "paper-3-b2-own-words.html"],
];

test("the Paper 3 hub lists the five B2 skills in order, each with its tick id, and Part A is coming soon", () => {
  const hub = read("paper-3.html");
  const rows = [...hub.matchAll(/<a class="row step-link" href="([^"]+)" data-step-link="([^"]+)"/g)].map((m) => [m[2], m[1]]);
  assert.deepStrictEqual(rows, PAGES);
  assert.ok(hub.includes('data-done-key="cly:p3b2-done"'));
  assert.ok(/Part A · Listening<\/b> <span>Coming soon/.test(hub));
});

test("each skill page opens on a concept check, ends on a closing one that ticks it, and links to the next page", () => {
  PAGES.forEach(([id, file], i) => {
    const html = read(file);
    assert.ok(html.includes('data-step="' + id + '"') && html.includes('data-done-key="cly:p3b2-done"'), file);
    assert.ok(/<section class="opener" data-gates data-opener="[a-z]+-open"/.test(html), file + " has no gating opener");
    assert.ok(new RegExp('data-step-done data-step-id="' + id + '"').test(html), file + " does not tick its step");
    assert.ok(/<div class="step-lesson row-body" data-lesson hidden>/.test(html), file);
    const next = html.match(/<p class="row-next"><a href="([^"]+)"/)[1];
    assert.strictEqual(next, i < 4 ? PAGES[i + 1][1] : "text-types.html", file);
  });
});

test("every try-it question has exactly one right answer and an explanation", () => {
  for (const [, file] of PAGES) {
    const qs = [...read(file).matchAll(/<div class="tryit-q" data-q>([^]*?)<p class="tryit-why" hidden>([^]*?)<\/p>/g)];
    assert.ok(qs.length >= 3, file + " has too few questions");
    for (const q of qs) {
      assert.strictEqual((q[1].match(/data-ok/g) || []).length, 1, file + ": a question without one right answer");
      assert.ok(q[2].trim().length > 20, file + ": no explanation");
    }
  }
});

test("every page that shows official extracts carries the HKEAA credit", () => {
  for (const [, file] of PAGES) {
    const html = read(file);
    assert.ok(/© Hong Kong Examinations and Assessment Authority\. Reproduced with permission\./.test(html), file + " has no credit");
  }
  assert.ok(read("paper-3.html").includes("Reproduced with permission"));
});

test("the 2024 official points are listed in full: 8, 9 and 9", () => {
  const html = read("paper-3-b2-data-file.html");
  for (const [task, n] of [[8, 8], [9, 9], [10, 9]]) {
    const items = [...html.matchAll(new RegExp("<strong>" + task + "[.]([0-9]+)</strong>", "g"))];
    assert.strictEqual(items.length, n, "Task " + task);
  }
});

test("Senior links to Paper 3, and the practice passages are marked for the Hear it button", () => {
  assert.ok(read("senior.html").includes('href="paper-3.html"'));
  const notes = read("paper-3-b2-notes.html");
  assert.strictEqual((notes.match(/data-speak="#ts-[abc]"/g) || []).length, 3);
  assert.ok(notes.includes('id="ts-a"') && notes.includes("data-say"));
  assert.ok(read("assets/js/tryit.js").includes("SpeechSynthesisUtterance"));
});
