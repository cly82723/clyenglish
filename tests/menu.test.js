"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const pages = [...fs.readdirSync(root).filter((f) => f.endsWith(".html") && f !== "samples.html"), ...fs.readdirSync(path.join(root, "past-questions")).map((f) => "past-questions/" + f)];

test("every page has the three cover tabs: Home, Junior, Senior", () => {
  for (const file of pages) {
    const tabs = read(file).match(/<nav class="tabs"[^]*?<[/]nav>/)[0];
    const labels = [...tabs.matchAll(/<a href="[^"]+"[^>]*>([^<]+)<[/]a>/g)].map((m) => m[1]);
    assert.deepStrictEqual(labels, ["Home", "Junior", "Senior"], file);
  }
});

test("the pop-up menu lists every hub, and every link in it is a real page", () => {
  const code = read("assets/js/site.js");
  const menu = code.slice(code.indexOf("var MENU = ["), code.indexOf("function initSiteMenu"));
  const links = [...menu.matchAll(/"([a-z0-9-]+[.]html)"/g)].map((m) => m[1]);
  assert.deepStrictEqual(links.slice().sort(), ["challenge.html", "cutoffs.html", "final.html", "grammar.html", "part-a.html", "part-b.html", "questions.html", "s3-challenge.html", "s3-grammar.html", "text-types.html", "toolkit.html", "vocab.html"]);
  for (const f of links) assert.ok(fs.existsSync(path.join(root, f)), f + " does not exist");
  assert.ok(!fs.existsSync(path.join(root, "menu.html")), "the old menu page is still there");
});

test("the menu opens on hover for a mouse and on a tap for everything else, and Escape closes it", () => {
  const code = read("assets/js/site.js");
  assert.ok(/pointerenter[^]*?e\.pointerType !== "mouse"/.test(code), "hover must only open it for a mouse");
  assert.ok(/btn\.addEventListener\("click"/.test(code), "a tap must open it");
  assert.ok(/e\.key === "Escape"/.test(code), "Escape must close it");
  assert.ok(/aria-expanded/.test(code) && /aria-controls/.test(code), "the button must say whether the menu is open");
});
