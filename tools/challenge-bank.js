// Checks a challenge bank and writes the files the teacher needs. The bank holds answers, so it is never kept in this repo.
// Run: node tools/challenge-bank.js <folder holding bank.json>
// Writes, next to bank.json: challenges.tsv (rows to paste into the sheet's Challenges tab) and review.html (to read before approving).
const fs = require("fs");
const path = require("path");
const dir = path.resolve(process.argv[2] || ".");
const L = require(path.join(__dirname, "../apps-script/Logic.gs"));
const bank = JSON.parse(fs.readFileSync(path.join(dir, "bank.json"), "utf8"));

const problems = [];
const check = (ok, set, msg) => { if (!ok) problems.push(set.title + ": " + msg); };

// What a student who knows the answer would send, so the key is marked by the web app's own rules.
function keyAnswers(ch) {
  if (ch.format === "cloze") return Object.fromEntries(Object.entries(ch.blanks).map(([id, b]) => [id, b.answers[0]]));
  const out = {};
  ch.lines.forEach((l, i) => {
    const e = L.parseProofLine(l[0]).error;
    out[i] = e ? { type: e.type, at: e.at, word: e.answers[0] || "" } : { type: "ok" };
  });
  return out;
}

function checkCloze(set, ch) {
  const ids = Object.keys(ch.blanks);
  const inText = ch.paragraphs.flat().filter(p => typeof p === "number");
  check(ids.length === 15, set, ids.length + " blanks, not 15");
  check(inText.join() === ids.map(Number).sort((a, b) => a - b).join(), set, "blanks in the passage don't match the key: " + inText.join());
  const box = ids.map(id => ch.blanks[id].verb).concat(ch.distractors);
  check(new Set(box).size === 18, set, "the verb box has " + new Set(box).size + " different verbs, not 18");
  ids.forEach(id => {
    const b = ch.blanks[id];
    check(b.why && b.answers.length, set, "blank " + id + " needs answers and a why");
    // every listed answer is accepted on its own, and the bare verb is not
    b.answers.forEach(a => check(L.markCloze(ch, { [id]: a }).right[id], set, "blank " + id + " rejects its own answer " + a));
    if (b.answers.indexOf(b.verb) < 0) check(!L.markCloze(ch, { [id]: b.verb }).right[id], set, "blank " + id + " accepts the bare verb");
  });
}

// True when b is a with exactly one word changed, added or removed.
function oneChange(a, b) {
  let s = 0;
  while (s < a.length && s < b.length && a[s] === b[s]) s++;
  let e = 0;
  while (e < a.length - s && e < b.length - s && a[a.length - 1 - e] === b[b.length - 1 - e]) e++;
  const cut = a.length - s - e, put = b.length - s - e;
  return (cut === 1 && put === 1) || (cut === 0 && put === 1) || (cut === 1 && put === 0);
}

