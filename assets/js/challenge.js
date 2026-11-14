/* CLY English Weekly Challenge: the page students use (challenge.html).
   Sign in with an emailed code → this week → the 20-minute challenge → the result.
   Below "this week": the weekly board, the season table, the student's own results and, once a week closes, its answers.
   Talks to the league through assets/js/challenge-api.js; the papers themselves are in challenge-papers.js. */
(function () {
  "use strict";
  var h = CLY.h, clear = CLY.clear, P = window.CLY_PAPERS, S = window.CLY_CHALLENGE;
  var root = document.getElementById("challenge");
  var testBar = h("div");
  root.parentNode.insertBefore(testBar, root);

  var SAVE_AFTER_MS = 2500;    // answers are saved this long after the last change
  var LIMIT_MS = 20 * 60 * 1000;
  var COUNT_UP_MS = 700;       // the score counting up after handing in
  var RESEND_WAIT_S = 60;
  var WARN_AT_MS = [5 * 60 * 1000, 60 * 1000];
  var FORMAT = { cloze: "Cloze", proofreading: "Proofreading" };

  var league = null;
  var paperFormat = "";        // the paper being done, so the result screen's next step matches it
  var playing = false;
  var saveNow = null;          // while playing: saves the answers at once (the test bar uses it before reloading)
  // Timers and listeners belong to one view and stop when the next view is drawn.
  var cleanups = [];
  function every(ms, fn) { var t = setInterval(fn, ms); cleanups.push(function () { clearInterval(t); }); }
  function after(ms, fn) { var t = setTimeout(fn, ms); cleanups.push(function () { clearTimeout(t); }); return t; }
  function listen(target, type, fn) { target.addEventListener(type, fn); cleanups.push(function () { target.removeEventListener(type, fn); }); }

  function view(build, keepPlaying) {
    cleanups.splice(0).forEach(function (stop) { stop(); });
    playing = !!keepPlaying;
    saveNow = null;
    // While the clock runs the page steps back to the paper: the big page title goes, like an exam room.
    document.body.classList.toggle("playing", playing);
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
  var plural = function (n, word) { return n + " " + word + (n === 1 ? "" : "s"); };
  // "14 seconds", "1 min 23 s": time away from the page.
  function awayFor(sec) {
    var s = Math.max(0, Math.round(sec));
    return s < 60 ? plural(s, "second") : Math.floor(s / 60) + " min" + (s % 60 ? " " + (s % 60) + " s" : "");
  }
  var times = function (n) { return n === 1 ? "once" : n + " times"; };

  // What a student is told about leaving the page: { kind: "warned" | "out", lead, rest }, or null.
  // during: the clock is still running, so a disqualified student is told they can finish for practice.
  function awayNote(a, during) {
    if (!a) return null;
    if (a.byTeacher) return { kind: "out", lead: "Not counted:", rest: " your teacher has marked this attempt so it won't count on the board or the league." };
    if (a.disqualified) return { kind: "out", lead: "Disqualified:", rest: " you " + (during ? "have left" : "left") + " this page " + times(a.switches) + " (" + awayFor(a.awaySec) + " in total). "
      + (during ? "You can finish for practice, but this attempt won't count on the board or the league." : "This week's attempt won't count on the board or the league.") };
    if (a.switches >= 1 && during) return { kind: "warned", lead: "Warning:", rest: " you left this page for " + awayFor(a.awaySec) + ". That was your one allowed switch. If you leave again, you'll be disqualified." };
    return null;
  }
  // "3 days", "5 hours", "12 minutes": how long until the week closes, in its biggest unit.
  function closesIn(ms) {
    var hours = Math.floor(ms / 36e5);
    if (hours >= 48) return plural(Math.floor(hours / 24), "day");
    if (hours >= 1) return plural(hours, "hour");
    return minutes(Math.max(ms, 60000));
  }

  // ---------- Sign in ----------

  function intro() {
    var fact = function (n, what) { return h("li", null, h("strong", null, n), h("span", null, what)); };
    return [
      h("p", { class: "lead" }, "One grammar challenge every week for " + S.form + ". Do your best, beat the clock and climb the league."),
      h("ul", { class: "facts", "aria-label": "The challenge at a glance" }, fact("15", "marks"), fact("20", "minutes"), fact("1", S.tryWord + " a week"))
    ];
  }

  function howItWorks() {
    var step = function (what, detail) { return h("li", null, h("strong", null, what), h("span", null, detail)); };
    return h("section", { class: "how", "aria-labelledby": "how" },
      h("h2", { id: "how" }, "How it works"),
      h("ol", { class: "skeleton" },
        step("Sign in", "Type your school email. We'll email you a code."),
        step("Do this week's challenge", "A cloze one week, proofreading the next. Each week runs Monday to Sunday."),
        step("Beat the clock", "You have 20 minutes. The clock keeps going if you leave, and your answers hand in by themselves."),
        step("Climb the league", "The top five each week get 5, 4, 3, 2 and 1 points. Same score? The faster time wins."),
        step("Keep your streak", "Do the challenge every week to build a streak. Miss a whole week and it starts again.")),
      h("p", { class: "meta" }, "Play fair: your teacher can see if you leave the page for more than 3 seconds. Answers come out every Monday."));
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
      el.appendChild(h("section", null, intro(), form));
      el.appendChild(howItWorks());
      el.appendChild(privacy());
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
        resend.textContent = "Send a new code in " + left + "s";
        every(1000, function () {
          left -= 1;
          resend.textContent = left > 0 ? "Send a new code in " + left + "s" : "Send a new code";
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

  // toBoards: open at the league (from the result screen) instead of the top of the page.
  function home(tab, toBoards) {
    if (!league.signedIn()) return signIn();
    loading();
    league.call("me").then(function (me) {
      view(function (el) {
        el.appendChild(h("div", { class: "who" },
          h("p", null, "Signed in as ", h("strong", null, me.student.label)),
          h("button", { type: "button", class: "link-btn", onclick: signOut }, "Sign out")));
        el.appendChild(thisWeek(me));
        // The board loads after the page draws, so the scroll waits until there is a board to scroll to.
        var lg = boards(me, tab || "board", toBoards ? function () { lg.scrollIntoView({ block: "start" }); } : null);
        el.appendChild(lg);
      });
    }, function (err) { problem(err, function () { home(tab); }); });
  }

  function signOut() {
    loading("Signing out…");
    league.call("signOut").then(function () { signIn("You've signed out.", true); }, function () { signIn(); });
  }

  // What the league covers in this week, for a form whose page lists it; later entries add to the earlier ones.
  function coverage(week) {
    var names = [];
    S.topics.forEach(function (t) { if (!t.from || t.from <= week) names = names.concat(t.names); });
    return names.length ? h("details", { class: "see-examples coverage" },
      h("summary", { class: "field-label" }, "What the league tests"),
      h("ul", { class: "how-to-list" }, names.map(function (name) { return h("li", null, name); }))) : null;
  }

  function thisWeek(me) {
    var w = me.week, a = me.attempt, s = me.season;
    var box = h("section", { class: "this-week", "aria-labelledby": "this-week" },
      h("h2", { id: "this-week" }, "This week"),
      h("dl", { class: "label" },
        h("dt", null, "Week"), h("dd", null, weekName(w.id)),
        h("dt", null, "Challenge"), h("dd", null, w.format ? FORMAT[w.format] + " · " + w.title : "Not ready yet"),
        h("dt", null, "Closes"), h("dd", null, "Sunday 23:59", s.active ? countdown(w.closesAt) : null)));
    if (!s.active) {
      var starts = s.start && s.start > w.id;
      box.appendChild(h("p", null, starts ? "The league starts on Monday " + day(Date.parse(s.start + "T00:00:00Z")) + ". See you then!"
        : s.start ? "The season has ended. Well done to everyone who took part." : "The league hasn't started yet."));
    } else if (!w.format) {
      box.appendChild(h("p", null, "This week's challenge isn't ready yet. Please check back soon."));
    } else if (a.status === "done" && a.away) {
      var out = awayNote(a.away, false);
      box.appendChild(h("p", { class: "not-counted", role: "status" }, h("strong", null, out.lead), out.rest));
      box.appendChild(h("p", { class: "meta" }, "Answers and explanations appear after the week closes on Sunday night."));
    } else if (a.status === "done") {
      box.appendChild(h("p", { class: "result-line" }, "Your score: ", h("strong", null, a.score + " / 15"), " in " + duration(a.timeSec) + "."));
      box.appendChild(h("p", { class: "meta" }, "Answers and explanations appear after the week closes on Sunday night."));
    } else if (a.status === "open") {
      box.appendChild(h("p", null, "You've started. ", h("strong", null, minutes(a.remainingMs) + " left"), " on your clock."));
      if (a.away && a.away.disqualified) { var gone = awayNote(a.away, true); box.appendChild(h("p", { class: "not-counted" }, h("strong", null, gone.lead), gone.rest)); }
      box.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: start }, "Carry on")));
    } else {
      box.appendChild(ready(me));
    }
    var keepGoing = s.active ? streakNote(me.streak, a.status === "done") : null;
    if (keepGoing) box.appendChild(keepGoing);
    var covers = coverage(w.id);
    if (covers) box.appendChild(covers);
    return box;
  }

  // Weeks in a row the student has handed in, and what keeps it going. Only they see it.
  // No streak from the web app (an older version still deployed) means nothing is shown.
  function streakNote(st, doneThisWeek) {
    if (!st) return null;
    var n = st.current, next;
    if (n > 0) next = (doneThisWeek ? "Come back next Monday" : "Do this week's challenge") + " to make it " + (n + 1) + ".";
    else if (st.best > 0) next = "Do this week's challenge to start a new one. Your best is " + plural(st.best, "week") + ".";
    else next = "Do the challenge every week to build one.";
    return h("p", { class: "streak" + (n > 0 ? " on" : "") },
      h("strong", null, n > 0 ? "Streak: " + plural(n, "week") + " in a row." : "Streak: none yet."), " ", h("span", null, next));
  }

  // Kept up to date while the page is open, so it never says "1 day" on Sunday night.
  function countdown(closesAt) {
    var span = h("span", { class: "countdown" });
    var draw = function () { span.textContent = " · closes in " + closesIn(closesAt - Date.now()); };
    draw();
    every(30000, draw);
    return span;
  }

  function ready(me) {
    // Only this spot changes when Start is pressed, so the page doesn't jump and the warning stays on screen.
    var spot = h("div");
    function ask() {
      clear(spot);
      // Under the switch rule, Start waits for the promise to be ticked (the league checks it too).
      var rules = me.rules;
      var go = h("button", { type: "button", class: "btn", disabled: !!rules, onclick: function () { start(true); } }, "Start now");
      var pledge = rules ? h("label", { class: "pledge" },
        h("input", { type: "checkbox", id: "start-pledge", onchange: function (e) { go.disabled = !e.target.checked; } }),
        h("span", null, "I'll do this on my own, without AI, translation apps, or help from anyone. I know that leaving this page more than once will disqualify me.")) : null;
      var box = h("div", { class: "confirm", role: "alertdialog", "aria-label": "Start the challenge?", "aria-describedby": "start-clock start-stay", tabindex: "-1",
        onkeydown: function (e) { if (e.key === "Escape") notYet(); } },
        h("p", { id: "start-clock" }, h("strong", null, "Ready?"), " The clock starts when you press Start now, and it doesn't stop."),
        h("p", { id: "start-stay" }, rules
          ? "Stay on this page until you hand in. You may leave it once; the second time, your attempt won't count. Glances under 3 seconds don't count."
          : "Stay on this page until you hand in. Your teacher can see if you leave for more than 3 seconds."),
        pledge,
        h("div", { class: "actions" }, go,
          h("button", { type: "button", class: "btn-quiet", onclick: notYet }, "Not yet")));
      spot.appendChild(box);
      box.focus({ preventScroll: true });
      box.scrollIntoView({ block: "nearest", behavior: CLY.reduceMotion ? "auto" : "smooth" });
    }
    function notYet() {
      show();
      spot.querySelector(".btn").focus({ preventScroll: true });
    }
    // How the paper works, before the clock costs anything.
    function howTo() {
      if (me.week.format !== "cloze" || !S.clozeHowTo) return null;
      return h("div", { class: "tip how-to" },
        h("p", { class: "field-label" }, "How this paper works"),
        h("ul", { class: "how-to-list" }, S.clozeHowTo.map(function (t) { return h("li", null, t); })),
        window.CLY_WORD_BOX.examples({ commas: true, choose: true }),
        S.practiceFirst ? h("p", null, h("a", { href: S.practiceFirst }, "Try a practice paper first, with no clock")) : null);
    }
    function show() {
      clear(spot);
      spot.appendChild(h("p", { class: "ready-line" }, me.week.format === "cloze" ? "15 blanks · 20 minutes · one " + S.tryWord : "15 lines · 20 minutes · one go"));
      spot.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: ask }, "Start the challenge")));
    }
    show();
    return h("div", null, spot, howTo());
  }

  function boards(me, tab, loaded) {
    var tabs = [["board", "Weekly board"], ["league", "League table"], ["mine", "My results"]];
    var panel = h("div", { class: "board-panel", "aria-live": "polite" });
    var chips = h("ul", { class: "chips" }, tabs.map(function (t) {
      return h("li", null, h("button", { type: "button", class: "chip", "data-tab": t[0], "aria-pressed": String(t[0] === tab), onclick: function () { pick(t[0]); } }, t[1]));
    }));
    // The league can answer slowly, so an answer only shows if the student is still on that tab.
    var current = null;
    function pick(name) {
      current = name;
      chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-tab") === name)); });
      clear(panel);
      if (name === "mine") return panel.appendChild(myResults(me));
      panel.appendChild(h("p", { class: "meta loading" }, "Loading…"));
      league.call(name).then(function (d) {
        if (current !== name) return;
        clear(panel);
        panel.appendChild(name === "board" ? weekBoards(d) : leagueTable(d));
        if (loaded) { loaded(); loaded = null; }
      },
        function (err) {
          if (err.signIn) return signIn(err.message);
          if (current !== name) return;
          clear(panel); panel.appendChild(h("p", { class: "warn" }, err.message));
        });
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
          h("td", null, duration(r.timeSec)), h("td", null, String(r.points || 0)));
      }));
    };
    var tookPart = function (n) { return h("p", { class: "took-part" }, n === 1 ? "1 student has taken part." : n + " students have taken part."); };
    var out = [h("h3", null, "This week · " + weekName(d.thisWeek.id))];
    out.push(d.thisWeek.rows.length ? [board(d.thisWeek.rows, "This week's board"), tookPart(d.thisWeek.entrants)] : h("p", null, "Nobody has finished this week's challenge yet. Be the first!"));
    if (d.lastWeek.rows.length) out.push(h("h3", null, "Final board · " + weekName(d.lastWeek.id)), board(d.lastWeek.rows, "Final board for " + weekName(d.lastWeek.id)), tookPart(d.lastWeek.entrants));
    out.push(h("p", { class: "meta" }, "Best score first. Same score? The faster time wins. Points: 5 for 1st, 4 for 2nd, 3 for 3rd, 2 for 4th, 1 for 5th. You see the top five and your own score; nobody else sees yours."));
    return h("div", null, out);
  }

  function leagueTable(d) {
    if (!d.weeks) return h("p", null, "The table starts once the first week of the season closes.");
    return h("div", { class: "season-table" },
      table("Season league table", ["Place", "Student", "Points", "1st", "2nd", "3rd", "4th", "5th", "Weeks"], d.rows.map(function (r) {
        var finishes = [r.firsts, r.seconds, r.thirds, r.fourths, r.fifths].map(function (n) { return h("td", null, String(n || 0)); });
        return h("tr", { class: r.you ? "you" : null },
          h("td", null, ordinal(r.place)), h("td", null, you(r, r.label)), h("td", null, h("strong", null, String(r.points))),
          finishes, h("td", null, String(r.played)));
      })),
      h("p", { class: "meta" }, "After " + d.weeks + (d.weeks === 1 ? " week" : " weeks") + ". Students with the same points share a place, so there can be joint winners. You see everyone with points, and your own row."));
  }

  function myResults(me) {
    if (!me.history.length) return h("p", null, "Your results appear here after each week closes. Only you can see this list.");
    // A week that didn't count is listed, so its answers can be read, but it never sets a personal best.
    var counted = me.history.filter(function (r) { return !r.disqualified; });
    var best = counted.length ? Math.max.apply(null, counted.map(function (r) { return r.score; })) : null;
    var st = me.streak;
    return h("div", null,
      best != null ? h("p", { class: "result-line" }, "Personal best: ", h("strong", null, best + " / 15")) : null,
      st ? h("p", { class: "result-line" }, "Streak: ", h("strong", null, plural(st.current, "week")), " · Best streak: ", h("strong", null, plural(st.best, "week"))) : null,
      table("My results", ["Week", "Score", "Place", "Points", "Answers"], me.history.slice().reverse().map(function (r) {
        if (r.disqualified) return h("tr", null, h("td", null, weekName(r.week)), h("td", { colspan: "3" }, "Not counted"),
          h("td", null, h("button", { type: "button", class: "link-btn", onclick: function () { review(r.week); } }, "See answers")));
        return h("tr", null, h("td", null, weekName(r.week)), h("td", null, r.score + " / 15"),
          h("td", null, ordinal(r.place) + " of " + r.entrants), h("td", null, String(r.points)),
          h("td", null, h("button", { type: "button", class: "link-btn", onclick: function () { review(r.week); } }, "See answers")));
      })),
      h("p", { class: "meta" }, "Only you can see this list."));
  }

  // ---------- The challenge ----------

  // pledged: the student ticked the promise (a first start); carrying on an attempt needs no tick.
  function start(pledged) {
    loading("Opening the challenge…");
    league.call("start", pledged === true ? { pledged: true } : {}).then(play, function (err) { problem(err, function () { home(); }); });
  }

  function play(d) {
    var ch = d.challenge, answers = d.saved || {}, deadline = Date.now() + d.remainingMs;
    paperFormat = ch.format;
    var savedState = "saved", pending = null, saving = false, done = false, leftAt = null, warned = {};
    // Under the switch rule the page warns and disqualifies as the league does; the league's own count wins when it answers.
    var rules = d.rules || null, away = d.away || { switches: 0, awaySec: 0, disqualified: false };
    view(function (el) {
      var awayBox = h("p", { class: "away-note", role: "alert" });
      function drawAway() {
        var note = rules || away.byTeacher ? awayNote(away, true) : null;
        awayBox.className = "away-note" + (note ? " " + note.kind : "");
        clear(awayBox);
        if (note) awayBox.append(h("strong", null, note.lead), note.rest);
      }
      var left = h("span", { class: "left" }, clock(d.remainingMs));
      var status = h("span", { class: "save-state" }, "Saved");
      // A cloze's narrow clock bar has no room for this, so a failed save gets a row of its own.
      var saveAlert = ch.format === "cloze" ? h("p", { class: "save-alert", role: "alert" }) : null;
      // Seen and heard: "5 minutes left", then "Last minute!".
      var timeNote = h("span", { class: "time-note", "aria-live": "assertive" });
      // The confirm opens beside the Hand in that was pressed: in the clock bar, or under the paper.
      var topSpot = h("div", { class: "confirm-spot" }), bottomSpot = h("div", { class: "confirm-spot" });
      var sheet = P.sheet(ch, answers, changed);
      var done15 = h("span", { class: "progress-count" });
      var drain = h("i");
      var bar = h("div", { class: "clock-bar" + (sheet.boxButton ? " has-box" : ""), role: "region", "aria-label": "Time and handing in" },
        h("p", { class: "time" }, h("span", { class: "visually-hidden" }, "Time left: "), left),
        h("p", { class: "clock-meta" }, timeNote, done15, status),
        sheet.boxButton || null,
        h("button", { type: "button", class: "btn", onclick: function () { confirmHandIn(topSpot); } }, "Hand in"),
        saveAlert,
        awayBox,
        topSpot,
        sheet.boxPanel || null,
        h("span", { class: "time-drain", "aria-hidden": "true" }, drain));
      var countDone = function () { done15.textContent = sheet.progress(); };

      function changed() {
        countDone();
        // A cloze's clock bar is narrow on a phone, so its word stays short enough to clear the Box button.
        savedState = "changed"; status.textContent = ch.format === "cloze" ? "Saving" : "Saving soon…";
        clearTimeout(pending);
        pending = after(SAVE_AFTER_MS, save);
      }
      // force: save even with nothing new, so the league knows when the page was last open.
      // A forced save asked for while another is on its way goes as soon as that one is back.
      var forceNext = false;
      function save(force) {
        if (saving && force === true) { forceNext = true; return; }
        if (saving || done || (savedState !== "changed" && force !== true)) return;
        saving = true; savedState = "saving"; status.textContent = ch.format === "cloze" ? "Saving" : "Saving…";
        var sent = JSON.stringify(answers);
        league.call("save", { answers: answers }).then(function () {
          saving = false;
          if (forceNext) { forceNext = false; return save(true); }
          if (JSON.stringify(answers) !== sent) { savedState = "changed"; return save(); }
          savedState = "saved"; status.textContent = "Saved";
          if (saveAlert) saveAlert.textContent = "";
        }, function (err) {
          saving = false; savedState = "changed";
          if (err.signIn) return signIn(err.message);
          status.textContent = "Not saved: check your connection";
          if (saveAlert) saveAlert.textContent = "Not saved: check your connection. We'll keep trying.";
          pending = after(10000, save);
        });
      }
      function tickClock() {
        var ms = deadline - Date.now();
        left.textContent = clock(ms);
        drain.style.transform = "scaleX(" + Math.max(0, Math.min(1, ms / LIMIT_MS)) + ")";
        bar.classList.toggle("short", ms <= 60000);
        WARN_AT_MS.forEach(function (at) {
          if (ms <= at && !warned[at]) { warned[at] = true; timeNote.textContent = at <= 60000 ? "Last minute!" : ch.format === "cloze" ? Math.ceil(at / 60000) + " min left" : minutes(at) + " left"; }
        });
        if (ms <= 0) handIn(true);
      }
      function confirmHandIn(spot) {
        var cloze = ch.format === "cloze", opener = document.activeElement;
        // Cloze only: handing in can't be undone, so focus starts on the safe choice and Esc backs out.
        var keepWorking = function () { clear(spot); if (cloze && opener && opener.isConnected) opener.focus({ preventScroll: true }); };
        clear(topSpot); clear(bottomSpot);
        if (sheet.closeBox) sheet.closeBox();
        spot.appendChild(h("div", { class: "confirm", role: "alertdialog", "aria-label": "Hand in now?",
          onkeydown: cloze ? function (e) { if (e.key === "Escape") keepWorking(); } : null },
          h("p", null, h("strong", null, "Hand in now?"), " You can't change your answers afterwards. " + sheet.handInNote()),
          h("div", { class: "actions" },
            h("button", { type: "button", class: "btn", onclick: function () { handIn(false); } }, "Hand in"),
            h("button", { type: "button", class: "btn-quiet", onclick: keepWorking }, "Keep working"))));
        spot.querySelector(cloze ? ".btn-quiet" : ".btn").focus({ preventScroll: true });
        spot.scrollIntoView({ block: "nearest", behavior: CLY.reduceMotion ? "auto" : "smooth" });
      }
      function handIn(timeUp) {
        if (done) return;
        done = true;
        // Still in another window when time ran out: that time away is reported before the answers go in.
        var stillAway = leftAt != null ? Date.now() - leftAt : 0;
        leftAt = null;
        view(function (v) { v.appendChild(h("p", { class: "meta loading" }, timeUp ? "Time's up! Handing in your answers…" : "Handing in…")); });
        (stillAway ? league.call("away", { ms: stillAway }).catch(function () { return null; }) : Promise.resolve())
          .then(function () { return league.call("submit", { answers: answers }); })
          .then(function (r) { result(r, timeUp); }, function (err) {
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
      // iPadOS Safari calls itself a Mac, so it is caught by its touch points; a touchscreen laptop with a mouse is not.
      var touchFirst = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (/Mac/.test(navigator.platform) && navigator.maxTouchPoints > 1) ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      // Switching tab or app, or clicking into another window beside the paper: the time away is reported when the
      // student comes back. Answers are saved on the way out; when the page hides it saves anyway, so a closed tab
      // that is reopened later is timed from that moment.
      function leave() {
        if (done) return;
        if (leftAt == null) leftAt = Date.now();
        if (document.hidden) save(true); else if (savedState === "changed") save();
      }
      function back() {
        if (done || leftAt == null || document.hidden) return;
        if (!touchFirst && !document.hasFocus()) return;
        var ms = Date.now() - leftAt;
        leftAt = null;
        if (rules && ms >= rules.minAwayMs) {
          away = { switches: away.switches + 1, awaySec: Math.round(away.awaySec + ms / 1000), byTeacher: false };
          away.disqualified = away.switches > rules.maxSwitches;
          drawAway();
        }
        league.call("away", { ms: ms }).then(function (r) {
          if (done || !r || !r.away) return;
          away = r.away;
          drawAway();
        }, function () { /* the page's own count stands; the league still has the time from the clock */ });
      }
      listen(document, "visibilitychange", function () { if (document.hidden) leave(); else back(); });
      // iPads and phones lose window focus without leaving the page (the pop-up keyboard, autofill, Scribble), and
      // hasFocus() can stay false while the keyboard is up. There only a hidden page counts as a switch.
      if (!touchFirst) listen(window, "blur", leave);
      listen(window, "focus", back);
      // Some phone browsers send no focus event on the way back: touching or typing on the paper also ends the time away.
      listen(document, "pointerdown", back);
      listen(document, "keydown", back);
      // Leaving mid-challenge (a cover tab, the footer, closing the tab) asks first. The clock would keep running.
      listen(window, "beforeunload", function (e) {
        if (done) return;
        if (savedState === "changed") save();
        e.preventDefault();
        e.returnValue = "";
      });

      el.appendChild(bar);
      drawAway();
      el.appendChild(h("section", { class: "paper", "aria-labelledby": "paper-title" },
        h("h2", { id: "paper-title" }, ch.title),
        ch.textType ? h("p", { class: "tagline" }, ch.textType) : null,
        h("p", null, ch.format === "cloze"
          ? S.clozeTask.replace("{items}", ch.phrases && ch.phrases.length ? "verbs and phrases" : "verbs") + (ch.commas && S.commaReminder ? " " + S.commaReminder : "")
          : S.proofTask),
        sheet.el,
        h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: function () { confirmHandIn(bottomSpot); } }, "Hand in")),
        bottomSpot));
      // Cloze only: the clock has started, so say so, and put keyboard and screen-reader students at the top of the paper.
      if (ch.format === "cloze") {
        var started = h("p", { class: "visually-hidden", role: "status" });
        el.appendChild(started);
        var paperTitle = el.querySelector("#paper-title");
        paperTitle.tabIndex = -1;
        paperTitle.focus();
        after(200, function () { started.textContent = "Clock started. " + minutes(d.remainingMs) + " left."; });
      }
      every(250, tickClock);
      tickClock();
      countDone();
      saveNow = function () { return league.call("save", { answers: answers }); };
    }, true);
    // A cloze opens at its first line, wherever the Start button was on the page.
    if (ch.format === "cloze") window.scrollTo(0, root.getBoundingClientRect().top + window.scrollY);
  }

  // Said with the score: encouraging at every level, never a telling-off.
  function cheer(score) {
    if (score === 15) return "Full marks! That's hard to beat.";
    if (score >= 12) return "Excellent work!";
    if (score >= 8) return "Good effort. Check the answers on Monday to find the last few marks.";
    return "Thanks for taking part. Read the answers on Monday, and next week will feel easier.";
  }

  // Seen once a week, so the score earns a short count-up; with reduced motion it simply appears.
  function countUp(el, to) {
    if (CLY.reduceMotion || !to) { el.textContent = to; return; }
    var start = performance.now();
    requestAnimationFrame(function frame(t) {
      var p = Math.min(1, (t - start) / COUNT_UP_MS);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    });
  }

  // One thing to do next, as every page on the site ends with.
  function nextStep(text, format) {
    var href = (format === "cloze" && S.clozePracticeHref) || S.practiceHref;
    return h("div", { class: "tip next-step" },
      h("p", { class: "field-label" }, "Next step"),
      h("p", null, text, " ", h("a", { href: href }, "Go to " + S.form + " grammar practice")));
  }

  function result(r, timeUp) {
    if (r.disqualified) return notCounted(r, timeUp);
    view(function (el) {
      var score = h("strong", null, "0");
      el.appendChild(h("section", { class: "handed-in" },
        h("h2", null, "Handed in"),
        timeUp ? h("p", { class: "time-up" }, "Time ran out, so your answers were handed in for you.") : null,
        h("p", { class: "big-score", "aria-label": r.score + " out of " + r.outOf }, score, h("span", { "aria-hidden": "true" }, " / " + r.outOf)),
        h("p", { class: "result-line" }, cheer(r.score)),
        h("p", null, "Time taken: " + duration(r.timeSec) + "."),
        h("p", { class: "meta" }, "Answers come out on Monday. Please don't share yours before then, so it's fair for everyone."),
        nextStep((paperFormat === "cloze" && S.clozePracticeNote) || S.practiceNote, paperFormat),
        h("div", { class: "actions" },
          h("button", { type: "button", class: "btn", onclick: function () { home("board", true); } }, "See the weekly board"))));
      el.querySelector("h2").setAttribute("tabindex", "-1");
      el.querySelector("h2").focus();
      countUp(score, r.score);
    });
  }

  // Handed in after being disqualified: how long they were away, and no score until the answers come out.
  function notCounted(r, timeUp) {
    var out = awayNote(r.away, false) || { lead: "Not counted.", rest: "" };
    view(function (el) {
      el.appendChild(h("section", { class: "handed-in" },
        h("h2", null, "Handed in (not counted)"),
        timeUp ? h("p", { class: "time-up" }, "Time ran out, so your answers were handed in for you.") : null,
        h("p", { class: "not-counted" }, h("strong", null, out.lead), out.rest),
        h("p", null, "Time taken: " + duration(r.timeSec) + "."),
        h("p", { class: "meta" }, "Answers come out on Monday, so you can see which of yours were right. Next week is a fresh start: stay on the page and it counts."),
        nextStep((paperFormat === "cloze" && S.clozePracticeNote) || S.practiceNote, paperFormat),
        h("div", { class: "actions" },
          h("button", { type: "button", class: "btn", onclick: function () { home("board", true); } }, "See the weekly board"))));
      el.querySelector("h2").setAttribute("tabindex", "-1");
      el.querySelector("h2").focus();
    });
  }

  // ---------- Answers for a closed week ----------

  function reviewAdvice(topics, perfect, format) {
    if (perfect) return "Full marks! Keep your skills sharp with a harder practice set.";
    if (topics.length) return "The grammar you missed: " + topics.join(format === "cloze" ? "; " : ", ") + ". Read the explanations above, then practise " + (topics.length === 1 ? "it." : "them.");
    return "Read the explanation under each cross, then try the practice cloze for the same tenses.";
  }

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
          P.review(d.challenge, d.answers, right),
          nextStep(reviewAdvice(P.missedTopics(d.challenge, right), score === total, d.challenge.format), d.challenge.format)));
        window.scrollTo(0, 0);
      });
    }, function (err) { problem(err, function () { home("mine"); }); });
  }

  // ---------- Test mode ----------

  function drawTestBar() {
    var t = league.test;
    clear(testBar);
    if (!t) return;
    var again = function (fn) {
      return function () {
        (saveNow ? saveNow() : Promise.resolve()).then(function () { fn(); playing ? start() : home(); drawTestBar(); });
      };
    };
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
