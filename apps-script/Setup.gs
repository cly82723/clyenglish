/* CLY English Weekly Challenge: the teacher's menu in the Google Sheet.
   Run setup() once from the Apps Script editor; after that the "CLY League" menu appears in the sheet. */

function onOpen() {
  SpreadsheetApp.getUi().createMenu("CLY League")
    .addItem("Show league table", "showLeagueTable")
    .addItem("Show attempts week by week", "showWeeklyAttempts")
    .addItem("Set up tabs and yearly data deletion", "setup")
    .addSeparator()
    .addItem("Delete all student data now", "confirmWipe")
    .addToUi();
}

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone("Asia/Hong_Kong");
  Object.keys(TABS).forEach(sheet);
  addMissingHeaders();
  if (readRows("Season").length === 0) {
    appendRow("Season", { Setting: "Season start", Value: "", Notes: "Type the first day of the league, e.g. 2026-11-02. Week 1 is a cloze." });
    appendRow("Season", { Setting: "Season end", Value: "", Notes: "Type the last day. Standings freeze after this date." });
  }
  // Plain text, so the dates stay exactly as typed whatever the sheet's locale.
  sheet("Season").getRange(2, 2, 2, 1).setNumberFormat("@");
  scheduleYearlyWipe();
}

// Student data is deleted on 31 August each year, after prizes are given.
function scheduleYearlyWipe() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "wipeSeasonData") ScriptApp.deleteTrigger(t);
  });
  var now = new Date();
  var year = now.getMonth() > 7 || (now.getMonth() === 7 && now.getDate() >= 31) ? now.getFullYear() + 1 : now.getFullYear();
  ScriptApp.newTrigger("wipeSeasonData").timeBased().atDate(year, 8, 31).inTimezone("Asia/Hong_Kong").create();
}

