/* CLY English — fox stickers. Earned by showing up and finishing things, kept in this browser only.
   The sheet lives on the home page ([data-stickers]); every other page only awards and announces.
   League stickers are worked out from the league's own history, so they come back after a change of phone. */
(function () {
  "use strict";

  var SERIES_LENGTH = 12;      // "the fox's school year": one league sticker for every second counted week
  var WEEKS_PER_STICKER = 2;
  var DAYS_FOR_STICKER = 5;
  var SETS_FOR_STICKER = 10;
  var SETS_PER_EXERCISE = 5;
  var PART_B_STEPS = 5;
  var TOAST_MS = 5000;
  var TOAST_FADE_MS = 400;
  var KEY = "cly:stickers";

  /* ---------- What earns what: plain functions, tested in tests/stickers.test.js ---------- */

  // Counted weeks: every closed week that wasn't disqualified, plus this week once it is handed in and counts.
  function countStamps(history, thisWeek, doneAndCounted) {
    var weeks = (history || []).filter(function (r) { return !r.disqualified; }).map(function (r) { return r.week; });
    if (doneAndCounted && weeks.indexOf(thisWeek) < 0) weeks = weeks.concat([thisWeek]);
    return weeks.length;
  }
  // The league stickers a number of stamps is worth: the first-entry sticker, then one per two stamps.
  function leagueIds(stamps) {
    var ids = stamps >= 1 ? ["league-first"] : [];
    var series = Math.floor(stamps / WEEKS_PER_STICKER);
    for (var k = 1; k <= series; k++) ids.push("year-" + ((k - 1) % SERIES_LENGTH + 1) + (k > SERIES_LENGTH ? "-gold" : ""));
    return ids;
  }
  // Weeks until the next sticker: the very first counted week brings the first-challenge sticker.
  function stampsToNext(stamps) { return stamps < 1 ? 1 : WEEKS_PER_STICKER - (stamps % WEEKS_PER_STICKER); }
  // Does the nth stamp bring a sticker? The first one does, then every second one.
  function bringsSticker(n) { return n === 1 || (n > 0 && n % WEEKS_PER_STICKER === 0); }
  function union(a, b) { return a.concat(b.filter(function (x) { return a.indexOf(x) < 0; })); }
  // Two tabs open at once: what the other tab saved is kept, never written over.
  function merge(mine, saved) {
    return { earned: Object.assign({}, saved.earned, mine.earned), days: union(mine.days, saved.days), steps: union(mine.steps, saved.steps), vocab: mine.vocab || saved.vocab };
  }
  // Practice stickers from what the pages already keep: finished sets per exercise, days visited, steps read.
  function practiceIds(facts) {
    var ids = [], sets = facts.setsDone || {}, total = 0, whole = false;
    Object.keys(sets).forEach(function (name) { total += sets[name]; if (sets[name] >= SETS_PER_EXERCISE) whole = true; });
    if (total >= 1) ids.push("first-set");
    if (total >= SETS_FOR_STICKER) ids.push("ten-sets");
    if (whole) ids.push("whole-exercise");
    if (facts.vocabDone) ids.push("vocab");
    if ((facts.days || []).length >= DAYS_FOR_STICKER) ids.push("five-days");
    if ((facts.stepsRead || []).length >= PART_B_STEPS) ids.push("part-b-steps");
    return ids;
  }
  function addDay(days, day) { return days.indexOf(day) < 0 ? days.concat([day]) : days; }

  var pure = { countStamps: countStamps, leagueIds: leagueIds, stampsToNext: stampsToNext, bringsSticker: bringsSticker, merge: merge, practiceIds: practiceIds, addDay: addDay, SERIES_LENGTH: SERIES_LENGTH };
  if (typeof module !== "undefined" && module.exports) { module.exports = pure; return; }

  /* ---------- The sticker sheet: one fox, a prop and a colour each ---------- */

  var INK = "#1d2a3a", FOX = "#f2711c", GLOW = "#ffc98f", LEAF = "#1f7a45", SKY = "#1a64c4", WHITE = "#fff", GOLD = "#e0a92e";
  var line = ' stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
  var bare = ' fill="none"' + line;
  // each prop is drawn in a 22px box, placed at the fox's shoulder
  var PROPS = {
    tick: '<circle cx="11" cy="11" r="9.5" fill="' + LEAF + '"' + line + '/><path d="M6 11.5l3.5 3.5L16 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    star: '<path d="M11 1.5l2.9 6.4 7 .7-5.3 4.6 1.6 6.8L11 16.4 4.8 20l1.6-6.8L1.1 8.6l7-.7z" fill="' + GLOW + '"' + line + '/>',
    medal: '<path d="M6 1h4l1 6M16 1h-4l-1 6" fill="' + SKY + '"' + line + '/><circle cx="11" cy="14" r="6.5" fill="' + GLOW + '"' + line + '/>',
    book: '<path d="M1.5 5H9q2 0 2 2 0-2 2-2h7.5v13H13q-2 0-2 2 0-2-2-2H1.5z" fill="#fff"' + line + '/><path d="M11 7v11"' + bare + '/>',
    calendar: '<rect x="2" y="4" width="18" height="16" rx="3" fill="#fff"' + line + '/><path d="M2 9h18M7 2v4M15 2v4"' + bare + '/><path d="M7 15l2.5 2.5L15 12" fill="none" stroke="' + LEAF + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    steps: '<path d="M2 20v-5h5v-5h5V5h8v15z" fill="#fff"' + line + '/>',
    flag: '<path d="M5 21V2"' + bare + '/><path d="M5 3h14l-4 5 4 5H5z" fill="' + LEAF + '"' + line + '/>',
    pencil: '<path d="M3 19l1.8-6L15.5 2.3l4.2 4.2L9 17.2z" fill="' + GLOW + '"' + line + '/><path d="M4.8 13L9 17.2"' + bare + '/>',
    zzz: '<path d="M3 4h8l-8 8h8M13 12h6l-6 7h6" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    riceball: '<path d="M11 2.5Q13.5 2.5 20 16q1.5 4-3 4H5q-4.5 0-3-4Q8.5 2.5 11 2.5z" fill="#fff"' + line + '/><rect x="7" y="13" width="8" height="7" rx="1" fill="' + INK + '"/>',
    umbrella: '<path d="M1.5 12a9.5 9.5 0 0 1 19 0z" fill="' + SKY + '"' + line + '/><path d="M11 12v6.5q0 2.5 2.5 2.5"' + bare + '/>',
    leaf: '<path d="M3 19C3 8 10 3 20 3c0 10-6 17-17 16z" fill="' + LEAF + '"' + line + '/><path d="M3 19L13 9" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    kite: '<path d="M12 1.5l7 8-7 9-7-9z" fill="' + GLOW + '"' + line + '/><path d="M12 18.5q-3 1 0 3"' + bare + '/>',
    snow: '<path d="M11 2v18M3.2 6.5l15.6 9M18.8 6.5l-15.6 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
    lantern: '<rect x="8" y="1.5" width="6" height="3" rx="1" fill="#fff"/><ellipse cx="11" cy="12" rx="8" ry="7.5" fill="' + FOX + '"' + line + '/><path d="M11 4.5v15M7 6q-2 6 0 12M15 6q2 6 0 12"' + bare + '/>',
    cup: '<path d="M3 8h13v6a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" fill="#fff"' + line + '/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M7 2q-1.5 2 0 4M11.5 2q-1.5 2 0 4"' + bare + '/>',
    note: '<path d="M8 17V4l11-2v13"' + bare + '/><ellipse cx="5.5" cy="17" rx="3.5" ry="2.8" fill="' + INK + '"/><ellipse cx="16.5" cy="15" rx="3.5" ry="2.8" fill="' + INK + '"/>',
    sun: '<circle cx="11" cy="11" r="5" fill="' + GLOW + '"' + line + '/><path d="M11 1v3M11 18v3M1 11h3M18 11h3M4 4l2 2M16 16l2 2M18 4l-2 2M6 16l-2 2"' + bare + '/>',
    crown: '<path d="M2 18L1 6l5.5 5L11 3l4.5 8L21 6l-1 12z" fill="' + GLOW + '"' + line + '/>'
  };

  // id, name, how it is earned, backing colour, prop, sleepy eyes
  var PRACTICE = [
    ["first-set", "First set", "Finish one practice set.", "#dcefe2", "tick"],
    ["ten-sets", "Ten sets", "Finish ten practice sets.", "#dce8f7", "star"],
    ["whole-exercise", "Whole exercise", "Finish all five sets of one exercise.", "#ffe4c8", "medal"],
    ["vocab", "Word collector", "Get every blank right in a vocab passage.", "#ece4f4", "book"],
    ["five-days", "Five days", "Open CLY English on five different days.", "#fff1e3", "calendar"],
    ["part-b-steps", "Step by step", "Read all five steps of the Part B guide.", "#e8f5ec", "steps"]
  ];
  var LEAGUE_FIRST = ["league-first", "First challenge", "Hand in your first weekly challenge.", "#dcefe2", "flag"];
  var YEAR = [
    ["New pencil", "#dce8f7", "pencil"], ["Asleep on a book", "#ece4f4", "zzz", true], ["Picnic day", "#dcefe2", "riceball"],
    ["Rainy day", "#fff1e3", "umbrella"], ["Autumn leaf", "#ffe4c8", "leaf"], ["Kite flying", "#e8f5ec", "kite"],
    ["First frost", "#1a64c4", "snow"], ["Lantern night", "#1d2a3a", "lantern"], ["Tea break", "#fff1e3", "cup"],
    ["Music lesson", "#ece4f4", "note"], ["Summer sun", "#dce8f7", "sun"], ["End of the year", "#6b4596", "crown"]
  ].map(function (y, i) {
    return ["year-" + (i + 1), y[0], "Hand in " + (i + 1) * WEEKS_PER_STICKER + " weekly challenges that count.", y[1], y[2], y[3]];
  });
  var ALL = PRACTICE.concat([LEAGUE_FIRST], YEAR);
  var BY_ID = {};
  ALL.forEach(function (s) { BY_ID[s[0]] = s; });

  function art(s, gold) {
    var eyes = s[5]
      ? '<path d="M21 34q3 3 6 0M37 34q3 3 6 0" fill="none" stroke="' + INK + '" stroke-width="2" stroke-linecap="round"/>'
      : '<circle cx="24" cy="34" r="2.3" fill="' + INK + '"/><circle cx="40" cy="34" r="2.3" fill="' + INK + '"/>';
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<circle cx="32" cy="32" r="31" fill="' + (gold ? GOLD : WHITE) + '"/>' +
      '<circle cx="32" cy="32" r="27.5" fill="' + s[3] + '"/>' +
      '<path d="M13 28l4-19 13 11zM51 28L47 9 34 20z" fill="' + FOX + '"/>' +
      '<path d="M16.5 22l1.5-8 6 5zM47.5 22L46 14l-6 5z" fill="' + INK + '"/>' +
      '<path d="M11 29q21-16 42 0 0 15-21 26-21-11-21-26z" fill="' + FOX + '"/>' +
      '<path d="M11 30q11 4 21 25-20-10-21-25zM53 30q-11 4-21 25 20-10 21-25z" fill="' + WHITE + '"/>' +
      eyes + '<ellipse cx="32" cy="51.5" rx="2.8" ry="2.2" fill="' + INK + '"/>' +
      '<g transform="translate(40 39)">' + PROPS[s[4]] + '</g></svg>';
  }

  /* ---------- What this browser remembers ---------- */

  function load() {
    var v = null;
    try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) { v = null; }
    v = v && typeof v === "object" ? v : {};
    return { earned: v.earned || {}, days: Array.isArray(v.days) ? v.days : [], steps: Array.isArray(v.steps) ? v.steps : [], vocab: !!v.vocab };
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: stickers last for this visit only */ }
  }
  function setsDone() {
    var out = {};
    var keys = [];
    try { for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i)); } catch (e) { /* storage blocked: no sets to count */ }
    keys.forEach(function (k) {
      if (k.indexOf("cly:sets-done:") !== 0) return;
      // one unreadable entry is skipped, and the rest still count
      try { var list = JSON.parse(localStorage.getItem(k)); if (Array.isArray(list)) out[k] = list.length; } catch (e) { /* skipped */ }
    });
    return out;
  }

  var state = load();
  var today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  var fresh = [];   // earned on this page, waiting to be announced

  function give(ids) {
    var added = ids.filter(function (id) { return !state.earned[id]; });
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
    give(practiceIds({ setsDone: setsDone(), days: state.days, stepsRead: state.steps, vocabDone: state.vocab }));
  }
  // The steps of a long guide are the groups in its contents; only Part B has the five to read.
  function isPage(name) { return new RegExp("(^|/)" + name + "(\\.html)?$").test(location.pathname); }
  function stepOf(sectionId) {
    var link = document.querySelector(".index a[href='#" + (window.CSS && CSS.escape ? CSS.escape(sectionId) : sectionId) + "']");
    var li = link && link.closest("li");
    while (li && !li.classList.contains("index-group")) li = li.previousElementSibling;
    return li ? li.textContent.trim() : null;
  }

  /* ---------- Announcing: a small sticker in the corner, never while the league clock runs ---------- */

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
    var ids = fresh, last = ids[ids.length - 1], gold = /-gold$/.test(last), s = BY_ID[last.replace(/-gold$/, "")];
    fresh = [];
    if (!s) return;
    toast.innerHTML = '<span class="sticker-art">' + art(s, gold) + '</span><p><strong></strong><span></span></p>';
    toast.querySelector("strong").textContent = ids.length > 1 ? ids.length + " new stickers" : "New sticker";
    toast.querySelector("p span").textContent = s[1] + (gold ? " (gold)" : "");
    if (!sheet) {
      var a = document.createElement("a");
      a.href = "index.html#stickers";
      a.textContent = "See your stickers";
      toast.querySelector("p").appendChild(a);
    }
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
    hideSoon();
  }
  // a sticker earned as the clock stops is announced once the paper is out of the way
  if (window.MutationObserver) new MutationObserver(announce).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  /* ---------- The sheet on the home page ---------- */

  var sheet = document.querySelector("[data-stickers]");
  function draw() {
    if (!sheet) return;
    var grid = sheet.querySelector(".sticker-grid"), caption = sheet.querySelector(".sticker-caption"), count = sheet.querySelector("[data-sticker-count]");
    var have = 0;
    grid.textContent = "";
    ALL.forEach(function (s) {
      var gold = !!state.earned[s[0] + "-gold"], earned = gold || !!state.earned[s[0]];
      if (earned) have += 1;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sticker" + (earned ? " earned" : "") + (gold ? " gold" : "");
      b.setAttribute("aria-label", s[1] + (earned ? ", earned" : ", not earned yet"));
      b.innerHTML = '<span class="sticker-art">' + (earned ? art(s, gold) : "") + "</span>";
      b.addEventListener("click", function () {
        grid.querySelectorAll("[aria-pressed]").forEach(function (x) { x.removeAttribute("aria-pressed"); });
        b.setAttribute("aria-pressed", "true");
        caption.textContent = "";
        var name = document.createElement("strong");
        name.textContent = s[1] + (gold ? " (gold)" : "") + ": ";
        caption.appendChild(name);
        caption.appendChild(document.createTextNode(earned ? s[2].replace(/\.$/, "") + ". Earned!" : s[2]));
      });
      var li = document.createElement("li");
      li.appendChild(b);
      grid.appendChild(li);
    });
    count.textContent = have + " of " + ALL.length;
    sheet.hidden = false;
  }

  /* ---------- Listening to the pages ---------- */

  document.addEventListener("cly:set-done", function () { update({}); });
  document.addEventListener("cly:all-right", function () {
    if (isPage("vocab") && !state.vocab) update({ vocab: true });
  });
  document.addEventListener("cly:read", function (e) {
    if (!isPage("part-b") || !e.detail) return;
    var step = stepOf(e.detail.id);
    if (step && state.steps.indexOf(step) < 0) update({ steps: state.steps.concat([step]) });
  });

  window.CLY_STICKERS = {
    // stamps: counted weeks from the league's history (challenge.js works it out with countStamps)
    league: function (stamps) { give(leagueIds(stamps)); },
    countStamps: countStamps,
    stampsToNext: stampsToNext,
    bringsSticker: bringsSticker
  };

  draw();
  update({ days: addDay(state.days, today) });
})();
