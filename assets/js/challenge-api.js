/* CLY English Weekly Challenge: talking to the league's web app (apps-script/).
   With ?test in the address on a local preview (localhost), a stand-in league runs in the browser instead: it marks with the web app's own
   rules (apps-script/Logic.gs), plays a practice passage, and saves nothing anywhere.
   Every call resolves to the data, or rejects with { message, signIn } for the page to show as it is. */
(function () {
  "use strict";

  // S.4's league. Another form's page sets window.CLY_CHALLENGE before this script to replace any of these; each form has its own web app and sign-in.
  var S = window.CLY_CHALLENGE = Object.assign({
    form: "S.4",
    webApp: "https://script.google.com/macros/s/AKfycbyISXddli7FK0eppikCORtBaRSd4LWmBWVu3bUakmInmqZ52-Gf7AMS9WSCX88-Q9Lv/exec",
    tokenKey: "cly:league-token",
    practiceHref: "grammar.html#practice",
    practiceNote: "While you wait, practise the same kind of paper with hints and instant marking.",
    boxLabel: "Verb box",
    boxHelp: "Tap a verb to cross it off once you've used it. Lost the box? Tap “Box” at the top.",
    clozeTask: "Pick a verb from the box for each blank and write it in the right form. You might need any tense, the passive or “not”. You won't need every verb.",
    commaReminder: "",
    tryWord: "go",          // "1 go a week"
    wordTable: false,       // the box as a table, grouped into verbs and phrases, instead of a row of chips
    wordRanges: {},         // { topic: { name, words } }: a whole group shown in the box when a set has blanks on that topic
    clozeHowTo: null,       // how the paper works, shown with worked examples before the clock starts
    clozePracticeHref: "", // after a cloze, if different from practiceHref
    clozePracticeNote: "",
    practiceFirst: "",      // where to try the paper with no clock, linked before the clock starts
    proofTask: "Most lines have one mistake. Fix it by changing, adding or deleting one word. Some lines are correct: tap “No mistake” for those. A line with no mark scores nothing.",
    linesOutOf: false,      // "3 / 15 lines marked" instead of "3 lines marked"
    topics: [],             // [{ from: "YYYY-MM-DD" or "", names: [...] }]: what the league covers from that Monday on
    testCloze: ""           // test mode's cloze: a script setting window.CLY_TEST_CLOZE, instead of the practice passage
  }, window.CLY_CHALLENGE);
  var WEB_APP = S.webApp;
  var TOKEN_KEY = S.tokenKey;
  var OFFLINE = "Can't reach the league. Check your internet connection and try again.";
  var GARBLED = "The league didn't answer properly. Please try again in a minute.";

  // ---------- The real league ----------

  // Private browsing can block storage; the sign-in then lasts until the tab closes.
  var token = null;
  try { token = localStorage.getItem(TOKEN_KEY); } catch (e) { token = null; }
  function keepToken(t) {
    token = t;
    try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) { /* kept in memory only */ }
  }

  function call(action, extra) {
    // A plain string body is sent as text/plain, so the browser skips the CORS preflight Apps Script can't answer.
    var body = JSON.stringify(Object.assign({ action: action, token: token }, extra));
    // A save sent as the page closes still arrives (keepalive), so a reopen is timed from it.
    return fetch(WEB_APP, { method: "POST", body: body, keepalive: action === "save" })
      .then(function (res) { return res.json().catch(function () { throw { message: GARBLED }; }); }, function () { throw { message: OFFLINE, offline: true }; })
      .then(function (r) {
        if (!r || typeof r.ok !== "boolean") throw { message: GARBLED };
        if (r.ok) {
          if (action === "verifyCode") keepToken(r.data.token);
          if (action === "signOut") keepToken(null);
          return r.data;
        }
        if (r.signIn) keepToken(null);
        throw { message: r.error, signIn: !!r.signIn };
      });
  }

  var league = {
    test: null,
    signedIn: function () { return !!token; },
    call: function (action, extra) {
      // Signing out works even when the league can't be reached: the device simply forgets the sign-in.
      if (action === "signOut") return call(action).catch(function () { keepToken(null); return { signedOut: true }; });
      return call(action, extra);
    }
  };

  // ---------- Test mode: a stand-in league in the browser ----------

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = function () { reject({ message: "Test mode couldn't load " + src + "." }); };
      document.head.appendChild(s);
    });
  }

  // Logic.gs is plain JavaScript, so test mode marks with exactly the web app's rules.
  function loadRules() {
    return fetch("apps-script/Logic.gs").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (src) {
      return new Function(src + "\nreturn { mark: mark, publicChallenge: publicChallenge, rankWeek: rankWeek, timeTaken: timeTaken, weekId: weekId, weekEndMs: weekEndMs, visibleRows: visibleRows, streak: streak, countAway: countAway, overSwitchLimit: overSwitchLimit, MAX_SWITCHES: MAX_SWITCHES, MIN_AWAY_MS: MIN_AWAY_MS };")();
    }).catch(function () { throw { message: "Test mode couldn't load the marking rules. Open the page from the website or a local server, not as a file." }; });
  }

  var TEST_CODE = "123456";
  var LIMIT_MS = 20 * 60 * 1000;
  var GRACE_MS = 60 * 1000;
  // Made-up classmates so the board and the league table have something to show.
  var YEAR = S.form.slice(2);
  var OTHERS = [{ key: YEAR + "A-3", score: 13, timeMs: 512000 }, { key: YEAR + "D-18", score: 11, timeMs: 655000 }, { key: YEAR + "B-7", score: 11, timeMs: 690000 }];
  var ME = { key: YEAR + "C-12", cls: YEAR + "C", number: 12, email: "student@kings.edu.hk" };

  function testLeague(rules) {
    var passages = {
      cloze: Object.assign({ format: "cloze" }, window.CLY_TEST_CLOZE || window.CLY_TENSE_CLOZE[0]),
      proofreading: Object.assign({ format: "proofreading" }, window.CLY_PROOFREADING[0])
    };
    var st, signedIn = false;
    function reset(format) { st = { format: format || "cloze", shiftMs: 0, closed: false, attempt: null }; }
    reset();
    var now = function () { return Date.now() + st.shiftMs; };
    var week = function () { return rules.weekId(Date.now()); };
    var challenge = function () { return passages[st.format]; };
    var deadline = function () { return st.attempt.started + LIMIT_MS; };
    var fail = function (message, signIn) { throw { message: message, signIn: !!signIn }; };

    function finish(answers, atMs) {
      var a = st.attempt;
      a.answers = answers; a.submitted = atMs;
      a.score = rules.mark(challenge(), answers).score;
      a.timeMs = rules.timeTaken(a.started, atMs, LIMIT_MS);
    }
    function finishIfExpired() {
      var a = st.attempt;
      if (a && !a.submitted && now() > deadline() + GRACE_MS) finish(a.answers, deadline());
    }
    function ranked() {
      var a = st.attempt, rows = OTHERS.slice();
      if (a && a.submitted && !a.dq) rows.push({ key: ME.key, score: a.score, timeMs: a.timeMs });
      return rules.rankWeek(rows);
    }
    var boardRow = function (r) { return { label: r.key, score: r.score, timeSec: r.timeMs / 1000, place: r.place, points: r.points, you: r.key === ME.key }; };
    // Test mode always plays under the switch rule, so it can be tried before the week it starts.
    var RULES = { maxSwitches: rules.MAX_SWITCHES, minAwayMs: rules.MIN_AWAY_MS };
    var awayOf = function (a) { return { switches: a.switches, awaySec: a.awaySec, disqualified: a.dq, byTeacher: false }; };
    function leftFor(ms) {
      var a = st.attempt, next = rules.countAway({ switches: a.switches, awaySec: a.awaySec }, ms);
      a.lastSeen = now();
      if (!next.counted) return false;
      a.switches = next.switches; a.awaySec = next.awaySec;
      if (rules.overSwitchLimit(a.switches)) a.dq = true;
      return true;
    }
    function summary() {
      var a = st.attempt;
      if (!a) return { status: "none" };
      if (a.submitted && a.dq) return { status: "done", away: awayOf(a), timeSec: a.timeMs / 1000 };
      if (a.submitted) return { status: "done", score: a.score, timeSec: a.timeMs / 1000 };
      return { status: "open", remainingMs: Math.max(0, deadline() - now()), away: awayOf(a) };
    }
    function history() {
      if (st.closed && st.attempt && st.attempt.dq) return [{ week: week(), disqualified: true, entrants: OTHERS.length }];
      var mine = st.closed && ranked().filter(function (r) { return r.key === ME.key; })[0];
      return mine ? [{ week: week(), score: mine.score, place: mine.place, points: mine.points, entrants: OTHERS.length + 1 }] : [];
    }

    var actions = {
      sendCode: function (b) {
        var typed = String(b.email || "").trim().toLowerCase();
        if (!typed) fail("Please type your school email.");
        return { sent: true, email: typed.indexOf("@") < 0 ? typed + "@kings.edu.hk" : typed };
      },
      verifyCode: function (b) {
        if (String(b.code || "").replace(/\s/g, "") !== TEST_CODE) fail("That code isn't right. In test mode the code is " + TEST_CODE + ".");
        signedIn = true;
        return { token: "test", label: ME.key };
      },
      signOut: function () { signedIn = false; return { signedOut: true }; },
      me: function () {
        finishIfExpired();
        return {
          email: ME.email, student: { cls: ME.cls, number: ME.number, label: ME.key },
          season: { start: week(), end: "", active: true },
          week: { id: week(), closesAt: rules.weekEndMs(week()), format: st.format, title: challenge().title },
          attempt: summary(), limitMs: LIMIT_MS, rules: RULES, history: history(),
          // After "Close the week", the test week counts as last week, so the streak shows as still alive.
          // A week that didn't count doesn't keep the streak going.
          streak: st.closed ? rules.streak(history().filter(function (r) { return !r.disqualified; }).map(function (r) { return r.week; }), rules.weekId(rules.weekEndMs(week())), false)
            : rules.streak([], week(), summary().status === "done" && !st.attempt.dq)
        };
      },
      start: function (b) {
        if (st.closed) fail("This week has closed. Press “Start again” in the test bar.");
        finishIfExpired();
        if (st.attempt && st.attempt.submitted) fail("You have already done this week's challenge.");
        if (st.attempt) leftFor(now() - st.attempt.lastSeen);
        else if (b.pledged !== true) fail("Please tick the promise before you start.");
        else st.attempt = { started: now(), answers: {}, switches: 0, awaySec: 0, dq: false, lastSeen: now() };
        return { challenge: rules.publicChallenge(challenge()), remainingMs: Math.max(0, deadline() - now()), saved: st.attempt.answers,
          rules: RULES, away: awayOf(st.attempt) };
      },
      save: function (b) {
        if (!st.attempt || st.attempt.submitted) fail("There is no challenge in progress.");
        if (now() > deadline() + GRACE_MS) return { saved: false };
        st.attempt.answers = b.answers || {};
        st.attempt.lastSeen = now();
        return { saved: true };
      },
      away: function (b) {
        if (!st.attempt || st.attempt.submitted) fail("There is no challenge in progress.");
        var counted = leftFor(Math.min(Number(b.ms) || 0, LIMIT_MS));
        return { counted: counted, away: awayOf(st.attempt) };
      },
      submit: function (b) {
        var a = st.attempt;
        if (!a || a.submitted) fail("There is no challenge in progress.");
        finish(now() > deadline() + GRACE_MS ? a.answers : (b.answers || {}), Math.min(now(), deadline()));
        if (a.dq) return { disqualified: true, away: awayOf(a), outOf: 15, timeSec: a.timeMs / 1000 };
        return { score: a.score, outOf: 15, timeSec: a.timeMs / 1000 };
      },
      board: function () {
        finishIfExpired();
        var all = ranked();
        var shown = { id: week(), entrants: all.length, rows: rules.visibleRows(all, ME.key).map(boardRow) };
        var none = { id: week(), entrants: 0, rows: [] };
        return st.closed ? { thisWeek: none, lastWeek: shown } : { thisWeek: shown, lastWeek: none };
      },
      league: function () {
        if (!st.closed) return { weeks: 0, entrants: 0, rows: [] };
        return { weeks: 1, entrants: ranked().length, rows: rules.visibleRows(ranked(), ME.key).map(function (r) {
          return { label: r.key, points: r.points, played: 1, firsts: r.place === 1 ? 1 : 0, seconds: r.place === 2 ? 1 : 0, thirds: r.place === 3 ? 1 : 0,
            fourths: r.place === 4 ? 1 : 0, fifths: r.place === 5 ? 1 : 0, place: r.place, you: r.key === ME.key };
        }) };
      },
      review: function () {
        if (!st.closed) fail("Answers appear after the week closes on Sunday night.");
        var answers = (st.attempt && st.attempt.answers) || {};
        return { challenge: challenge(), answers: answers, right: rules.mark(challenge(), answers).right };
      }
    };

    return {
      signedIn: function () { return signedIn; },
      call: function (action, extra) {
        return new Promise(function (resolve, reject) {
          // A short pause, like a real round trip, so loading states show up in testing.
          setTimeout(function () {
            try {
              if (action !== "sendCode" && action !== "verifyCode" && !signedIn) fail("Please sign in with your school email.", true);
              resolve(JSON.parse(JSON.stringify(actions[action](extra || {}))));
            } catch (err) { reject(err && err.message ? err : { message: String(err) }); }
          }, 250);
        });
      },
      // The test bar's controls.
      test: {
        code: TEST_CODE,
        format: function () { return st.format; },
        useFormat: function (f) { reset(f); },
        lastMinute: function () { if (st.attempt && !st.attempt.submitted) st.shiftMs += deadline() - now() - 60000; },
        closeWeek: function () {
          if (st.attempt && !st.attempt.submitted) finish(st.attempt.answers, Math.min(now(), deadline()));
          st.closed = true;
        },
        reset: function () { reset(st.format); }
      }
    };
  }

  // Test mode is for the teacher's own computer only (tools/serve.js); on the published site ?test does nothing.
  var testing = /[?&]test\b/.test(location.search) && /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  window.CLY_LEAGUE = testing
    ? Promise.all([loadRules(), loadScript("assets/js/data/grammar-tense-cloze.js"), loadScript("assets/js/data/grammar-proofreading.js"), S.testCloze ? loadScript(S.testCloze) : null]).then(function (r) { return testLeague(r[0]); })
    : Promise.resolve(league);
})();
