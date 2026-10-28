/* CLY English Weekly Challenge: the teacher's menu in the Google Sheet.
   Run setup() once from the Apps Script editor; after that the "CLY League" menu appears in the sheet. */

function onOpen() {
  SpreadsheetApp.getUi().createMenu("CLY League")
    .addItem("Show league table", "showLeagueTable")
    .addItem("Set up tabs and yearly data deletion", "setup")
    .addSeparator()
    .addItem("Delete all student data now", "confirmWipe")
    .addToUi();
}

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone("Asia/Hong_Kong");
  Object.keys(TABS).forEach(sheet);
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
  var rows = leagueTable(weeks).map(function (r) { return [r.place, byEmail[r.key], r.key, r.points, r.firsts, r.seconds, r.thirds, r.played]; });
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName("League") || ss.insertSheet("League");
  sh.clear();
  sh.appendRow(["Place", "Student", "Email", "Points", "1st", "2nd", "3rd", "Weeks played"]);
  sh.getRange(1, 1, 1, 8).setFontWeight("bold");
  if (rows.length) sh.getRange(2, 1, rows.length, 8).setValues(rows);
  sh.appendRow([]);
  sh.appendRow(["Updated " + Utilities.formatDate(new Date(), "Asia/Hong_Kong", "d MMM yyyy HH:mm") + " · " + Object.keys(weeks).length + " closed weeks. Level points are joint places."]);
  ss.setActiveSheet(sh);
}
