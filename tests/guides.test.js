"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const idsIn = (html) => new Set((html.match(/ id="([^"]+)"/g) || []).map((s) => s.slice(5, -1)));
const GUIDES = ["part-a.html", "part-b.html", "text-types.html", "samples.html", "toolkit.html", "final.html"];
const pages = Object.fromEntries(GUIDES.map((f) => [f, read(f)]));
const moved = JSON.parse(pages["part-b.html"].match(/window\.CLY_MOVED = (\{.*?\});/)[1]);

test("every S.5 and S.6 guide is one list of rows, with no side contents list", () => {
  for (const file of GUIDES) {
    assert.ok(/<details class="row"/.test(pages[file]), file + " has no rows");
    assert.ok(!/<nav class="index"/.test(pages[file]), file + " still has a side list");
  }
});

test("Part B is five steps, in order", () => {
  const rows = [...pages["part-b.html"].matchAll(/<details class="row" id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(rows, ["choose", "method", "crei", "language", "check"]);
});

test("the strip is the same six links on every S.5 and S.6 guide", () => {
  const strip = (html) => [...html.match(/<nav class="forms"[\s\S]*?<\/nav>/)[0].matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
  for (const file of GUIDES) {
    assert.deepStrictEqual(strip(pages[file]), ["part-a.html", "part-b.html", "text-types.html", "samples.html", "toolkit.html", "final.html"], file);
  }
});

test("past paper samples are nine questions, newest year first, each with its text type", () => {
  const rows = [...pages["samples.html"].matchAll(/<details class="row" id="y(\d{4})-q(\d+)"[\s\S]*?<span class="row-title">([^<]+)</g)];
  assert.strictEqual(rows.length, 9);
  const years = rows.map((m) => Number(m[1]));
  assert.deepStrictEqual(years, years.slice().sort((a, b) => b - a));
  rows.forEach((m) => assert.ok(m[3].trim().length > 3, "no text type on " + m[0].slice(0, 40)));
});

test("everything that left Part B has a new home that exists", () => {
  for (const [id, target] of Object.entries(moved)) {
    const [file, hash] = target.split("#");
    assert.ok(pages[file], id + " points at an unknown page " + file);
    if (hash) assert.ok(idsIn(pages[file]).has(hash), id + " points at " + target + ", which is not there");
  }
});

test("no link on the site points at a part of a guide that is not there", () => {
  const files = ["index.html", "self-study.html", "grammar.html", "s3-grammar.html", "challenge.html", "s3-challenge.html", ...GUIDES, "assets/js/data/tips.js", "assets/js/data/words.js"];
  for (const file of files) {
    for (const m of read(file).matchAll(/(part-a|part-b|text-types|samples|toolkit|final)\.html#([A-Za-z0-9-]+)/g)) {
      const target = m[1] + ".html";
      assert.ok(idsIn(pages[target]).has(m[2]) || (target === "part-b.html" && moved[m[2]]), file + " links to " + m[0] + ", which is not there");
    }
  }
});

test("each month's words are complete, and no month has more than 31", () => {
  global.window = {};
  require(path.join(root, "assets", "js", "data", "words.js"));
  const months = Object.keys(window.CLY_WORDS);
  assert.ok(months.length >= 1);
  for (const month of months) {
    assert.match(month, /^\d{4}-\d{2}$/);
    const list = window.CLY_WORDS[month];
    assert.ok(list.length >= 28 && list.length <= 31, month + " has " + list.length + " words");
    list.forEach((w, i) => ["word", "weak", "strong", "topic", "href"].forEach((k) => assert.ok(w[k], month + " word " + (i + 1) + " has no " + k)));
  }
});

test("the fox no longer gives a word of the day", () => {
  global.window = {};
  delete require.cache[require.resolve(path.join(root, "assets", "js", "data", "tips.js"))];
  require(path.join(root, "assets", "js", "data", "tips.js"));
  assert.deepStrictEqual(Object.keys(window.CLY_TIPS).sort(), ["grammar", "writing"]);
});
