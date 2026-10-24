/* CLY English — home: where you left off, the fox's tip of the day, and one sentence climbing from Level 2 to 5** */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the animation that just played is wiped, so the same class can play it again
  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function store(key, value) {
    try { if (value === undefined) return localStorage.getItem(key); localStorage.setItem(key, value); } catch (e) { return null; }
  }

  /* ---------- Continue: the page the student last had open (written by site.js) ---------- */
  function initResume(box) {
    var last = null;
    try { last = JSON.parse(store("cly:last")); } catch (e) { last = null; }
    if (!last || !/^[a-z0-9-]+\.html(#[a-z0-9-]+)?$/.test(last.href || "")) return;
    var a = box.querySelector("a");
    a.href = last.href;
    a.querySelector("span").textContent = last.label || last.href;
    box.hidden = false;
  }

  /* ---------- The fox: today's tip, and the next one on every tap ---------- */

  // the words that differ between the wrong and the right line are underlined, so the fix is easy to spot:
  // a word is kept plain only if it is part of the longest run of words the two lines share, in order
  function bare(w) { return w.toLowerCase().replace(/[.,!?":;]/g, ""); }
  function shared(a, b) {
    var t = a.map(function () { return new Array(b.length + 1).fill(0); }).concat([new Array(b.length + 1).fill(0)]);
    for (var i = a.length - 1; i >= 0; i--) for (var j = b.length - 1; j >= 0; j--) {
      t[i][j] = bare(a[i]) === bare(b[j]) ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    }
    var keep = {}, x = 0, y = 0;
    while (x < a.length && y < b.length) {
      if (bare(a[x]) === bare(b[y])) { keep[x] = true; x++; y++; }
      else if (t[x + 1][y] >= t[x][y + 1]) x++;
      else y++;
    }
    return keep;
  }
  function underline(el, line, other) {
    var a = line.split(" "), keep = shared(a, other.split(" "));
    el.textContent = "";
    a.forEach(function (w, i) {
      if (i) el.appendChild(document.createTextNode(" "));
      if (keep[i]) { el.appendChild(document.createTextNode(w)); return; }
      var u = document.createElement("u");
      u.textContent = w;
      el.appendChild(u);
    });
  }

  function initFox(hello, tips) {
    if (!tips || !tips.length) return;
    var fox = hello.querySelector(".fox"), bubble = hello.querySelector(".bubble");
    var hint = fox.querySelector(".fox-hint");
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    var at = day % tips.length;

    function draw() {
      var t = tips[at];
      bubble.querySelector(".bubble-label").textContent = at === day % tips.length ? "Tip of the day" : "Another tip";
      bubble.querySelector(".bubble-tip").textContent = t.tip;
      underline(bubble.querySelector("[data-wrong]"), t.wrong, t.right);
      underline(bubble.querySelector("[data-right]"), t.right, t.wrong);
      var go = bubble.querySelector(".bubble-go a");
      go.href = t.href;
      go.textContent = "Practise this: " + t.where;
    }

    // one control for keyboards and screen readers; the fox is the same button for fingers
    var more = document.createElement("button");
    more.type = "button";
    more.className = "btn-quiet";
    more.textContent = "Another tip";
    bubble.querySelector(".bubble-go").appendChild(more);

    // a hop that is still in the air is left to land, and the words only slide in when they are not
    // still sliding: a student tapping fast sees each new tip at once, not a stutter of restarts
    var hopping = false, swapped = 0;
    fox.addEventListener("animationend", function () { hopping = false; });
    function next() {
      at = (at + 1) % tips.length;
      draw();
      if (!hopping) { hopping = true; replay(fox, "hop"); }
      var now = Date.now();
      if (now - swapped > 250) replay(bubble, "swap"); else bubble.classList.remove("swap");
      swapped = now;
      if (!hint.hidden) { hint.hidden = true; store("cly:fox", "1"); }
    }
    fox.addEventListener("click", next);
    more.addEventListener("click", next);
    if (!store("cly:fox")) hint.hidden = false;
    draw();
  }

  /* ---------- Level up: the student climbs one level at a time; the new words are highlighted ---------- */
  function initLevelUp(box) {
    var levels = Array.prototype.slice.call(box.querySelectorAll(".levelup-levels > li"));
    var announce = box.querySelector("[data-announce]");
    var bar = document.createElement("div");
    bar.className = "levelup-steps";
    var steps = document.createElement("div");
    steps.setAttribute("role", "group");
    steps.setAttribute("aria-label", "Choose a level");
    var buttons = levels.map(function (li, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = li.getAttribute("data-level");
      b.setAttribute("aria-label", "Level " + li.getAttribute("data-level").replace("**", " double star"));
      b.addEventListener("click", function (e) { select(i, true, e.detail === 0); });
      steps.appendChild(b);
      return b;
    });
    var next = document.createElement("button");
    next.type = "button";
    next.className = "btn levelup-next";
    next.addEventListener("click", function (e) { select(current < levels.length - 1 ? current + 1 : 0, true, e.detail === 0); });
    bar.appendChild(steps);
    bar.appendChild(next);
    box.appendChild(bar);

    var current = 0;
    // keyboard is true for Enter or Space: the level changes at once, with no rise and no highlighter stroke
    function select(i, moved, keyboard) {
      current = i;
      box.classList.toggle("instant", !!keyboard);
      levels.forEach(function (li, j) { li.hidden = j !== i; });
      buttons.forEach(function (b, j) {
        b.setAttribute("aria-pressed", String(j === i));
        b.classList.toggle("passed", j < i);
      });
      next.textContent = i < levels.length - 1 ? "Next level" : "Start again";
      if (!moved) return;
      // the highlighter draws across what changed at this level
      var marks = levels[i].querySelectorAll("mark.swipe");
      marks.forEach(function (m) { m.style.transition = "none"; m.classList.remove("on"); });
      void levels[i].offsetWidth;
      marks.forEach(function (m) { m.style.transition = ""; m.classList.add("on"); });
      announce.textContent = "Level " + levels[i].getAttribute("data-level").replace("**", " double star") + ". " +
        levels[i].querySelector(".levelup-line").textContent + " " + levels[i].querySelector(".levelup-why").textContent;
    }
    select(0, false);
  }

  var resume = document.querySelector(".resume");
  if (resume) initResume(resume);
  var hello = document.querySelector(".hello");
  if (hello) initFox(hello, window.CLY_TIPS);
  document.querySelectorAll(".levelup").forEach(initLevelUp);
})();