function wipeSeasonData() {
  ["Students", "Attempts", "League", "Sessions"].forEach(function (name) {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    if (sh && sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
  });
  scheduleYearlyWipe();
}

function confirmWipe() {
  var ui = SpreadsheetApp.getUi();
  var ok = ui.alert("Delete all student data?", "This removes the class list, every attempt, the league table and all sign-ins. Challenges and season dates are kept.", ui.ButtonSet.YES_NO);
  if (ok === ui.Button.YES) wipeSeasonData();
}

// Writes the season table, with emails, into a "League" tab for the teacher.
function showLeagueTable() {
  var nowMs = Date.now(), sn = season(nowMs), byEmail = labels(), weeks = {};
  closedSeasonWeeks(sn, nowMs).forEach(function (w) { weeks[w] = rankingFor(w, sn, nowMs, byEmail); });
  var rows = leagueTable(weeks).map(function (r) { return [r.place, byEmail[r.key], r.key, r.points, r.firsts, r.seconds, r.thirds, r.fourths, r.fifths, r.played]; });
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("League") || ss.insertSheet("League");
  sh.clear();
  sh.appendRow(["Place", "Student", "Email", "Points", "1st", "2nd", "3rd", "4th", "5th", "Weeks played"]);
  sh.getRange(1, 1, 1, 10).setFontWeight("bold");
  if (rows.length) sh.getRange(2, 1, rows.length, 10).setValues(rows);
  sh.appendRow([]);
  sh.appendRow(["Updated " + Utilities.formatDate(new Date(), "Asia/Hong_Kong", "d MMM yyyy HH:mm") + " · " + Object.keys(weeks).length + " closed weeks. Level points are joint places."]);
  ss.setActiveSheet(sh);
}

// ---------- Attempts, week by week, for the teacher ----------

var WEEKLY_HEAD = ["Class", "No.", "Score", "Time", "Status", "Switches", "Away", "Check", "Late", "Started"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "9–15 Nov", or "30 Nov – 6 Dec", for the week starting on that Monday.
function weekLabel(id) {
  var mon = new Date(Date.parse(id + "T00:00:00Z")), sun = new Date(mon.getTime() + 6 * DAY_MS);
  var a = mon.getUTCDate(), b = sun.getUTCDate(), m1 = MONTHS[mon.getUTCMonth()], m2 = MONTHS[sun.getUTCMonth()];
  return m1 === m2 ? a + "–" + b + " " + m2 : a + " " + m1 + " – " + b + " " + m2;
}

var clockText = function (sec) { var s = Math.round(Number(sec) || 0); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + s % 60; };

function attemptStatus(a) {
  if (!a.Submitted) return "In progress";
  return isTrue(a.Disqualified) ? "Not counted" : "Counted";
}

// The rows of the Weekly tab: a heading for each week (newest first), then its attempts in class and number order.
// Returns { values, bold } where bold lists the 1-based row numbers to set in bold.
function weeklyRows(attempts, challenges) {
  var byWeek = {};
  attempts.forEach(function (a) { var w = dayString(a.Week); (byWeek[w] = byWeek[w] || []).push(a); });
  var titleOf = function (w) {
    var c = challenges.filter(function (r) { return dayString(r.Week) === w && /^(used|approved)$/i.test(r.Status); })[0];
    return c ? (String(c.Format).toLowerCase() === "cloze" ? "Cloze" : "Proofreading") + " · " + c.Title : "";
  };
  var values = [], bold = [], pad = function (row) { while (row.length < WEEKLY_HEAD.length) row.push(""); return row; };
  Object.keys(byWeek).sort().reverse().forEach(function (w) {
    var rows = byWeek[w].slice().sort(function (a, b) { return String(a.Class).localeCompare(String(b.Class)) || Number(a.Number) - Number(b.Number); });
    var count = function (s) { return rows.filter(function (a) { return attemptStatus(a) === s; }).length; };
    if (values.length) values.push(pad([]));
    values.push(pad(["Week of " + weekLabel(w), titleOf(w), "", "", count("Counted") + " counted · " + count("Not counted") + " not counted · " + count("In progress") + " in progress"]));
    bold.push(values.length);
    values.push(WEEKLY_HEAD.slice());
    bold.push(values.length);
    rows.forEach(function (a) {
      var done = !!a.Submitted;
      values.push([a.Class, a.Number, done ? a.Score : "", done ? clockText(a["Time (s)"]) : "", attemptStatus(a),
        Number(a.Switches) || 0, Number(a["Away (s)"]) ? clockText(a["Away (s)"]) : "", a.Check || "", a.Late || "",
        a.Started ? Utilities.formatDate(new Date(msOf(a.Started)), "Asia/Hong_Kong", "EEE d MMM HH:mm") : ""]);
    });
  });
  return { values: values, bold: bold };
}

// Rewrites the "Weekly" tab from Attempts. Read only: nothing in Attempts changes, so it is safe to run any time.
function showWeeklyAttempts() {
  var nowMs = Date.now(), sn = season(nowMs);
  // Attempts left open past their 20 minutes are marked first, so they show their real score.
  var weeks = {};
  readRows("Attempts").forEach(function (a) { weeks[dayString(a.Week)] = true; });
  Object.keys(weeks).forEach(function (w) { var c = challengeFor(w, sn); if (c) finishExpired(w, c, nowMs); });
  var out = weeklyRows(readRows("Attempts"), readRows("Challenges"));
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("Weekly") || ss.insertSheet("Weekly");
  sh.clear();
  if (out.values.length) sh.getRange(1, 1, out.values.length, WEEKLY_HEAD.length).setValues(out.values);
  out.bold.forEach(function (r) { sh.getRange(r, 1, 1, WEEKLY_HEAD.length).setFontWeight("bold"); });
  sh.appendRow([]);
  sh.appendRow(["Updated " + Utilities.formatDate(new Date(nowMs), "Asia/Hong_Kong", "d MMM yyyy HH:mm") + ". Run CLY League → Show attempts week by week again to refresh. Edit students in Attempts, not here."]);
  ss.setActiveSheet(sh);
}
