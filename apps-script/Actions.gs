/* CLY English Weekly Challenge: one function per request from challenge.html (and the teachers' challenge-trial.html).
   Each takes (user, body, nowMs) and returns what the page shows; a UserError is shown to the student as it is.
   A trial request plays in its own week (trialWeek in Code.gs), which is always open and never counted. */

// The week a request plays in, and whether it is open.
function playing(body, nowMs) {
  var trial = trialWeek(body), sn = season(nowMs);
  return { sn: sn, week: trial || weekId(nowMs), trial: !!trial, active: !!trial || sn.active };
}

// Who the student is, this week's challenge and their own record.
function me(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, week = p.week, student = user.student;
  var challenge = p.active ? challengeFor(week, sn) : null;
  var attempt = myAttempt(week, user.email);
  if (attempt && challenge) finishExpired(week, challenge, nowMs);
  if (attempt) attempt = myAttempt(week, user.email);
  return {
    email: user.email,
    student: { cls: student.Class, number: student.Number, label: studentKey(student) },
    season: { start: sn.start, end: sn.end, active: p.active },
    week: { id: week, closesAt: p.trial ? null : weekEndMs(week), format: challenge ? challenge.format : null, title: challenge ? challenge.title : null },
    attempt: attemptSummary(attempt, nowMs),
    limitMs: CONFIG.TIME_LIMIT_MS,
    history: p.trial ? trialHistory(user.email, week, sn, nowMs) : history(user.email, sn, nowMs)
  };
}

// The trial's own result, as soon as it is handed in.
function trialHistory(email, week, sn, nowMs) {
  var ranked = rankingFor(week, sn, nowMs, labels());
  var mine = ranked.filter(function (r) { return r.key === email; })[0];
  return mine ? [{ week: week, score: mine.score, place: mine.place, points: mine.points, entrants: ranked.length }] : [];
}

function attemptSummary(a, nowMs) {
  if (!a) return { status: "none" };
  if (a.Submitted) return { status: "done", score: Number(a.Score), timeSec: Number(a["Time (s)"]) };
  return { status: "open", remainingMs: Math.max(0, deadlineOf(a) - nowMs) };
}

// The student's own score and place in each closed week; only they see this.
function history(email, sn, nowMs) {
  var byEmail = labels();
  return closedSeasonWeeks(sn, nowMs).map(function (w) {
    var ranked = rankingFor(w, sn, nowMs, byEmail);
    var mine = ranked.filter(function (r) { return r.key === email; })[0];
    return { week: w, score: mine ? mine.score : null, place: mine ? mine.place : null, points: mine ? mine.points : 0, entrants: ranked.length };
  }).filter(function (h) { return h.score !== null; });
}

// Starts the timer, or carries on an attempt already started (the clock keeps running while away).
function start(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, week = p.week, student = user.student;
  if (!p.active) throw new UserError("The league is not running this week.");
  var challenge = challengeFor(week, sn);
  if (!challenge) throw new UserError(p.trial ? "There is no trial set in this format yet. Ask the teacher who set up the trial." : "This week's challenge is not ready yet. Please check back soon.");
  var attempt = myAttempt(week, user.email);
  if (attempt && attempt.Submitted) throw new UserError("You have already done this week's challenge.");
  if (attempt && nowMs > deadlineOf(attempt) + CONFIG.LATE_GRACE_MS) {
    finishExpired(week, challenge, nowMs);
    throw new UserError("Your 20 minutes are up. Your saved answers have been marked.");
  }
  if (attempt) {
    updateRow("Attempts", attempt._row, { Reopened: Number(attempt.Reopened || 0) + 1 });
  } else {
    appendRow("Attempts", { Week: week, Email: user.email, Class: student.Class, Number: student.Number, Started: new Date(nowMs), Switches: 0, "Away (s)": 0, Reopened: 0 });
    attempt = myAttempt(week, user.email);
  }
  return { challenge: publicChallenge(challenge), remainingMs: Math.max(0, deadlineOf(attempt) - nowMs), saved: parseAnswers(attempt.Answers) };
}

function openAttempt(user, body, nowMs) {
  var trial = trialWeek(body);
  var attempt = trial ? myAttempt(trial, user.email)
    : myAttempt(weekId(nowMs), user.email) || myAttempt(weekId(nowMs - CONFIG.TIME_LIMIT_MS - CONFIG.LATE_GRACE_MS), user.email);
  if (!attempt || attempt.Submitted) throw new UserError("There is no challenge in progress.");
  return attempt;
}

