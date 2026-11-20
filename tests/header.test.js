"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const site = fs.readFileSync(path.join(__dirname, "..", "assets", "css", "site.css"), "utf8");
const phone = site.slice(site.indexOf("Phone: less chrome above the first line of the guide"));

test("the breadcrumb stays on a phone: it wraps, keeps a 32px tap height, and no link is hidden", () => {
  assert.ok(/[.]crumbs a [{][^}]*min-height: 32px/.test(site), "the breadcrumb links are too small to tap");
  assert.ok(/[.]crumbs ol [{][^}]*flex-wrap: wrap/.test(site), "a long trail would run off a narrow screen");
  assert.ok(!/.crumbs a[^{]*{[^}]*display: none/.test(phone), "a breadcrumb link is hidden on phones");
});
