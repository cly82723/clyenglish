"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const idsIn = (html) => new Set((html.match(/ id="([^"]+)"/g) || []).map((s) => s.slice(5, -1)));
const GUIDES = ["part-a.html", "part-b.html", "text-types.html", "questions.html", "toolkit.html", "final.html", "cutoffs.html"];
const pages = Object.fromEntries(GUIDES.map((f) => [f, read(f)]));
const moved = JSON.parse(pages["part-b.html"].match(/window\.CLY_MOVED = (\{.*?\});/)[1]);

test("every S.5 and S.6 guide is one list of rows, with no side contents list", () => {
  for (const file of GUIDES) {
    assert.ok(/<details class="row[ "]/.test(pages[file]), file + " has no rows");
    assert.ok(!/<nav class="index"/.test(pages[file]), file + " still has a side list");
  }
});

test("Part B is five steps, in order", () => {
  const rows = [...pages["part-b.html"].matchAll(/<details class="row" id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(rows, ["choose", "method", "crei", "language", "check"]);
});

test("the strip is the same seven links on every S.5 and S.6 guide", () => {
  const strip = (html) => [...html.match(/<nav class="forms"[\s\S]*?<\/nav>/)[0].matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
  for (const file of GUIDES) {
    assert.deepStrictEqual(strip(pages[file]), ["part-a.html", "part-b.html", "text-types.html", "questions.html", "toolkit.html", "final.html", "cutoffs.html"], file);
  }
});

test("cut-offs run from 2026 back to 2013, six levels a year, each level no higher than the one above", () => {
  const rows = [...pages["cutoffs.html"].matchAll(/<details class="row cut-row" id="y(\d{4})"[\s\S]*?<\/summary>/g)];
  const years = rows.map((m) => Number(m[1]));
  assert.deepStrictEqual(years, Array.from({ length: 14 }, (_, i) => 2026 - i));
  for (const m of rows) {
    const levels = [...m[0].matchAll(/class="cut-lv">([^<]+)<\/span><b>(\d+)%/g)];
    assert.deepStrictEqual(levels.map((l) => l[1]), ["5**", "5*", "5", "4", "3", "2"], m[1]);
    const shares = levels.map((l) => Number(l[2]));
    assert.deepStrictEqual(shares, shares.slice().sort((a, b) => b - a), m[1] + " is out of order");
  }
});

test("the cut-offs page says its figures are estimates and names where they come from", () => {
  const html = pages["cutoffs.html"];
  assert.ok(/Estimates, not official/.test(html));
  ["afterschool.com.hk", "notesity.hk", "dsetreasure.com"].forEach((site) => assert.ok(html.includes(site), site + " is not credited"));
});

test("past questions run from 2026 back to 2013, each year with Part A and its Part B questions in order", () => {
  const html = pages["questions.html"];
  const years = [...html.matchAll(/<details class="row year-row" id="y(\d{4})"/g)].map((m) => Number(m[1]));
  assert.deepStrictEqual(years, Array.from({ length: 14 }, (_, i) => 2026 - i));
  for (const year of years) {
    const numbers = [...html.matchAll(new RegExp('<article class="q" id="y' + year + '-q(\\d+)"', "g"))].map((m) => Number(m[1]));
    const last = year >= 2024 ? 5 : 9;   // four Part B questions from 2024, eight before
    assert.deepStrictEqual(numbers, Array.from({ length: last }, (_, i) => i + 1), String(year));
  }
});

test("every past question has a text type and a summary, and names an elective only up to 2023", () => {
  const questions = [...pages["questions.html"].matchAll(/<article class="q" id="y(\d{4})-q(\d+)">\s*<p class="q-head">([\s\S]*?)<\/p>\s*<p class="q-task">([^<]+)</g)];
  assert.strictEqual(questions.length, 114);
  for (const [, year, n, head, task] of questions) {
    const id = year + " Q" + n;
    assert.ok(/class="q-type"[^>]*>[^<]{3,}</.test(head), id + " has no text type");
    assert.ok(task.trim().length > 40, id + " has no summary");
    assert.strictEqual(/class="q-elective"/.test(head), Number(year) <= 2023 && Number(n) > 1, id + " elective");
  }
});

test("the nine CLY samples sit under their questions, and the old samples page forwards with its #part", () => {
  const html = pages["questions.html"];
  const withSample = [...html.matchAll(/<article class="q" id="(y\d{4}-q\d+)">(?:(?!<\/article>)[\s\S])*?<details class="why q-sample">/g)].map((m) => m[1]);
  assert.deepStrictEqual(withSample, ["y2025-q2", "y2025-q4", "y2024-q4", "y2022-q8", "y2018-q5", "y2017-q7", "y2016-q2", "y2016-q7", "y2015-q4"]);
  const old = read("samples.html");
  assert.ok(old.includes('location.replace("questions.html" + location.hash)'), "the old page must pass the #part on");
  assert.ok(!/<details/.test(old), "the old page still has content");
});

test("no page links to the old samples page", () => {
  for (const file of ["index.html", "self-study.html", ...GUIDES, "assets/js/data/tips.js", "assets/js/data/words.js"]) {
    assert.ok(!read(file).includes("samples.html"), file + " still links to samples.html");
  }
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
    for (const m of read(file).matchAll(/(part-a|part-b|text-types|questions|cutoffs|toolkit|final)\.html#([A-Za-z0-9-]+)/g)) {
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
