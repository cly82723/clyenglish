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
// the hub forwards old links (part-b.html#crei) in a script in its head: first to a step page, then to where things moved
const hubScript = pages["part-b.html"].match(/var m=(\{.*?\}),o=(\{.*?\}),id=location/);
const toStep = JSON.parse(hubScript[1]);
const moved = JSON.parse(hubScript[2]);
const STEP_PAGES = ["part-b-choose.html", "part-b-content.html", "part-b-organisation.html", "part-b-language.html", "part-b-finish.html"];
for (const f of STEP_PAGES) pages[f] = read(f);
// the Toolkit hub forwards old links (toolkit.html#linking, #vocab-education) the same way
const toolkitMap = JSON.parse(pages["toolkit.html"].match(/var m=(\{.*?\}),id=location/)[1]);
const partAMap = JSON.parse(pages["part-a.html"].match(/var m=(\{.*?\}),id=location/)[1]);
const PART_A_SKILLS = ["part-a-read.html", "part-a-formats.html", "part-a-plan.html", "part-a-opening.html"];
for (const f of PART_A_SKILLS) pages[f] = read(f);
const TOOLKIT_SKILLS = ["toolkit-openings.html", "toolkit-linking.html", "toolkit-vocabulary.html", "toolkit-variety.html"];
for (const f of [...TOOLKIT_SKILLS, "toolkit-words.html"]) pages[f] = read(f);

test("every S.5 and S.6 guide is one list of rows, with no side contents list", () => {
  for (const file of GUIDES) {
    assert.ok(/<(details|a) class="row[ "]/.test(pages[file]), file + " has no rows");
    assert.ok(!/<nav class="index"/.test(pages[file]), file + " still has a side list");
  }
});

test("Part B is a hub of five step pages, in order, each page one skill with its opener", () => {
  const links = [...pages["part-b.html"].matchAll(/<a class="row step-link" id="go-([^"]+)" href="([^"]+)"/g)];
  assert.deepStrictEqual(links.map((m) => m[1]), ["choose", "method", "crei", "language", "check"]);
  assert.deepStrictEqual(links.map((m) => m[2]), STEP_PAGES);
  for (const [, id, file] of links) {
    assert.ok(pages[file].includes('data-step="' + id + '"'), file + " does not say which step it is");
    assert.ok(/<section class="opener" data-gates/.test(pages[file]), file + " starts without a concept-check");
    assert.ok(/<div class="step-lesson row-body" data-lesson hidden>/.test(pages[file]), file + " has no lesson to unlock");
  }
});

test("every old Part B link goes on to a step page, and the anchor it names is there", () => {
  for (const [id, target] of Object.entries(toStep)) {
    const [file, hash] = target.split("#");
    assert.ok(STEP_PAGES.includes(file), id + " goes to " + file);
    if (hash) assert.ok(idsIn(pages[file]).has(hash), id + " goes to " + target + ", which is not there");
  }
});

