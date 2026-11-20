/* CLY English — the book as an object: controls tilt under the finger and
   a finished set lands like a stamp. Everything here is extra: with reduced motion none of it runs,
   and the pages work the same without this file. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  // The page turns on its spine level with the middle of the screen, so a long page scrolled far down still turns
  // where the reader is looking. The turn is drawn by the new page, so the old page measures where its sheet sat
  // on screen and leaves the number in sessionStorage for the new page to read.
  var HINGE_KEY = "cly:turn-y";
  function hingeOf() {
    var sheet = document.querySelector(".sheet");
    return sheet ? Math.round(window.innerHeight / 2 - sheet.getBoundingClientRect().top) : null;
  }
  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition) return;
    var y = hingeOf();
    try { if (y !== null) sessionStorage.setItem(HINGE_KEY, String(y)); } catch (err) { /* no hinge: the 30vh default */ }
  });

  // The site's reading order: the cover tabs, then each form's strip. Moving to an earlier page turns back.
  var ORDER = ["index.html", "junior.html", "s3-grammar.html", "s3-indefinite-pronouns.html", "s3-noun-phrases.html", "s3-bare-infinitives.html", "s3-so-so-that.html", "s3-must-have-to.html", "s3-units-consolidation.html", "s3-past-perfect.html", "s3-present-participle.html", "s3-past-participle.html", "s3-participle-consolidation.html", "s3-reported-statements.html", "s3-reported-questions.html", "s3-reported-consolidation.html", "s3-linking-words.html", "s3-tenses.html", "s3-practice-cloze.html", "vocab.html", "s3-challenge.html", "senior.html", "grammar.html", "s4-tenses.html", "s4-passive.html", "s4-gerunds-infinitives.html", "s4-conditionals.html", "s4-practice.html", "challenge.html",
    "part-a.html", "part-a-read.html", "part-a-formats.html", "part-a-plan.html", "part-a-opening.html", "part-b.html", "part-b-choose.html", "part-b-content.html", "part-b-organisation.html", "part-b-language.html", "part-b-finish.html", "text-types.html", "text-types-article.html", "text-types-letter.html", "text-types-speech.html", "text-types-proposal.html", "text-types-report.html", "text-types-story.html", "questions.html", "questions-part-a.html", "2026-part-a.html", "2025-part-a.html", "2024-part-a.html", "2023-part-a.html", "2022-part-a.html", "2021-part-a.html", "2020-part-a.html", "2019-part-a.html", "2018-part-a.html", "2017-part-a.html", "2016-part-a.html", "2015-part-a.html", "2014-part-a.html", "2013-part-a.html", "questions-part-b.html", "2026-part-b.html", "2025-part-b.html", "2024-part-b.html", "2023-part-b.html", "2022-part-b.html", "2021-part-b.html", "2020-part-b.html", "2019-part-b.html", "2018-part-b.html", "2017-part-b.html", "2016-part-b.html", "2015-part-b.html", "2014-part-b.html", "2013-part-b.html", "toolkit.html", "toolkit-openings.html", "toolkit-linking.html", "toolkit-vocabulary.html", "toolkit-variety.html", "toolkit-words.html", "final.html", "cutoffs.html", "menu.html"];
  function pageOf(url) {
    try { return new URL(url, location.href).pathname.split("/").pop() || "index.html"; } catch (err) { return ""; }
  }
  // true when this move should turn the page back: a step back in history, or an earlier page in the reading order
  function turnsBack(activation) {
    if (!activation || !activation.from || !activation.entry) return false;
    if (activation.navigationType === "traverse") return activation.entry.index < activation.from.index;
    var from = ORDER.indexOf(pageOf(activation.from.url)), to = ORDER.indexOf(pageOf(activation.entry.url));
    return from >= 0 && to >= 0 && to < from;
  }

  // A page turn the browser has to drop (the window resized mid-turn, say) is not an error worth reporting.
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    var root = document.documentElement;
    var y = null;
    try { y = sessionStorage.getItem(HINGE_KEY); sessionStorage.removeItem(HINGE_KEY); } catch (err) { y = null; }
    if (y) root.style.setProperty("--turn-old-y", y + "px");
    if (window.navigation && turnsBack(navigation.activation)) {
      root.setAttribute("data-turn", "back");
      var newY = hingeOf();   // where this page's own sheet sits on screen
      if (newY !== null) root.style.setProperty("--turn-new-y", newY + "px");
      var done = function () { root.removeAttribute("data-turn"); };
      e.viewTransition.finished.then(done, done);
    }
    e.viewTransition.ready.catch(function () { /* the page simply appears, as it did before */ });
    e.viewTransition.finished.catch(function () { /* as above */ });
  });

  /* ---------- Pressed controls lift and tilt towards the finger, then land flat ---------- */

  var TILTS = ".choice, .chip, .btn, .btn-quiet, .cell, .letter, .set-mark, .sticker, .directory a, .resume a, .forms a, .pager a, .word-cell, .levelup-steps button, .stamp-card, tr.step";
  var held = null;
  function release() {
    if (!held) return;
    held.classList.remove("held");
    held = null;
  }
  document.addEventListener("pointerdown", function (e) {
    var el = e.target.closest && e.target.closest(TILTS);
    if (!el || el.disabled) return;
    var box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    // -1 at the left or top edge, 1 at the right or bottom: where on the control the finger landed
    el.style.setProperty("--tx", ((e.clientX - box.left) / box.width * 2 - 1).toFixed(2));
    el.style.setProperty("--ty", ((e.clientY - box.top) / box.height * 2 - 1).toFixed(2));
    release();
    held = el;
    el.classList.add("held");
  }, { passive: true });
  ["pointerup", "pointercancel", "dragstart", "blur"].forEach(function (type) { window.addEventListener(type, release, { passive: true }); });
  document.addEventListener("scroll", release, { passive: true });

  /* ---------- The league: its rules, stamp card and tables arrive as they are scrolled to, once ---------- */

  // challenge.js redraws #challenge for each screen, so new arrivals are picked up as they are added. An element
  // waits (challenge.css: .waits) only once it is being watched, so without this code nothing is ever hidden.
  var league = document.getElementById("challenge");
  if (league && "IntersectionObserver" in window && "MutationObserver" in window) {
    var ARRIVES = ".how .skeleton > li, .stamp-card, .board-panel table";
    var DEAL_GAP_MS = 110;   // between two things that come into view together, so they land one after another
    var seen = new IntersectionObserver(function (entries) {
      var landed = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        seen.unobserve(entry.target);
        entry.target.style.setProperty("--wait", landed++ * DEAL_GAP_MS + "ms");
        entry.target.classList.remove("waits");
        entry.target.classList.add("arrives");
      });
    });
    // challenge.js changes text often (clocks, the mark counting up), so one look per frame is enough
    var looking = false;
    var watch = function () {
      if (looking) return;
      looking = true;
      requestAnimationFrame(look);
    };
    var look = function () {
      looking = false;
      Array.prototype.forEach.call(league.querySelectorAll(ARRIVES), function (el) {
        if (el.classList.contains("waits") || el.classList.contains("arrives")) return;
        el.classList.add("waits");
        seen.observe(el);
      });
    };
    new MutationObserver(watch).observe(league, { childList: true, subtree: true });
    look();
  }

  /* ---------- Hub rows arrive: the steps of each hub list in one after another ---------- */

  // A row waits (motion.css: .waits) only once it is being watched, so without this code nothing is ever hidden.
  var HUB_ROWS = ".steps .step-link";
  var hubRows = document.querySelectorAll(HUB_ROWS);
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hubRows.length && !calm && "IntersectionObserver" in window) {
    var ROW_GAP_MS = 70;        // between rows that come into view together
    var SAFETY_MS = 2500;       // if the observer never reports, show everything rather than leave a row hidden
    var observed = false;       // set once the observer has reported anything at all
    var nudged = false;         // only the first unfinished step gets its number nudged
    var rowsSeen = new IntersectionObserver(function (entries) {
      var landed = 0;
      observed = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var row = entry.target;
        rowsSeen.unobserve(row);
        row.style.setProperty("--wait", landed++ * ROW_GAP_MS + "ms");
        row.classList.remove("waits");
        row.classList.add("arrives");
        if (!nudged && row.classList.contains("step-link") && !row.classList.contains("is-done")) {
          nudged = true;
          row.classList.add("is-next");
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(hubRows, function (row) { row.classList.add("waits"); rowsSeen.observe(row); });
    setTimeout(function () {
      if (observed) return;   // working: rows lower down arrive as they are scrolled to
      Array.prototype.forEach.call(document.querySelectorAll(HUB_ROWS + ".waits"), function (row) { row.classList.remove("waits"); });
    }, SAFETY_MS);
  }

  /* ---------- A sticker catches the light where the pointer is ---------- */

  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(".sticker.earned");
    if (!el) return;
    var box = el.getBoundingClientRect();
    el.style.setProperty("--tx", ((e.clientX - box.left) / box.width * 2 - 1).toFixed(2));
    el.style.setProperty("--ty", ((e.clientY - box.top) / box.height * 2 - 1).toFixed(2));
  }, { passive: true });

  /* ---------- A finished set lands like a rubber stamp ---------- */

  document.addEventListener("cly:set-done", function (e) {
    var bar = e.detail && e.detail.bar;
    var mark = bar && bar.querySelectorAll(".set-mark")[e.detail.set];
    if (!mark) return;
    mark.classList.remove("stamped");
    void mark.offsetWidth;
    mark.classList.add("stamped");
  });
})();