function checkProof(set, ch) {
  check(ch.lines.length === 15, set, ch.lines.length + " lines, not 15");
  const errors = ch.lines.filter(l => L.parseProofLine(l[0]).error).length;
  check(errors >= 11 && errors <= 12, set, errors + " lines with a mistake (want 11-12)");
  ch.lines.forEach((l, i) => {
    const e = L.parseProofLine(l[0]).error;
    if (e) check(l[1] && l[2], set, "line " + (i + 1) + " needs a focus and a why");
    check((l[0].match(/\[\[/g) || []).length <= 1, set, "line " + (i + 1) + " has more than one mistake");
  });
  // each other accepted fix must be one change a student can make, on a line that has a mistake
  Object.entries(ch.alsoRight || {}).forEach(([i, alts]) => {
    const line = L.parseProofLine(ch.lines[i][0]);
    check(line.error, set, "line " + (+i + 1) + " has other fixes but no mistake");
    alts.forEach(alt => check(oneChange(line.words, alt.split(/\s+/)), set, "line " + (+i + 1) + ": \"" + alt + "\" isn't one change away"));
  });
  // a paper with no marks scores nothing: every line, even a correct one, needs a mark
  check(L.mark(ch, {}).score === 0, set, "an unmarked paper scores " + L.mark(ch, {}).score);
}

const rows = [];
bank.forEach(set => {
  const ch = Object.assign({ format: set.format, title: set.title }, set.data);
  if (set.format === "cloze") checkCloze(set, ch); else checkProof(set, ch);
  check(L.mark(ch, keyAnswers(ch)).score === 15, set, "the answer key scores " + L.mark(ch, keyAnswers(ch)).score + " / 15");
  const data = JSON.stringify(set.data);
  check(!/[\t\n]/.test(data) && data.length < 45000, set, "data can't go in one sheet cell");
  // Every set starts as a draft: the teacher approves it by changing Status in the sheet.
  rows.push([set.week, set.format, "draft", set.title, data]);
});

if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
fs.writeFileSync(path.join(dir, "challenges.tsv"), rows.map(r => r.join("\t")).join("\n") + "\n");
fs.writeFileSync(path.join(dir, "review.html"), review(bank));
console.log("All " + bank.length + " sets pass. Wrote challenges.tsv and review.html.");

// ---------- review.html: each set as students see it, then the answers ----------

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function clozeHtml(ch) {
  const passage = ch.paragraphs.map(p => "<p>" + p.map(x => typeof x === "number" ? "<b class=gap>(" + x + ") ______</b>" : esc(x)).join("") + "</p>").join("");
  const box = Object.values(ch.blanks).map(b => b.verb).concat(ch.distractors).sort().join(" · ");
  const key = Object.entries(ch.blanks).map(([id, b]) =>
    "<li><b>" + esc(b.answers.join(" / ")) + "</b> <span class=dim>(" + esc(b.verb) + ")</span><br>" + esc(b.why) + "</li>").join("");
  return "<p class=box><b>Verb box:</b> " + esc(box) + "</p><div class=passage>" + passage + "</div><h3>Answers</h3><ol class=key>" + key + "</ol>" +
    "<p class=dim>Not used: " + esc(ch.distractors.join(", ")) + ". Negatives also count in full or without the apostrophe (hasn't won = has not won = hasnt won).</p>";
}

function proofHtml(ch) {
  const lines = ch.lines.map((l, i) => {
    const r = L.parseProofLine(l[0]);
    const e = r.error;
    const fix = !e ? "<span class=ok>No mistake</span>"
      : e.type === "replace" ? "<s>" + esc(r.words[e.at]) + "</s> → <b>" + esc(e.answers[0]) + "</b>"
      : e.type === "insert" ? "add <b>" + esc(e.answers[0]) + "</b> before “" + esc(r.words[e.at]) + "”"
      : "delete <s>" + esc(r.words[e.at]) + "</s>";
    const also = (ch.alsoRight || {})[i];
    return "<tr><td class=n>" + (i + 1) + "</td><td>" + esc(r.words.join(" ")) + "</td><td>" + fix +
      (also ? "<br><b>Also accepted:</b> " + also.map(esc).join(" / ") : "") +
      (e ? "<br><span class=dim>" + esc(l[1]) + ": " + esc(l[2]) + "</span>" : "") + "</td></tr>";
  }).join("");
  return "<table><thead><tr><th>#</th><th>What students see</th><th>Answer</th></tr></thead><tbody>" + lines + "</tbody></table>";
}

function review(bank) {
  const sets = bank.map((s, i) => {
    const ch = Object.assign({ format: s.format, title: s.title }, s.data);
    const when = s.week ? "Week of " + s.week + " · set Status to <b>approved</b>" : "Backup · set Status to <b>backup</b>";
    return "<section><p class=tag>" + (i + 1) + " · " + (s.format === "cloze" ? "Cloze" : "Proofreading") + " · " + esc(s.data.textType) + "</p><h2>" + esc(s.title) + "</h2><p class=when>" + when + "</p>" +
      (s.format === "cloze" ? clozeHtml(ch) : proofHtml(ch)) + "</section>";
  }).join("");
  return `<!doctype html><html lang="en-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>League question bank · for the teacher</title>
<style>
body{font:17px/1.65 "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif;color:#1d2a3a;background:#e8f5ec;margin:0;padding:24px 16px}
main{max-width:900px;margin:0 auto}
section{background:#fff;border:1px solid #bfcfc5;border-radius:12px;padding:20px 24px;margin:0 0 28px}
h1,h2,h3,.tag{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif}
h1{font-size:2rem;margin:0 0 8px}h2{margin:0 0 4px}h3{margin:24px 0 8px}
.tag{color:#1a64c4;font-weight:700;margin:0}.when{margin:0 0 16px}
.box{background:#e8f5ec;border-radius:10px;padding:10px 14px}
.passage{border:1px solid #bfcfc5;border-radius:10px;padding:6px 18px;line-height:2}
.gap{color:#1a64c4;white-space:nowrap}.key li{margin:0 0 8px}.dim{color:#4a5a6a;font-size:.95rem}.ok{color:#1e7b3c;font-weight:700}
s{text-decoration-color:#c0362c;text-decoration-thickness:2px}
table{border-collapse:collapse;width:100%;font-size:1rem}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid #e2ebe5}
th{background:#e8f5ec;color:#1a64c4}.n{color:#1a64c4;font-weight:700}
</style></head><body><main>
<h1>League question bank</h1>
<p>Private: this file has the answers. Read each set before you approve it. To approve, paste <b>challenges.tsv</b> into the Challenges tab (every row starts as <b>draft</b>, which the league ignores), then change each Status as shown under its title.</p>
${sets}</main></body></html>`;
}