test("every S.5 and S.6 guide has a breadcrumb that starts at Senior and ends on the page itself", () => {
  for (const file of GUIDES) {
    const trail = pages[file].match(/<nav class="crumbs"[^]*?<[/]nav>/);
    assert.ok(trail, file + " has no breadcrumb");
    const links = [...trail[0].matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
    assert.strictEqual(links[0], "senior.html", file + " does not start at Senior");
    assert.ok(/<li aria-current="page">[^<]+<[/]li>/.test(trail[0]), file + " does not name itself");
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
  // 2026's are still one-paragraph summaries; every other year has the paper's wording, in paragraphs and lists
  const questions = [...pages["questions.html"].matchAll(/<article class="q" id="y(\d{4})-q(\d+)">\s*<p class="q-head">([\s\S]*?)<\/p>\s*<(?:p|div) class="q-task">([\s\S]*?)<\/(?:p|div)>\s*(?:<details|<\/article>)/g)]
    .map(([all, year, n, head, task]) => [all, year, n, head, task.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")]);
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

test("the Toolkit is a hub of five pages, and every old Toolkit link goes on to where its content now is", () => {
  const links = [...pages["toolkit.html"].matchAll(/<a class="row step-link" id="go-([^"]+)" href="([^"]+)"/g)];
  assert.deepStrictEqual(links.map((m) => m[2]), [...TOOLKIT_SKILLS, "toolkit-words.html"]);
  for (const file of TOOLKIT_SKILLS) {
    assert.ok(/<section class="opener" data-gates/.test(pages[file]), file + " starts without a concept-check");
    assert.ok(/<section class="opener" data-step-done/.test(pages[file]), file + " has no closing question");
  }
  assert.ok(/<section class="opener" data-step-done/.test(pages["toolkit-words.html"]), "the word page has no opener");
  for (const [id, target] of Object.entries(toolkitMap)) {
    const [file, hash] = target.split("#");
    assert.ok(pages[file], id + " goes to an unknown page " + file);
    if (hash) assert.ok(idsIn(pages[file]).has(hash), id + " goes to " + target + ", which is not there");
  }
});

test("Part A is a hub of four skill pages, each with an opener and a closing question, and old links go on to where their content is", () => {
  const links = [...pages["part-a.html"].matchAll(/<a class="row step-link" id="go-([^"]+)" href="([^"]+)"/g)];
  assert.deepStrictEqual(links.map((m) => m[2]), PART_A_SKILLS);
  for (const file of PART_A_SKILLS) {
    assert.ok(/<section class="opener" data-gates/.test(pages[file]), file + " starts without a concept-check");
    assert.ok(/<section class="opener" data-step-done/.test(pages[file]), file + " has no closing question");
  }
  for (const [id, target] of Object.entries(partAMap)) {
    const [file, hash] = target.split("#");
    assert.ok(pages[file], id + " goes to an unknown page " + file);
    if (hash) assert.ok(idsIn(pages[file]).has(hash), id + " goes to " + target + ", which is not there");
  }
  assert.ok(partAMap.formats && partAMap.check && partAMap.ladder, "an old Part A row has no forward");
});

test("Final lap is still one page of rows, with a concept-check at the top and a closing check at the foot", () => {
  const html = read("final.html");
  assert.strictEqual((html.match(/<details class="row"/g) || []).length, 5);
  const first = html.indexOf('data-opener="final-open"'), rows = html.indexOf('<details class="row"'), last = html.indexOf('data-opener="final-close"');
  assert.ok(first > 0 && first < rows && last > html.lastIndexOf('<details class="row"'), "openers are not at the top and the foot");
  assert.ok(html.includes('<script src="assets/js/opener.js"></script>'));
});

test("each text type has a Before you hand in checklist, and Part B's step pages have no tick-lists of their own", () => {
  const html = pages["text-types.html"];
  for (const type of ["article", "letter", "speech", "proposal", "report", "story"]) {
    const at = html.indexOf('<ul class="checklist" data-store="check-' + type + '"');
    const list = at < 0 ? null : [html.slice(at, html.indexOf("</ul>", at))];
    assert.ok(list, type + " has no checklist");
    const boxes = [...list[0].matchAll(/<input type="checkbox" id="(check-[a-z]+-[a-z]+)"/g)].map((m) => m[1]);
    assert.strictEqual(new Set(boxes).size, boxes.length, type + " has a repeated box id");
    assert.ok(boxes.length >= 7, type + " has too few boxes");
    for (const common of ["verbs", "words", "slips"]) assert.ok(boxes.includes("check-" + type + "-" + common), type + " is missing the " + common + " check");
    assert.ok(html.includes('id="handin-' + type + '"'), type + " has no anchor for its checklist");
    assert.ok(pages["part-b-finish.html"].includes('text-types.html#handin-' + type), "Step 5 does not link to the " + type + " checklist");
  }
  for (const f of STEP_PAGES) assert.ok(!/class="checklist"/.test(pages[f]), f + " still has a tick-list");
});

test("no link on the site points at a part of a guide that is not there", () => {
  const files = ["index.html", "self-study.html", "grammar.html", "s3-grammar.html", "challenge.html", "s3-challenge.html", ...GUIDES, "assets/js/data/tips.js", "assets/js/data/words.js"];
  for (const file of files) {
    for (const m of read(file).matchAll(/(?<![-A-Za-z])(part-a|part-b|text-types|questions|cutoffs|toolkit|final)\.html#([A-Za-z0-9-]+)/g)) {
      const target = m[1] + ".html";
      assert.ok(idsIn(pages[target]).has(m[2]) || (target === "part-b.html" && (moved[m[2]] || toStep[m[2]])) || (target === "toolkit.html" && toolkitMap[m[2]]) || (target === "part-a.html" && partAMap[m[2]]), file + " links to " + m[0] + ", which is not there");
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
