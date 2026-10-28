// Runs the Apps Script files against a fake Google Sheet to check the whole request flow.
// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const FILES = ["Logic.gs", "Sheets.gs", "Auth.gs", "Code.gs", "Actions.gs", "Setup.gs"];
const HKT = 8 * 3600 * 1000;

// A sheet stores rows as arrays; like Google Sheets, a typed "YYYY-MM-DD" becomes a Date at Hong Kong midnight.
function fakeSheet(RealDate) {
  const rows = [];
  const cell = v => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new RealDate(Date.parse(v + "T00:00:00Z") - HKT) : v);
  const width = () => Math.max(0, ...rows.map(r => r.length));
  const sh = {
    rows,
    appendRow: r => rows.push(r.map(cell)),
    setFrozenRows() {},
    getDataRange: () => ({ getValues: () => rows.map(r => Array.from({ length: width() }, (_, i) => (r[i] === undefined ? "" : r[i]))) }),
    getRange: (r, c, nr = 1, nc = 1) => ({
      setFontWeight() {}, setNumberFormat() {},
      setValue: v => { while (rows.length < r) rows.push([]); rows[r - 1][c - 1] = cell(v); },
      setValues: vs => vs.forEach((row, i) => row.forEach((v, j) => sh.getRange(r + i, c + j).setValue(v)))
    }),
    getLastRow: () => rows.length,
    deleteRow: r => rows.splice(r - 1, 1),
    deleteRows: (start, n) => rows.splice(start - 1, n),
    clear: () => rows.splice(0)
  };
  return sh;
}

function server() {
  let clock = 0;
  class FakeDate extends Date {
    constructor(...a) { if (a.length) super(...a); else super(clock); }
    static now() { return clock; }
  }
  const sheets = {};
  const mail = [];
  const cached = {};
  const ctx = {
    Date: FakeDate, JSON, Math, Object, String, Number, Array, console,
    SpreadsheetApp: { getActiveSpreadsheet: () => ({
      getSheetByName: n => sheets[n] || null,
      insertSheet: n => (sheets[n] = fakeSheet(FakeDate)),
      setSpreadsheetTimeZone() {}, setActiveSheet() {}
    }) },
    Utilities: {
      formatDate: d => new Date(d.getTime() + HKT).toISOString().slice(0, 10),
      getUuid: () => crypto.randomUUID(),
      DigestAlgorithm: { SHA_256: "sha256" },
      // Like Apps Script, bytes come back signed (-128 to 127).
      computeDigest: (alg, s) => Array.from(crypto.createHash(alg).update(s).digest(), b => (b > 127 ? b - 256 : b))
    },
    CacheService: { getScriptCache: () => ({
      get: k => (cached[k] && cached[k].until > clock ? cached[k].value : null),
      put: (k, value, seconds) => { cached[k] = { value, until: clock + seconds * 1000 }; },
      remove: k => { delete cached[k]; }
    }) },
    MailApp: { sendEmail: m => mail.push(m), getRemainingDailyQuota: () => 100 },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: s => ({ setMimeType: () => JSON.parse(s) }) },
    ScriptApp: { getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ atDate: () => ({ inTimezone: () => ({ create() {} }) }) }) }) }
  };
  vm.createContext(ctx);
  FILES.forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, "../apps-script", f), "utf8"), ctx, { filename: f }));
  ctx.setup();
  const set = (tab, row) => ctx.appendRow(tab, row);
  const post = body => ctx.doPost({ postData: { contents: JSON.stringify(body) } });
  const codeIn = m => /(\d{6})$/.exec(m.subject)[1];
  // Each student signs in the real way, through an emailed code, the first time they make a request.
  const tokens = {};
  const signIn = email => {
    const sent = post({ action: "sendCode", email });
    assert.ok(sent.ok, sent.error);
    return post({ action: "verifyCode", email, code: codeIn(mail[mail.length - 1]) }).data.token;
  };
  return {
    sheets, ctx, set, post, mail, codeIn,
    enrol: (email, cls, number, tester) => set("Students", { Email: email, Class: cls, Number: number, Tester: tester ? "yes" : "" }),
    at: iso => { clock = Date.parse(iso); },
    call: (email, action, extra) => post(Object.assign({ action, token: tokens[email] || (tokens[email] = signIn(email)) }, extra))
  };
}

