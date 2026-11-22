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

test("Senior links to Paper 3, and the practice passages play the real recording", () => {
  assert.ok(read("senior.html").includes('href="paper-3.html"'));
  const notes = read("paper-3-b2-notes.html");
  for (const clip of ["2024-b2-review-board", "2024-b2-lifetime-membership", "2024-b2-white-sand-beaches"]) {
    assert.ok(notes.includes('src="assets/audio/' + clip + '.mp3"'), clip + " is not on the page");
  }
  assert.ok(notes.includes('id="ts-a"') && notes.includes('id="ts-c"'));
  assert.ok(!notes.includes("data-speak") && !read("assets/js/tryit.js").includes("SpeechSynthesis"), "the text-to-speech button should be gone");
});

test("both full Part B2 recordings are on the notes page with timestamps that stay inside the recording", () => {
  const notes = read("paper-3-b2-notes.html");
  const LENGTH = { "rec-2024-audio": 525.5, "rec-2022-audio": 482.8 };
  for (const [id, length] of Object.entries(LENGTH)) {
    assert.ok(notes.includes('id="' + id + '"'), id + " is missing");
    const times = [...notes.matchAll(new RegExp('data-audio="' + id + '" data-t="([0-9.]+)"', "g"))].map((m) => parseFloat(m[1]));
    assert.ok(times.length >= 6, id + " has too few timestamps");
    assert.deepStrictEqual(times, [...times].sort((a, b) => a - b), id + " timestamps are not in order");
    assert.ok(times.every((t) => t >= 0 && t < length - 5), id + " has a timestamp outside the recording");
  }
  for (const file of ["2022-b2", "2024-b2", "2024-b2-review-board", "2024-b2-lifetime-membership", "2024-b2-white-sand-beaches"]) {
    assert.ok(fs.existsSync(path.join(root, "assets", "audio", file + ".mp3")), file + ".mp3 is not in assets/audio");
  }
  assert.ok(/Recordings: HKDSE English Language 2022 and 2024 Paper 3/.test(notes) && /Hong Kong Examinations and Assessment Authority/.test(notes), "the recordings are not credited to the HKEAA");
});
