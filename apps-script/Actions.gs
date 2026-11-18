/* CLY English Weekly Challenge: one function per request from challenge.html.
   Each takes (user, body, nowMs) and returns what the page shows; a UserError is shown to the student as it is. */

// The week a request plays in, and whether it is open.
function playing(body, nowMs) {
  var sn = season(nowMs);
  return { sn: sn, week: weekId(nowMs), active: sn.active };
}

// Who the student is, this week's challenge and their own record.
function me(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, week = p.week, student = user.student;
  var challenge = p.active ? challengeFor(week, sn) : null;
  var attempt = myAttempt(week, user.email);
  if (attempt && challenge) finishExpired(week, challenge, nowMs);
  if (attempt) attempt = myAttempt(week, user.email);
  var past = history(user.email, sn, nowMs);
  return {
    email: user.email,
    student: { cls: student.Class, number: student.Number, label: studentKey(student) },
    season: { start: sn.start, end: sn.end, active: p.active },
    week: { id: week, closesAt: weekEndMs(week), format: challenge ? challenge.format : null, title: challenge ? challenge.title : null },
    attempt: attemptSummary(attempt, nowMs),
    limitMs: CONFIG.TIME_LIMIT_MS,
    rules: switchRule(week),
    history: past,
    // Only the student sees their streak; it is never on the board or in the league. A week that didn't count doesn't keep it going,
    // unless a shield earned with quests covers it (Logic.gs, shieldedStreak).
    streak: shieldedStreak(past.filter(function (h) { return !h.disqualified; }).map(function (h) { return h.week; }),
      questsByWeek(questRows(), user.email), week, !!(attempt && attempt.Submitted && !isTrue(attempt.Disqualified)))
  };
}

// A disqualified attempt shows how long the student was away, never its score.
function attemptSummary(a, nowMs) {
  if (!a) return { status: "none" };
  if (a.Submitted && isTrue(a.Disqualified)) return { status: "done", away: awayOf(a), timeSec: Number(a["Time (s)"]) };
  if (a.Submitted) return { status: "done", score: Number(a.Score), timeSec: Number(a["Time (s)"]) };
  return { status: "open", remainingMs: Math.max(0, deadlineOf(a) - nowMs), away: awayOf(a) };
}

// The student's own score and place in each closed week; only they see this.
// A disqualified week is listed without a score, so its answers can still be read.
function history(email, sn, nowMs) {
  var byEmail = labels();
  return closedSeasonWeeks(sn, nowMs).map(function (w) {
    var ranked = rankingFor(w, sn, nowMs, byEmail);
    var mine = ranked.filter(function (r) { return r.key === email; })[0];
    if (mine) return { week: w, score: mine.score, place: mine.place, points: mine.points, entrants: ranked.length };
    var own = myAttempt(w, email);
    return own && own.Submitted && isTrue(own.Disqualified) ? { week: w, disqualified: true, entrants: ranked.length } : null;
  }).filter(Boolean);
}

// Starts the timer, or carries on an attempt already started (the clock keeps running while away).
function start(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, week = p.week, student = user.student;
  if (!p.active) throw new UserError("The league is not running this week.");
  var challenge = challengeFor(week, sn);
  if (!challenge) throw new UserError("This week's challenge is not ready yet. Please check back soon.");
  var attempt = myAttempt(week, user.email);
  if (attempt && attempt.Submitted) throw new UserError("You have already done this week's challenge.");
  if (attempt && nowMs > deadlineOf(attempt) + CONFIG.LATE_GRACE_MS) {
    finishExpired(week, challenge, nowMs);
    throw new UserError("Your 20 minutes are up. Your saved answers have been marked.");
  }
  var rules = switchRule(week);
  if (attempt) {
    // Closing the page and coming back is a switch too: away since the page last saved or reported in.
    var gone = nowMs - msOf(attempt["Last seen"] || attempt.Started);
    var seen = rules ? awayFields(attempt, gone, nowMs) : { "Last seen": new Date(nowMs) };
    updateRow("Attempts", attempt._row, Object.assign({ Reopened: Number(attempt.Reopened || 0) + 1 }, seen));
  } else {
    if (rules && body.pledged !== true) throw new UserError("Please tick the promise before you start.");
    appendRow("Attempts", { Week: week, Email: user.email, Class: student.Class, Number: student.Number, Started: new Date(nowMs), Switches: 0, "Away (s)": 0, Reopened: 0, "Last seen": new Date(nowMs) });
  }
  attempt = myAttempt(week, user.email);
  return { challenge: publicChallenge(challenge), remainingMs: Math.max(0, deadlineOf(attempt) - nowMs), saved: parseAnswers(attempt.Answers),
    rules: rules, away: awayOf(attempt) };
}

