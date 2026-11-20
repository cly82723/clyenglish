"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8").replace(/\r\n/g, "\n");
const site = read("assets/css/site.css"), guide = read("assets/css/guide.css");

test("one focus per section: the highlighter stays rare", () => {
  const caps = { "text-types.html": 20, "index.html": 5 };
  for (const f of fs.readdirSync(root).filter((n) => n.endsWith(".html") && n !== "samples.html")) {
    const marks = (read(f).match(/<mark class="swipe">/g) || []).length;
    assert.ok(marks <= (caps[f] || 5), f + " has " + marks + " highlighted sentences");
  }
});

test("a checklist item does not bold words: the tick is the thing to look at", () => {
  const html = read("text-types.html");
  for (const m of html.matchAll(/<ul class="checklist" data-store="check-[a-z]+"[^>]*>[^]*?<[/]ul>/g)) {
    assert.ok(!/<(strong|b)>/.test(m[0]), "a text-type checklist bolds a phrase");
  }
});

test("emphasis steps down and does not repeat", () => {
  assert.ok(/[.]word-head span [{] color: var[(]--ink-soft[)]; font-weight: 400; [}]/.test(site), "a word's partners should be regular weight under a bold headword");
  assert.ok(/[.]word-up [{][^}]*font-weight: 400;/.test(site), "the 3 to 5** side note should be regular weight");
  assert.ok(/[.]stack th [{] font-weight: 600;/.test(site), "a stacked table's row label should be quieter than the formula under it");
  assert.ok(/[.]goal [{][^}]*color: var[(]--ink-soft[)]/.test(guide) && !/[.]goal [{][^}]*background/.test(guide), "the goal should be a quiet line, not a second box");
  assert.ok(/[.]from-real [{][^}]*background: none/.test(site), "the real-script source note should be outlined, not a filled pill");
  assert.ok(/[.]pattern-ex2 b [{][^}]*font: 600/.test(guide), "the Another topic label should not out-weigh the example");
});
