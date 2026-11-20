"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const css = (file) => fs.readFileSync(path.join(root, "assets", "css", file), "utf8");
const motion = css("motion.css"), challenge = css("challenge.css"), site = css("site.css"), story = css("story.css");

test("springs are defined once, with a fallback for browsers without linear()", () => {
  assert.ok(/--spring: cubic-bezier\(/.test(motion), "no --spring fallback");
  assert.ok(/--spring-bounce: cubic-bezier\(/.test(motion), "no --spring-bounce fallback");
  const real = motion.match(/--spring: (linear\([^)]*\));/);
  assert.ok(real, "no linear() spring");
  const points = real[1].replace(/^linear\(|\)$/g, "").split(",").map(Number);
  assert.strictEqual(points[0], 0);
  assert.strictEqual(points[points.length - 1], 1);
  assert.ok(Math.max(...points) <= 1.001, "the default spring overshoots: it must be critically damped");
  const bounce = motion.match(/--spring-bounce: (linear\([^)]*\));/)[1].replace(/^linear\(|\)$/g, "").split(",").map(Number);
  assert.ok(Math.max(...bounce) > 1 && Math.max(...bounce) < 1.05, "the bounce spring should overshoot a little, and only a little");
  assert.strictEqual(bounce[bounce.length - 1], 1);
});

test("nothing tilts or flips further than a hand would: 3D angles stay subtle", () => {
  // the two exceptions are the book's own page turn (a view transition) and the countdown's split-flap tile
  const allowed = /leaf-away|leaf-back|flip-tick|perspective\(2000px\)/;
  for (const [name, text] of [["motion.css", motion], ["challenge.css", challenge]]) {
    text.split("\n").forEach((line, i) => {
      if (allowed.test(line)) return;
      for (const m of line.matchAll(/rotate[XY]\((-?\d+(?:\.\d+)?)deg\)/g)) {
        assert.ok(Math.abs(Number(m[1])) <= 64, name + ":" + (i + 1) + " rotates " + m[1] + "deg");
      }
      for (const m of line.matchAll(/\* (-?\d+(?:\.\d+)?)deg/g)) {
        assert.ok(Math.abs(Number(m[1])) <= 9, name + ":" + (i + 1) + " tilts " + m[1] + "deg for a pointer");
      }
    });
  }
});

test("everything translucent has a solid fallback for reduced transparency and more contrast", () => {
  assert.ok(/prefers-reduced-transparency: reduce/.test(motion));
  assert.ok(/prefers-contrast: more/.test(motion));
  assert.ok(/backdrop-filter/.test(story) && /\.cover-home/.test(motion.split("prefers-reduced-transparency")[1]), "the sticky bar has no reduced-transparency fallback");
});

test("a press goes in at once and lets go on a spring", () => {
  assert.ok(/transform 0\.45s var\(--spring\)/.test(site), "controls do not release on a spring");
  assert.ok(/transition-duration: 70ms/.test(site), "controls do not press in at once");
});
