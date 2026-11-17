/* CLY English — badges. Earned by showing up, finishing things and keeping the weekly challenge going.
   The sheet lives on the home page ([data-stickers]); every other page only awards and announces.
   Practice badges are kept in this browser only. League badges are worked out from the league's own history,
   so they come back after a change of phone. A streak badge is held, not kept: it goes when a week is missed. */
(function () {
  "use strict";

  var DAY_MS = 864e5;
  var DAYS_FOR_BADGE = 5;
  var DAYS_IN_A_ROW = 3;
  var SETS_FOR_BADGE = 10;
  var SETS_PER_EXERCISE = 5;
  var PART_B_STEPS = 5;
  var TIPS_FOR_BADGE = 10;
  var FULL_MARKS = 15;
  var STREAK_STEPS = [5, 10, 15];   // weeks in a row that change the streak badge
  var TOAST_MS = 5000;
  var TOAST_FADE_MS = 400;
  var KEY = "cly:stickers";

  /* ---------- What earns what: plain functions, tested in tests/stickers.test.js ---------- */

  function dayOf(week) { return Math.round(Date.parse(week + "T00:00:00Z") / DAY_MS); }

  // The weeks that counted, oldest first: every closed week that wasn't disqualified, plus this week once it is
  // handed in and counts (done: { score }). Each is { week, score, points }.
  function countedWeeks(history, thisWeek, done) {
    var weeks = (history || []).filter(function (r) { return !r.disqualified; })
      .map(function (r) { return { week: r.week, score: r.score, points: r.points || 0 }; });
    if (done && !weeks.some(function (w) { return w.week === thisWeek; })) weeks = weeks.concat([{ week: thisWeek, score: done.score, points: 0 }]);
    return weeks.sort(function (a, b) { return dayOf(a.week) - dayOf(b.week); });
  }
  // League badges that are kept for good, from those weeks.
  function leagueIds(weeks) {
    var ids = {}, best = -1;
    weeks.forEach(function (w, i) {
      var prev = weeks[i - 1];
      ids["first-challenge"] = true;
      if (prev && dayOf(w.week) - dayOf(prev.week) > 7) ids.comeback = true;          // a week was missed in between
      if (prev && w.score > prev.score) ids.climber = true;                           // higher than the week before
      if (i > 1 && w.score > best) ids["personal-best"] = true;                       // higher than every earlier week
      if (w.score === FULL_MARKS) ids["full-marks"] = true;
      if (w.points > 0) ids["top-five"] = true;
      best = Math.max(best, w.score);
    });
    return Object.keys(ids);
  }
  // The streak badge held for a number of weeks in a row, or null for none.
  function streakId(n) {
    if (!(n >= 1)) return null;
    var reached = STREAK_STEPS.filter(function (s) { return n >= s; });
    return reached.length ? "streak-" + reached[reached.length - 1] : "streak-alive";
  }
  // Weeks in a row still needed for the next streak badge; 0 once the last one is held.
  function weeksToNextStreak(n) {
    var next = STREAK_STEPS.filter(function (s) { return s > n; })[0];
    return next ? next - n : 0;
  }
  // A streak is alive until the end of the next week the student could still hand in.
  function streakEnds(week, doneThisWeek) { return Date.parse(week + "T00:00:00Z") + (doneThisWeek ? 14 : 7) * DAY_MS; }
  function hasRun(days, length) {
    var sorted = days.slice().sort(function (a, b) { return a - b; }), run = 1;
    for (var i = 1; i < sorted.length; i++) {
      run = sorted[i] === sorted[i - 1] + 1 ? run + 1 : sorted[i] === sorted[i - 1] ? run : 1;
      if (run >= length) return true;
    }
    return length <= 1 && sorted.length > 0;
  }
  // Practice and visiting badges from what the pages already keep.
  function practiceIds(facts) {
    var ids = [], sets = facts.setsDone || {}, total = 0, whole = false, days = facts.days || [];
    Object.keys(sets).forEach(function (name) { total += sets[name]; if (sets[name] >= SETS_PER_EXERCISE) whole = true; });
    if (total >= 1) ids.push("first-set");
    if (total >= SETS_FOR_BADGE) ids.push("ten-sets");
    if (whole) ids.push("whole-exercise");
    if (days.length >= DAYS_FOR_BADGE) ids.push("five-days");
    if (hasRun(days, DAYS_IN_A_ROW)) ids.push("three-in-a-row");
    if ((facts.stepsRead || []).length >= PART_B_STEPS) ids.push("step-by-step");
    if ((facts.tips || []).length >= TIPS_FOR_BADGE) ids.push("tip-collector");
    return ids;
  }
  function addOnce(list, item) { return list.indexOf(item) < 0 ? list.concat([item]) : list; }
  function union(a, b) { return a.concat(b.filter(function (x) { return a.indexOf(x) < 0; })); }
  // Two tabs open at once: what the other tab saved is kept, never written over.
  function merge(mine, saved) {
    var streak = !saved.streak || (mine.streak && mine.streak.ends >= saved.streak.ends) ? mine.streak : saved.streak;
    return {
      earned: Object.assign({}, saved.earned, mine.earned), days: union(mine.days, saved.days), steps: union(mine.steps, saved.steps),
      final: union(mine.final, saved.final), tips: union(mine.tips, saved.tips), streak: streak || null
    };
  }

  var pure = {
    countedWeeks: countedWeeks, leagueIds: leagueIds, streakId: streakId, weeksToNextStreak: weeksToNextStreak, streakEnds: streakEnds,
    hasRun: hasRun, practiceIds: practiceIds, addOnce: addOnce, merge: merge
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = pure; return; }

  /* ---------- The badges ---------- */

  // id, name, how it is earned, stand-in backing colour, stand-in prop.
  // A badge with a drawing in images/stickers/ is listed in DRAWN; the rest show a simple stand-in fox until theirs is drawn.
  var BADGES = [
    ["streak-alive", "Flawless streak", "Do the weekly challenge every week. You hold this until you reach 5 weeks in a row.", "#e8f5ec", "flame"],
    ["streak-5", "5 weeks in a row", "Do the weekly challenge 5 weeks in a row.", "#ffe4c8", "star"],
    ["streak-10", "10 weeks in a row", "Do the weekly challenge 10 weeks in a row.", "#dce8f7", "medal"],
    ["streak-15", "15 weeks in a row", "Do the weekly challenge 15 weeks in a row.", "#6b4596", "crown"],
    ["first-challenge", "First challenge", "Hand in your first weekly challenge.", "#dcefe2", "flag"],
    ["comeback", "Comeback", "Miss a week, then come back and do the next challenge.", "#dce8f7", "sun"],
    ["personal-best", "Personal best", "Beat your own best score in the weekly challenge.", "#6b4596", "star"],
    ["climber", "Climber", "Score higher than you did the week before.", "#dce8f7", "steps"],
    ["full-marks", "Full marks", "Score 15 out of 15 in a weekly challenge.", "#ffe4c8", "tick"],
    ["top-five", "Top five", "Finish a week in the top five. It shows after the week closes.", "#1a64c4", "medal"],
    ["first-set", "First set", "Finish one practice set.", "#dcefe2", "tick"],
    ["ten-sets", "Ten sets", "Finish ten practice sets.", "#dce8f7", "book"],
    ["whole-exercise", "Whole exercise", "Finish all five sets of one exercise.", "#ffe4c8", "medal"],
    ["second-try", "Second try", "Get an answer wrong, read the hint, and fix it.", "#dce8f7", "pencil"],
    ["checklist-done", "Checklist done", "Tick every item on the weekly self-study checklist.", "#e8f5ec", "tick"],
    ["step-by-step", "Step by step", "Read all five steps of the Part B guide.", "#e8f5ec", "steps"],
    ["final-lap", "Final lap", "Read every section of the S.6 final reminders.", "#6b4596", "flag"],
    ["to-the-top", "To the top", "Climb the home-page sentence from Level 2 to Level 5**.", "#1a64c4", "flag"],
    ["tip-collector", "Tip collector", "Read ten of the fox's tips.", "#ffe4c8", "bulb"],
    ["five-days", "Five days", "Open CLY English on five different days.", "#fff1e3", "calendar"],
    ["three-in-a-row", "Three in a row", "Open CLY English three days running.", "#dce8f7", "sun"]
  ];
  var DRAWN = ["streak-alive", "streak-5", "streak-15", "first-challenge", "comeback", "personal-best", "climber", "full-marks", "first-set", "ten-sets", "whole-exercise", "second-try",
    "step-by-step", "final-lap", "to-the-top", "tip-collector", "five-days", "three-in-a-row"];
  var BY_ID = {};
  BADGES.forEach(function (b) { BY_ID[b[0]] = b; });
  function isStreak(id) { return id.indexOf("streak-") === 0; }

  var INK = "#1d2a3a", FOX = "#f2711c", GLOW = "#ffc98f", LEAF = "#1f7a45", SKY = "#1a64c4", WHITE = "#fff";
  var line = ' stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
  var bare = ' fill="none"' + line;
  // each stand-in prop is drawn in a 22px box, placed at the fox's shoulder
  var PROPS = {
    tick: '<circle cx="11" cy="11" r="9.5" fill="' + LEAF + '"' + line + '/><path d="M6 11.5l3.5 3.5L16 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    star: '<path d="M11 1.5l2.9 6.4 7 .7-5.3 4.6 1.6 6.8L11 16.4 4.8 20l1.6-6.8L1.1 8.6l7-.7z" fill="' + GLOW + '"' + line + '/>',
    medal: '<path d="M6 1h4l1 6M16 1h-4l-1 6" fill="' + SKY + '"' + line + '/><circle cx="11" cy="14" r="6.5" fill="' + GLOW + '"' + line + '/>',
    book: '<path d="M1.5 5H9q2 0 2 2 0-2 2-2h7.5v13H13q-2 0-2 2 0-2-2-2H1.5z" fill="#fff"' + line + '/><path d="M11 7v11"' + bare + '/>',
    calendar: '<rect x="2" y="4" width="18" height="16" rx="3" fill="#fff"' + line + '/><path d="M2 9h18M7 2v4M15 2v4"' + bare + '/><path d="M7 15l2.5 2.5L15 12" fill="none" stroke="' + LEAF + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    steps: '<path d="M2 20v-5h5v-5h5V5h8v15z" fill="#fff"' + line + '/>',
    flag: '<path d="M5 21V2"' + bare + '/><path d="M5 3h14l-4 5 4 5H5z" fill="' + LEAF + '"' + line + '/>',
    pencil: '<path d="M3 19l1.8-6L15.5 2.3l4.2 4.2L9 17.2z" fill="' + GLOW + '"' + line + '/><path d="M4.8 13L9 17.2"' + bare + '/>',
    sun: '<circle cx="11" cy="11" r="5" fill="' + GLOW + '"' + line + '/><path d="M11 1v3M11 18v3M1 11h3M18 11h3M4 4l2 2M16 16l2 2M18 4l-2 2M6 16l-2 2"' + bare + '/>',
    crown: '<path d="M2 18L1 6l5.5 5L11 3l4.5 8L21 6l-1 12z" fill="' + GLOW + '"' + line + '/>',
    flame: '<path d="M11 1.5q7 6 7 11.5a7 7 0 0 1-14 0q0-3 3-5.5 0 3 2 3.5 0-5 2-9.5z" fill="' + GLOW + '"' + line + '/>',
    bulb: '<path d="M11 2a6.5 6.5 0 0 1 3.5 12v2.5h-7V14A6.5 6.5 0 0 1 11 2z" fill="' + GLOW + '"' + line + '/><path d="M8 19.5h6"' + bare + '/>'
  };
  function standIn(b) {
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<circle cx="32" cy="32" r="31" fill="' + WHITE + '"/><circle cx="32" cy="32" r="27.5" fill="' + b[3] + '"/>' +
      '<path d="M13 28l4-19 13 11zM51 28L47 9 34 20z" fill="' + FOX + '"/>' +
      '<path d="M16.5 22l1.5-8 6 5zM47.5 22L46 14l-6 5z" fill="' + INK + '"/>' +
      '<path d="M11 29q21-16 42 0 0 15-21 26-21-11-21-26z" fill="' + FOX + '"/>' +
      '<path d="M11 30q11 4 21 25-20-10-21-25zM53 30q-11 4-21 25 20-10 21-25z" fill="' + WHITE + '"/>' +
      '<circle cx="24" cy="34" r="2.3" fill="' + INK + '"/><circle cx="40" cy="34" r="2.3" fill="' + INK + '"/>' +
      '<ellipse cx="32" cy="51.5" rx="2.8" ry="2.2" fill="' + INK + '"/>' +
      '<g transform="translate(40 39)">' + PROPS[b[4]] + '</g></svg>';
  }
  // The picture for a badge, as markup built only from the constants above.
  function art(b) {
    return DRAWN.indexOf(b[0]) >= 0
      ? '<span class="sticker-art drawn"><img src="images/stickers/' + b[0] + '.png" alt="" width="64" height="64" loading="lazy"></span>'
      : '<span class="sticker-art">' + standIn(b) + '</span>';
  }

  /* ---------- What this browser remembers ---------- */

  function list(v) { return Array.isArray(v) ? v : []; }
  function load() {
    var v = null;
    try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) { v = null; }
    v = v && typeof v === "object" ? v : {};
    var streak = v.streak && typeof v.streak.n === "number" && typeof v.streak.ends === "number" ? { n: v.streak.n, ends: v.streak.ends } : null;
    return { earned: v.earned && typeof v.earned === "object" ? v.earned : {}, days: list(v.days), steps: list(v.steps), final: list(v.final), tips: list(v.tips), streak: streak };
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: badges last for this visit only */ }
  }
  function setsDone() {
    var out = {}, keys = [];
    try { for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i)); } catch (e) { /* storage blocked: no sets to count */ }
    keys.forEach(function (k) {
      if (k.indexOf("cly:sets-done:") !== 0) return;
      // one unreadable entry is skipped, and the rest still count
      try { var done = JSON.parse(localStorage.getItem(k)); if (Array.isArray(done)) out[k] = done.length; } catch (e) { /* skipped */ }
    });
    return out;
  }

  var state = load();
  var today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY_MS);
  var fresh = [];   // earned or newly held on this page, waiting to be announced

  function held() { return state.streak && Date.now() < state.streak.ends ? streakId(state.streak.n) : null; }

  function give(ids) {
    var added = ids.filter(function (id) { return BY_ID[id] && !isStreak(id) && !state.earned[id]; });
    if (!added.length) return;
    var earned = Object.assign({}, state.earned);
    added.forEach(function (id) { earned[id] = today; });
    state = merge(Object.assign({}, state, { earned: earned }), load());
    fresh = fresh.concat(added);
    save(state);
    announce();
    draw();
  }
  function update(change) {
    state = merge(Object.assign({}, state, change), load());
    save(state);
    give(practiceIds({ setsDone: setsDone(), days: state.days, stepsRead: state.steps, tips: state.tips }));
    draw();
  }
  function isPage(name) { return new RegExp("(^|/)" + name + "(\\.html)?$").test(location.pathname); }
  // The steps of a long guide are the groups in its contents; only Part B has the five to read.
  function stepOf(sectionId) {
    var link = document.querySelector(".index a[href='#" + (window.CSS && CSS.escape ? CSS.escape(sectionId) : sectionId) + "']");
    var li = link && link.closest("li");
    while (li && !li.classList.contains("index-group")) li = li.previousElementSibling;
    return li ? li.textContent.trim() : null;
  }

  /* ---------- Announcing: a small badge in the corner, never while the league clock runs ---------- */

  // The live region is on the page from the start, so screen readers hear what is put in it.
  var toast = document.createElement("div"), hideTimer = null;
  toast.className = "sticker-toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  function hideToast() {
    toast.classList.remove("show");
    // emptied once it has faded, so its link can't be reached while it is out of sight
    hideTimer = setTimeout(function () { toast.textContent = ""; }, TOAST_FADE_MS);
  }
  function hideSoon() { clearTimeout(hideTimer); hideTimer = setTimeout(hideToast, TOAST_MS); }
  // it stays for as long as a mouse or the keyboard is on it
  ["mouseenter", "focusin"].forEach(function (type) { toast.addEventListener(type, function () { clearTimeout(hideTimer); }); });
  ["mouseleave", "focusout"].forEach(function (type) { toast.addEventListener(type, function () { if (toast.classList.contains("show")) hideSoon(); }); });
  function announce() {
    if (!fresh.length || document.body.classList.contains("playing")) return;
    var ids = fresh, b = BY_ID[ids[ids.length - 1]];
    fresh = [];
    if (!b) return;
    toast.innerHTML = art(b) + "<p><strong></strong><span></span></p>";
    toast.querySelector("strong").textContent = ids.length > 1 ? ids.length + " new badges" : "New badge";
    toast.querySelector("p span").textContent = b[1];
    if (!sheet) {
      var a = document.createElement("a");
      a.href = "index.html#stickers";
      a.textContent = "See your badges";
      toast.querySelector("p").appendChild(a);
    }
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
    hideSoon();
  }
  // a badge earned as the clock stops is announced once the paper is out of the way
  if (window.MutationObserver) new MutationObserver(announce).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* ---------- The sheet on the home page ---------- */

  var sheet = document.querySelector("[data-stickers]");
  function draw() {
    if (!sheet) return;
    var grid = sheet.querySelector(".sticker-grid"), caption = sheet.querySelector(".sticker-caption"), count = sheet.querySelector("[data-sticker-count]");
    var have = 0, holding = held();
    grid.textContent = "";
    BADGES.forEach(function (b) {
      var streak = isStreak(b[0]), earned = streak ? holding === b[0] : !!state.earned[b[0]];
      if (earned) have += 1;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sticker" + (earned ? " earned" : "");
      btn.setAttribute("aria-label", b[1] + (earned ? (streak ? ", held now" : ", earned") : ", not earned yet"));
      btn.innerHTML = earned ? art(b) : '<span class="sticker-art"></span>';
      btn.addEventListener("click", function () {
        grid.querySelectorAll("[aria-pressed]").forEach(function (x) { x.removeAttribute("aria-pressed"); });
        btn.setAttribute("aria-pressed", "true");
        caption.textContent = "";
        var name = document.createElement("strong");
        name.textContent = b[1] + ": ";
        caption.appendChild(name);
        caption.appendChild(document.createTextNode(b[2] + (earned ? (streak ? " You hold it now: miss a week and it goes." : " Earned!") : "")));
      });
      var li = document.createElement("li");
      li.appendChild(btn);
      grid.appendChild(li);
    });
    count.textContent = have + " of " + BADGES.length;
    sheet.hidden = false;
  }

  /* ---------- Listening to the pages ---------- */

  document.addEventListener("cly:set-done", function () { update({}); });
  document.addEventListener("cly:second-try", function () { give(["second-try"]); });
  document.addEventListener("cly:top", function () { give(["to-the-top"]); });
  document.addEventListener("cly:checklist", function (e) { if (e.detail === "week") give(["checklist-done"]); });
  document.addEventListener("cly:tip", function (e) {
    if (typeof e.detail === "number" && state.tips.length < TIPS_FOR_BADGE) update({ tips: addOnce(state.tips, e.detail) });
  });
  document.addEventListener("cly:read", function (e) {
    if (!e.detail) return;
    if (isPage("part-b")) {
      var step = stepOf(e.detail.id);
      if (step) update({ steps: addOnce(state.steps, step) });
    } else if (isPage("final")) {
      update({ final: addOnce(state.final, e.detail.id) });
      var sections = document.querySelectorAll("[data-tabs] .column > section[id]");
      var read = Array.prototype.filter.call(sections, function (s) { return state.final.indexOf(s.id) >= 0; }).length;
      if (sections.length && read >= sections.length) give(["final-lap"]);
    }
  });

  window.CLY_STICKERS = {
    // Called by the weekly challenge page with what the league knows: the student's past weeks, this week's id,
    // this week's result once it counts ({ score }, or null), and how many weeks in a row they have done.
    league: function (o) {
      var before = held(), n = Number(o.streak) || 0;
      update({ streak: { n: n, ends: streakEnds(o.week, !!o.done) } });
      give(leagueIds(countedWeeks(o.history, o.week, o.done)));
      var now = held();
      if (now && now !== before) { fresh = fresh.concat([now]); announce(); }
    },
    countedWeeks: countedWeeks,
    weeksToNextStreak: weeksToNextStreak,
    // the streak badge held for n weeks in a row, as markup for the stamp card, or "" for none
    streakArt: function (n) { var id = streakId(n); return id ? art(BY_ID[id]) : ""; },
    streakName: function (n) { var id = streakId(n); return id ? BY_ID[id][1] : ""; }
  };

  draw();
  update({ days: addOnce(state.days, today) });
})();
