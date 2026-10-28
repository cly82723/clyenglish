/* CLY English Weekly Challenge: the pure rules (weeks, marking, ranking, league).
   No Apps Script services here, so tests/challenge-logic.test.js can run it in Node.
   Marking copies the practice exercises (assets/js/practice-core.js, grammar.js, data/grammar-data.js)
   so a challenge answer is right exactly when the same answer would be right in practice. */

var HKT_OFFSET_MS = 8 * 60 * 60 * 1000;
var DAY_MS = 24 * 60 * 60 * 1000;
var WEEK_MS = 7 * DAY_MS;
var LEAGUE_POINTS = [3, 2, 1];

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
    var accepted = [].concat.apply([], challenge.blanks[id].answers.map(bothNegatives)).map(normalise);
    right[id] = accepted.indexOf(normalise((answers && answers[id]) || "")) >= 0;
  });
  return { score: countTrue(right), right: right };
}

// answers: { "3": { type, at, word } } keyed by line index. A line the student left alone means "no mistake".
function markProofreading(challenge, answers) {
  var right = {};
  challenge.lines.forEach(function (l, i) {
    var line = parseProofLine(l[0]);
    var a = validMark((answers && answers[i]), line.words.length);
    right[i] = normalise(applyMark(line.words, a).join(" ")) === normalise(line.fixed.join(" "));
  });
  return { score: countTrue(right), right: right };
}

// Anything malformed from the browser counts as leaving the line alone.
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
    var bank = Object.keys(challenge.blanks).map(function (id) { return challenge.blanks[id].verb; })
      .concat(challenge.distractors || []).sort();
    return Object.assign(base, { paragraphs: challenge.paragraphs, bank: bank });
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

// weeks: { weekId: rankedAttempts }. Students level on points share a place (joint winners);
// 1st, 2nd and 3rd places only order the table, they never split a tie.
function leagueTable(weeks) {
  var rows = {};
  Object.keys(weeks).forEach(function (w) {
    weeks[w].forEach(function (a) {
      var r = rows[a.key] || (rows[a.key] = { key: a.key, points: 0, firsts: 0, seconds: 0, thirds: 0, played: 0 });
      r.points += a.points;
      r.played += 1;
      if (a.place === 1) r.firsts += 1;
      if (a.place === 2) r.seconds += 1;
      if (a.place === 3) r.thirds += 1;
    });
  });
  var sorted = Object.keys(rows).map(function (k) { return rows[k]; }).sort(function (a, b) {
    return b.points - a.points || b.firsts - a.firsts || b.seconds - a.seconds || b.thirds - a.thirds || (a.key < b.key ? -1 : 1);
  });
  return sharePlaces(sorted, function (p, r) { return p.points === r.points; });
}

// Time taken counts from the server's start time and never beyond the limit.
function timeTaken(startedMs, submittedMs, limitMs) { return Math.max(0, Math.min(submittedMs - startedMs, limitMs)); }

if (typeof module !== "undefined") {
  module.exports = { weekId: weekId, weekStartMs: weekStartMs, weekEndMs: weekEndMs, isClosed: isClosed, formatDue: formatDue,
    normalise: normalise, markCloze: markCloze, markProofreading: markProofreading, mark: mark, publicChallenge: publicChallenge,
    rankWeek: rankWeek, leagueTable: leagueTable, timeTaken: timeTaken, parseProofLine: parseProofLine };
}