function openAttempt(user, body, nowMs) {
  var attempt = myAttempt(weekId(nowMs), user.email) || myAttempt(weekId(nowMs - CONFIG.TIME_LIMIT_MS - CONFIG.LATE_GRACE_MS), user.email);
  if (!attempt || attempt.Submitted) throw new UserError("There is no challenge in progress.");
  return attempt;
}

// Progress saved every so often, so a closed tab or flat battery still gets marked.
function save(user, body, nowMs) {
  var attempt = openAttempt(user, body, nowMs);
  if (nowMs > deadlineOf(attempt) + CONFIG.LATE_GRACE_MS) return { saved: false };
  var challenge = challengeFor(dayString(attempt.Week), season(nowMs));
  var answers = cleanAnswers(challenge, body.answers);
  updateRow("Attempts", attempt._row, { Answers: JSON.stringify(answers), Timeline: timelineWith(attempt, answers, nowMs), "Last seen": new Date(nowMs) });
  return { saved: true };
}

// The page reports each time it comes back after being hidden or left for another window; short glances are ignored.
function away(user, body, nowMs) {
  var ms = Math.min(Number(body.ms) || 0, CONFIG.TIME_LIMIT_MS);
  var attempt = openAttempt(user, body, nowMs);
  var fields = awayFields(attempt, ms, nowMs);
  updateRow("Attempts", attempt._row, fields);
  return { counted: "Switches" in fields, away: awayOf(Object.assign({}, attempt, fields)) };
}

function submit(user, body, nowMs) {
  var attempt = openAttempt(user, body, nowMs);
  var challenge = challengeFor(dayString(attempt.Week), season(nowMs));
  var tooLate = nowMs > deadlineOf(attempt) + CONFIG.LATE_GRACE_MS;
  // Within the grace minute the answers still count (slow connections) but are flagged "late";
  // after it, only the answers saved before time ran out count.
  var answers = tooLate ? parseAnswers(attempt.Answers) : cleanAnswers(challenge, body.answers);
  var done = finishAttempt(attempt, challenge, answers, Math.min(nowMs, deadlineOf(attempt)), nowMs);
  if (isTrue(done.Disqualified)) return { disqualified: true, away: awayOf(done), outOf: 15, timeSec: Number(done["Time (s)"]) };
  return { score: Number(done.Score), outOf: 15, timeSec: Number(done["Time (s)"]) };
}

// This week's board so far, and last week's final one: the top five places and the student's own row,
// how far the student is behind the place above them (never who is there), and the classes by average score.
function board(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, week = p.week;
  var byEmail = labels();
  var students = readRows("Students").map(function (s) { return { key: String(s.Email).toLowerCase(), cls: String(s.Class) }; });
  var show = function (w) {
    var ranked = w && inSeason(sn, w) ? rankingFor(w, sn, nowMs, byEmail) : [];
    return { id: w, entrants: ranked.length, rows: visibleRows(ranked, user.email).map(function (r) { return publicRow(r, byEmail, user.email); }),
      gap: gapAbove(ranked, user.email), classes: ranked.length ? withQuests(classTable(students, ranked), students, w) : [] };
  };
  return { thisWeek: show(week), lastWeek: show(weekId(weekStartMs(week) - 1)), yourClass: className(user.student.Class) };
}

// The season table: points from closed weeks only, for students with points and the student asking.
function league(user, body, nowMs) {
  var sn = season(nowMs), byEmail = labels(), weeks = {};
  closedSeasonWeeks(sn, nowMs).forEach(function (w) { weeks[w] = rankingFor(w, sn, nowMs, byEmail); });
  var table = leagueTable(weeks);
  return { weeks: Object.keys(weeks).length, entrants: table.length, rows: visibleRows(table, user.email).map(function (r) {
    return { label: byEmail[r.key], points: r.points, played: r.played, firsts: r.firsts, seconds: r.seconds, thirds: r.thirds,
      fourths: r.fourths, fifths: r.fifths, place: r.place, you: r.key === user.email };
  }) };
}

