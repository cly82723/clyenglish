/* CLY English Weekly Challenge: the page students use (challenge.html).
   Sign in with an emailed code → this week → the 20-minute challenge → the result.
   Below "this week": the weekly board, the season table, the student's own results and, once a week closes, its answers.
   Talks to the league through assets/js/challenge-api.js; the papers themselves are in challenge-papers.js. */
(function () {
  "use strict";
  var h = CLY.h, clear = CLY.clear, P = window.CLY_PAPERS;
  var root = document.getElementById("challenge");
  var testBar = h("div");
  root.parentNode.insertBefore(testBar, root);

  var SAVE_AFTER_MS = 2500;    // answers are saved this long after the last change
  var RESEND_WAIT_S = 60;
  var WARN_AT_MS = [5 * 60 * 1000, 60 * 1000];
  var FORMAT = { cloze: "Cloze", proofreading: "Proofreading" };

  var league = null;
  var playing = false;
  // Timers and listeners belong to one view and stop when the next view is drawn.
  var cleanups = [];
  function every(ms, fn) { var t = setInterval(fn, ms); cleanups.push(function () { clearInterval(t); }); }
  function after(ms, fn) { var t = setTimeout(fn, ms); cleanups.push(function () { clearTimeout(t); }); return t; }
  function listen(target, type, fn) { target.addEventListener(type, fn); cleanups.push(function () { target.removeEventListener(type, fn); }); }

  function view(build, keepPlaying) {
    cleanups.splice(0).forEach(function (stop) { stop(); });
    playing = !!keepPlaying;
    clear(root);
    build(root);
  }
  function loading(text) { view(function (el) { el.appendChild(h("p", { class: "meta loading" }, text || "Loading…")); }); }

  function problem(err, retry) {
    if (err && err.signIn) return signIn(err.message);
    view(function (el) {
      el.appendChild(h("div", { class: "tip problem", role: "alert" },
        h("p", null, (err && err.message) || "Something went wrong."),
        h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: retry || function () { home(); } }, "Try again"))));
    });
  }

  // ---------- Small formats ----------

  var two = function (n) { return (n < 10 ? "0" : "") + n; };
  var clock = function (ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ":" + two(s % 60); };
  var duration = function (sec) { return clock(sec * 1000); };
  var day = function (ms) { return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }); };
  // "2–8 Nov" for the week starting Monday 2026-11-02.
  function weekName(id) {
    var mon = Date.parse(id + "T00:00:00Z");
    if (isNaN(mon)) return id;
    var sun = mon + 6 * 864e5, a = day(mon), b = day(sun);
    return a.split(" ")[1] === b.split(" ")[1] ? a.split(" ")[0] + "–" + b : a + " – " + b;
  }
  var ordinal = function (n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  var minutes = function (ms) { var m = Math.ceil(ms / 60000); return m + (m === 1 ? " minute" : " minutes"); };

  // ---------- Sign in ----------

  function rules() {
    return [
      h("p", { class: "lead" }, "One grammar challenge a week for S.4: a cloze one week, proofreading the next. ", h("strong", null, "15 marks, 20 minutes, one go.")),
      h("ul", { class: "rules" },
        h("li", null, "A week runs from ", h("strong", null, "Monday 00:00 to Sunday 23:59"), ", Hong Kong time, holidays included."),
        h("li", null, "The 20-minute clock starts when you press Start. It doesn't stop, even if you close the page, and your answers are handed in when it runs out."),
        h("li", null, "The best score wins the week; if scores are level, the faster time wins. 1st place gets 3 league points, 2nd gets 2 and 3rd gets 1."),
        h("li", null, "Leaving the page for more than 3 seconds is recorded for your teacher."),
        h("li", null, "Answers and explanations appear after the week closes."))
    ];
  }

  function privacy() {
    return h("p", { class: "meta privacy" }, "What's kept: your school email, class, class number and results, in your teacher's Google Sheet. Everything is deleted by 31 August.");
  }

  function field(id, label, input, button, help) {
    input.id = id;
    return [h("label", { class: "field-label", for: id }, label), h("div", { class: "row" }, input, button), help ? h("p", { class: "meta" }, help) : null];
  }

  // note: why the student is here (an expired sign-in); calm notes (signed out) aren't shown as errors.
  function signIn(note, calm) {
    view(function (el) {
      var msg = h("p", { class: calm ? "meta" : "warn", role: "alert" }, note || "");
      var email = h("input", { type: "text", inputmode: "email", autocomplete: "email", autocapitalize: "off", spellcheck: "false", placeholder: "e.g. s12345@kings.edu.hk" });
      var send = h("button", { type: "submit", class: "btn" }, "Email me a code");
      var form = h("form", { class: "signin", novalidate: true, onsubmit: function (e) {
        e.preventDefault();
        if (!email.value.trim()) { msg.textContent = "Please type your school email."; email.focus(); return; }
        send.disabled = true; send.textContent = "Sending…"; msg.textContent = "";
        league.call("sendCode", { email: email.value }).then(function (d) { codeStep(d.email); }, function (err) {
          send.disabled = false; send.textContent = "Email me a code"; msg.textContent = err.message;
        });
      } }, h("h2", null, "Sign in"), field("league-email", "Your school email", email, send, "Just the part before the @ is enough."), msg);
      el.appendChild(h("section", null, rules(), form, privacy()));
      email.focus({ preventScroll: true });
    });
  }

  function codeStep(address) {
    view(function (el) {
      var msg = h("p", { class: "warn", role: "alert" });
      var code = h("input", { type: "text", inputmode: "numeric", autocomplete: "one-time-code", maxlength: "7", placeholder: "6 digits", class: "code" });
      var go = h("button", { type: "submit", class: "btn" }, "Sign in");
      var resend = h("button", { type: "button", class: "link-btn", disabled: true, onclick: function () {
        resend.disabled = true;
        league.call("sendCode", { email: address }).then(function () { msg.textContent = "A new code is on its way."; wait(); }, function (err) { msg.textContent = err.message; resend.disabled = false; });
      } });
      var left;
      function wait() {
        left = RESEND_WAIT_S;
        resend.textContent = "Send a new code (" + left + ")";
        every(1000, function () {
          left -= 1;
          resend.textContent = left > 0 ? "Send a new code (" + left + ")" : "Send a new code";
          if (left === 0) resend.disabled = false;
        });
      }
      var form = h("form", { class: "signin", novalidate: true, onsubmit: function (e) {
        e.preventDefault();
        if (!code.value.trim()) { msg.textContent = "Please type the 6-digit code from the email."; code.focus(); return; }
        go.disabled = true; go.textContent = "Signing in…"; msg.textContent = "";
        league.call("verifyCode", { email: address, code: code.value }).then(function () { home(); }, function (err) {
          go.disabled = false; go.textContent = "Sign in"; msg.textContent = err.message; code.select();
        });
      } },
        h("h2", null, "Check your email"),
        h("p", null, "We've emailed a 6-digit code to ", h("strong", null, address), ". It can take a minute to arrive, so check your spam folder too. The code works for 10 minutes."),
        field("league-code", "Code", code, go), msg,
        h("p", { class: "actions-line" }, resend, " · ", h("button", { type: "button", class: "link-btn", onclick: function () { signIn(); } }, "Use a different email")));
      el.appendChild(h("section", null, form));
      wait();
      code.focus({ preventScroll: true });
    });
  }

  // ---------- Home: this week, then the boards ----------

  function home(tab) {
    if (!league.signedIn()) return signIn();
    loading();
    league.call("me").then(function (me) {
      view(function (el) {
        el.appendChild(h("div", { class: "who" },
          h("p", null, "Signed in as ", h("strong", null, me.student.label)),
          h("button", { type: "button", class: "link-btn", onclick: signOut }, "Sign out")));
        el.appendChild(thisWeek(me));
        el.appendChild(boards(me, tab || "board"));
      });
    }, function (err) { problem(err, function () { home(tab); }); });
  }

  function signOut() {
    loading("Signing out…");
    league.call("signOut").then(function () { signIn("You've signed out.", true); }, function () { signIn(); });
  }

  function thisWeek(me) {
    var w = me.week, a = me.attempt, s = me.season;
    var box = h("section", { class: "this-week", "aria-labelledby": "this-week" },
      h("h2", { id: "this-week" }, "This week"),
      h("dl", { class: "label" },
        h("dt", null, "Week"), h("dd", null, weekName(w.id)),
        h("dt", null, "Challenge"), h("dd", null, w.format ? FORMAT[w.format] + " · " + w.title : "Not ready yet"),
        h("dt", null, "Closes"), h("dd", null, "Sunday 23:59")));
    if (!s.active) {
      var starts = s.start && s.start > w.id;
      box.appendChild(h("p", null, starts ? "The league starts on Monday " + day(Date.parse(s.start + "T00:00:00Z")) + ". See you then!"
        : s.start ? "The season has ended. Well done to everyone who took part." : "The league hasn't started yet."));
    } else if (!w.format) {
      box.appendChild(h("p", null, "This week's challenge isn't ready yet. Please check back soon."));
    } else if (a.status === "done") {
      box.appendChild(h("p", { class: "result-line" }, "Your score: ", h("strong", null, a.score + " / 15"), " in " + duration(a.timeSec) + "."));
      box.appendChild(h("p", { class: "meta" }, "Answers and explanations appear after the week closes on Sunday night."));
    } else if (a.status === "open") {
      box.appendChild(h("p", null, "You've started. ", h("strong", null, minutes(a.remainingMs) + " left"), " on your clock."));
      box.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: start }, "Carry on")));
    } else {
      box.appendChild(ready(me));
    }
    return box;
  }

  function ready(me) {
    var spot = h("div");
    function ask() {
      clear(spot);
      spot.appendChild(h("div", { class: "tip confirm" },
        h("p", null, h("strong", null, "Ready?"), " The 20-minute clock starts now and keeps running, even if you leave the page."),
        h("div", { class: "actions" },
          h("button", { type: "button", class: "btn", onclick: start }, "Start now"),
          h("button", { type: "button", class: "btn-quiet", onclick: show }, "Not yet"))));
      spot.querySelector(".btn").focus();
    }
    function show() {
      clear(spot);
      spot.appendChild(h("p", null, "One go, 20 minutes, " + (me.week.format === "cloze" ? "15 blanks." : "15 lines.") + " Leaving the page is recorded."));
      spot.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: ask }, "Start the challenge")));
    }
    show();
    return spot;
  }

  function boards(me, tab) {
    var tabs = [["board", "Weekly board"], ["league", "League table"], ["mine", "My results"]];
    var panel = h("div", { class: "board-panel", "aria-live": "polite" });
    var chips = h("ul", { class: "chips" }, tabs.map(function (t) {
      return h("li", null, h("button", { type: "button", class: "chip", "data-tab": t[0], "aria-pressed": String(t[0] === tab), onclick: function () { pick(t[0]); } }, t[1]));
    }));
    function pick(name) {
      chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-tab") === name)); });
      clear(panel);
      if (name === "mine") return panel.appendChild(myResults(me));
      panel.appendChild(h("p", { class: "meta loading" }, "Loading…"));
      league.call(name).then(function (d) { clear(panel); panel.appendChild(name === "board" ? weekBoards(d) : leagueTable(d)); },
        function (err) { if (err.signIn) return signIn(err.message); clear(panel); panel.appendChild(h("p", { class: "warn" }, err.message)); });
    }
    pick(tab);
    return h("section", { class: "boards", "aria-labelledby": "boards" }, h("h2", { id: "boards" }, "The league"), chips, panel);
  }

  function table(caption, head, rows) {
    return h("div", { class: "table-wrap" }, h("table", null,
      h("caption", { class: "visually-hidden" }, caption),
      h("thead", null, h("tr", null, head.map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, rows)));
  }
  var you = function (r, label) { return r.you ? [h("strong", null, label), " ", h("span", { class: "you-tag" }, "you")] : label; };

  function weekBoards(d) {
    var board = function (rows, caption) {
      return table(caption, ["Place", "Student", "Score", "Time", "Points"], rows.map(function (r) {
        return h("tr", { class: r.you ? "you" : null },
          h("td", null, ordinal(r.place)), h("td", null, you(r, r.label)), h("td", null, r.score + " / 15"),
          h("td", null, duration(r.timeSec)), h("td", null, String(r.points || "")));
      }));
    };
    var out = [h("h3", null, "This week · " + weekName(d.thisWeek.id))];
    out.push(d.thisWeek.rows.length ? board(d.thisWeek.rows, "This week's board") : h("p", null, "Nobody has finished this week's challenge yet."));
    if (d.lastWeek.rows.length) out.push(h("h3", null, "Final board · " + weekName(d.lastWeek.id)), board(d.lastWeek.rows, "Final board for " + weekName(d.lastWeek.id)));
    out.push(h("p", { class: "meta" }, "Best score first; level scores go to the faster time. Points: 3 for 1st, 2 for 2nd, 1 for 3rd."));
    return h("div", null, out);
  }

  function leagueTable(d) {
    if (!d.weeks) return h("p", null, "The table starts once the first week of the season closes.");
    return h("div", null,
      table("Season league table", ["Place", "Student", "Points", "1st", "2nd", "3rd", "Weeks"], d.rows.map(function (r) {
        return h("tr", { class: r.you ? "you" : null },
          h("td", null, ordinal(r.place)), h("td", null, you(r, r.label)), h("td", null, h("strong", null, String(r.points))),
          h("td", null, String(r.firsts)), h("td", null, String(r.seconds)), h("td", null, String(r.thirds)), h("td", null, String(r.played)));
      })),
      h("p", { class: "meta" }, "After " + d.weeks + (d.weeks === 1 ? " week" : " weeks") + ". Students level on points share their place, so there can be joint winners."));
  }

  function myResults(me) {
    if (!me.history.length) return h("p", null, "Your results appear here after each week closes. Only you can see this list.");
    var best = Math.max.apply(null, me.history.map(function (r) { return r.score; }));
    return h("div", null,
      h("p", { class: "result-line" }, "Personal best: ", h("strong", null, best + " / 15")),
      table("My results", ["Week", "Score", "Place", "Points", "Answers"], me.history.slice().reverse().map(function (r) {
        return h("tr", null, h("td", null, weekName(r.week)), h("td", null, r.score + " / 15"),
          h("td", null, ordinal(r.place) + " of " + r.entrants), h("td", null, String(r.points)),
          h("td", null, h("button", { type: "button", class: "link-btn", onclick: function () { review(r.week); } }, "See answers")));
      })),
      h("p", { class: "meta" }, "Only you can see this list."));
  }

  // ---------- The challenge ----------

  function start() {
    loading("Opening the challenge…");
    league.call("start").then(play, function (err) { problem(err, function () { home(); }); });
  }

  function play(d) {
    var ch = d.challenge, answers = d.saved || {}, deadline = Date.now() + d.remainingMs;
    var savedState = "saved", pending = null, saving = false, done = false, hiddenAt = null, warned = {};
    view(function (el) {
      var left = h("span", { class: "left" }, clock(d.remainingMs));
      var status = h("span", { class: "save-state" }, "Saved");
      var shout = h("p", { class: "visually-hidden", "aria-live": "assertive" });
      var confirmSpot = h("div");
      var sheet = P.sheet(ch, answers, changed);
      var bar = h("div", { class: "clock-bar", role: "region", "aria-label": "Time and handing in" },
        h("p", { class: "time" }, h("span", { class: "visually-hidden" }, "Time left: "), left),
        status,
        h("button", { type: "button", class: "btn", onclick: confirmHandIn }, "Hand in"));

      function changed() {
        savedState = "changed"; status.textContent = "Saving soon…";
        clearTimeout(pending);
        pending = after(SAVE_AFTER_MS, save);
      }
      function save() {
        if (saving || done || savedState !== "changed") return;
        saving = true; savedState = "saving"; status.textContent = "Saving…";
        var sent = JSON.stringify(answers);
        league.call("save", { answers: answers }).then(function () {
          saving = false;
          if (JSON.stringify(answers) !== sent) { savedState = "changed"; return save(); }
          savedState = "saved"; status.textContent = "Saved";
        }, function (err) {
          saving = false; savedState = "changed";
          if (err.signIn) return signIn(err.message);
          status.textContent = "Not saved: check your connection";
          pending = after(10000, save);
        });
      }
      function tickClock() {
        var ms = deadline - Date.now();
        left.textContent = clock(ms);
        bar.classList.toggle("short", ms <= 60000);
        WARN_AT_MS.forEach(function (at) { if (ms <= at && !warned[at]) { warned[at] = true; shout.textContent = minutes(at) + " left."; } });
        if (ms <= 0) handIn(true);
      }
      function confirmHandIn() {
        clear(confirmSpot);
        var empty = sheet.empty();
        confirmSpot.appendChild(h("div", { class: "tip confirm", role: "alertdialog", "aria-label": "Hand in now?" },
          h("p", null, h("strong", null, "Hand in now?"), " You can't change your answers afterwards." + (empty ? " " + empty + (empty === 1 ? " blank is" : " blanks are") + " still empty." : "")),
          h("div", { class: "actions" },
            h("button", { type: "button", class: "btn", onclick: function () { handIn(false); } }, "Hand in"),
            h("button", { type: "button", class: "btn-quiet", onclick: function () { clear(confirmSpot); } }, "Keep working"))));
        confirmSpot.querySelector(".btn").focus();
      }
      function handIn(timeUp) {
        if (done) return;
        done = true;
        view(function (v) { v.appendChild(h("p", { class: "meta loading" }, timeUp ? "Time's up! Handing in your answers…" : "Handing in…")); });
        league.call("submit", { answers: answers }).then(result, function (err) {
          if (err.signIn) return signIn(err.message);
          view(function (v) {
            v.appendChild(h("div", { class: "tip problem", role: "alert" },
              h("p", null, err.message),
              h("p", null, "Don't worry: your answers were saved as you went, and they'll be marked even if you can't hand in from here."),
              h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: function () { done = false; handInAgain(); } }, "Try again"),
                h("button", { type: "button", class: "btn-quiet", onclick: function () { home(); } }, "Back to the league"))));
          });
        });
      }
      function handInAgain() {
        loading("Handing in…");
        league.call("submit", { answers: answers }).then(result, function (err) { problem(err, function () { home(); }); });
      }
      // Switching tab or app: the time away is reported when the page comes back, and answers are saved on the way out.
      listen(document, "visibilitychange", function () {
        if (document.hidden) { hiddenAt = Date.now(); if (savedState === "changed") save(); return; }
        if (hiddenAt == null) return;
        var ms = Date.now() - hiddenAt;
        hiddenAt = null;
        league.call("away", { ms: ms }).catch(function () { /* the server still has the time from the clock */ });
      });

      el.appendChild(bar);
      el.appendChild(shout);
      el.appendChild(confirmSpot);
      el.appendChild(h("section", { class: "paper", "aria-labelledby": "paper-title" },
        h("h2", { id: "paper-title" }, ch.title),
        ch.textType ? h("p", { class: "tagline" }, ch.textType) : null,
        h("p", null, ch.format === "cloze"
          ? "Choose a verb from the box for each blank and type it in the right form. Use each verb once at most; some verbs in the box are not needed. You may need any tense, the passive, or “not”."
          : "Most lines have one mistake, and some lines are correct. Mark each mistake you find. One mark per line."),
        sheet.el,
        h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: confirmHandIn }, "Hand in"))));
      every(250, tickClock);
      tickClock();
    }, true);
  }

  function result(r) {
    view(function (el) {
      el.appendChild(h("section", { class: "handed-in" },
        h("h2", null, "Handed in"),
        h("p", { class: "big-score" }, h("strong", null, r.score), " / " + r.outOf),
        h("p", null, "Time taken: " + duration(r.timeSec) + "."),
        h("p", null, "Answers and explanations appear after the week closes on Sunday night. Until then, keep your answers to yourself, so the league stays fair."),
        h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: function () { home("board"); } }, "See the weekly board"))));
      el.querySelector("h2").setAttribute("tabindex", "-1");
      el.querySelector("h2").focus();
    });
  }

  // ---------- Answers for a closed week ----------

  function review(week) {
    loading();
    league.call("review", { week: week }).then(function (d) {
      var right = d.right, total = Object.keys(right).length;
      var score = Object.keys(right).filter(function (k) { return right[k]; }).length;
      view(function (el) {
        var back = h("button", { type: "button", class: "link-btn", onclick: function () { home("mine"); } }, "← Back to the league");
        el.appendChild(h("p", null, back));
        el.appendChild(h("section", { class: "review-sheet" },
          h("h2", null, "Answers · " + weekName(week)),
          h("p", { class: "tagline" }, FORMAT[d.challenge.format] + " · " + d.challenge.title),
          h("p", { class: "result-line" }, "You scored ", h("strong", null, score + " / " + total), "."),
          P.review(d.challenge, d.answers, right)));
        window.scrollTo(0, 0);
      });
    }, function (err) { problem(err, function () { home("mine"); }); });
  }

  // ---------- Test mode ----------

  function drawTestBar() {
    var t = league.test;
    clear(testBar);
    if (!t) return;
    var again = function (fn) { return function () { fn(); playing ? start() : home(); drawTestBar(); }; };
    testBar.appendChild(h("aside", { class: "test-bar", "aria-label": "Test mode" },
      h("p", null, h("strong", null, "Test mode."), " Nothing is saved and nobody else sees this. Sign in with any email; the code is ", h("strong", null, t.code), "."),
      h("div", { class: "row" },
        ["cloze", "proofreading"].map(function (f) {
          return h("button", { type: "button", class: "chip", "aria-pressed": String(t.format() === f), onclick: function () { t.useFormat(f); playing = false; home(); drawTestBar(); } }, FORMAT[f]);
        }),
        h("button", { type: "button", class: "chip", onclick: again(t.lastMinute) }, "Jump to the last minute"),
        h("button", { type: "button", class: "chip", onclick: function () { t.closeWeek(); playing = false; home("mine"); } }, "Close the week"),
        h("button", { type: "button", class: "chip", onclick: function () { t.reset(); playing = false; home(); } }, "Start again"))));
  }

  loading();
  window.CLY_LEAGUE.then(function (l) {
    league = l;
    drawTestBar();
    home();
  }, function (err) { problem(err, function () { location.reload(); }); });
})();