const CLOZE = { blanks: { 1: { verb: "hold", answers: ["are held"], why: "routine passive" }, 2: { verb: "give", answers: ["aren't given"] } },
  paragraphs: [["The exams ", 1, " in May and we ", 2, " enough time."]], distractors: ["swim"] };
const PROOF = { lines: [["I [[am>have]] been so busy."], ["Our teacher is kind."]] };

function league() {
  const s = server();
  s.ctx.updateRow("Season", 2, { Value: "2026-11-02" });
  s.ctx.updateRow("Season", 3, { Value: "2027-06-30" });
  s.set("Challenges", { Week: "2026-11-02", Format: "cloze", Status: "approved", Title: "Mock exams", Data: JSON.stringify(CLOZE) });
  s.set("Challenges", { Format: "proofreading", Status: "backup", Title: "Backup proof", Data: JSON.stringify(PROOF) });
  s.set("Challenges", { Format: "cloze", Status: "backup", Title: "Backup cloze", Data: JSON.stringify(CLOZE) });
  return s;
}

test("only students on the class list get a code, and the code signs them in once", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.at("2026-11-03T10:00:00+08:00");
  assert.match(s.post({ action: "sendCode", email: "zoe@kings.edu.hk" }).error, /isn't on the class list/);
  assert.strictEqual(s.mail.length, 0);
  // Just the part before the @, in capitals, is enough.
  assert.ok(s.post({ action: "sendCode", email: " AMY " }).ok);
  assert.strictEqual(s.mail[0].to, "amy@kings.edu.hk");
  const code = s.codeIn(s.mail[0]);
  const signedIn = s.post({ action: "verifyCode", email: "amy@kings.edu.hk", code: code.slice(0, 3) + " " + code.slice(3) });
  assert.strictEqual(signedIn.data.label, "4C-12");
  assert.match(s.post({ action: "verifyCode", email: "amy@kings.edu.hk", code }).error, /expired or been used/);
  assert.strictEqual(s.post({ action: "me", token: signedIn.data.token }).data.student.label, "4C-12");
  // The sheet holds a hash, never the token itself.
  assert.ok(!JSON.stringify(s.sheets.Sessions.rows).includes(signedIn.data.token));
});

test("another student can't sign in with a classmate's email without the code", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.at("2026-11-03T10:00:00+08:00");
  s.post({ action: "sendCode", email: "amy@kings.edu.hk" });
  const wrong = s.codeIn(s.mail[0]) === "000000" ? "111111" : "000000";
  for (let i = 0; i < 4; i++) assert.match(s.post({ action: "verifyCode", email: "amy", code: wrong }).error, /isn't right/);
  assert.match(s.post({ action: "verifyCode", email: "amy", code: wrong }).error, /Too many wrong tries/);
  assert.match(s.post({ action: "verifyCode", email: "amy", code: s.codeIn(s.mail[0]) }).error, /expired or been used/);
  assert.match(s.post({ action: "me", token: "x".repeat(64) }).error, /sign in/);
  assert.strictEqual(s.post({ action: "me", token: crypto.randomBytes(32).toString("hex") }).signIn, true);
});

test("a code lasts 10 minutes, and a new one needs a minute's wait", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.at("2026-11-03T10:00:00+08:00");
  s.post({ action: "sendCode", email: "amy" });
  assert.match(s.post({ action: "sendCode", email: "amy" }).error, /less than a minute/);
  s.at("2026-11-03T10:10:01+08:00");
  assert.match(s.post({ action: "verifyCode", email: "amy", code: s.codeIn(s.mail[0]) }).error, /expired/);
  assert.ok(s.post({ action: "sendCode", email: "amy" }).ok);
  assert.ok(s.post({ action: "verifyCode", email: "amy", code: s.codeIn(s.mail[1]) }).ok);
});

