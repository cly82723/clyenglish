/* CLY English Weekly Challenge: reading and writing the Google Sheet.
   Each tab is a table with a header row; rows come back as objects keyed by header. */

var TABS = {
  Season: ["Setting", "Value", "Notes"],
  Students: ["Email", "Class", "Number"],
  Attempts: ["Week", "Email", "Class", "Number", "Started", "Submitted", "Score", "Time (s)", "Switches", "Away (s)", "Reopened", "Late", "Disqualified", "Answers"],
  Challenges: ["Week", "Format", "Status", "Title", "Data"],
  Sessions: ["Token hash", "Email", "Created"]
};

function sheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  sh.appendRow(TABS[name]);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, TABS[name].length).setFontWeight("bold");
  return sh;
}

// Each request reads a tab once; any write to the tab drops its copy.
var rowsRead = {};

// All rows of a tab as objects, each remembering its sheet row so it can be updated.
function readRows(name) {
  if (!rowsRead[name]) rowsRead[name] = readSheetRows(name);
  return rowsRead[name];
}

function readSheetRows(name) {
  var values = sheet(name).getDataRange().getValues();
  var headers = values[0];
  return values.slice(1).map(function (v, i) {
    var row = { _row: i + 2 };
    headers.forEach(function (h, j) { row[h] = v[j]; });
    return row;
  }).filter(function (r) { return r[headers[0]] !== "" || r[headers[1]] !== ""; });
}

function appendRow(name, obj) {
  delete rowsRead[name];
  sheet(name).appendRow(TABS[name].map(function (h) { return h in obj ? obj[h] : ""; }));
}

// Writes only the given fields of one row.
function updateRow(name, rowNumber, fields) {
  delete rowsRead[name];
  var sh = sheet(name);
  Object.keys(fields).forEach(function (h) {
    var col = TABS[name].indexOf(h) + 1;
    if (col > 0) sh.getRange(rowNumber, col).setValue(fields[h]);
  });
}

function deleteRowAt(name, rowNumber) {
  delete rowsRead[name];
  sheet(name).deleteRow(rowNumber);
}

// Sheets turns typed dates into Date objects; the league works in "YYYY-MM-DD" week IDs.
function dayString(v) {
  if (v instanceof Date) return Utilities.formatDate(v, "Asia/Hong_Kong", "yyyy-MM-dd");
  return String(v || "").trim();
}

function msOf(v) { return v instanceof Date ? v.getTime() : Number(v) || 0; }

function isTrue(v) { return v === true || /^(true|yes|y)$/i.test(String(v).trim()); }

function seasonSettings() {
  var s = {};
  readRows("Season").forEach(function (r) { s[r.Setting] = r.Value; });
  return { start: isoDay(s["Season start"]), end: isoDay(s["Season end"]) };
}

// A date the sheet couldn't read (e.g. "2 Nov") counts as not set, rather than breaking every request.
function isoDay(v) {
  var d = dayString(v);
  if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) console.warn("Season date not understood: " + d + ". Type it as YYYY-MM-DD.");
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : "";
}

function findStudent(email) {
  return readRows("Students").filter(function (r) { return String(r.Email).toLowerCase() === email; })[0] || null;
}

function studentKey(student) { return student.Class + "-" + student.Number; }

function attemptsFor(week) {
  return readRows("Attempts").filter(function (r) { return dayString(r.Week) === week; });
}
