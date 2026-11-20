/* CLY English — concept-check openers for the Part B step pages and hub.
   An opener is one "which is stronger?" question with two real lines. A wrong tap costs nothing: the answer
   is explained either way. The first opener on a step page (data-gates) holds the lesson back until it is
   answered or skipped, so the page starts with one small thing to do, not a wall of text. A closing opener
   (data-step-done) marks the step done for the route on the hub. Everything is kept on this device only. */
(function () {
  "use strict";

  var PREFIX = "cly:opener:";

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: the opener works, it just isn't remembered */ }
  }

  // a step page names its step; a page of topic rows (S.3 grammar) only names where its ticks are kept
  var main = document.querySelector("main[data-step], main[data-done-key]");
  var stepId = main ? main.getAttribute("data-step") || "" : "";
  // Part B is the default guide; the Toolkit pages name themselves and keep their own ticks
  var GUIDE = (main && main.getAttribute("data-guide")) || "";
  var DONE_KEY = (main && main.getAttribute("data-done-key")) || "cly:partb-done";
  // the lesson an opener holds back: the one in the same row if the opener sits in a row, else the page's
  function lessonFor(box) {
    var scope = box.closest(".row-body");
    return (scope && scope.querySelector("[data-lesson]")) || document.querySelector("[data-lesson]");
  }

  function unlock(lesson) {
    if (!lesson || !lesson.hidden) return;
    lesson.hidden = false;
    // the highlighter swipes draw once they scroll into view; a hidden lesson never lets them start
    lesson.querySelectorAll("mark.swipe:not(.on)").forEach(function (m) { m.classList.add("on"); });
  }

  function markDone(box) {
    var which = box.getAttribute("data-step-id") || stepId;   // a row names its own topic; a step page is its own step
    var done = load(DONE_KEY) || [];
    if (which && done.indexOf(which) < 0) { done.push(which); save(DONE_KEY, done); }
    document.dispatchEvent(new CustomEvent("cly:step-done", { detail: which }));
  }

  function initOpener(box) {
    var id = box.getAttribute("data-opener");
    var choices = Array.prototype.slice.call(box.querySelectorAll(".opener-choice"));
    var reveal = box.querySelector(".opener-reveal");
    var verdict = box.querySelector(".opener-verdict");
    var skip = box.querySelector("[data-skip]");
    var holder = box.querySelector(".opener-choices");
    var gates = box.hasAttribute("data-gates");
    var lesson = lessonFor(box);
    var saved = load(PREFIX + id);

    // either line can come first, so the stronger one is not always second
    if (!saved && Math.random() < 0.5) holder.appendChild(choices[0]);
    choices = Array.prototype.slice.call(holder.querySelectorAll(".opener-choice"));

    function show(pick, announce) {
      var right = pick.hasAttribute("data-ok");
      choices.forEach(function (c) {
        c.disabled = true;
        var tag = document.createElement("span");
        tag.className = "opener-tag";
        var name = c.getAttribute("data-tag");
        tag.textContent = name + (c.hasAttribute("data-ok") && !/stronger|bigger|correct/i.test(name) ? " · stronger" : "");
        c.insertBefore(tag, c.firstChild);
        c.classList.toggle("is-stronger", c.hasAttribute("data-ok"));
        c.classList.toggle("is-pick", c === pick);
      });
      // a section can use its own words: Final lap's pairs are right and wrong, not stronger and weaker
      verdict.textContent = right
        ? (box.getAttribute("data-right") || "Yes, that is the stronger one.")
        : (box.getAttribute("data-wrong") || "An easy one to pick. The other is stronger, and here is why.");
      reveal.hidden = false;
      if (skip) skip.parentNode.hidden = true;
      if (gates) unlock(lesson);
      if (announce) {
        if (box.hasAttribute("data-step-done")) markDone(box);
        document.dispatchEvent(new CustomEvent("cly:opener", { detail: { id: id, ok: right, suggest: box.getAttribute("data-suggest") } }));
      }
    }

    choices.forEach(function (c) {
      c.addEventListener("click", function () {
        save(PREFIX + id, { pick: c.getAttribute("data-tag"), ok: c.hasAttribute("data-ok") });
        show(c, true);
      });
    });
    if (skip) {
      skip.addEventListener("click", function () {
        save(PREFIX + id, { skip: true });
        box.hidden = true;
        unlock(lesson);
      });
    }

    if (saved && saved.skip) { box.hidden = true; unlock(lesson); return; }
    if (saved && saved.pick) {
      var again = choices.filter(function (c) { return c.getAttribute("data-tag") === saved.pick; })[0];
      if (again) { show(again, !gates); return; }
    }
    // a link into the lesson (part-b.html#crei sends a student here) should not meet a closed gate
    if (gates && lesson && location.hash.length > 1) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target && lesson.contains(target)) { unlock(lesson); target.scrollIntoView({ block: "start" }); }
    }
    // a link inside the page that opens a row at something in this lesson (a quiz's "review the rules") opens the gate too
    if (gates && lesson) {
      document.addEventListener("cly:show", function (e) {
        var el = e.detail && document.getElementById(e.detail);
        if (el && lesson.contains(el)) unlock(lesson);
      });
    }
  }

  document.querySelectorAll("[data-opener]").forEach(initOpener);

  // a step page tells the rest of the site it has been opened: the "Step by step" badge and home's "Continue"
  if (stepId) {
    var kicker = document.querySelector(".row-kicker");
    var page = location.pathname.split("/").pop() || "";
    var name = main.getAttribute("data-resume") || (kicker ? kicker.textContent : "");   // a topic page names itself, its kicker is only the unit
    var label = GUIDE ? (name.indexOf(GUIDE) === 0 ? name : GUIDE + " › " + name) : "Part B › " + name;
    try { localStorage.setItem("cly:last", JSON.stringify({ href: page, label: label })); } catch (e) { /* home simply shows no "Continue" */ }
    // the "Step by step" badge counts Part B's steps only
    if (!GUIDE) {
      // stickers.js loads after this file, so the event waits until every script on the page has run
      var announce = function () { document.dispatchEvent(new CustomEvent("cly:read", { detail: { page: "part-b.html", id: stepId } })); };
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", announce); else announce();
    }
  }
})();
