// Turns the quest bank (assets/js/data/league-quests.js) into rows for each form's QuestSets tab.
// Run: node tools/quests-tsv.js <output folder>
// Writes s4-quests.tsv and s3-quests.tsv. Every row is a draft: CLY changes Status to "approved" in the sheet.
const fs = require("fs");
const path = require("path");

const out = process.argv[2];
if (!out) { console.error("Usage: node tools/quests-tsv.js <output folder>"); process.exit(1); }
global.window = {};
require(path.join(__dirname, "../assets/js/data/league-quests.js"));
const bank = global.window.CLY_QUESTS_BANK;
const FILES = { "S.4": "s4-quests.tsv", "S.3": "s3-quests.tsv" };

Object.keys(bank).forEach((form) => {
  const rows = [["Week", "Kind", "Status", "Title", "Data"]];
  Object.keys(bank[form]).sort().forEach((week) => {
    ["sprint", "words", "ladder"].forEach((kind) => {
      const set = bank[form][week][kind];
      if (set) rows.push([week, kind, "draft", set.title, JSON.stringify(set)]);
    });
  });
  const file = path.join(out, FILES[form] || form + "-quests.tsv");
  fs.writeFileSync(file, rows.map((r) => r.join("\t")).join("\n") + "\n");
  console.log(file + ": " + (rows.length - 1) + " rows");
});
