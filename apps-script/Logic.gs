/* CLY English Weekly Challenge: the pure rules (weeks, marking, ranking, league).
   No Apps Script services here, so tests/challenge-logic.test.js can run it in Node.
   Marking copies the practice exercises (assets/js/practice-core.js, grammar.js, data/grammar-data.js)
   so a challenge answer is right exactly when the same answer would be right in practice. */

var HKT_OFFSET_MS = 8 * 60 * 60 * 1000;
var DAY_MS = 24 * 60 * 60 * 1000;
var WEEK_MS = 7 * DAY_MS;
var LEAGUE_POINTS = [5, 4, 3, 2, 1]; // 1st to 5th each week; the board shows every place that earns points

// ---------- Weeks (Monday 00:00 to Sunday 23:59, Hong Kong time) ----------

// The Monday of the week holding this moment, as "YYYY-MM-DD" in Hong Kong time.
function weekId(ms) {
  var hk = new Date(ms + HKT_OFFSET_MS);
  var sinceMonday = (hk.getUTCDay() + 6) % 7;
  var monday = new Date(Date.UTC(hk.getUTCFullYear(), hk.getUTCMonth(), hk.getUTCDate() - sinceMonday));
  return monday.toISOString().slice(0, 10);
}

function weekStartMs(id) { return Date.parse(id + "T00:00:00Z") - HKT_OFFSET_MS; }
function weekEndMs(id) { return weekStartMs(id) + WEEK_MS; }
function isClosed(id, nowMs) { return nowMs >= weekEndMs(id); }

// Week 1 of the season is a cloze, week 2 proofreading, and so on. The season start may be any day of its week.
function formatDue(seasonStartId, id) {
  var n = Math.round((weekStartMs(id) - weekStartMs(weekId(weekStartMs(seasonStartId)))) / WEEK_MS);
  return n % 2 === 0 ? "cloze" : "proofreading";
}

// ---------- Marking ----------

var normalise = function (s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim(); };