// Progress saved every so often, so a closed tab or flat battery still gets marked.
function save(user, body, nowMs) {
  var attempt = openAttempt(user, body, nowMs);
  if (nowMs > deadlineOf(attempt) + CONFIG.LATE_GRACE_MS) return { saved: false };
  var challenge = challengeFor(dayString(attempt.Week), season(nowMs));
  updateRow("Attempts", attempt._row, { Answers: JSON.stringify(cleanAnswers(challenge, body.answers)) });
  return { saved: true };
}

// The page reports each time it comes back after being hidden; short glances are ignored.
function away(user, body, nowMs) {
  var ms = Math.min(Number(body.ms) || 0, CONFIG.TIME_LIMIT_MS);
  if (ms < CONFIG.MIN_AWAY_MS) return { counted: false };
  var attempt = openAttempt(user, body, nowMs);
  updateRow("Attempts", attempt._row, { Switches: Number(attempt.Switches || 0) + 1, "Away (s)": Math.round(Number(attempt["Away (s)"] || 0) + ms / 1000) });
  return { counted: true };
}

function submit(user, body, nowMs) {
  var attempt = openAttempt(user, body, nowMs);
  var challenge = challengeFor(dayString(attempt.Week), season(nowMs));
  var tooLate = nowMs > deadlineOf(attempt) + CONFIG.LATE_GRACE_MS;
  // Within the grace minute the answers still count (slow connections) but are flagged "late";
  // after it, only the answers saved before time ran out count.
  var answers = tooLate ? parseAnswers(attempt.Answers) : cleanAnswers(challenge, body.answers);
  var done = finishAttempt(attempt, challenge, answers, Math.min(nowMs, deadlineOf(attempt)), nowMs);
  return { score: Number(done.Score), outOf: 15, timeSec: Number(done["Time (s)"]) };
}

// This week's board so far, and last week's final one: the top three places and the student's own row.
function board(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, week = p.week;
  var byEmail = labels();
  var show = function (w) {
    var ranked = w && (p.trial || inSeason(sn, w)) ? rankingFor(w, sn, nowMs, byEmail) : [];
    return { id: w, entrants: ranked.length, rows: visibleRows(ranked, user.email).map(function (r) { return publicRow(r, byEmail, user.email); }) };
  };
  return { thisWeek: show(week), lastWeek: show(p.trial ? "" : weekId(weekStartMs(week) - 1)) };
}

// The season table: points from closed weeks only, for students with points and the student asking.
// On the trial page it shows how the trial would count, as if it were a finished week.
function league(user, body, nowMs) {
  var p = playing(body, nowMs), sn = p.sn, byEmail = labels(), weeks = {};
  if (p.trial) weeks[p.week] = rankingFor(p.week, sn, nowMs, byEmail);
  else closedSeasonWeeks(sn, nowMs).forEach(function (w) { weeks[w] = rankingFor(w, sn, nowMs, byEmail); });
  var table = leagueTable(weeks);
  return { weeks: Object.keys(weeks).length, entrants: table.length, rows: visibleRows(table, user.email).map(function (r) {
    return { label: byEmail[r.key], points: r.points, played: r.played, firsts: r.firsts, seconds: r.seconds, thirds: r.thirds, place: r.place, you: r.key === user.email };
  }) };
}

// After a week closes: the full answers and explanations, with the student's own answers marked.
function review(user, body, nowMs) {
  var week = String(body.week || "");
  var trial = isTrialWeek(week);
  if (trial && week !== trialWeek(body)) throw new UserError("Trial answers are only on the trial page.");
  // Someone who started at 23:59 on Sunday is still answering until 00:21 on Monday.
  var revealAt = /^\d{4}-\d{2}-\d{2}$/.test(week) ? weekEndMs(week) + CONFIG.TIME_LIMIT_MS + CONFIG.LATE_GRACE_MS : trial ? 0 : Infinity;
  if (nowMs < revealAt) throw new UserError("Answers appear after the week closes on Sunday night.");
  var challenge = challengeFor(week, season(nowMs));
  if (!challenge) throw new UserError("There was no challenge that week.");
  finishExpired(week, challenge, nowMs);
  var attempt = myAttempt(week, user.email);
  // A tester sees the trial's answers as soon as they have handed it in.
  if (trial && !(attempt && attempt.Submitted)) throw new UserError("Hand in the trial first, then its answers appear here.");
  var answers = attempt ? parseAnswers(attempt.Answers) : {};
  return { challenge: challenge, answers: answers, right: mark(challenge, answers).right };
}
