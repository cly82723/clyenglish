"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");

test("the page turn is kept for the cover tabs; links inside a hub change at once", () => {
  const js = read("assets", "js", "motion.js");
  assert.ok(/TAB_PAGES = \["index\.html", "junior\.html", "senior\.html"\]/.test(js), "the cover tab pages are not named");
  assert.ok(/skipTransition\(\)/.test(js), "other moves are not skipped");
});

test("the last row of a long hub never waits more than a quarter of a second", () => {
  const js = read("assets", "js", "motion.js");
  assert.ok(/ROW_SPREAD_MS = 250/.test(js), "no cap on the row stagger");
  assert.ok(/Math\.min\(landed\+\+ \* ROW_GAP_MS, ROW_SPREAD_MS\)/.test(js), "the stagger is not capped");
});

test("the quiz shows ten marks, one per question, and names them for a screen reader", () => {
  const js = read("assets", "js", "vocab-practice.js");
  const css = read("assets", "css", "guide.css");
  assert.ok(/class: "q-strip", role: "img", "aria-label"/.test(js), "the strip has no spoken label");
  assert.ok(/marks\[at\] = tries \? "hint" : "first"/.test(js), "right answers are not marked");
  for (const cls of [".q-strip", ".q-step.is-first", ".q-step.is-hint", ".q-step.is-now"]) assert.ok(css.includes(cls), cls + " is not styled");
});

test("on phones the first door shows on the first screen of Home", () => {
  const css = read("assets", "css", "story.css");
  assert.ok(/\.scene-title \{ min-height: 68vh; min-height: 68svh;/.test(css), "the title scene is not shortened on phones");
});