test("signing out, or being taken off the class list, ends the sign-in", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.enrol("ben@kings.edu.hk", "4C", 13);
  s.at("2026-11-03T10:00:00+08:00");
  assert.ok(s.call("amy@kings.edu.hk", "signOut").ok);
  assert.strictEqual(s.call("amy@kings.edu.hk", "me").signIn, true);
  assert.ok(s.call("ben@kings.edu.hk", "me").ok);
  s.ctx.updateRow("Students", 3, { Email: "" });
  assert.match(s.call("ben@kings.edu.hk", "me").error, /sign in again/);
});

test("start hides the answers and an attempt can only be submitted once", () => {
  const s = league();
  s.at("2026-11-03T10:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  const started = s.call("amy@kings.edu.hk", "start");
  assert.ok(started.ok, started.error);
  assert.ok(!JSON.stringify(started.data).includes("are held"));
  assert.deepStrictEqual(started.data.challenge.bank, ["give", "hold", "swim"]);
  s.at("2026-11-03T10:05:00+08:00");
  const done = s.call("amy@kings.edu.hk", "submit", { answers: { 1: "are held", 2: "are not given" } });
  assert.deepStrictEqual([done.data.score, done.data.timeSec], [2, 300]);
  assert.match(s.call("amy@kings.edu.hk", "start").error, /already done/);
  assert.match(s.call("amy@kings.edu.hk", "submit", { answers: {} }).error, /no challenge in progress/);
});

test("reopening keeps the clock running and is counted", () => {
  const s = league();
  s.at("2026-11-03T10:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.call("amy@kings.edu.hk", "start");
  s.at("2026-11-03T10:08:00+08:00");
  assert.strictEqual(s.call("amy@kings.edu.hk", "start").data.remainingMs, 12 * 60 * 1000);
  assert.strictEqual(s.ctx.readRows("Attempts")[0].Reopened, 1);
});

test("switches under 3 seconds are ignored, longer ones are counted", () => {
  const s = league();
  s.at("2026-11-03T10:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.call("amy@kings.edu.hk", "start");
  s.call("amy@kings.edu.hk", "away", { ms: 1500 });
  s.call("amy@kings.edu.hk", "away", { ms: 8000 });
  s.call("amy@kings.edu.hk", "away", { ms: 4000 });
  const a = s.ctx.readRows("Attempts")[0];
  assert.deepStrictEqual([a.Switches, a["Away (s)"]], [2, 12]);
});

test("an abandoned attempt is marked from its saved answers at 20 minutes", () => {
  const s = league();
  s.at("2026-11-03T10:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.call("amy@kings.edu.hk", "start");
  s.call("amy@kings.edu.hk", "save", { answers: { 1: "are held", 99: "junk" } });
  s.at("2026-11-03T11:00:00+08:00");
  const me = s.call("amy@kings.edu.hk", "me").data;
  assert.deepStrictEqual(me.attempt, { status: "done", score: 1, timeSec: 1200 });
});

test("weekly board ranks by score then time, and shows labels not emails", () => {
  const s = league();
  s.at("2026-11-03T10:00:00+08:00");
  const play = (email, cls, n, answers, secs) => {
    s.at("2026-11-03T10:00:00+08:00");
    s.enrol(email, cls, n);
    s.call(email, "start");
    s.at(new Date(Date.parse("2026-11-03T10:00:00+08:00") + secs * 1000).toISOString());
    s.call(email, "submit", { answers });
  };
  const full = { 1: "are held", 2: "aren't given" };
  play("a@kings.edu.hk", "4A", 1, full, 400);
  play("b@kings.edu.hk", "4B", 2, full, 300);
  play("c@kings.edu.hk", "4C", 3, { 1: "are held" }, 100);
  const b = s.call("a@kings.edu.hk", "board").data.thisWeek.rows;
  assert.deepStrictEqual(b.map(r => [r.label, r.place, r.points, r.you]), [["4B-2", 1, 3, false], ["4A-1", 2, 2, true], ["4C-3", 3, 1, false]]);
  assert.ok(!JSON.stringify(b).includes("@"));
  // A fourth student's score is shown only to them; classmates just see that four took part.
  play("d@kings.edu.hk", "4D", 4, {}, 50);
  const seenByA = s.call("a@kings.edu.hk", "board").data.thisWeek;
  assert.deepStrictEqual([seenByA.entrants, seenByA.rows.map(r => r.label)], [4, ["4B-2", "4A-1", "4C-3"]]);
  assert.deepStrictEqual(s.call("d@kings.edu.hk", "board").data.thisWeek.rows.map(r => [r.label, r.you]),
    [["4B-2", false], ["4A-1", false], ["4C-3", false], ["4D-4", true]]);
});

test("league counts closed weeks only; disqualified attempts drop out", () => {
  const s = league();
  ["a", "b"].forEach((x, i) => {
    s.at("2026-11-03T10:00:00+08:00");
    s.enrol(x + "@kings.edu.hk", "4A", i + 1);
    s.call(x + "@kings.edu.hk", "start");
    s.at("2026-11-03T10:0" + (i + 1) + ":00+08:00");
    s.call(x + "@kings.edu.hk", "submit", { answers: { 1: "are held", 2: "aren't given" } });
  });
  assert.strictEqual(s.call("a@kings.edu.hk", "league").data.weeks, 0);
  s.at("2026-11-09T09:00:00+08:00");
  let rows = s.call("a@kings.edu.hk", "league").data.rows;
  assert.deepStrictEqual(rows.map(r => [r.label, r.points]), [["4A-1", 3], ["4A-2", 2]]);
  s.ctx.updateRow("Attempts", 2, { Disqualified: "yes" });
  rows = s.call("a@kings.edu.hk", "league").data.rows;
  assert.deepStrictEqual(rows.map(r => [r.label, r.points]), [["4A-2", 3]]);
});

test("week 2 with no approved set takes the proofreading backup", () => {
  const s = league();
  s.at("2026-11-10T09:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  const me = s.call("amy@kings.edu.hk", "me").data;
  assert.deepStrictEqual([me.week.format, me.week.title], ["proofreading", "Backup proof"]);
  const backup = s.ctx.readRows("Challenges").find(r => r.Title === "Backup proof");
  assert.deepStrictEqual([s.ctx.dayString(backup.Week), backup.Status], ["2026-11-09", "used"]);
});

test("answers are only revealed after the week closes", () => {
  const s = league();
  s.at("2026-11-03T10:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  assert.match(s.call("amy@kings.edu.hk", "review", { week: "2026-11-02" }).error, /after the week closes/);
  s.at("2026-11-09T00:21:01+08:00");
  const r = s.call("amy@kings.edu.hk", "review", { week: "2026-11-02" }).data;
  assert.strictEqual(r.challenge.blanks[1].answers[0], "are held");
});

test("a Sunday 23:50 starter cannot see the answers before their time is up", () => {
  const s = league();
  s.at("2026-11-08T23:50:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.call("amy@kings.edu.hk", "start");
  s.at("2026-11-09T00:05:00+08:00");
  assert.match(s.call("amy@kings.edu.hk", "review", { week: "2026-11-02" }).error, /after the week closes/);
  assert.strictEqual(s.call("amy@kings.edu.hk", "submit", { answers: { 1: "are held" } }).data.score, 1);
  s.at("2026-11-09T00:21:01+08:00");
  assert.ok(s.call("amy@kings.edu.hk", "review", { week: "2026-11-02" }).ok);
});

test("answers in the grace minute count but are flagged late; after it only saved answers count", () => {
  const s = league();
  ["a", "b"].forEach((x, i) => {
    s.at("2026-11-03T10:00:00+08:00");
    s.enrol(x + "@kings.edu.hk", "4A", i + 1);
    s.call(x + "@kings.edu.hk", "start");
    s.call(x + "@kings.edu.hk", "save", { answers: { 1: "are held" } });
  });
  s.at("2026-11-03T10:20:30+08:00");
  const a = s.call("a@kings.edu.hk", "submit", { answers: { 1: "are held", 2: "aren't given" } }).data;
  s.at("2026-11-03T10:25:00+08:00");
  const b = s.call("b@kings.edu.hk", "submit", { answers: { 1: "are held", 2: "aren't given" } }).data;
  assert.deepStrictEqual([a.score, a.timeSec, b.score, b.timeSec], [2, 1200, 1, 1200]);
  assert.deepStrictEqual(s.ctx.readRows("Attempts").map(r => r.Late), ["late", "late"]);
});

test("a backup that went live is not replaced by a set approved later that week", () => {
  const s = league();
  s.at("2026-11-10T09:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.call("amy@kings.edu.hk", "start");
  s.set("Challenges", { Week: "2026-11-09", Format: "proofreading", Status: "approved", Title: "Late approval", Data: JSON.stringify(PROOF) });
  assert.strictEqual(s.call("amy@kings.edu.hk", "me").data.week.title, "Backup proof");
});

test("a season date the sheet cannot read leaves the league paused instead of broken", () => {
  const s = league();
  s.ctx.updateRow("Season", 2, { Value: "2 Nov 2026" });
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.at("2026-11-03T10:00:00+08:00");
  const me = s.call("amy@kings.edu.hk", "me");
  assert.ok(me.ok, me.error);
  assert.strictEqual(me.data.season.active, false);
});

test("outside the season nobody can start", () => {
  const s = league();
  s.at("2026-10-30T10:00:00+08:00");
  s.enrol("amy@kings.edu.hk", "4C", 12);
  assert.match(s.call("amy@kings.edu.hk", "start").error, /not running/);
});

test("the trial page is for testers only, and its attempts never reach the league", () => {
  const s = league();
  s.set("Challenges", { Format: "cloze", Status: "trial", Title: "Trial cloze", Data: JSON.stringify(CLOZE) });
  s.enrol("teacher@kings.edu.hk", "4T", 1, true);
  s.enrol("amy@kings.edu.hk", "4C", 12);
  // Before the season starts, so only the trial is open.
  s.at("2026-10-30T10:00:00+08:00");
  const trial = { trial: "cloze" };
  assert.match(s.post({ action: "sendCode", email: "amy", trial: "cloze" }).error, /only for the teachers/);
  assert.match(s.call("amy@kings.edu.hk", "me", trial).error, /only for the teachers/);
  const me = s.call("teacher@kings.edu.hk", "me", trial).data;
  assert.deepStrictEqual([me.week.id, me.week.title, me.week.closesAt, me.season.active], ["trial-cloze", "Trial cloze", null, true]);
  assert.match(s.call("teacher@kings.edu.hk", "review", { week: "trial-cloze", trial: "cloze" }).error, /Hand in the trial first/);
  s.call("teacher@kings.edu.hk", "start", trial);
  s.at("2026-10-30T10:03:00+08:00");
  assert.strictEqual(s.call("teacher@kings.edu.hk", "submit", Object.assign({ answers: { 1: "are held" } }, trial)).data.score, 1);
  assert.match(s.call("teacher@kings.edu.hk", "start", trial).error, /already done/);
  // Answers straight away on the trial page, never on the real page.
  assert.strictEqual(s.call("teacher@kings.edu.hk", "review", { week: "trial-cloze", trial: "cloze" }).data.right[1], true);
  assert.match(s.call("teacher@kings.edu.hk", "review", { week: "trial-cloze" }).error, /only on the trial page/);
  assert.deepStrictEqual(s.call("teacher@kings.edu.hk", "me", trial).data.history.map(h => [h.week, h.score]), [["trial-cloze", 1]]);
  assert.strictEqual(s.call("teacher@kings.edu.hk", "board", trial).data.thisWeek.rows[0].label, "4T-1");
  // The real league and the real week don't see it.
  s.at("2026-11-10T10:00:00+08:00");
  assert.strictEqual(s.call("teacher@kings.edu.hk", "league").data.rows.length, 0);
  assert.strictEqual(s.call("teacher@kings.edu.hk", "me").data.attempt.status, "none");
  assert.strictEqual(s.call("teacher@kings.edu.hk", "board").data.lastWeek.entrants, 0);
});
