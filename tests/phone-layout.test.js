"use strict";
// Every page at phone width (360 x 740): nothing makes the page scroll sideways, and every tap target is at least
// 24 x 24 px (WCAG 2.2 AA, 2.5.8). Exempt, as WCAG allows: links inside running text, and the word buttons of a
// proofreading sentence (each word is a target inside a sentence).
// Needs Playwright with Chromium. GitHub installs it (.github/workflows/tests.yml); without it these checks are skipped.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

let chromium = null;
try { ({ chromium } = require("playwright")); } catch (e) { /* not installed: skip below */ }

const root = path.join(__dirname, "..");
const pages = fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort();
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".pdf": "application/pdf", ".woff2": "font/woff2" };

function measure() {
  const iw = window.innerWidth;
  const sw = document.documentElement.scrollWidth;
  const label = (el) => el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "");
  const wide = [];
  if (sw > iw) {
    for (const el of document.querySelectorAll("body *")) {
      const b = el.getBoundingClientRect();
      if (b.width && b.right > iw + 1 && getComputedStyle(el).position !== "fixed") wide.push(label(el) + " reaches " + Math.round(b.right) + "px");
      if (wide.length >= 3) break;
    }
  }
  const small = [];
  for (const el of document.querySelectorAll("a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button]")) {
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (!b.width || !b.height || cs.visibility === "hidden") continue;
    if (el.classList.contains("word")) continue;
    if (el.tagName === "A" && cs.display === "inline") {
      const own = el.textContent.trim().length;
      const around = (el.parentElement ? el.parentElement.textContent.trim().length : 0) - own;
      if (around > 10) continue;
    }
    if (b.width < 24 || b.height < 24) small.push(label(el) + ' "' + (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30) + '" is ' + Math.round(b.width) + "x" + Math.round(b.height));
  }
  return { iw, sw, wide, small };
}

test("pages at phone width: no sideways scroll, tap targets at least 24px", { skip: chromium ? false : "Playwright is not installed" }, async (t) => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(req.url.split("?")[0].split("#")[0]));
    if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
      res.end(data);
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = "http://127.0.0.1:" + server.address().port + "/";
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 360, height: 740 }, reducedMotion: "reduce" });
    page.on("dialog", (d) => d.dismiss());
    // The site's own pages only: block anything from outside so the check does not depend on the network.
    await page.route((url) => !url.href.startsWith(base), (route) => route.abort());
    for (const file of pages) {
      await t.test(file, async () => {
        await page.goto(base + file, { waitUntil: "load" });
        await page.waitForTimeout(100);
        const r = await page.evaluate(measure);
        assert.ok(r.sw <= r.iw, file + " scrolls sideways at 360px (" + r.sw + "px wide): " + r.wide.join("; "));
        assert.deepStrictEqual(r.small, [], file + " has tap targets under 24px");
      });
    }
  } finally {
    await browser.close();
    server.close();
  }
});
