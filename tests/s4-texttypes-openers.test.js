"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const PAGES = ["s4-tenses", "s4-passive", "s4-gerunds-infinitives", "s4-conditionals", "text-types-article", "text-types-letter", "text-types-speech", "text-types-proposal", "text-types-report", "text-types-story"];
const read = (page) => fs.readFileSync(path.join(root, page + ".html"), "utf8").split("\r\n").join("\n");

test("each S.4 and Text types page opens and closes with one two-choice question", () => {
  for (const page of PAGES) {
    const html = read(page);
    const sections = [...html.matchAll(/<section class="opener"[^>]*data-opener="([^"]+)"[^>]*>([^]*?)<\/section>/g)];
    assert.strictEqual(sections.length, 2, page + " needs an opening and a closing question");
    for (const [, id, body] of sections) {
      assert.strictEqual((body.match(/class="opener-choice"/g) || []).length, 2, id + " must have two choices");
      assert.strictEqual((body.match(/ data-ok /g) || []).length, 1, id + " must have exactly one better choice");
      assert.ok(/class="opener-reveal" hidden/.test(body), id + " has no reveal");
    }
    assert.ok(html.indexOf(sections[0][1]) < html.indexOf('class="topic-lesson row-body"'), page + ": the first question comes before the lesson");
    assert.ok(html.indexOf(sections[1][1]) < html.indexOf('class="row-next"'), page + ": the closing question comes before the Next row");
  }
});

test("these openers never hold the lesson back, and each page loads opener.js", () => {
  for (const page of PAGES) {
    const html = read(page);
    assert.ok(!/data-gates|data-lesson/.test(html), page + " must keep its lesson visible");
    assert.ok(/assets\/js\/opener\.js/.test(html), page + " does not load opener.js");
  }
});
