/* CLY English — the book as an object: controls tilt under the finger and
   a finished set lands like a stamp. Everything here is extra: with reduced motion none of it runs,
   and the pages work the same without this file. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  // A page turn the browser has to drop (the window resized mid-turn, say) is not an error worth reporting.
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
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
