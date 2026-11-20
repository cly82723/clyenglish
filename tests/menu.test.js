"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const pages = [...fs.readdirSync(root).filter((f) => f.endsWith(".html") && f !== "samples.html"), ...fs.readdirSync(path.join(root, "past-questions")).map((f) => "past-questions/" + f)];

test("every page has the four cover tabs: Home, Junior, Senior, Menu", () => {
  for (const file of pages) {
    const tabs = read(file).match(/<nav class="tabs"[^]*?<[/]nav>/)[0];
    const labels = [...tabs.matchAll(/<a href="[^"]+"[^>]*>([^<]+)<[/]a>/g)].map((m) => m[1]);
    assert.deepStrictEqual(labels, ["Home", "Junior", "Senior", "Menu"], file);
  }
});

test("the menu links to every hub, and every hub is reachable from it", () => {
  const menu = read("menu.html");
  const links = [...menu.matchAll(/<a href="([^"]+)" aria-label/g)].map((m) => m[1]);
  assert.deepStrictEqual(links.sort(), ["challenge.html", "cutoffs.html", "final.html", "grammar.html", "part-a.html", "part-b.html", "questions.html", "s3-challenge.html", "s3-grammar.html", "text-types.html", "toolkit.html", "vocab.html"]);
  assert.ok(/<a href="menu.html" aria-current="page">Menu<[/]a>/.test(menu), "the menu does not mark itself as current");
});
