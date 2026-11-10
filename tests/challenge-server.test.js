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
    enrol: (email, cls, number) => set("Students", { Email: email, Class: cls, Number: number }),
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
  assert.deepStrictEqual(b.map(r => [r.label, r.place, r.points, r.you]), [["4B-2", 1, 5, false], ["4A-1", 2, 4, true], ["4C-3", 3, 3, false]]);
  assert.ok(!JSON.stringify(b).includes("@"));
  // The top five are on the board; a sixth student's score is shown only to them, and classmates just see that six took part.
  play("d@kings.edu.hk", "4D", 4, {}, 50);
  play("e@kings.edu.hk", "4E", 5, {}, 60);
  play("f@kings.edu.hk", "4F", 6, {}, 70);
  const seenByA = s.call("a@kings.edu.hk", "board").data.thisWeek;
  assert.deepStrictEqual([seenByA.entrants, seenByA.rows.map(r => [r.label, r.points])],
    [6, [["4B-2", 5], ["4A-1", 4], ["4C-3", 3], ["4D-4", 2], ["4E-5", 1]]]);
  assert.deepStrictEqual(s.call("f@kings.edu.hk", "board").data.thisWeek.rows.map(r => [r.label, r.you]),
    [["4B-2", false], ["4A-1", false], ["4C-3", false], ["4D-4", false], ["4E-5", false], ["4F-6", true]]);
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
  assert.deepStrictEqual(rows.map(r => [r.label, r.points]), [["4A-1", 5], ["4A-2", 4]]);
  s.ctx.updateRow("Attempts", 2, { Disqualified: "yes" });
  rows = s.call("a@kings.edu.hk", "league").data.rows;
  assert.deepStrictEqual(rows.map(r => [r.label, r.points]), [["4A-2", 5]]);
});

test("streak: counts weeks handed in, one after another, and only the student sees it", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  const playWeek = monday => {
    s.at(monday + "T10:00:00+08:00");
    s.call("amy@kings.edu.hk", "start", { pledged: true });
    s.at(monday + "T10:05:00+08:00");
    s.call("amy@kings.edu.hk", "submit", { answers: {} });
  };
  s.at("2026-11-03T10:00:00+08:00");
  assert.deepStrictEqual(s.call("amy@kings.edu.hk", "me").data.streak, { current: 0, best: 0 });
  playWeek("2026-11-03");
  assert.deepStrictEqual(s.call("amy@kings.edu.hk", "me").data.streak, { current: 1, best: 1 });
  playWeek("2026-11-10");
  // Week 3, not done yet: the streak of 2 is still alive.
  s.at("2026-11-17T10:00:00+08:00");
  assert.deepStrictEqual(s.call("amy@kings.edu.hk", "me").data.streak, { current: 2, best: 2 });
  // Week 3 skipped: by week 4 it has gone, and the best stays.
  s.at("2026-11-24T10:00:00+08:00");
  assert.deepStrictEqual(s.call("amy@kings.edu.hk", "me").data.streak, { current: 0, best: 2 });
  assert.ok(!JSON.stringify(s.call("amy@kings.edu.hk", "board").data).includes("streak"));
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

// ---------- The switch rule (from the week of 9 Nov 2026) ----------

const RULE_WEEK = "2026-11-17";
const at = (s, hhmmss) => s.at(RULE_WEEK + "T" + hhmmss + "+08:00");
const attemptOf = (s, email) => s.ctx.readRows("Attempts").find(r => r.Email === email);

test("under the switch rule a first start needs the promise ticked; carrying on doesn't", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  at(s, "10:00:00");
  assert.match(s.call("amy@kings.edu.hk", "start").error, /tick the promise/);
  const started = s.call("amy@kings.edu.hk", "start", { pledged: true });
  assert.ok(started.ok, started.error);
  assert.deepStrictEqual(started.data.rules, { maxSwitches: 1, minAwayMs: 3000 });
  assert.deepStrictEqual(started.data.away, { switches: 0, awaySec: 0, disqualified: false, byTeacher: false });
  at(s, "10:00:02");
  assert.ok(s.call("amy@kings.edu.hk", "start").ok);
});

