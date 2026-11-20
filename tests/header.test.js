"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const site = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "site.css"), "utf8");
const phone = site.slice(site.indexOf("Phone: less chrome above the first line of the guide"));

test("on a phone the page strip is four links to a row where they fit, and every link stays", () => {
  assert.ok(/@media \(min-width: 360px\) \{ \.forms a \{ flex-basis: 22%;/.test(phone), "no four-to-a-row rule for phones 360px and wider");
  assert.ok(/\.forms a \{\s*flex: 1 1 30%;[\s\S]*?min-height: 44px;/.test(phone), "the narrow-phone fallback of three to a row, or the 44px tap height, is gone");
  assert.ok(!/\.forms a[^{]*\{[^}]*display: none/.test(phone), "a strip link is hidden on phones");
});
