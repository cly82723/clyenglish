"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const directory = html.slice(html.indexOf('<nav class="directory"'), html.indexOf("</nav>", html.indexOf('<nav class="directory"')));

test("the home directory is one plain list of S.3 to S.6, with no track headings", () => {
  const forms = [...directory.matchAll(/class="form-mark">(S\.\d)</g)].map((m) => m[1]);
  assert.deepStrictEqual(forms, ["S.3", "S.4", "S.5", "S.6"]);
  assert.ok(!/<h3|class="tracks"/.test(directory), "track headings or columns are still there");
});

test("every directory link says which form it belongs to, for screen readers", () => {
  for (const row of directory.match(/<li>.*?<\/li>/g)) {
    const form = row.match(/class="form-mark">(S\.\d)</)[1];
    for (const link of row.match(/<a [^>]*>[^<]*<\/a>/g)) {
      const text = link.match(/>([^<]*)</)[1];
      assert.ok(link.includes('aria-label="' + form + " " + text + '"'), "no form in: " + link);
    }
  }
});

test("students are told plainly that the teacher can see them leave the page", () => {
  const source = read("assets/js/challenge.js");
  assert.ok(!source.includes("is recorded"), "the old wording is still there");
  assert.ok(source.includes("Your teacher can see if you leave for more than 3 seconds."));
  assert.ok(/MIN_AWAY_MS:\s*3000/.test(read("apps-script/Code.gs")), "the warning says 3 seconds, so the server must agree");
});

test("the start screen keeps the how-to in place: Start replaces itself, nothing above it collapses", () => {
  const source = read("assets/js/challenge.js");
  const ready = source.slice(source.indexOf("function ready(me)"), source.indexOf("function boards("));
  assert.ok(ready.indexOf("clear(spot)") !== -1);
  assert.ok(/h\("div", null, spot, howTo\(\)\)/.test(ready), "the how-to must sit outside the spot that Start clears, and below it");
});

test("proofreading papers keep their hand-in confirm exactly as it was", () => {
  const source = read("assets/js/challenge.js");
  const confirm = source.slice(source.indexOf("function confirmHandIn(spot)"), source.indexOf("function handIn(timeUp)"));
  assert.ok(/ch\.format === "cloze"/.test(confirm), "the safer focus and Esc are for cloze weeks only");
  assert.ok(confirm.includes('".btn"'), "other formats still focus Hand in");
});