test("one switch is allowed; the second disqualifies, and the score is never shown", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.enrol("ben@kings.edu.hk", "4C", 13);
  at(s, "10:00:00");
  s.call("amy@kings.edu.hk", "start", { pledged: true });
  s.call("ben@kings.edu.hk", "start", { pledged: true });
  assert.strictEqual(s.call("amy@kings.edu.hk", "away", { ms: 2000 }).data.counted, false);
  const first = s.call("amy@kings.edu.hk", "away", { ms: 14000 }).data;
  assert.deepStrictEqual([first.counted, first.away.switches, first.away.awaySec, first.away.disqualified], [true, 1, 14, false]);
  const second = s.call("amy@kings.edu.hk", "away", { ms: 69000 }).data;
  assert.deepStrictEqual([second.away.switches, second.away.awaySec, second.away.disqualified, second.away.byTeacher], [2, 83, true, false]);
  assert.strictEqual(attemptOf(s, "amy@kings.edu.hk").Disqualified, "yes");
  // Amy can still finish, but the hand-in gives no score and she's off the board.
  at(s, "10:05:00");
  const done = s.call("amy@kings.edu.hk", "submit", { answers: { 1: "are held", 2: "aren't given" } }).data;
  assert.deepStrictEqual([done.disqualified, "score" in done, done.away.switches, done.timeSec], [true, false, 2, 300]);
  s.call("ben@kings.edu.hk", "submit", { answers: { 1: "are held" } });
  assert.deepStrictEqual(s.call("ben@kings.edu.hk", "board").data.thisWeek.rows.map(r => r.label), ["4C-13"]);
  const mine = s.call("amy@kings.edu.hk", "me").data.attempt;
  assert.deepStrictEqual([mine.status, "score" in mine, mine.away.disqualified], ["done", false, true]);
  // Clearing the cell reinstates her.
  s.ctx.updateRow("Attempts", attemptOf(s, "amy@kings.edu.hk")._row, { Disqualified: "" });
  assert.deepStrictEqual(s.call("ben@kings.edu.hk", "board").data.thisWeek.rows.map(r => r.label), ["4C-12", "4C-13"]);
});

test("closing the page and reopening counts as a switch, timed from the last save", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  at(s, "10:00:00");
  s.call("amy@kings.edu.hk", "start", { pledged: true });
  at(s, "10:03:00");
  s.call("amy@kings.edu.hk", "save", { answers: { 1: "are held" } });
  at(s, "10:04:30");
  const back = s.call("amy@kings.edu.hk", "start").data;
  assert.deepStrictEqual([back.away.switches, back.away.awaySec, back.away.disqualified], [1, 90, false]);
  // A quick reload doesn't count.
  at(s, "10:04:32");
  assert.strictEqual(s.call("amy@kings.edu.hk", "start").data.away.switches, 1);
  at(s, "10:06:00");
  assert.strictEqual(s.call("amy@kings.edu.hk", "start").data.away.disqualified, true);
  assert.strictEqual(attemptOf(s, "amy@kings.edu.hk").Reopened, 3);
});

test("before the rule's first week, switches are counted but never disqualify, and no promise is needed", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  s.at("2026-11-03T10:00:00+08:00");
  const started = s.call("amy@kings.edu.hk", "start");
  assert.ok(started.ok, started.error);
  assert.strictEqual(started.data.rules, null);
  s.call("amy@kings.edu.hk", "away", { ms: 8000 });
  s.call("amy@kings.edu.hk", "away", { ms: 8000 });
  const a = attemptOf(s, "amy@kings.edu.hk");
  assert.deepStrictEqual([a.Switches, a.Disqualified], [2, ""]);
  s.at("2026-11-03T10:09:00+08:00");
  assert.strictEqual(s.call("amy@kings.edu.hk", "start").data.away.switches, 2, "a reopen isn't a switch before the rule");
});

test("a week that didn't count is listed without a score and doesn't keep the streak going", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  at(s, "10:00:00");
  s.call("amy@kings.edu.hk", "start", { pledged: true });
  s.call("amy@kings.edu.hk", "away", { ms: 5000 });
  s.call("amy@kings.edu.hk", "away", { ms: 5000 });
  s.call("amy@kings.edu.hk", "submit", { answers: { 1: "are held" } });
  assert.deepStrictEqual(s.call("amy@kings.edu.hk", "me").data.streak, { current: 0, best: 0 });
  s.at("2026-11-24T10:00:00+08:00");
  const me = s.call("amy@kings.edu.hk", "me").data;
  assert.deepStrictEqual(me.history, [{ week: "2026-11-16", disqualified: true, entrants: 0 }]);
  assert.ok(s.call("amy@kings.edu.hk", "review", { week: "2026-11-16" }).ok, "the answers can still be read");
});

