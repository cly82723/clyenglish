/* CLY English — the book as an object: controls tilt under the finger, the home book leans and opens,
   a finished set lands like a stamp. Everything here is extra: with reduced motion none of it runs,
   and the pages work the same without this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var OPEN_AFTER_MS = 380;     // the closed cover is seen for a moment before it opens
  var OPEN_GIVE_UP_MS = 1600;  // the cover never stays shut, whatever happens to the animation

  /* ---------- The home book opens, once a day (index.html decides that before the first paint) ---------- */

  function openBook() {
    if (!root.classList.contains("book-closed")) return;
    var cover = document.querySelector(".book-cover");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      root.classList.remove("book-closed", "book-opening");
      window.removeEventListener("pointerdown", finish, true);
      window.removeEventListener("keydown", finish, true);
    }
    if (!cover || reduceMotion) return finish();
    // a tap or a key skips it
    window.addEventListener("pointerdown", finish, true);
    window.addEventListener("keydown", finish, true);
    cover.addEventListener("animationend", finish);
    setTimeout(function () { if (!done) root.classList.add("book-opening"); }, OPEN_AFTER_MS);
    setTimeout(finish, OPEN_AFTER_MS + OPEN_GIVE_UP_MS);
  }
  openBook();
  if (reduceMotion) return;

  // A page turn the browser has to drop (the window resized mid-turn, say) is not an error worth reporting.
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    e.viewTransition.ready.catch(function () { /* the page simply appears, as it did before */ });
    e.viewTransition.finished.catch(function () { /* as above */ });
  });

  /* ---------- Pressed controls lift and tilt towards the finger, then land flat ---------- */

  var TILTS = ".choice, .chip, .btn, .btn-quiet, .cell, .letter, .set-mark, .sticker, .directory a, .resume a, .forms a, .pager a, .word-cell, .levelup-steps button";
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

  /* ---------- A sticker catches the light where the pointer is ---------- */

  document.addEventListener("pointermove", function (e) {
    var el = e.target.closest && e.target.closest(".sticker.earned");
    if (!el) return;
    var box = el.getBoundingClientRect();
    el.style.setProperty("--tx", ((e.clientX - box.left) / box.width * 2 - 1).toFixed(2));
    el.style.setProperty("--ty", ((e.clientY - box.top) / box.height * 2 - 1).toFixed(2));
  }, { passive: true });

  /* ---------- The home book leans a little towards a mouse; the fox floats a layer above it ---------- */

  var hub = document.querySelector(".hub");
  if (hub && window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px)").matches) {
    var queued = false, lx = 0, ly = 0;
    window.addEventListener("pointermove", function (e) {
      lx = e.clientX / window.innerWidth * 2 - 1;
      ly = e.clientY / window.innerHeight * 2 - 1;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        hub.style.setProperty("--lx", lx.toFixed(3));
        hub.style.setProperty("--ly", ly.toFixed(3));
      });
    }, { passive: true });
    document.addEventListener("pointerleave", function () {
      hub.style.setProperty("--lx", 0);
      hub.style.setProperty("--ly", 0);
    });
  }

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
