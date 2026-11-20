"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const pageFiles = [...fs.readdirSync(root).filter((f) => f.endsWith(".html")), ...fs.readdirSync(path.join(root, "past-questions")).map((f) => "past-questions/" + f)];
const text = new Map(pageFiles.map((f) => [f, fs.readFileSync(path.join(root, f), "utf8")]));
const idsOf = (html) => new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
// a hub forwards old anchors in a script in its head: those anchors are fine too
const forwards = (html) => { const m = html.match(/var m=(\{[^]*?\}),(?:o=(\{[^]*?\}),)?id=location/); return m ? new Set([...Object.keys(JSON.parse(m[1])), ...Object.keys(m[2] ? JSON.parse(m[2]) : {})]) : new Set(); };

test("every link between pages goes to a page that exists, and to an anchor that is there or forwarded", () => {
  const bad = [];
  for (const [file, html] of text) {
    const dir = path.posix.dirname(file);
    for (const m of html.matchAll(/<a [^>]*href="([^"]*)"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|tel:)/.test(href) || href === "") continue;
      const [target, hash] = href.split("#");
      const targetFile = target === "" ? file : path.posix.normalize(path.posix.join(dir, target));
      if (!text.has(targetFile)) { if (!fs.existsSync(path.join(root, targetFile))) bad.push(file + " -> " + href + " (no such page)"); continue; }
      if (!hash) continue;
      const html2 = text.get(targetFile);
      if (!idsOf(html2).has(hash) && !forwards(html2).has(hash)) bad.push(file + " -> " + href + " (no such anchor)");
    }
  }
  assert.deepStrictEqual(bad, []);
});

test("every stylesheet, script and image a page loads exists", () => {
  const bad = [];
  for (const [file, html] of text) {
    const dir = path.posix.dirname(file);
    for (const m of html.matchAll(/(?:src|href)="([^"]+[.](?:css|js|png|jpg|svg|webp))"/g)) {
      if (/^https?:/.test(m[1])) continue;
      if (!fs.existsSync(path.join(root, path.posix.normalize(path.posix.join(dir, m[1]))))) bad.push(file + " -> " + m[1]);
    }
  }
  assert.deepStrictEqual(bad, []);
});