test("the timeline records when answers arrive, and the Check flag never reaches the student", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  at(s, "10:00:00");
  s.call("amy@kings.edu.hk", "start", { pledged: true });
  at(s, "10:01:00");
  s.call("amy@kings.edu.hk", "save", { answers: { 1: "are held" } });
  at(s, "10:03:00");
  s.call("amy@kings.edu.hk", "submit", { answers: { 1: "are held", 2: "aren't given" } });
  const amy = attemptOf(s, "amy@kings.edu.hk");
  assert.deepStrictEqual(JSON.parse(amy.Timeline), [[60, ["1"]], [180, ["2"]]]);
  assert.strictEqual(amy.Check, "", "2/15 is never flagged as fast");
  s.ctx.updateRow("Attempts", amy._row, { Check: "quiet 4:30" });
  assert.ok(!JSON.stringify(s.call("amy@kings.edu.hk", "me").data).includes("quiet"));
});

test("the Weekly tab shows each week newest first, students in class order, and leaves Attempts alone", () => {
  const s = league();
  s.enrol("cat@kings.edu.hk", "4B", 3);
  s.enrol("amy@kings.edu.hk", "4A", 12);
  s.enrol("ben@kings.edu.hk", "4A", 2);
  s.at("2026-11-03T10:00:00+08:00");
  s.call("cat@kings.edu.hk", "start");
  s.at("2026-11-03T10:05:00+08:00");
  s.call("cat@kings.edu.hk", "submit", { answers: { 1: "are held" } });
  at(s, "10:00:00");
  ["amy", "ben"].forEach(x => s.call(x + "@kings.edu.hk", "start", { pledged: true }));
  s.call("amy@kings.edu.hk", "away", { ms: 5000 });
  s.call("amy@kings.edu.hk", "away", { ms: 70000 });
  at(s, "10:04:10");
  s.call("amy@kings.edu.hk", "submit", { answers: {} });
  const before = JSON.stringify(s.sheets.Attempts.rows);
  s.ctx.showWeeklyAttempts();
  assert.strictEqual(JSON.stringify(s.sheets.Attempts.rows), before);
  const rows = s.sheets.Weekly.rows.map(r => r.slice(0, 7).map(String));
  assert.deepStrictEqual(rows[0].slice(0, 2), ["Week of 16–22 Nov", "Cloze · Backup cloze"]);
  assert.strictEqual(rows[0][4], "0 counted · 1 not counted · 1 in progress");
  assert.deepStrictEqual(rows[1], ["Class", "No.", "Score", "Time", "Status", "Switches", "Away"]);
  assert.deepStrictEqual(rows[2], ["4A", "2", "", "", "In progress", "0", ""]);
  assert.deepStrictEqual(rows[3], ["4A", "12", "0", "4:10", "Not counted", "2", "1:15"]);
  assert.deepStrictEqual(rows[5].slice(0, 2), ["Week of 2–8 Nov", "Cloze · Mock exams"]);
  assert.deepStrictEqual(rows[7], ["4B", "3", "1", "5:00", "Counted", "0", ""]);
  assert.strictEqual(s.ctx.weekLabel("2026-11-30"), "30 Nov – 6 Dec");
});

test("an older sheet with no header for the new columns still reads them", () => {
  const s = league();
  s.enrol("amy@kings.edu.hk", "4C", 12);
  const head = s.sheets.Attempts.rows[0];
  head.splice(head.indexOf("Answers") + 1);
  at(s, "10:00:00");
  s.call("amy@kings.edu.hk", "start", { pledged: true });
  at(s, "10:02:00");
  assert.strictEqual(s.call("amy@kings.edu.hk", "start").data.away.awaySec, 120);
  s.ctx.addMissingHeaders();
  assert.strictEqual(JSON.stringify(s.sheets.Attempts.rows[0].slice(-3)), JSON.stringify(["Last seen", "Timeline", "Check"]));
});

