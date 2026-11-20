"use strict";
// Past questions are a hub (questions.html), a list of years for each part, and one page per year and part
// (past-questions/<year>-part-<a|b>.html). Tests written for the one long page read this rebuilt copy of it: the hub's
// notes, then each year, newest first, as the old year row held it (Part A, then Part B).
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8").split(String.fromCharCode(13, 10)).join(String.fromCharCode(10));
const mainOf = (html) => html.slice(html.indexOf(">", html.indexOf("<main")) + 1, html.indexOf("</main>")).split('href="../').join('href="');
const years = Array.from({ length: 14 }, (_, i) => 2026 - i);

const pages = years.flatMap((y) => ["a", "b"].map((p) => "past-questions/" + y + "-part-" + p + ".html"));
const rebuilt = read("questions.html") + years.map((y) =>
  '<details class="row year-row" id="y' + y + '" name="rows">' + mainOf(read("past-questions/" + y + "-part-a.html")) + mainOf(read("past-questions/" + y + "-part-b.html")) + "</details>").join(String.fromCharCode(10));

module.exports = { years, pages, hub: read("questions.html"), all: rebuilt, read };
