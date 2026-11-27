/* CLY English — the Part B hub: ticks on the steps a student has finished, the three-question check that
   points to a step to try first (it never hides or locks one), and the one thing they wrote last time. */
(function () {
  "use strict";

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }

  /* ---------- Route: a tick on every finished step ---------- */
  // A tick the hub has not shown on this device before lands like a stamp (motion.css: .step-done.stamp-in), once.
  var SEEN_SUFFIX = ":seen";
  function markDone() {
    var nav = document.querySelector(".steps");
    var key = (nav && nav.getAttribute("data-done-key")) || "cly:partb-done";
    var done = load(key) || [];
    var seen = load(key + SEEN_SUFFIX);
    var firstVisit = !Array.isArray(seen);   // ticks already there before this was added simply show
    document.querySelectorAll("[data-step-link]").forEach(function (a) {
      var id = a.getAttribute("data-step-link");
      var finished = done.indexOf(id) >= 0;
      a.classList.toggle("is-done", finished);
      var tick = a.querySelector(".step-done");
      if (!tick) return;
      tick.hidden = !finished;
      // added, never taken off: markDone runs again on pageshow, by when this tick has already been seen
      if (finished && !firstVisit && seen.indexOf(id) < 0) tick.classList.add("stamp-in");
      if (!finished) tick.classList.remove("stamp-in");
    });
    try { localStorage.setItem(key + SEEN_SUFFIX, JSON.stringify(done)); } catch (e) { /* no stamp next time either */ }
  }
  markDone();
  window.addEventListener("pageshow", markDone);   // back from a step page: the tick is already there

  /* ---------- Three questions: a step to try first ---------- */
  var result = document.querySelector("[data-hub-result]");
  var answers = {};   // opener id -> { ok, suggest }
  var TOTAL = document.querySelectorAll(".hub-check [data-opener]").length;

  function stepName(id) {
    var link = document.querySelector("[data-step-link='" + id + "'] .row-kicker");
    return link ? link.textContent.split(" · ")[0] : "";
  }
  function refresh() {
    var missed = Object.keys(answers).filter(function (k) { return !answers[k].ok; }).map(function (k) { return answers[k].suggest; });
    document.querySelectorAll("[data-step-link]").forEach(function (a) {
      var first = missed.indexOf(a.getAttribute("data-step-link")) >= 0;
      a.classList.toggle("is-suggested", first);
      var note = a.querySelector(".step-suggest");
      if (first && !note) {
        note = document.createElement("span");
        note.className = "step-suggest";
        note.textContent = "Try this first";
        a.querySelector(".row-head").appendChild(note);
      } else if (!first && note) {
        note.remove();
      }
    });
    if (!result || Object.keys(answers).length < TOTAL) return;
    result.hidden = false;
    result.textContent = missed.length
      ? "Try " + missed.map(stepName).join(" and ") + " first. The other steps are open to you whenever you like."
      : "You picked the stronger line every time. Start with Step 1, or open any step you like.";
  }
  document.addEventListener("cly:opener", function (e) {
    var d = e.detail;
    if (!d || !d.suggest) return;
    answers[d.id] = { ok: d.ok, suggest: d.suggest };
    refresh();
  });

  /* ---------- The one thing from last time ---------- */
  var back = document.querySelector("[data-one-thing-back]");
  var saved = "";
  try { saved = localStorage.getItem("cly:partb-one") || ""; } catch (e) { saved = ""; }
  if (back && saved) {
    var b = document.createElement("b");
    b.textContent = "Your one thing: ";
    back.appendChild(b);
    back.appendChild(document.createTextNode("next time, I will " + saved));
    back.hidden = false;
  }
})();
