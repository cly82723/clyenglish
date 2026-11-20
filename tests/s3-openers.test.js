"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const S3P = require("./s3-pages.js");
const pages = Object.fromEntries(S3P.files.map((f) => [f, S3P.read(f).split(String.fromCharCode(13, 10)).join(String.fromCharCode(10))]));
const page = Object.values(pages).join(String.fromCharCode(10));
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets", "js", "data", "s3-grammar-data.js"), "utf8"), ctx);
const lessons = ctx.window.CLY_S3_GRAMMAR.lessons;
const clean = (s) => String(s).replace(/[*][*]/g, "");
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// every topic row, keyed by its data-topic
const rows = {};
for (const html of Object.values(pages)) {
  const m = html.match(/<main [^>]*data-step="([A-Za-z]+)"[^>]*>/);
  if (m) rows[m[1]] = html.slice(m.index, html.indexOf("</main>", m.index));
}
const buttons = (section) => [...section.matchAll(/<button type="button" class="opener-choice"( data-ok)? data-tag="([^"]*)">([^<]*)<[/]button>/g)].map((b) => ({ ok: !!b[1], tag: b[2], text: unescape(b[3]) }));
const openers = (row) => [...row.matchAll(/<section class="opener"[^>]*data-opener="([^"]+)"[^>]*>([^]*?)<[/]section>/g)].map((s) => ({ id: s[1], attrs: s[0].slice(0, s[0].indexOf(">")), html: s[2] }));

test("S.3 grammar: all eleven topics have an opener and a closing question", () => {
  assert.deepStrictEqual(Object.keys(rows).sort(), Object.keys(lessons).sort());
  for (const [key, row] of Object.entries(rows)) {
    const [open, close, ...more] = openers(row);
    assert.strictEqual(more.length, 0, key + " has more than two openers");
    assert.ok(/data-gates/.test(open.attrs) && !/data-step-done/.test(open.attrs), key + ": the first opener must hold the lesson back");
    assert.ok(/data-step-done/.test(close.attrs) && close.attrs.includes('data-step-id="' + key + '"'), key + ": the closing question must tick this topic");
    assert.ok(row.indexOf(open.id) < row.indexOf('class="topic-lesson"') && row.indexOf('class="topic-lesson"') < row.indexOf(close.id), key + ": order is opener, lesson, closing question");
  }
});

test("every opener sentence, reveal and check is the lesson's own, and the closing question uses a different mistake", () => {
  for (const [key, row] of Object.entries(rows)) {
    const mistakes = lessons[key].mistakes.map((m) => ({ wrong: clean(m.wrong), right: clean(m.right), why: clean(m.why) }));
    const used = [];
    for (const o of openers(row)) {
      const [a, b] = buttons(o.html);
      assert.ok(a && b && !a.ok && b.ok, key + ": a pair is one mistake and one correct sentence");
      const at = mistakes.findIndex((m) => m.wrong === a.text && m.right === b.text);
      assert.ok(at >= 0, key + ": " + a.text + " is not one of the lesson's mistakes");
      const why = unescape(/<p>([^<]*)<[/]p>\s*<[/]div>/.exec(o.html)[1]);
      assert.strictEqual(why, mistakes[at].why, key + ": the reveal is not the lesson's own why");
      used.push(at);
    }
    assert.notStrictEqual(used[0], used[1], key + ": the opener and the closing question use the same mistake");
    const check = unescape(/<p class="goal"><b>One check:<[/]b> ([^<]*)<[/]p>/.exec(row)[1]);
    assert.strictEqual(check, clean(lessons[key].tip), key + ": the one check is not the lesson's tip");
  }
});

test("the rules are behind a tap and the quiz is not, and every old anchor still exists", () => {
  for (const [key, row] of Object.entries(rows)) {
    const foldAt = row.indexOf('id="' + key + '-rules-fold"'), foldEnd = row.indexOf("</details>", foldAt);
    const fold = row.slice(foldAt, foldEnd);
    assert.ok(fold.includes('data-grammar="s3lesson" data-set="' + lessons[key].practice.id.replace("-quiz", "") + '"') || fold.includes('data-grammar="s3lesson"'), key + ": the rules are not in the fold");
    assert.ok(!fold.includes("s3quiz"), key + ": the quiz is hidden in the fold");
    assert.ok(row.includes('id="' + lessons[key].practice.id + '"') , key + ": the quiz anchor is gone");
    assert.ok(row.includes("-rules\""), key + ": the rules anchor is gone");
    assert.ok(/<p class="lead">[^<]{5,}<[/]p>/.test(row), key + ": no plain name under the title");
    assert.ok(new RegExp('data-step-link="' + key + '"[^]*?class="row-sub">[^<]{5,}<').test(pages["s3-grammar.html"]), key + ": the hub row has no plain name");
  }
});

test("the page keeps its ticks on the device and loads the scripts that draw them", () => {
  assert.ok(pages["s3-grammar.html"].includes("data-topics-done") && pages["s3-grammar.html"].includes('<script src="assets/js/topic-ticks.js"></script>'));
  for (const [file, html] of Object.entries(pages)) {
    if (!/<main [^>]*data-step=/.test(html)) continue;
    assert.ok(html.includes('data-done-key="cly:s3-done"') && html.includes('<script src="assets/js/opener.js"></script>'), file + " does not keep its tick");
  }
  const ids = [...page.matchAll(/data-opener="([^"]+)"/g)].map((m) => m[1]);
  assert.strictEqual(new Set(ids).size, ids.length, "an opener id is repeated");
  assert.strictEqual(ids.length, 22);
});
