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
  var TIPS_FOR_BADGE = 10;
  var FULL_MARKS = 15;
  var SETS_FOR_POTATO = 25;
  var PAGES_FOR_SNIFFER = 8;
  var FIXES_FOR_THINKING = 5;
  var VISITS_FOR_SIX_SEVEN = 67;
  var BADGES_FOR_CALL_ME = 10;
  var TAPS_FOR_SHH = 15;             // tips asked for in one visit to the home page
  var EARLY_MS = 2 * DAY_MS;         // handed in within this long of the week starting is early
  var STREAK_STEPS = [5, 10, 15];   // weeks in a row that change the streak badge
  var TOAST_MS = 5000;
  var TOAST_FADE_MS = 400;
  var KEY = "cly:stickers";
  var NEW_FOR_DAYS = 5;              // the home page's line about badges shows on a student's first four days
  var HINT_KEY = "cly:badges-hint";  // set once the student has followed that line
  var VISIT_KEY = "cly:visit-counted"; // per browser session: one open of the site counts once, however many pages it has

  // Secret badges show a dashed outline and no name until they are earned. A streak step can be secret too.
  var SECRET = ["streak-10", "shh"];
  // A badge that is not a circle is drawn in the shape of its picture: its width and height in pixels, as the file is.
  var SHAPES = {
    "full-marks": [512, 300], "streak-10": [512, 512], comeback: [512, 354], "second-try": [512, 512], "top-five": [414, 512],
    "to-the-top": [299, 512], "tip-collector": [299, 512], "final-lap": [512, 300], "whole-exercise": [391, 512], "low-cortisol": [512, 300]
  };

  /* ---------- What earns what: plain functions, tested in tests/stickers.test.js ---------- */

  // A score or a point total as a number: the league sends numbers, but a figure that arrives as text ("15") is the same figure.
  function figure(v) { return typeof v === "string" && v.trim() !== "" && isFinite(Number(v)) ? Number(v) : v; }

  function dayOf(week) { return Math.round(Date.parse(week + "T00:00:00Z") / DAY_MS); }

  // The weeks that counted, oldest first: every closed week that wasn't disqualified, plus this week once it is
  // handed in and counts (done: { score }). Each is { week, score, points }.
  function countedWeeks(history, thisWeek, done) {
    var weeks = (history || []).filter(function (r) { return !r.disqualified; })
      .map(function (r) { return { week: r.week, score: figure(r.score), points: Number(r.points) || 0 }; });
    if (done && !weeks.some(function (w) { return w.week === thisWeek; })) weeks = weeks.concat([{ week: thisWeek, score: figure(done.score), points: 0 }]);
    return weeks.sort(function (a, b) { return dayOf(a.week) - dayOf(b.week); });
  }
  // League badges that are kept for good, from those weeks.
  function leagueIds(weeks) {
    var ids = {}, best = -1;
    weeks.forEach(function (w, i) {
      var prev = weeks[i - 1];
      ids["first-challenge"] = true;
      var next = weeks[i + 1];
      if (prev && dayOf(w.week) - dayOf(prev.week) > 7) ids.comeback = true;          // a week was missed in between
      if (prev && dayOf(w.week) - dayOf(prev.week) === 7) ids["hehe-again"] = true;   // two weeks running
      // a lower score than the week before, then the very next week handed in too
      if (prev && next && w.score < prev.score && dayOf(next.week) - dayOf(w.week) === 7) ids["shake-it-off"] = true;
      if (prev && w.score > prev.score) ids.climber = true;                           // higher than the week before
      // higher than every earlier week, or full marks again, since 15 out of 15 can't be beaten
      if (i > 1 && (w.score > best || w.score === FULL_MARKS)) ids["personal-best"] = true;
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
  // A guide is read once every one of its rows has been opened. Only the rows it has now count, so ids saved by an
  // older layout of the page never make up the number.
  function allRead(read, rows) {
    return rows.length > 0 && rows.every(function (id) { return read.indexOf(id) >= 0; });
  }
  // A new student: fewer than NEW_FOR_DAYS days on the site, and hasn't yet followed the line about badges.
  function isNewStudent(days, tapped) { return !tapped && days.length < NEW_FOR_DAYS; }
  // Handed in within the first 48 hours of the week, which starts seven days before it closes.
  function earlyHandIn(closesAt, now) {
    if (typeof closesAt !== "number") return false;
    var elapsed = now - (closesAt - 7 * DAY_MS);
    return elapsed >= 0 && elapsed <= EARLY_MS;
  }
  // The self-study checklist badge became low-cortisol. A student who had it keeps one, and it counts once.
  function legacyEarned(earned) {
    var out = Object.assign({}, earned);
    if (!("checklist-done" in out)) return out;
    var day = out["checklist-done"];
    delete out["checklist-done"];
    if (!out["low-cortisol"]) out["low-cortisol"] = day;
    return out;
  }
  // The line about the next streak badge. A secret step is not named, so the note never gives it away.
  function nextStreakText(n) {
    var next = STREAK_STEPS.filter(function (s) { return s > n; })[0];
    if (!next) return "That is the top streak badge.";
    if (SECRET.indexOf("streak-" + next) >= 0) return "Keep it going. A secret badge is waiting further on.";
    var left = next - n;
    return left + (left === 1 ? " more week" : " more weeks") + " in a row for the " + next + "-week badge.";
  }
  // The words that go with a badge, on the line under the sheet and in the zoomed card: its name and how it is earned.
  // A secret badge not yet earned has no name and only its hint; a held streak badge says it goes if a week is missed.
  function describe(b, earned) {
    var hidden = SECRET.indexOf(b[0]) >= 0 && !earned, streak = b[0].indexOf("streak-") === 0;
    if (hidden) return { name: "Secret", text: b[5], hidden: true };
    return { name: b[1], text: b[2] + (earned ? (streak ? " You hold it now: miss a week and it goes." : " Earned!") : ""), hidden: false };
  }
  // Handed in with 24 hours or less left before the week closes.
  function lastMinute(closesAt, now) { return typeof closesAt === "number" && now <= closesAt && closesAt - now <= DAY_MS; }
  // Ten other badges earned. The badge for it is not one of the ten.
  function collectorIds(earned) {
    var others = Object.keys(earned || {}).filter(function (id) { return id !== "call-me"; });
    return others.length >= BADGES_FOR_CALL_ME ? ["call-me"] : [];
  }
  // "grammar" for /site/grammar.html, /site/grammar or /grammar.html; "index" for the home page however it was opened.
  function pageName(pathname) {
    var path = String(pathname || "");
    if (path.slice(-1) === "/") return "index";   // a folder is its home page
    return (path.split("/").pop() || "").replace(/.html$/, "") || "index";
  }
  // Practice and visiting badges from what the pages already keep.
  function practiceIds(facts) {
    var ids = [], sets = facts.setsDone || {}, total = 0, whole = false, days = facts.days || [];
    Object.keys(sets).forEach(function (name) { total += sets[name]; if (sets[name] >= SETS_PER_EXERCISE) whole = true; });
    if (total >= 1) ids.push("first-set");
    if (total >= SETS_FOR_BADGE) ids.push("ten-sets");
    if (whole) ids.push("whole-exercise");
    if (total >= SETS_FOR_POTATO) ids.push("potato");
    if (days.length >= DAYS_FOR_BADGE) ids.push("five-days");
    if (hasRun(days, DAYS_IN_A_ROW)) ids.push("three-in-a-row");
    if ((facts.tips || []).length >= TIPS_FOR_BADGE) ids.push("tip-collector");
    if ((facts.pages || []).length >= PAGES_FOR_SNIFFER) ids.push("sniffer");
    if (facts.fixes >= FIXES_FOR_THINKING) ids.push("thinking");
    if (facts.visits >= VISITS_FOR_SIX_SEVEN) ids.push("six-seven");
    return ids;
  }
  function addOnce(list, item) { return list.indexOf(item) < 0 ? list.concat([item]) : list; }
  function union(a, b) { return a.concat(b.filter(function (x) { return a.indexOf(x) < 0; })); }
  // Two tabs open at once: what the other tab saved is kept, never written over.
  function merge(mine, saved) {
    var streak = !saved.streak || (mine.streak && mine.streak.ends >= saved.streak.ends) ? mine.streak : saved.streak;
    return {
      earned: Object.assign({}, saved.earned, mine.earned), days: union(mine.days, saved.days), steps: union(mine.steps, saved.steps),
      final: union(mine.final, saved.final), tips: union(mine.tips, saved.tips), streak: streak || null,
      pages: union(mine.pages || [], saved.pages || []), visits: Math.max(mine.visits || 0, saved.visits || 0), fixes: Math.max(mine.fixes || 0, saved.fixes || 0)
    };
  }

  var pure = {
    countedWeeks: countedWeeks, leagueIds: leagueIds, streakId: streakId, weeksToNextStreak: weeksToNextStreak, streakEnds: streakEnds,
    hasRun: hasRun, allRead: allRead, isNewStudent: isNewStudent, practiceIds: practiceIds, addOnce: addOnce, merge: merge,
    lastMinute: lastMinute, collectorIds: collectorIds, pageName: pageName,
    earlyHandIn: earlyHandIn, legacyEarned: legacyEarned, nextStreakText: nextStreakText, describe: describe, secret: SECRET, shapes: SHAPES
  };
  if (typeof module !== "undefined" && module.exports) { module.exports = pure; return; }

  /* ---------- The badges ---------- */

  // id, name, how it is earned, stand-in backing colour, stand-in prop.
  // A badge with a drawing in images/stickers/ is listed in DRAWN; the rest show a simple stand-in fox until theirs is drawn.
  var BADGES = [
    ["streak-alive", "Flawless streak", "Do the weekly challenge every week. You hold this until you reach 5 weeks in a row.", "#e8f5ec", "flame"],
    ["streak-5", "5 weeks in a row", "Do the weekly challenge 5 weeks in a row.", "#ffe4c8", "star"],
    ["streak-10", "Tung Tung", "Do the weekly challenge 10 weeks in a row. A sentry never misses a night.", "#dce8f7", "medal", "A secret. Keep your streak going and see who is on guard."],
    ["streak-15", "15 weeks in a row", "Do the weekly challenge 15 weeks in a row.", "#6b4596", "crown"],
    ["first-challenge", "First challenge", "Hand in your first weekly challenge.", "#dcefe2", "flag"],
    ["comeback", "Son", "Miss a week, then come back and do the next challenge. He is disappointed, but he is glad you are back.", "#dce8f7", "sun"],
    ["personal-best", "Personal best", "Beat your own best score in the weekly challenge, or get 15 out of 15 again. Counts from your third week.", "#6b4596", "star"],
    ["climber", "Climber", "Score higher than you did the week before.", "#dce8f7", "steps"],
    ["full-marks", "An IQ too high?", "Score 15 out of 15 in a weekly challenge.", "#ffe4c8", "tick"],
    ["top-five", "Gyat", "Finish a week in the top five. It shows after the week closes.", "#1a64c4", "medal"],
    ["first-set", "First set", "Finish one practice set.", "#dcefe2", "tick"],
    ["ten-sets", "Ten sets", "Finish ten practice sets.", "#dce8f7", "book"],
    ["whole-exercise", "Dum", "Finish all five sets of one exercise.", "#ffe4c8", "medal"],
    ["second-try", "Sad second try", "Get an answer wrong, read the hint, and fix it.", "#dce8f7", "pencil"],
    ["low-cortisol", "Low cortisol", "Hand in the weekly challenge in the first 48 hours of the week, with all the time in the world.", "#e8f5ec", "tick"],
    ["step-by-step", "Step by step", "Read all five steps of the Part B guide.", "#e8f5ec", "steps"],
    ["final-lap", "I guess, bro", "Read every section of the S.6 final reminders.", "#6b4596", "flag"],
    ["to-the-top", "Oh god", "Climb the home-page sentence from Level 2 to Level 5**.", "#1a64c4", "flag"],
    ["tip-collector", "Thinker", "Read ten of the fox's tips.", "#ffe4c8", "bulb"],
    ["five-days", "Five days", "Open CLY English on five different days.", "#fff1e3", "calendar"],
    ["three-in-a-row", "Three in a row", "Open CLY English three days running.", "#dce8f7", "sun"],
    ["hehe-again", "Hehe, again", "Do the weekly challenge two weeks in a row.", "#ffd9cf", "star"],
    ["shake-it-off", "Shake it off", "Score lower than the week before, then do the very next challenge anyway.", "#cfd8e6", "sun"],
    ["last-minute", "Last-minute prayer", "Hand in the weekly challenge in the last 24 hours before it closes.", "#e6cfdc", "flag"],
    ["saved-it", "Saved it", "Fix three wrong answers in one go: press Check and watch them all turn right.", "#c8e4fa", "tick"],
    ["potato", "Potato", "Finish 25 practice sets.", "#c8e4fa", "book"],
    ["call-me", "Call me", "Earn 10 other badges.", "#ffb9a6", "star"],
    ["thinking", "Thinking it through", "Get an answer wrong, read the hint and fix it, 5 times.", "#d2e3bf", "pencil"],
    ["sniffer", "Sniffer", "Open 8 different pages of CLY English.", "#d4eec3", "book"],
    ["six-seven", "Six seven", "Open CLY English 67 times. A visit counts once however many pages you open.", "#c9dcff", "calendar"],
    ["shh", "Shh", "You kept asking the fox for another tip. Shh, that was the secret.", "#e6cfdc", "bulb", "A secret. Keep exploring, and see what the fox does."]
  ];
  var DRAWN = ["streak-alive", "streak-5", "streak-10", "streak-15", "first-challenge", "comeback", "personal-best", "climber", "full-marks", "top-five", "first-set", "ten-sets", "whole-exercise", "second-try", "low-cortisol",
    "step-by-step", "final-lap", "to-the-top", "tip-collector", "five-days", "three-in-a-row",
    "hehe-again", "shake-it-off", "last-minute", "saved-it", "potato", "call-me", "thinking", "sniffer", "six-seven", "shh"];
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
  // The width over the height of a shaped sticker, to three places, for the stylesheet.
  function ratio(shape) { return Math.round(shape[0] / shape[1] * 1000) / 1000; }
  // The picture for a badge, as markup built only from the constants above.
  function art(b) {
    var shape = SHAPES[b[0]];
    if (DRAWN.indexOf(b[0]) < 0) return '<span class="sticker-art">' + standIn(b) + '</span>';
    var size = shape || [64, 64];
    return '<span class="sticker-art drawn' + (shape ? ' shaped" style="--ar:' + ratio(shape) : '') + '"><img src="images/stickers/' + b[0] +
      '.png" alt="" width="' + size[0] + '" height="' + size[1] + '" loading="lazy"></span>';
  }
  // An empty outline for a badge not earned yet: the same shape as its picture.
  function blank(b) {
    var shape = SHAPES[b[0]];
    return '<span class="sticker-art' + (shape ? ' shaped" style="--ar:' + ratio(shape) + '"' : '"') + '></span>';
  }

  /* ---------- What this browser remembers ---------- */

  function list(v) { return Array.isArray(v) ? v : []; }
  function count(v) { return Number(v) > 0 ? Math.floor(Number(v)) : 0; }
  function load() {
    var v = null;
    try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) { v = null; }
    v = v && typeof v === "object" ? v : {};
    var streak = v.streak && typeof v.streak.n === "number" && typeof v.streak.ends === "number" ? { n: v.streak.n, ends: v.streak.ends } : null;
    return { earned: v.earned && typeof v.earned === "object" ? legacyEarned(v.earned) : {}, days: list(v.days), steps: list(v.steps), final: list(v.final), tips: list(v.tips), streak: streak,
      pages: list(v.pages), visits: count(v.visits), fixes: count(v.fixes) };
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
    // the badge for ten others comes with the one that makes ten
    collectorIds(earned).forEach(function (id) { if (!earned[id]) { earned[id] = today; added.push(id); } });
    state = merge(Object.assign({}, state, { earned: earned }), load());
    fresh = fresh.concat(added);
    save(state);
    announce();
    draw();
  }
  function update(change) {
    state = merge(Object.assign({}, state, change), load());
    save(state);
    give(practiceIds({ setsDone: setsDone(), days: state.days, tips: state.tips, pages: state.pages, visits: state.visits, fixes: state.fixes }));
    draw();
  }
  function isPage(name) { return new RegExp("(^|/)" + name + "(\\.html)?$").test(location.pathname); }
  // the rows of the guide on this page, which a student opens one at a time
  // the five Part B steps, each its own page (part-b-choose.html and so on); the hub links to them in this order
  var PART_B_STEPS = ["choose", "method", "crei", "language", "check"];
  function rowIds() {
    return Array.prototype.map.call(document.querySelectorAll("main details.row[id]"), function (row) { return row.id; });
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
      var hidden = SECRET.indexOf(b[0]) >= 0 && !earned;   // a secret badge keeps its name until it is earned
      if (earned) have += 1;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sticker" + (earned ? " earned" : "") + (SHAPES[b[0]] ? " shaped" : "");
      btn.setAttribute("aria-label", (hidden ? "Secret badge" : b[1]) + (earned ? (streak ? ", held now" : ", earned") : ", not earned yet"));
      btn.innerHTML = earned ? art(b) : blank(b);
      btn.addEventListener("click", function () {
        grid.querySelectorAll("[aria-pressed]").forEach(function (x) { x.removeAttribute("aria-pressed"); });
        btn.setAttribute("aria-pressed", "true");
        var said = describe(b, earned);
        caption.textContent = "";
        var name = document.createElement("strong");
        name.textContent = said.name + ": ";
        caption.appendChild(name);
        caption.appendChild(document.createTextNode(said.text));
        openZoom(b, earned);
      });
      var li = document.createElement("li");
      li.appendChild(btn);
      grid.appendChild(li);
    });
    count.textContent = have + " of " + BADGES.length;
    sheet.hidden = false;
  }

  /* ---------- Zooming in: a badge and its words, large, in a card over the page ---------- */

  // A browser without <dialog> keeps the line under the sheet, which has the same words.
  var zoom = null;
  function buildZoom() {
    if (typeof HTMLDialogElement === "undefined" || !document.createElement("dialog").showModal) return null;
    var dialog = document.createElement("dialog"), card = document.createElement("div"), close = document.createElement("button");
    var art = document.createElement("div"), name = document.createElement("h3"), text = document.createElement("p");
    dialog.className = "sticker-zoom";
    dialog.setAttribute("aria-labelledby", "sticker-zoom-name");
    card.className = "sticker-zoom-card";
    close.type = "button";
    close.className = "sticker-zoom-close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    art.className = "sticker-zoom-art";
    art.setAttribute("aria-hidden", "true");   // the picture says nothing the name and words do not
    name.id = "sticker-zoom-name";
    card.appendChild(close); card.appendChild(art); card.appendChild(name); card.appendChild(text);
    dialog.appendChild(card);
    document.body.appendChild(dialog);
    close.addEventListener("click", function () { dialog.close(); });
    // a tap on the dimmed page outside the card closes it too; Escape closes it as for any dialog
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    return { dialog: dialog, art: art, name: name, text: text };
  }
  function openZoom(b, earned) {
    zoom = zoom || buildZoom();
    if (!zoom) return;
    var said = describe(b, earned);
    zoom.art.innerHTML = earned ? art(b) : blank(b);
    zoom.art.classList.toggle("empty", !earned);
    zoom.name.textContent = said.name;
    zoom.text.textContent = said.text;
    if (!zoom.dialog.open) zoom.dialog.showModal();
  }

  /* ---------- Listening to the pages ---------- */

  document.addEventListener("cly:set-done", function () { update({}); });
  document.addEventListener("cly:second-try", function () {
    update({ fixes: state.fixes + 1 });
    give(["second-try"]);
  });
  // three wrong answers turned right by one press of Check (practice-core.js)
  document.addEventListener("cly:fixed-many", function () { give(["saved-it"]); });
  document.addEventListener("cly:top", function () { give(["to-the-top"]); });
  var taps = 0;   // tips asked for since this page opened; the secret badge is for the student who keeps going
  document.addEventListener("cly:tip", function () { taps += 1; if (taps >= TAPS_FOR_SHH) give(["shh"]); });
  document.addEventListener("cly:tip", function (e) {
    if (typeof e.detail === "number" && state.tips.length < TIPS_FOR_BADGE) update({ tips: addOnce(state.tips, e.detail) });
  });
  document.addEventListener("cly:read", function (e) {
    if (!e.detail) return;
    // Part B is five steps, each its own page, and the final reminders a short list of rows: each badge is every
    // step or row opened at least once
    if (PART_B_STEPS.indexOf(e.detail.id) >= 0 && /(^|\/)part-b(-[a-z]+)?(\.html)?$/.test(location.pathname)) {
      update({ steps: addOnce(state.steps, e.detail.id) });
      if (allRead(state.steps, PART_B_STEPS)) give(["step-by-step"]);
      return;
    }
    var rows = rowIds();
    if (rows.indexOf(e.detail.id) < 0) return;
    if (isPage("final")) {
      update({ final: addOnce(state.final, e.detail.id) });
      if (allRead(state.final, rows)) give(["final-lap"]);
    }
  });

  window.CLY_STICKERS = {
    // Called by the weekly challenge page with what the league knows: the student's past weeks, this week's id,
    // this week's result once it counts ({ score }, or null), and how many weeks in a row they have done.
    league: function (o) {
      var before = held(), n = Number(o.streak) || 0;
      update({ streak: { n: n, ends: streakEnds(o.week, !!o.done) } });
      give(leagueIds(countedWeeks(o.history, o.week, o.done)));
      if (o.fresh && lastMinute(o.closesAt, Date.now())) give(["last-minute"]);
      if (o.fresh && earlyHandIn(o.closesAt, Date.now())) give(["low-cortisol"]);
      var now = held();
      if (now && now !== before) { fresh = fresh.concat([now]); announce(); }
    },
    countedWeeks: countedWeeks,
    weeksToNextStreak: weeksToNextStreak,
    nextStreakText: nextStreakText,
    // the streak badge held for n weeks in a row, as markup for the stamp card, or "" for none
    streakArt: function (n) { var id = streakId(n); return id ? art(BY_ID[id]) : ""; },
    streakName: function (n) { var id = streakId(n); return id ? BY_ID[id][1] : ""; }
  };

  draw();
  // One open of the site counts once, not once per page: a browser session is the unit. If the browser won't say
  // whether this session has been counted, it isn't, so a student can't run up the number by reloading.
  var counted = true;
  try { counted = sessionStorage.getItem(VISIT_KEY) === "1"; sessionStorage.setItem(VISIT_KEY, "1"); } catch (e) { counted = true; }
  update({ days: addOnce(state.days, today), pages: addOnce(state.pages, pageName(location.pathname)), visits: state.visits + (counted ? 0 : 1) });

  /* ---------- The home page's line about badges, for new students only ---------- */

  var hint = document.querySelector("[data-badges-new]");
  if (hint) {
    var tapped = false;
    try { tapped = localStorage.getItem(HINT_KEY) === "1"; } catch (e) { /* storage blocked: shown by days alone */ }
    hint.hidden = !isNewStudent(state.days, tapped);
    hint.addEventListener("click", function () {
      try { localStorage.setItem(HINT_KEY, "1"); } catch (e) { /* storage blocked: it shows again next visit */ }
    });
  }
})();
