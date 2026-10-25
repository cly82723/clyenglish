/* CLY English — set marks. Every exercise has five sets. Above it sits one small square per set:
   empty, half-filled once started, ticked once finished. Tap any square to open that set, or "Next set".
   The page remembers the set you were on and the sets you have finished, so the book keeps your marks.
   Answers inside a set stay put when you switch away and come back. */
(function () {
  "use strict";

  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: just don't remember it */ }
  }
  function el(tag, cls, text) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text != null) x.textContent = text;
    return x;
  }
  var WORD = { "": "not started", started: "started", done: "finished" };

  // o.name       storage key for this exercise
  // o.titles     one title per set ("" for none)
  // o.panels     one element per set, or a function (i) => element, made the first time that set opens
  // o.state(i)   "", "started" or "done", read from the set's own page
  // returns { refresh }: call it whenever a set's answers may have changed
  window.CLYSets = function (root, before, o) {
    var count = o.titles.length, made = [];
    var at = Math.min(Math.max(Number(read("cly:set:" + o.name, 0)) || 0, 0), count - 1);
    var finished = read("cly:sets-done:" + o.name, []);
    if (!Array.isArray(finished)) finished = [];

    var bar = el("div", "set-bar");
    var title = el("p", "set-title");
    title.setAttribute("aria-live", "polite");
    var marks = el("div", "set-marks");
    marks.setAttribute("role", "group");
    marks.setAttribute("aria-label", "Sets");
    var squares = o.titles.map(function (t, i) {
      var b = el("button", "set-mark", String(i + 1));
      b.type = "button";
      b.addEventListener("click", function () { open(i, true); });
      marks.appendChild(b);
      return b;
    });
    var next = el("button", "btn-quiet", "Next set");
    next.type = "button";
    next.addEventListener("click", function () { open((at + 1) % count, true); });
    bar.appendChild(title);
    bar.appendChild(marks);
    bar.appendChild(next);
    root.insertBefore(bar, before || null);

    function panel(i) {
      if (!made[i]) {
        made[i] = typeof o.panels === "function" ? o.panels(i) : o.panels[i];
        made[i].setAttribute("tabindex", "-1");
        made[i].setAttribute("aria-label", "Set " + (i + 1) + (o.titles[i] ? ": " + o.titles[i] : ""));
      }
      return made[i];
    }
    function stateOf(i) {
      var live = made[i] ? o.state(i) : "";
      if (live === "done" && finished.indexOf(i) < 0) { finished.push(i); write("cly:sets-done:" + o.name, finished); }
      return live === "done" || finished.indexOf(i) >= 0 ? "done" : live;
    }
    // only what changed is written, so the watcher below never hears its own writes
    function attr(b, k, v) { if (b.getAttribute(k) !== v) b.setAttribute(k, v); }
    function refresh() {
      squares.forEach(function (b, i) {
        var s = stateOf(i);
        attr(b, "data-state", s);
        attr(b, "aria-pressed", String(i === at));
        attr(b, "aria-label", "Set " + (i + 1) + (o.titles[i] ? ": " + o.titles[i] : "") + ", " + WORD[s]);
      });
    }
    function open(i, moved) {
      at = i;
      write("cly:set:" + o.name, at);
      var p = panel(i);
      made.forEach(function (m, j) { if (m) m.hidden = j !== i; });
      title.textContent = "Set " + (i + 1) + " of " + count + (o.titles[i] ? ": " + o.titles[i] : "");
      refresh();
      if (!moved) return;
      // the bar stays where it is and the new set opens under it; keyboard focus moves into the set
      if (bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start" });
      p.focus({ preventScroll: true });
    }

    // answers change inside the sets: the squares follow, once per frame at most
    var queued = false;
    function soon() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; refresh(); });
    }
    root.addEventListener("input", soon);
    root.addEventListener("click", soon);
    if (window.MutationObserver) new MutationObserver(soon).observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "aria-pressed"] });

    open(at, false);
    return { refresh: refresh };
  };
})();
