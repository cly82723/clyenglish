"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");
const motionCss = read("assets", "css", "motion.css");
const motionJs = read("assets", "js", "motion.js");

// The hub rows wait (hidden) only once motion.js is watching them, so a page without the script never hides anything.
const HUBS = ["part-a.html", "part-b.html", "toolkit.html", "s3-grammar.html"];

test("hub rows arrive one after another, only where motion is welcome", () => {
  const block = motionCss.slice(motionCss.indexOf("Hub rows arrive"));
  assert.ok(block.length > 100, "no 'Hub rows arrive' section in motion.css");
  assert.ok(/prefers-reduced-motion: no-preference/.test(block), "arrival is not limited to no-preference");
  assert.ok(/html:not\(\[data-lite\]\)[^{]*\.waits/.test(block), "lite mode would still hide rows");
  assert.ok(/\.arrives[^{]*\{[^}]*animation:[^}]*var\(--spring\)[^}]*var\(--wait/.test(block), "arrival should use the spring and the --wait stagger");
  assert.ok(/backwards/.test(block), "the animation must let go afterwards (fill backwards) so rows can be pressed");
});

test("motion.js watches the hub rows, skips reduced motion, and never leaves a row hidden", () => {
  const code = motionJs.slice(motionJs.indexOf("Hub rows arrive"));
  assert.ok(code.length > 100, "no 'Hub rows arrive' section in motion.js");
  assert.ok(/\.steps \.step-link/.test(code), "Part A, Part B and Toolkit rows are not watched");
  assert.ok(/details\.row\[data-topic\]/.test(code), "S.3 topic rows are not watched");
  assert.ok(/prefers-reduced-motion: reduce/.test(code), "reduced motion is not checked");
  assert.ok(/setTimeout/.test(code), "no safety net if the observer never fires");
});

test("every hub page loads motion.js", () => {
  for (const page of HUBS) assert.ok(/motion\.js/.test(read(page)), page + " does not load motion.js");
});

test("the first unfinished step gets one gentle nudge on its number", () => {
  assert.ok(/is-next/.test(motionJs), "motion.js never marks the next step");
  assert.ok(/\.is-next \.row-mark/.test(motionCss), "no nudge style for the next step's number");
});