// For a blank marked commas: true, where the commas are what is being tested. Spaces around a comma still don't matter,
// and a comma from a Chinese keyboard counts.
var keepCommas = function (s) { return String(s).toLowerCase().replace(/，/g, ",").replace(/[’']/g, "'").replace(/[.!?]/g, "").replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ").trim(); };

// A negative counts in any spelling: "hadn't been told", "had not been told" or "hadnt been told".
var NOT_FORMS = { "won't": "will not", "can't": "cannot", "shan't": "shall not" };
function bothNegatives(answer) {
  var full = answer.replace(/\b(\w+)n't\b/g, function (w, stem) { return NOT_FORMS[w] || stem + " not"; });
  var forms = [answer, full, answer.replace(/n't\b/g, "nt")];
  if (/\bcannot\b/.test(full)) forms.push(full.replace(/\bcannot\b/, "can not"));
  return forms;
}

function applyMark(words, a) {
  var out = words.slice();
  // A changed word keeps the punctuation around the original unless the student typed their own.
  if (a.type === "replace") {
    var m = out[a.at].match(/^([^\w'-]*)(.*?)([^\w'-]*)$/);
    out[a.at] = /^[^\w'-]|[^\w'-]$/.test(a.word) ? a.word : m[1] + a.word + m[3];
  }
  if (a.type === "insert") out.splice(a.at, 0, a.word);
  if (a.type === "delete") out.splice(a.at, 1);
  return out;
}

// [[wrong>right]] changes a word, [[>right]] adds one and [[wrong>]] deletes one. No marker: no mistake.
function parseProofLine(text) {
  var m = text.match(/\[\[([^\]>]*)>([^\]]*)\]\]/);
  if (!m) return { words: text.split(/\s+/), fixed: text.split(/\s+/), error: null };
  var words = text.replace(m[0], m[1] ? "\u0000" : " \u0000 ").trim().split(/\s+/);
  var at = words.findIndex(function (w) { return w.indexOf("\u0000") >= 0; });
  var error;
  if (!m[1]) { words.splice(at, 1); error = { type: "insert", at: at, answers: [m[2]] }; }
  else { words[at] = words[at].replace("\u0000", m[1]); error = m[2] ? { type: "replace", at: at, answers: [m[2]] } : { type: "delete", at: at, answers: [] }; }
  return { words: words, fixed: applyMark(words, { type: error.type, at: at, word: m[2] }), error: error };
}

// answers: { "1": "are held", ... } keyed by blank number.
function markCloze(challenge, answers) {
  var right = {};
  Object.keys(challenge.blanks).forEach(function (id) {
    var clean = challenge.blanks[id].commas ? keepCommas : normalise;
    var accepted = [].concat.apply([], challenge.blanks[id].answers.map(bothNegatives)).map(clean);
    right[id] = accepted.indexOf(clean((answers && answers[id]) || "")) >= 0;
  });
  return { score: countTrue(right), right: right };
}

// answers: { "3": { type, at, word } } keyed by line index. Every line needs a mark: a fix, or { type: "ok" } for
// "No mistake". A line with no mark (or a mark that makes no sense) scores nothing, even if the line is correct.
// challenge.alsoRight: { "3": ["the whole line, fixed another way"] } lists other single fixes that are equally right.
function markProofreading(challenge, answers) {
  var right = {};
  challenge.lines.forEach(function (l, i) {
    var line = parseProofLine(l[0]), given = answers && answers[i];
    var a = validMark(given, line.words.length);
    if (!given || (a.type === "none" && given.type !== "ok")) { right[i] = false; return; }
    var accepted = [line.fixed.join(" ")].concat((challenge.alsoRight && challenge.alsoRight[i]) || []).map(normalise);
    right[i] = accepted.indexOf(normalise(applyMark(line.words, a).join(" "))) >= 0;
  });
  return { score: countTrue(right), right: right };
}

// "No mistake", or anything malformed from the browser, changes nothing in the line.
function validMark(a, length) {
  if (!a || ["replace", "insert", "delete"].indexOf(a.type) < 0) return { type: "none" };
  var at = Number(a.at);
  var max = a.type === "insert" ? length : length - 1;
  if (!(at >= 0 && at <= max && Math.floor(at) === at)) return { type: "none" };
  return { type: a.type, at: at, word: String(a.word || "").slice(0, 40) };
}

function mark(challenge, answers) {
  return challenge.format === "cloze" ? markCloze(challenge, answers) : markProofreading(challenge, answers);
}

function countTrue(o) { return Object.keys(o).filter(function (k) { return o[k]; }).length; }

// ---------- What students may see ----------

// The challenge without its answers: the verb box for a cloze, the lines with their mistakes in for proofreading.
function publicChallenge(challenge) {
  var base = { format: challenge.format, title: challenge.title, textType: challenge.textType || "" };
  if (challenge.format === "cloze") {
    var blanks = Object.keys(challenge.blanks).map(function (id) { return challenge.blanks[id]; });
    var boxed = blanks.filter(function (b) { return b.verb; });
    var bank = boxed.filter(function (b) { return !b.commas; }).map(function (b) { return b.verb; }).concat(challenge.distractors || []).sort();
    var phrases = boxed.filter(function (b) { return b.commas; }).map(function (b) { return b.verb; }).concat(challenge.phraseDistractors || []).sort();
    // A blank with no verb isn't in the box: the student chooses the word. The page says which kinds, not which blanks.
    var open = blanks.filter(function (b) { return !b.verb; }).map(function (b) { return b.topic; })
      .filter(function (t, i, all) { return all.indexOf(t) === i; });
    // Says that commas count somewhere, not which blanks: the page shows a reminder.
    var commas = blanks.some(function (b) { return b.commas; });
    return Object.assign(base, { paragraphs: challenge.paragraphs, bank: bank }, phrases.length ? { phrases: phrases } : {},
      open.length ? { open: open } : {}, commas ? { commas: true } : {});
  }
  return Object.assign(base, { lines: challenge.lines.map(function (l) { return parseProofLine(l[0]).words; }) });
}

// ---------- Ranking ----------

// Gives each row a shared place when sameAsPrevious says it is level with the row above.
function sharePlaces(sorted, sameAsPrevious) {
  var place = 0;
  return sorted.map(function (row, i) {
    if (i === 0 || !sameAsPrevious(sorted[i - 1], row)) place = i + 1;
    return Object.assign({}, row, { place: place });
  });
}

// attempts: [{ key, score, timeMs }], already only submitted and not disqualified.
// Best score first, then fastest; identical score and time share a place and its points.
function rankWeek(attempts) {
  var sorted = attempts.slice().sort(function (a, b) { return b.score - a.score || a.timeMs - b.timeMs; });
  return sharePlaces(sorted, function (p, a) { return p.score === a.score && p.timeMs === a.timeMs; })
    .map(function (a) { return Object.assign(a, { points: LEAGUE_POINTS[a.place - 1] || 0 }); });
}

// How many times a student finished in each points-earning place, as fields on a league row.
var FINISHES = ["firsts", "seconds", "thirds", "fourths", "fifths"];

// weeks: { weekId: rankedAttempts }. Students level on points share a place (joint winners);
// 1st to 5th places only order the table, they never split a tie.
function leagueTable(weeks) {
  var rows = {};
  Object.keys(weeks).forEach(function (w) {
    weeks[w].forEach(function (a) {
      var r = rows[a.key];
      if (!r) {
        r = rows[a.key] = { key: a.key, points: 0, played: 0 };
        FINISHES.forEach(function (f) { r[f] = 0; });
      }
      r.points += a.points;
      r.played += 1;
      if (FINISHES[a.place - 1]) r[FINISHES[a.place - 1]] += 1;
    });
  });
  var sorted = Object.keys(rows).map(function (k) { return rows[k]; }).sort(function (a, b) {
    var byFinishes = 0;
    FINISHES.some(function (f) { byFinishes = b[f] - a[f]; return byFinishes !== 0; });
    return b.points - a.points || byFinishes || (a.key < b.key ? -1 : 1);
  });
  return sharePlaces(sorted, function (p, r) { return p.points === r.points; });
}

// weeks: the weeks a student handed in (Monday ids). current counts back from this week if it is done, or from last week
// if not, so a streak stays alive until a whole week is missed. best is the longest run this season.
function streak(weeks, thisWeek, doneThisWeek) {
  var played = {};
  weeks.forEach(function (w) { played[w] = true; });
  if (doneThisWeek) played[thisWeek] = true;
  var before = function (w) { return weekId(weekStartMs(w) - 1); };
  var runTo = function (w) { var n = 0; while (played[w]) { n += 1; w = before(w); } return n; };
  var best = 0;
  Object.keys(played).forEach(function (w) { best = Math.max(best, runTo(w)); });
  return { current: runTo(doneThisWeek ? thisWeek : before(thisWeek)), best: best };
}

// ---------- Weekly quests and streak shields ----------

var QUESTS_PER_SHIELD = 3;   // every third quest finished earns a shield
var MAX_SHIELDS = 2;         // a student holds two at most; a shield earned beyond that is lost

// The streak with shields. weeks: the weeks a student handed in; questsByWeek: { weekId: quests finished that week }.
// Weeks are judged oldest first. A missed week during a run spends a shield if one is held: the run carries on, but
// the shielded week adds nothing to it and earns no stamp. A shield earned in a week only covers later weeks.
// This week's quests count towards the next shield before the week is judged.
function shieldedStreak(weeks, questsByWeek, thisWeek, doneThisWeek) {
  var quests = questsByWeek || {};
  var played = {};
  weeks.forEach(function (w) { played[w] = true; });
  if (doneThisWeek) played[thisWeek] = true;
  var next = function (w) { return weekId(weekStartMs(w) + WEEK_MS); };
  var lastJudged = doneThisWeek ? thisWeek : weekId(weekStartMs(thisWeek) - 1);
  var all = Object.keys(played).concat(Object.keys(quests)).sort();
  var run = 0, best = 0, held = 0, progress = 0, shielded = [];
  var earn = function (n) {
    progress += Number(n) || 0;
    while (progress >= QUESTS_PER_SHIELD) { progress -= QUESTS_PER_SHIELD; held = Math.min(MAX_SHIELDS, held + 1); }
  };
  for (var w = all[0]; all.length && w <= lastJudged; w = next(w)) {
    if (played[w]) { run += 1; best = Math.max(best, run); }
    else if (run > 0 && held > 0) { held -= 1; shielded.push(w); }
    else run = 0;
    earn(quests[w]);
  }
  if (!doneThisWeek) earn(quests[thisWeek]);
  return { current: run, best: best, shields: held, toNext: QUESTS_PER_SHIELD - progress, shielded: shielded };
}

// ---------- Leaving the page ----------

var MIN_AWAY_MS = 3000;   // shorter switches (a glance at a notification) are ignored
var MAX_SWITCHES = 1;     // one switch is allowed; the next one disqualifies
var QUIET_GAP_MS = 4 * 60 * 1000, BURST_MS = 60 * 1000, BURST_ANSWERS = 5;
var FAST_SCORE = 14, FAST_MS = 5 * 60 * 1000;

// One time away added to a { switches, awaySec } record. Returns a new record; short glances leave it as it was.
function countAway(record, ms) {
  var r = { switches: Number(record.switches) || 0, awaySec: Number(record.awaySec) || 0, counted: false };
  if (!(ms >= MIN_AWAY_MS)) return r;
  return { switches: r.switches + 1, awaySec: Math.round(r.awaySec + ms / 1000), counted: true };
}

function overSwitchLimit(switches) { return Number(switches) > MAX_SWITCHES; }

// The blanks or lines given a new, non-empty answer between two saves.
function answerChanges(before, after) {
  return Object.keys(after || {}).filter(function (id) {
    var a = after[id];
    if (a == null || a === "" || (typeof a === "object" && !a.type)) return false;
    return JSON.stringify(a) !== JSON.stringify((before || {})[id]);
  });
}

// events: [[secondsSinceStart, [ids]], ...] oldest first. A note for the teacher, or "" if nothing looks odd.
// Students never see it. The quiet gap is counted between answers, so reading the passage first never sets it off.
function timingCheck(events, score, timeMs) {
  var notes = [];
  var at = function (sec) { var s = Math.round(sec); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); };
  for (var k = 1; k < events.length; k++) {
    var gapMs = (events[k][0] - events[k - 1][0]) * 1000;
    if (gapMs < QUIET_GAP_MS) continue;
    var ids = {};
    for (var j = k; j < events.length && (events[j][0] - events[k][0]) * 1000 <= BURST_MS; j++) {
      events[j][1].forEach(function (id) { ids[id] = true; });
    }
    var n = Object.keys(ids).length;
    if (n >= BURST_ANSWERS) { notes.push("quiet " + at(gapMs / 1000) + ", then " + n + " answers in 1 min (at " + at(events[k][0]) + ")"); break; }
  }
  if (Number(score) >= FAST_SCORE && Number(timeMs) < FAST_MS) notes.push(score + "/15 in " + at(timeMs / 1000));
  return notes.join("; ");
}

// Time taken counts from the server's start time and never beyond the limit.
function timeTaken(startedMs, submittedMs, limitMs) { return Math.max(0, Math.min(submittedMs - startedMs, limitMs)); }

// How far a student is behind the place above them in a ranked week: { place, marks, seconds }, or null in first place
// (or not in the list). Level on marks, the gap is the time. A row level with them is skipped, since they share its place.
function gapAbove(ranked, key) {
  var i = -1;
  ranked.forEach(function (r, j) { if (r.key === key) i = j; });
  if (i < 0 || ranked[i].place === 1) return null;
  var me = ranked[i], above = null;
  for (var j = i - 1; j >= 0 && !above; j--) if (ranked[j].place < me.place) above = ranked[j];
  var marks = above.score - me.score;
  return { place: above.place, marks: marks, seconds: marks ? 0 : Math.max(1, Math.round((me.timeMs - above.timeMs) / 1000)) };
}

// A class as typed in the class list, tidied: " 4c " and "4C" are the same class.
function className(cls) { return String(cls == null ? "" : cls).trim().toUpperCase(); }

// Classes ranked by the average score of the students who took part (a disqualified attempt doesn't count).
// Level on average, the class with more taking part goes first; a class where nobody took part has no average
// (null) and comes last. students: [{ key, cls }]; ranked: [{ key, score }].
function classTable(students, ranked) {
  var scoreOf = {}, byCls = {};
  ranked.forEach(function (r) { scoreOf[r.key] = r.score; });
  students.forEach(function (s) {
    var name = className(s.cls);
    var c = byCls[name] || (byCls[name] = { cls: name, size: 0, took: 0, total: 0 });
    c.size += 1;
    if (s.key in scoreOf) { c.took += 1; c.total += scoreOf[s.key]; }
  });
  var avg = function (c) { return c.average === null ? -1 : c.average; };
  var rows = Object.keys(byCls).map(function (k) {
    var c = byCls[k];
    return { cls: c.cls, size: c.size, took: c.took, average: c.took ? Math.round(c.total / c.took * 10) / 10 : null };
  }).sort(function (a, b) { return avg(b) - avg(a) || b.took - a.took || (a.cls < b.cls ? -1 : 1); });
  return sharePlaces(rows, function (p, r) { return p.average === r.average; });
}

// ---------- Weekly quests: marking (the rules and shields are with the streak above) ----------
// A proofreading line in a quest is typed out whole, corrected. A line typed back unchanged (case, spaces and
// end punctuation aside) is not a change.

var QUEST_KINDS = ["fix", "sprint", "words", "ladder"];
var FIX_FALLBACK_ITEMS = 5;   // nothing of their own to fix: the items most students missed last week

function proofText(line) { return parseProofLine(line[0]).words.join(" "); }
function acceptedLines(challenge, i) {
  var line = parseProofLine(challenge.lines[i][0]);
  return [line.fixed.join(" ")].concat((challenge.alsoRight && challenge.alsoRight[i]) || []).map(normalise);
}

// sprint: { title, lines } as in a proofreading challenge. answers: { lineIndex: "the line as typed" }.
// Passes with all but one mistake corrected and no correct line changed.
function markSprint(sprint, answers) {
  var found = 0, errors = 0, changedRight = 0;
  sprint.lines.forEach(function (l, i) {
    var typed = answers && answers[i] != null ? normalise(answers[i]) : null;
    var original = normalise(proofText(l));
    if (parseProofLine(l[0]).error) {
      errors += 1;
      if (typed !== null && acceptedLines(sprint, i).indexOf(typed) >= 0) found += 1;
    } else if (typed !== null && typed !== original) changedRight += 1;
  });
  return { found: found, errors: errors, changedRight: changedRight, passed: errors > 0 && found >= errors - 1 && changedRight === 0 };
}

// words: { paragraphs, gaps: { id: { first, answers } } }. Spelt exactly; typing the given first letter is optional.
function markWords(set, answers) {
  var right = {};
  Object.keys(set.gaps).forEach(function (id) {
    var gap = set.gaps[id], typed = normalise((answers && answers[id]) || "");
    var accepted = gap.answers.map(normalise);
    right[id] = !!typed && (accepted.indexOf(typed) >= 0 || accepted.indexOf(normalise(gap.first + typed)) >= 0);
  });
  var outOf = Object.keys(right).length, score = countTrue(right);
  return { right: right, score: score, outOf: outOf, passed: outOf > 0 && score >= outOf - 1 };
}

// ladder: { start, rungs: [{ to, options, answer, reasons, reason }] }. answers: { rung: { pick, reason } }.
function markLadder(set, answers) {
  var rungs = set.rungs.map(function (r, i) {
    var a = (answers && answers[i]) || {};
    return { rewrite: Number(a.pick) === r.answer, reason: Number(a.reason) === r.reason };
  });
  return { rungs: rungs, passed: rungs.every(function (r) { return r.rewrite && r.reason; }) };
}

// The items of a challenge a student got wrong, as ids in the paper's order.
function missedItems(challenge, answers) {
  var right = mark(challenge, answers).right;
  return Object.keys(right).filter(function (id) { return !right[id]; });
}

// The items most students got wrong, most missed first (level: the paper's order). answerSets: one per attempt.
function hardestItems(challenge, answerSets, n) {
  var ids = Object.keys(mark(challenge, {}).right), misses = {};
  ids.forEach(function (id) { misses[id] = 0; });
  answerSets.forEach(function (answers) { missedItems(challenge, answers).forEach(function (id) { misses[id] += 1; }); });
  return ids.slice().sort(function (a, b) { return misses[b] - misses[a] || ids.indexOf(a) - ids.indexOf(b); }).slice(0, n);
}

// A cloze item is marked as in the challenge; a proofreading line is typed out whole, corrected.
function markFix(challenge, ids, answers) {
  var right = {};
  if (challenge.format === "cloze") {
    var all = markCloze(challenge, answers).right;
    ids.forEach(function (id) { right[id] = all[id]; });
  } else {
    ids.forEach(function (id) {
      var typed = normalise((answers && answers[id]) || "");
      right[id] = !!typed && acceptedLines(challenge, Number(id)).indexOf(typed) >= 0;
    });
  }
  return { right: right, passed: ids.length > 0 && ids.every(function (id) { return right[id]; }) };
}

// After two wrong tries at an item, the hint names the rule; never the answer.
function fixHint(challenge, id) {
  if (challenge.format === "cloze") {
    var b = challenge.blanks[id] || {};
    return b.hint || b.why || (b.verb ? "Think about the form of “" + b.verb + "” this sentence needs." : "");
  }
  var line = challenge.lines[Number(id)] || [];
  return line[3] || line[2] || "";
}

// What the student sees of a quest: never its answers.
function publicQuest(kind, set) {
  if (kind === "sprint") return { title: set.title, lines: set.lines.map(proofText) };
  if (kind === "words") {
    var gaps = {};
    Object.keys(set.gaps).forEach(function (id) { gaps[id] = { first: set.gaps[id].first }; });
    return { title: set.title, paragraphs: set.paragraphs, gaps: gaps };
  }
  if (kind === "ladder") return { title: set.title, start: set.start, rungs: set.rungs.map(function (r) { return { to: r.to, options: r.options, reasons: r.reasons }; }) };
  return null;
}

// Fixing last week's mistakes: each item in its sentence (other blanks shown as "…"), with what the student wrote.
function publicFix(challenge, ids, mine) {
  var yours = function (a, words) {
    if (typeof a === "string") return a;
    var m = validMark(a, words ? words.length : 0);
    return words && m.type !== "none" ? applyMark(words, m).join(" ") : "";
  };
  if (challenge.format === "cloze") {
    var items = ids.map(function (id) {
      var para = challenge.paragraphs.filter(function (parts) { return parts.indexOf(Number(id)) >= 0; })[0] || [];
      var text = para.map(function (p) { return typeof p !== "number" ? p : String(p) === String(id) ? "[" + id + "]" : "…"; }).join("");
      // just the sentence that holds the blank, so a long paragraph doesn't fill a phone screen
      var sentence = text.split(/(?<=[.!?][”"']?)\s+(?=[A-Z“"‘])/).filter(function (s) { return s.indexOf("[" + id + "]") >= 0; })[0];
      return { id: String(id), text: (sentence || text).trim(), yours: yours((mine || {})[id]) };
    });
    return { format: "cloze", title: challenge.title, bank: publicChallenge(challenge).bank, items: items };
  }
  return { format: "proofreading", title: challenge.title, items: ids.map(function (id) {
    var words = parseProofLine(challenge.lines[Number(id)][0]).words;
    return { id: String(id), text: words.join(" "), yours: yours((mine || {})[id], words) };
  }) };
}

// The quest kinds that run in a week, besides fixing last week's mistakes: three quests a week in all, so with
// something to fix one of the others rests, a different one each week. available: the kinds with content this week.
function questKindsFor(week, available, hasFix) {
  if (!hasFix || available.length <= 2) return available.slice(0, 3);
  var resting = QUEST_KINDS.slice(1)[Math.round(weekStartMs(week) / WEEK_MS) % 3];
  var out = available.filter(function (k) { return k !== resting; });
  return out.slice(0, 2);
}

// rows: [{ week, key, passed }]. Quests passed by one student, week by week, for shieldedStreak.
function questsByWeek(rows, key) {
  var out = {};
  rows.forEach(function (r) { if (r.key === key && r.passed) out[r.week] = (out[r.week] || 0) + 1; });
  return out;
}

// Quests passed in a week by each class's students: { cls: n }.
function classQuests(students, rows) {
  var clsOf = {}, out = {};
  students.forEach(function (s) { clsOf[s.key] = className(s.cls); });
  rows.forEach(function (r) { if (r.passed && clsOf[r.key]) out[clsOf[r.key]] = (out[clsOf[r.key]] || 0) + 1; });
  return out;
}

// What a student may see of a ranked list: the places that earn points, and their own row.
// Everyone else only counts towards "N took part", so a low score is never shown to classmates.
function visibleRows(ranked, myKey) {
  return ranked.filter(function (r) { return r.points > 0 || r.key === myKey; });
}

if (typeof module !== "undefined") {
  module.exports = { weekId: weekId, weekStartMs: weekStartMs, weekEndMs: weekEndMs, isClosed: isClosed, formatDue: formatDue,
    normalise: normalise, markCloze: markCloze, markProofreading: markProofreading, mark: mark, publicChallenge: publicChallenge,
    rankWeek: rankWeek, leagueTable: leagueTable, streak: streak, shieldedStreak: shieldedStreak, gapAbove: gapAbove, classTable: classTable, className: className,
    markSprint: markSprint, markWords: markWords, markLadder: markLadder, missedItems: missedItems, hardestItems: hardestItems,
    markFix: markFix, fixHint: fixHint, publicQuest: publicQuest, publicFix: publicFix, questsByWeek: questsByWeek, classQuests: classQuests,
    QUEST_KINDS: QUEST_KINDS, questKindsFor: questKindsFor, FIX_FALLBACK_ITEMS: FIX_FALLBACK_ITEMS, timeTaken: timeTaken, parseProofLine: parseProofLine, visibleRows: visibleRows,
    countAway: countAway, overSwitchLimit: overSwitchLimit, answerChanges: answerChanges, timingCheck: timingCheck,
    MIN_AWAY_MS: MIN_AWAY_MS, MAX_SWITCHES: MAX_SWITCHES };
}
