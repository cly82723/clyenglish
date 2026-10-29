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
  // Only when the two lines mostly match: on a full rewrite nearly every word would be underlined,
  // and the marks would say nothing. Then the level marks carry the comparison on their own.
  function underline(el, line, other) {
    var a = line.split(" "), b = other.split(" "), keep = shared(a, b);
    el.textContent = "";
    if (Object.keys(keep).length < Math.min(a.length, b.length) / 2) { el.textContent = line; return; }
    a.forEach(function (w, i) {
      if (i) el.appendChild(document.createTextNode(" "));
      if (keep[i]) { el.appendChild(document.createTextNode(w)); return; }
      var u = document.createElement("u");
      u.textContent = w;
      el.appendChild(u);
    });
  }

  // A word of the day highlights just its phrase in the stronger line: the words of the tip
  // ("alleviate + pressure / a burden") found there, with the small words between them.
  var SMALL = /^(a|an|the|of|to|on|in|for|with|and|or|your|our|someone|\+|\/)$/;
  function highlight(el, line, tip) {
    var stems = tip.split(/[\s+\/]+/).map(bare).filter(function (w) { return w && !SMALL.test(w); })
      .map(function (w) { return w.length > 4 ? w.replace(/e$/, "") : w; });
    var words = line.split(" "), hits = [];
    words.forEach(function (w, i) {
      var x = bare(w);
      if (stems.some(function (s) { return x.indexOf(s) === 0; })) hits.push(i);
    });
    el.textContent = "";
    if (!hits.length) { el.textContent = line; return; }
    // one run: from the first hit, joined to later hits no more than two words away
    var from = hits[0], to = hits[0];
    hits.slice(1).forEach(function (i) { if (i - to <= 3) to = i; });
    var mark = document.createElement("mark");
    mark.className = "swipe";
    mark.textContent = words.slice(from, to + 1).join(" ");
    if (from) el.appendChild(document.createTextNode(words.slice(0, from).join(" ") + " "));
    el.appendChild(mark);
    if (to < words.length - 1) el.appendChild(document.createTextNode(" " + words.slice(to + 1).join(" ")));
    void mark.offsetWidth;
    mark.classList.add("on");
  }

  // Three kinds of tip take turns day by day. Day n shows kind n mod 3, and the next tip of that kind,
  // so each kind runs through its whole list before repeating. Nothing to update: the date does it.
  var KINDS = [
    { key: "writing", today: "Writing tip of the day", more: "Writing tip" },
    { key: "grammar", today: "Grammar tip of the day", more: "Grammar tip" },
    { key: "vocab", today: "Word of the day", more: "Word to use" }
  ];
  function tipAt(tips, n) {
    var kind = KINDS[n % KINDS.length], list = tips[kind.key] || [];
    return { kind: kind, tip: list[Math.floor(n / KINDS.length) % list.length] };
  }

  function initFox(hello, tips) {
    if (!tips || !KINDS.every(function (k) { return tips[k.key] && tips[k.key].length; })) return;
    var fox = hello.querySelector(".fox"), bubble = document.querySelector(".tip-day .bubble");
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    var at = day;

    // A grammar tip fixes a mistake, so it keeps the cross and the tick. A writing tip or a word of the
    // day lifts a line that is already correct, so it gets the circled levels instead: 3, then 5.
    var rows = bubble.querySelectorAll(".bubble-eg li");
    var LOOK = {
      error: [["avoid", "Wrong: "], ["do", "Right: "]],
      level: [["rung", "Weaker: "], ["rung up", "Stronger: "]]
    };
    function draw() {
      var pick = tipAt(tips, at), t = pick.tip, look = LOOK[pick.kind.key === "grammar" ? "error" : "level"];
      bubble.querySelector(".bubble-label").textContent = at === day ? pick.kind.today : pick.kind.more;
      bubble.setAttribute("data-kind", pick.kind.key);
      bubble.querySelector(".bubble-tip").textContent = pick.kind.key === "vocab" ? "Use “" + t.tip + "”" : t.tip;
      Array.prototype.forEach.call(rows, function (li, i) {
        li.className = look[i][0];
        li.querySelector("[data-say]").textContent = look[i][1];
      });
      if (pick.kind.key === "vocab") {
        bubble.querySelector("[data-wrong]").textContent = t.wrong;
        highlight(bubble.querySelector("[data-right]"), t.right, t.tip);
      } else {
        underline(bubble.querySelector("[data-wrong]"), t.wrong, t.right);
        underline(bubble.querySelector("[data-right]"), t.right, t.wrong);
      }
      var go = bubble.querySelector(".bubble-go a");
      go.href = t.href;
      go.textContent = "Practise this: " + t.where;
      back.hidden = at === day;
    }

    // one control for keyboards and screen readers; the fox is the same button for fingers
    var more = document.createElement("button");
    more.type = "button";
    more.className = "btn-quiet";
    more.textContent = "Another tip";
    bubble.querySelector(".bubble-go").appendChild(more);
    // after a few taps, one step back to today's tip
    var back = document.createElement("button");
    back.type = "button";
    back.className = "link-btn";
    back.textContent = "Today’s tip";
    back.hidden = true;
    back.addEventListener("click", function () { at = day; draw(); replay(bubble, "swap"); more.focus(); });
    bubble.querySelector(".bubble-go").appendChild(back);

    // a hop that is still in the air is left to land, and the words only slide in when they are not
    // still sliding: a student tapping fast sees each new tip at once, not a stutter of restarts
    var hopping = false, swapped = 0;
    fox.addEventListener("animationend", function () { hopping = false; });
    function next() {
      at += 1;
      draw();
      if (!hopping) { hopping = true; replay(fox, "hop"); }
      var now = Date.now();
      if (now - swapped > 250) replay(bubble, "swap"); else bubble.classList.remove("swap");
      swapped = now;
    }
    fox.addEventListener("click", next);
    more.addEventListener("click", next);
    draw();
    // today's tip is in place before anything is announced: only a tip the student asks for is read out
    var body = bubble.querySelector(".bubble-body");
    body.classList.add("drawn");
    body.setAttribute("aria-live", "polite");
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
