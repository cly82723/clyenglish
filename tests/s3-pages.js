"use strict";
// The S.3 grammar section is a hub (s3-grammar.html) and one page per topic or exercise (s3-<topic>.html).
// Tests that used to read the one long page read all of them joined together through this.
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const files = fs.readdirSync(root).filter((f) => /^s3-[a-z-]+[.]html$/.test(f) && f !== "s3-challenge.html").sort();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

module.exports = { files, read, all: files.map(read).join("\n") };