// After a week closes: the full answers and explanations, with the student's own answers marked.
function review(user, body, nowMs) {
  var week = String(body.week || "");
  // Someone who started at 23:59 on Sunday is still answering until 00:21 on Monday.
  var revealAt = /^\d{4}-\d{2}-\d{2}$/.test(week) ? weekEndMs(week) + CONFIG.TIME_LIMIT_MS + CONFIG.LATE_GRACE_MS : Infinity;
  if (nowMs < revealAt) throw new UserError("Answers appear after the week closes on Sunday night.");
  var challenge = challengeFor(week, season(nowMs));
  if (!challenge) throw new UserError("There was no challenge that week.");
  finishExpired(week, challenge, nowMs);
  var attempt = myAttempt(week, user.email);
  var answers = attempt ? parseAnswers(attempt.Answers) : {};
  return { challenge: challenge, answers: answers, right: mark(challenge, answers).right };
}

// ---------- Weekly quests: three a week, marked by the league; they earn shields and class points, never league points ----------

var SPRINT_MS = 5 * 60 * 1000;        // the proofreading sprint's clock
var SPRINT_GRACE_MS = 30 * 1000;      // network delay allowed after it
var MAX_LINE_CHARS = 200;             // a proofreading line typed out whole

// Every quest result as { week, key, passed }, for the streak's shields and the class points.
function questRows() {
  return readRows("QuestResults").map(function (r) { return { week: dayString(r.Week), key: String(r.Email).toLowerCase(), passed: isTrue(r.Passed) }; });
}

function myQuestRow(week, email, kind) {
  return readRows("QuestResults").filter(function (r) {
    return dayString(r.Week) === week && String(r.Email).toLowerCase() === email && String(r.Kind) === kind;
  })[0] || null;
}

// The classes' quest points for a week, added to the class table's rows.
function withQuests(rows, students, week) {
  var points = classQuests(students, questRows().filter(function (r) { return r.week === week; }));
  return rows.map(function (c) { return Object.assign({}, c, { quests: points[c.cls] || 0 }); });
}

// Fixing last week's mistakes: the student's own wrong items, or the five most missed if they have none.
function fixQuest(user, sn, week) {
  var last = weekId(weekStartMs(week) - 1);
  var challenge = inSeason(sn, last) ? challengeFor(last, sn) : null;
  if (!challenge) return null;
  var own = myAttempt(last, user.email);
  var mine = own && own.Submitted && !isTrue(own.Disqualified) ? parseAnswers(own.Answers) : null;
  var ids = mine ? missedItems(challenge, mine) : [];
  var ownMistakes = ids.length > 0;
  if (!ownMistakes) {
    var others = attemptsFor(last).filter(function (a) { return a.Submitted && !isTrue(a.Disqualified); }).map(function (a) { return parseAnswers(a.Answers); });
    ids = hardestItems(challenge, others, FIX_FALLBACK_ITEMS);
  }
  return { kind: "fix", title: ownMistakes ? "Fix last week's mistakes" : "Last week's hardest items", challenge: challenge, ids: ids,
    shown: Object.assign(publicFix(challenge, ids, ownMistakes ? mine : {}), { own: ownMistakes }) };
}

// This week's quests: fixing last week, and the approved sets for the week (QuestSets tab) that are not resting.
function weekQuests(user, sn, week) {
  var fix = fixQuest(user, sn, week);
  var sets = {};
  readRows("QuestSets").forEach(function (r) {
    var kind = String(r.Kind).toLowerCase();
    if (dayString(r.Week) === week && /^approved$/i.test(r.Status) && QUEST_KINDS.indexOf(kind) > 0 && !sets[kind]) {
      sets[kind] = { kind: kind, title: r.Title, set: JSON.parse(r.Data) };
    }
  });
  var kinds = questKindsFor(week, QUEST_KINDS.slice(1).filter(function (k) { return sets[k]; }), !!fix);
  return (fix ? [fix] : []).concat(kinds.map(function (k) {
    var q = sets[k];
    // the sprint's lines come only when its clock starts (questStart)
    q.shown = k === "sprint" ? { title: q.set.title, passages: q.set.passages.length, minutes: SPRINT_MS / 60000 } : publicQuest(k, q.set);
    return q;
  }));
}

function questFor(user, sn, week, kind) {
  var q = weekQuests(user, sn, week).filter(function (x) { return x.kind === kind; })[0];
  if (!q) throw new UserError("That quest isn't on this week's list.");
  return q;
}

function rowFor(user, week, kind) {
  var row = myQuestRow(week, user.email, kind);
  if (row) return row;
  appendRow("QuestResults", { Week: week, Email: user.email, Class: user.student.Class, Kind: kind, Tries: 0, Passed: "" });
  return myQuestRow(week, user.email, kind);
}

