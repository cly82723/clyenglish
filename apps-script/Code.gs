/* CLY English Weekly Challenge: the web app challenge.html talks to.
   Every request is a POST of {action, token, ...} sent as text/plain (so the browser skips CORS preflight).
   The answers live only in the Challenges tab; the page never sees them until the week closes.
   Setup steps: apps-script/README.md. Sign-in: Auth.gs. Rules (weeks, marking, ranking): Logic.gs. */

var CONFIG = {
  DOMAIN: "kings.edu.hk",
  CODE_TTL_S: 600,          // a sign-in code works for 10 minutes
  CODE_TRIES: 5,            // wrong tries before a code is used up
  RESEND_WAIT_S: 60,
  CODES_PER_HOUR: 5,
  TIME_LIMIT_MS: 20 * 60 * 1000,
  LATE_GRACE_MS: 60 * 1000, // network delay allowed after the auto-submit at 20 minutes
  MIN_AWAY_MS: 3000,        // shorter switches (a notification glance) are ignored
  MAX_ANSWER_CHARS: 60
};

var WRITES = ["verifyCode", "signOut", "start", "save", "away", "submit"];
var NO_SIGN_IN = ["sendCode", "verifyCode"];

// Looked up per request: Apps Script loads files one by one, so Actions.gs may not exist yet when this file runs.
function actionFor(name) {
  var actions = { sendCode: sendCode, verifyCode: verifyCode, signOut: signOut,
    me: me, start: start, save: save, away: away, submit: submit, board: board, league: league, review: review };
  return actions.hasOwnProperty(name) ? actions[name] : null;
}

function doGet() { return json({ ok: true, service: "CLY English Weekly Challenge" }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var action = actionFor(body.action);
    if (!action) throw new UserError("Unknown request.");
    var user = NO_SIGN_IN.indexOf(body.action) >= 0 ? null : verifiedUser(body.token);
    // Reading the boards needs no lock, so a class checking at once doesn't queue behind itself.
    if (WRITES.indexOf(body.action) >= 0) lock.waitLock(20000);
    return json({ ok: true, data: action(user, body, Date.now()) });
  } catch (err) {
    // signIn tells the page to show the sign-in screen.
    if (err instanceof UserError) return json(err.signIn ? { ok: false, error: err.message, signIn: true } : { ok: false, error: err.message });
    console.error(err && err.stack || err);
    return json({ ok: false, error: "Something went wrong on our side. Please try again in a minute." });
  } finally {
    lock.releaseLock();
  }
}

function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// ---------- Season and this week's challenge ----------

function season(nowMs) {
  var s = seasonSettings();
  var startWeek = s.start ? weekId(Date.parse(s.start + "T12:00:00+08:00")) : "";
  var endMs = s.end ? Date.parse(s.end + "T23:59:59+08:00") : Infinity;
  return { start: s.start, end: s.end, startWeek: startWeek, endMs: endMs,
    active: !!startWeek && nowMs >= weekStartMs(startWeek) && nowMs <= endMs };
}

function inSeason(sn, week) { return !!sn.startWeek && week >= sn.startWeek && weekStartMs(week) <= sn.endMs; }

// The approved challenge for the week; if the current week has none, the first backup in the format due becomes it.
// A backup that has gone live stays live, even if a set for that week is approved later, so nobody is marked against a different passage.
function challengeFor(week, sn) {
  var rows = readRows("Challenges");
  var forWeek = function (status) { return rows.filter(function (r) { return dayString(r.Week) === week && String(r.Status).toLowerCase() === status; })[0]; };
  var live = forWeek("used") || forWeek("approved");
  if (!live && week === weekId(Date.now()) && inSeason(sn, week)) {
    var due = formatDue(sn.startWeek, week);
    live = rows.filter(function (r) { return /^backup$/i.test(r.Status) && String(r.Format).toLowerCase() === due; })[0];
    if (live) updateRow("Challenges", live._row, { Week: week, Status: "used" });
  }
  if (!live) return null;
  return Object.assign(JSON.parse(live.Data), { format: String(live.Format).toLowerCase(), title: live.Title });
}

// ---------- Attempts ----------

function myAttempt(week, email) {
  return attemptsFor(week).filter(function (r) { return String(r.Email).toLowerCase() === email; })[0] || null;
}

function deadlineOf(attempt) { return msOf(attempt.Started) + CONFIG.TIME_LIMIT_MS; }

// submittedMs is the time that counts (never past the deadline); arrivedMs is when the answers really came in.
function finishAttempt(attempt, challenge, answers, submittedMs, arrivedMs) {
  var result = mark(challenge, answers);
  var fields = { Submitted: new Date(submittedMs), Score: result.score,
    "Time (s)": timeTaken(msOf(attempt.Started), submittedMs, CONFIG.TIME_LIMIT_MS) / 1000,
    Late: arrivedMs > deadlineOf(attempt) ? "late" : "", Answers: JSON.stringify(answers) };
  updateRow("Attempts", attempt._row, fields);
  return Object.assign(attempt, fields);
}

// An attempt left open past its time (closed tab, flat battery) is marked from its last saved answers.
function finishExpired(week, challenge, nowMs) {
  attemptsFor(week).forEach(function (a) {
    if (!a.Submitted && nowMs > deadlineOf(a) + CONFIG.LATE_GRACE_MS) {
      finishAttempt(a, challenge, parseAnswers(a.Answers), deadlineOf(a), deadlineOf(a));
    }
  });
}

function parseAnswers(s) { try { return JSON.parse(s || "{}"); } catch (e) { return {}; } }

// Keeps only answers to real blanks or lines, trimmed to a sensible length.
function cleanAnswers(challenge, answers) {
  var out = {};
  var ids = challenge.format === "cloze" ? Object.keys(challenge.blanks) : challenge.lines.map(function (_, i) { return String(i); });
  ids.forEach(function (id) {
    var a = answers && answers[id];
    if (a == null) return;
    out[id] = challenge.format === "cloze" ? String(a).slice(0, CONFIG.MAX_ANSWER_CHARS)
      : { type: String(a.type), at: Number(a.at), word: String(a.word || "").slice(0, CONFIG.MAX_ANSWER_CHARS) };
  });
  return out;
}

// ---------- Rankings ----------

function labels() {
  var byEmail = {};
  readRows("Students").forEach(function (s) { byEmail[String(s.Email).toLowerCase()] = studentKey(s); });
  return byEmail;
}

// Submitted, not disqualified attempts of registered students, ranked; keyed by email.
function rankingFor(week, sn, nowMs, byEmail) {
  var challenge = challengeFor(week, sn);
  if (challenge) finishExpired(week, challenge, nowMs);
  var entries = attemptsFor(week).filter(function (a) {
    return a.Submitted && !isTrue(a.Disqualified) && byEmail[String(a.Email).toLowerCase()];
  }).map(function (a) {
    return { key: String(a.Email).toLowerCase(), score: Number(a.Score), timeMs: Math.round(Number(a["Time (s)"]) * 1000) };
  });
  return rankWeek(entries);
}

// Every closed week of the season that has a challenge, oldest first.
function closedSeasonWeeks(sn, nowMs) {
  var weeks = [];
  if (!sn.startWeek) return weeks;
  for (var w = sn.startWeek; isClosed(w, nowMs) && weekStartMs(w) <= sn.endMs; w = weekId(weekEndMs(w))) weeks.push(w);
  return weeks;
}

function publicRow(r, byEmail, email) {
  return { label: byEmail[r.key], score: r.score, timeSec: r.timeMs != null ? r.timeMs / 1000 : undefined, place: r.place, points: r.points, you: r.key === email };
}
