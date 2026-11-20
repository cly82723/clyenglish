"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8").replace(/\r\n/g, "\n");
const questions = read("questions.html"), text = read("text-types.html"), cutoffs = read("cutoffs.html"), words = read("toolkit-words.html");

test("past questions: every topic tag points at a real Toolkit topic, and the summary counts what is tagged", () => {
  const ids = new Set([...words.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  const per = {}, years = {};
  let tagged = 0;
  for (const m of questions.matchAll(/<article class="q" id="y([0-9]{4})-q[0-9]+">(?:(?!<p class="q-head">)[^])*<p class="q-head">((?:(?!<[/]p>)[^])*)<[/]p>/g)) {
    if (!m[2].includes('q-themes')) continue;
    const chips = [...m[2].matchAll(/href="toolkit-words\.html#(vocab-[a-z]+)"/g)].map((c) => c[1]);
    assert.ok(chips.length >= 1 && chips.length <= 2, "a question has " + chips.length + " tags");
    assert.strictEqual(new Set(chips).size, chips.length, "a question repeats a tag");
    tagged++;
    for (const c of chips) { assert.ok(ids.has(c), c + " is not a topic row on the words page"); per[c] = (per[c] || 0) + 1; (years[c] = years[c] || new Set()).add(m[1]); }
  }
  assert.strictEqual(tagged, 73);
  const summary = questions.slice(questions.indexOf("Which topics come back"), questions.indexOf('id="y2026"'));
  for (const [c, n] of Object.entries(per)) {
    const row = summary.match(new RegExp('href="toolkit-words[.]html#' + c + '"><b>[^<]*</b></a> ([0-9]+) questions?, in ([0-9]+) of 14 years'));
    assert.ok(row, c + " is missing from the summary");
    assert.strictEqual(Number(row[1]), n, c + ": the summary count differs from the tags");
    assert.strictEqual(Number(row[2]), years[c].size, c + ": the summary years differ from the tags");
  }
  assert.ok(Object.values(years).every((y) => y.size < 14), "the summary says no topic appears every year, so none may");
});

test("every sentence pattern has a second example on another topic", () => {
  const folds = [...text.matchAll(/<details class="why" id="patterns-[a-z]+">([\s\S]*?)<\/details>/g)].map((m) => m[1]);
  assert.strictEqual(folds.length, 6);
  let n = 0;
  for (const f of folds) for (const li of f.match(/<li>[\s\S]*?<\/li>/g)) {
    const first = /<p class="pattern-ex">([\s\S]*?)<\/p>/.exec(li), second = /<p class="pattern-ex2"><b>Another topic:<\/b> ([\s\S]*?)<\/p>/.exec(li);
    assert.ok(first && second, "a pattern has no second example: " + li.slice(0, 80));
    assert.ok(second[1].trim().length > 20, "a second example is too short");
    assert.notStrictEqual(second[1], first[1], "a second example repeats the first");
    n++;
  }
  assert.strictEqual(n, 37);
});

test("cut-offs: the official table has every year from 2026 to 2013, each row rising across the levels, and the words quote it", () => {
  const table = cutoffs.match(/<table class="share-table">[\s\S]*?<\/table>/)[0];
  const rows = [...table.matchAll(/<tr><th scope="row">(\d{4})<\/th>((?:<td>[\d.]+<\/td>){6})<\/tr>/g)].map((m) => ({ year: Number(m[1]), v: [...m[2].matchAll(/([\d.]+)</g)].map((x) => Number(x[1])) }));
  assert.deepStrictEqual(rows.map((r) => r.year), Array.from({ length: 14 }, (_, i) => 2026 - i));
  for (const r of rows) for (let i = 1; i < 6; i++) assert.ok(r.v[i] >= r.v[i - 1], r.year + ": level " + i + " is lower than the level above it");
  const intro = cutoffs.match(/In 2026, ([\d.]+)% reached 5\*\*, ([\d.]+)% reached 5\* or above, ([\d.]+)% reached 5 or above, and ([\d.]+)% reached level 3/);
  assert.deepStrictEqual(intro.slice(1).map(Number), [rows[0].v[0], rows[0].v[1], rows[0].v[2], rows[0].v[4]]);
  const range = cutoffs.match(/between ([\d.]+)% and ([\d.]+)% every year since 2013, and level 3 or above between ([\d.]+)% \((\d{4})\) and ([\d.]+)% \((\d{4})\)/);
  assert.strictEqual(Number(range[1]), Math.min(...rows.map((r) => r.v[0])));
  assert.strictEqual(Number(range[2]), Math.max(...rows.map((r) => r.v[0])));
  assert.strictEqual(Number(range[3]), Math.min(...rows.map((r) => r.v[4])));
  assert.strictEqual(Number(range[5]), Math.max(...rows.map((r) => r.v[4])));
  assert.ok(/hkeaa\.edu\.hk\/DocLibrary\/HKDSE\/Exam_Report\/Examination_Statistics\/dseexamstat25_1\.pdf/.test(cutoffs) && /HKDSE26_ResultsReleased_en\.pdf/.test(cutoffs), "the sources are not linked");
  assert.ok(/Estimates, not official/.test(cutoffs), "the warning about the estimated cut-offs must stay");
  assert.ok(/not Paper 2 alone/.test(cutoffs), "the table must say it is the whole subject, not Paper 2");
});