// This week's quests, with how far the student has got, and their shields.
function quests(user, body, nowMs) {
  var p = playing(body, nowMs), week = p.week;
  var list = p.active ? weekQuests(user, p.sn, week) : [];
  var past = history(user.email, p.sn, nowMs);
  var attempt = myAttempt(week, user.email);
  var st = shieldedStreak(past.filter(function (h) { return !h.disqualified; }).map(function (h) { return h.week; }),
    questsByWeek(questRows(), user.email), week, !!(attempt && attempt.Submitted && !isTrue(attempt.Disqualified)));
  return {
    week: week,
    quests: list.map(function (q) {
      var r = myQuestRow(week, user.email, q.kind);
      return { kind: q.kind, title: q.title, passed: !!r && isTrue(r.Passed), tries: r ? Number(r.Tries) || 0 : 0, quest: q.shown };
    }),
    shields: st.shields, toNext: st.toNext, maxShields: MAX_SHIELDS, perShield: QUESTS_PER_SHIELD
  };
}

// The sprint's clock starts here; each try gets the next passage, so a failed try can't be learnt by heart.
function questStart(user, body, nowMs) {
  var p = playing(body, nowMs);
  if (!p.active) throw new UserError("The league is not running this week.");
  if (body.kind !== "sprint") throw new UserError("Only the sprint has a clock.");
  var q = questFor(user, p.sn, p.week, "sprint"), row = rowFor(user, p.week, "sprint");
  if (isTrue(row.Passed)) return { passed: true };
  var n = (Number(row.Tries) || 0) % q.set.passages.length;
  updateRow("QuestResults", row._row, { Started: new Date(nowMs), Passage: n, Updated: new Date(nowMs) });
  var passage = q.set.passages[n];
  return { title: passage.title, lines: publicQuest("sprint", passage).lines, remainingMs: SPRINT_MS };
}

// Only what each quest takes: words as short text, lines as longer text, ladder choices as numbers.
function cleanQuestAnswers(kind, answers) {
  var out = {};
  Object.keys(answers || {}).slice(0, 20).forEach(function (id) {
    var a = answers[id];
    if (kind === "ladder") out[id] = { pick: Number(a && a.pick), reason: Number(a && a.reason) };
    else if (a != null) out[id] = String(a).slice(0, kind === "words" ? CONFIG.MAX_ANSWER_CHARS : MAX_LINE_CHARS);
  });
  return out;
}

// Marks a try. A wrong answer gets a hint, never the answer.
function questAnswer(user, body, nowMs) {
  var p = playing(body, nowMs);
  if (!p.active) throw new UserError("The league is not running this week.");
  var kind = String(body.kind || "");
  var q = questFor(user, p.sn, p.week, kind), row = rowFor(user, p.week, kind);
  var tries = Number(row.Tries) || 0;
  if (isTrue(row.Passed)) return { passed: true, tries: tries };
  var answers = cleanQuestAnswers(kind, body.answers), out;
  if (kind === "fix") {
    var f = markFix(q.challenge, q.ids, answers), wrong = q.ids.filter(function (id) { return !f.right[id]; });
    var hints = {};
    // after two wrong tries, the hint names the rule
    if (tries + 1 >= 2) wrong.forEach(function (id) { hints[id] = fixHint(q.challenge, id); });
    out = { passed: f.passed, wrong: wrong, hints: hints };
  } else if (kind === "sprint") {
    if (!row.Started) throw new UserError("Start the sprint first: its clock starts when you do.");
    var late = nowMs - msOf(row.Started) > SPRINT_MS + SPRINT_GRACE_MS;
    var s = markSprint(q.set.passages[Number(row.Passage) || 0], answers);
    out = { passed: s.passed && !late, found: s.found, errors: s.errors, changedRight: s.changedRight, timeUp: late };
  } else if (kind === "words") {
    var w = markWords(q.set, answers);
    out = { passed: w.passed, score: w.score, outOf: w.outOf, wrong: Object.keys(w.right).filter(function (id) { return !w.right[id]; }) };
  } else {
    var l = markLadder(q.set, answers);
    out = { passed: l.passed, rungs: l.rungs };
  }
  // a sprint try ends here: the next try starts a fresh clock on a fresh passage
  updateRow("QuestResults", row._row, { Tries: tries + 1, Passed: out.passed ? "yes" : "", Updated: new Date(nowMs),
    Answers: JSON.stringify(answers), Started: kind === "sprint" ? "" : row.Started });
  out.tries = tries + 1;
  return out;
}
