// A blind second marker for the league's question bank: catches answers that are right but that the key would mark wrong.
// The bank holds answers, so it is never kept in this repo; run this on the folder that holds bank.json.
//
//   node tools/second-marker.js blind <folder>     Writes <folder>/blind/set-N.md: each set exactly as students see it
//                                                  (built by the web app's own publicChallenge), with NO answers.
//                                                  Give each file to an agent that has never seen the bank.
//   node tools/second-marker.js compare <folder>   Reads the agent's <folder>/blind/set-N.answers.json files, marks every
//                                                  answer with the web app's own marking, and writes second-marker.md.
//                                                  Exits 1 when something needs CLY's decision.
//
// See docs/agents/league-second-marker.md for the whole procedure.
const fs = require("fs");
const path = require("path");
const L = require(path.join(__dirname, "../apps-script/Logic.gs"));

const GROUPS = { // the word box's open groups (RANGES in assets/js/word-box.js)
  "Indefinite pronouns": ["somebody", "someone", "something", "anybody", "anyone", "anything", "everybody", "everyone", "everything", "nobody", "no one", "nothing"],
  "So, so that, so as to": ["so", "so that", "so as to"],
  "Must, have to, need to": ["must", "have to", "need to"],
  "Linking words": ["moreover", "furthermore", "in addition", "as well as", "however", "although", "even though", "yet", "on the other hand", "because", "since", "due to", "as a result", "therefore", "for example", "for instance", "such as", "including", "as long as", "provided that", "in case", "in order to", "so as to", "so that", "all in all", "overall", "in conclusion", "to sum up"]
};

function loadBank(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, "bank.json"), "utf8"))
    .map((s) => Object.assign({ format: s.format, title: s.title }, s.data));
}

// ---------- blind: the paper as students see it ----------

function blindCloze(p) {
  const passage = p.paragraphs.map((para) => para.map((x) => typeof x === "number" ? "(" + x + ") ______" : x).join("")).join("\n\n");
  const ids = p.paragraphs.flat().filter((x) => typeof x === "number");
  const out = ["Passage:", "", passage, "", "What the student may put in a blank:"];
  if (p.bank.length) out.push("- A word from this box, in any form the sentence needs (each box word is used at most once, and some are not used): " + p.bank.join(", "));
  if (p.phrases) out.push("- A phrase from this box, which the student writes with a comma before and after it when it is extra information, and without commas when it identifies which one: " + p.phrases.join(", "));
  (p.open || []).forEach((t) => out.push("- For some blanks the student chooses from this group (" + t + "): " + GROUPS[t].join(", ")));
  out.push("", "The page does not say which blank takes which kind of answer.");
  out.push("", "Reply with ONLY a JSON object: for every blank, a list of EVERY answer from the options above that gives a grammatical, natural sentence a fair teacher would have to accept. Write each answer exactly as the student would type it (with the commas, for a phrase that needs them). Example:",
    "{ " + ids.map((id) => '"' + id + '": ["..."]').join(", ") + " }");
  return out.join("\n");
}

function blindProof(p) {
  const lines = p.lines.map((w, i) => (i + 1) + ". " + w.join(" ")).join("\n");
  return ["Lines (a student marks each one: one fix, or \"No mistake\"):", "", lines, "",
    "Each line has at most one mistake, fixed by changing, adding or removing ONE word.",
    "", "Reply with ONLY a JSON object: for every line, \"ok\" if a fair teacher would accept the line as it is, or a list of EVERY whole corrected line (one word changed, added or removed) that a fair teacher would have to accept. Example:",
    '{ "1": "ok", "2": ["The whole line, corrected."], ... }'].join("\n");
}

function blind(dir) {
  const out = path.join(dir, "blind");
  fs.mkdirSync(out, { recursive: true });
  loadBank(dir).forEach((ch, i) => {
    const p = L.publicChallenge(ch);
    const head = ["# Set " + (i + 1) + ": " + (p.format === "cloze" ? "cloze" : "proofreading") + (p.textType ? " (" + p.textType + ")" : ""), "",
      "You are a second marker for a grammar paper for Hong Kong S.3/S.4 students (English as a second language). You do not have the answer key, on purpose. Do not look for it.", ""];
    fs.writeFileSync(path.join(out, "set-" + (i + 1) + ".md"), head.join("\n") + "\n" + (p.format === "cloze" ? blindCloze(p) : blindProof(p)) + "\n");
  });
  console.log("Wrote " + fs.readdirSync(out).filter((f) => f.endsWith(".md")).length + " blind sets to " + out + ". They hold no answers.");
}

// ---------- compare: the second marker's answers against the key ----------

// The one change that turns `words` into `fixed`, as the web app records it, or null if it is not one change.
function toMark(words, fixed) {
  let s = 0;
  while (s < words.length && s < fixed.length && words[s] === fixed[s]) s++;
  let e = 0;
  while (e < words.length - s && e < fixed.length - s && words[words.length - 1 - e] === fixed[fixed.length - 1 - e]) e++;
  const cut = words.length - s - e, put = fixed.length - s - e;
  if (cut === 1 && put === 1) return { type: "replace", at: s, word: fixed[s] };
  if (cut === 0 && put === 1) return { type: "insert", at: s, word: fixed[s] };
  if (cut === 1 && put === 0) return { type: "delete", at: s };
  return null;
}

function compareCloze(ch, given) {
  const notes = [];
  Object.entries(ch.blanks).forEach(([id, b]) => {
    const theirs = [].concat(given[id] || []);
    theirs.forEach((a) => {
      if (!L.markCloze(ch, { [id]: a }).right[id]) notes.push("**Blank " + id + ": possibly unfair.** The second marker accepts \"" + a + "\", but the key marks it wrong. Key: " + b.answers.join(" / ") + ". Either add it to the key or rewrite the sentence so it no longer fits.");
    });
    b.answers.forEach((a) => {
      const ok = theirs.some((t) => L.markCloze({ blanks: { [id]: { answers: [t], commas: b.commas } } }, { [id]: a }).right[id]);
      if (!ok) notes.push("Blank " + id + ": check the key. The second marker did not accept the key's \"" + a + "\"" + (theirs.length ? " (it gave: " + theirs.join(" / ") + ")" : "") + ".");
    });
  });
  return notes;
}

function compareProof(ch, given) {
  const notes = [];
  ch.lines.forEach((l, i) => {
    const line = L.parseProofLine(l[0]);
    const theirs = given[i + 1];
    const shown = "\"" + line.words.join(" ") + "\"";
    if (theirs === "ok" || theirs === undefined) {
      if (line.error) notes.push("Line " + (i + 1) + ": the second marker found no mistake in " + shown + ". Is the mistake clear enough for S.3/S.4?");
      return;
    }
    if (!line.error) notes.push("**Line " + (i + 1) + ": possibly unfair.** The key says " + shown + " has no mistake, but the second marker would fix it: " + [].concat(theirs).map((f) => "\"" + f + "\"").join(" / ") + ". Check for an accidental mistake.");
    [].concat(theirs).forEach((fix) => {
      const m = toMark(line.words, fix.trim().split(/\s+/));
      if (!m) { notes.push("Line " + (i + 1) + ": the second marker's fix \"" + fix + "\" is not one change, so a student could not make it. Ignored."); return; }
      if (line.error && !L.markProofreading(ch, { [i]: m }).right[i]) notes.push("**Line " + (i + 1) + ": possibly unfair.** The second marker accepts \"" + fix + "\", but the key marks it wrong. Key: \"" + line.fixed.join(" ") + "\". Either add it to alsoRight or rewrite the line.");
    });
  });
  return notes;
}

function compare(dir) {
  const bank = loadBank(dir);
  let unfair = 0, missing = 0;
  const report = ["# Second marker report", "", "Each set was solved blind by an agent that never saw the key. **Possibly unfair** means a student could give a right answer and lose the mark. Nothing here changes the bank: CLY decides.", ""];
  bank.forEach((ch, i) => {
    const file = path.join(dir, "blind", "set-" + (i + 1) + ".answers.json");
    report.push("## Set " + (i + 1) + ": " + ch.title, "");
    if (!fs.existsSync(file)) { missing++; report.push("Not checked: no answers file.", ""); return; }
    const given = JSON.parse(fs.readFileSync(file, "utf8"));
    const notes = ch.format === "cloze" ? compareCloze(ch, given) : compareProof(ch, given);
    unfair += notes.filter((n) => n.includes("possibly unfair")).length;
    report.push(notes.length ? notes.map((n) => "- " + n).join("\n") : "No differences: the key and the second marker agree.", "");
  });
  fs.writeFileSync(path.join(dir, "second-marker.md"), report.join("\n"));
  console.log("Checked " + (bank.length - missing) + " of " + bank.length + " sets: " + unfair + " possibly unfair. Wrote second-marker.md.");
  if (unfair || missing) process.exit(1);
}

if (require.main === module) {
  const [cmd, dir] = process.argv.slice(2);
  if (cmd === "blind") blind(path.resolve(dir || "."));
  else if (cmd === "compare") compare(path.resolve(dir || "."));
  else { console.error("Use: node tools/second-marker.js blind|compare <folder holding bank.json>"); process.exit(2); }
}

module.exports = { toMark, compareCloze, compareProof };
