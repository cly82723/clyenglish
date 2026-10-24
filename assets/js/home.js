/* CLY English — home: the fox's tip of the day, and one sentence climbing from Level 2 to 5** */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the animation that just played is wiped, so the same class can play it again
  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ---------- The fox: today's tip, and the next one on every tap ---------- */
  function initFox(fox, bubble, tips) {
    if (!tips || !tips.length) return;
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    var at = day % tips.length;

    function draw() {
      var t = tips[at];
      bubble.querySelector(".bubble-label").textContent = at === day % tips.length ? "Tip of the day" : "Another tip";
      bubble.querySelector(".bubble-tip").textContent = t.tip;
      var eg = bubble.querySelector(".bubble-eg");
      eg.querySelector("s").textContent = t.wrong;
      eg.querySelector("strong").textContent = t.right;
      var go = bubble.querySelector(".bubble-go a");
      go.href = t.href;
      go.textContent = "Practise this: " + t.where;
    }

    var more = document.createElement("button");
    more.type = "button";
    more.className = "link-btn";
    more.textContent = "Another tip";
    bubble.querySelector(".bubble-go").appendChild(more);

    function next() {
      at = (at + 1) % tips.length;
      draw();
      replay(fox, "hop");
      replay(bubble, "swap");
    }
    fox.addEventListener("click", next);
    more.addEventListener("click", next);
    draw();
  }

  /* ---------- Level up: the sentence rewrites itself, one level at a time ---------- */
  function initLevelUp(box) {
    var levels = Array.prototype.slice.call(box.querySelectorAll(".levelup-levels > li"));
    var again = box.querySelector("[data-replay]");
    var steps = document.createElement("div");
    steps.className = "levelup-steps";
    steps.setAttribute("role", "group");
    steps.setAttribute("aria-label", "Choose a level");
    var buttons = levels.map(function (li, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = li.getAttribute("data-level");
      b.setAttribute("aria-label", "Level " + li.getAttribute("data-level").replace("**", " double star"));
      b.addEventListener("click", function () { stop(); if (!reduceMotion) again.hidden = false; select(i); });
      steps.appendChild(b);
      return b;
    });
    box.appendChild(steps);

    function select(i) {
      levels.forEach(function (li, j) { li.hidden = j !== i; });
      buttons.forEach(function (b, j) {
        b.setAttribute("aria-pressed", String(j === i));
        b.classList.toggle("passed", j < i);
      });
    }

    var timer = null;
    function stop() { clearTimeout(timer); timer = null; }
    function play() {
      stop();
      again.hidden = true;
      var i = 0;
      select(0);
      (function step() {
        if (i >= levels.length - 1) { again.hidden = false; return; }
        timer = setTimeout(function () { i += 1; select(i); step(); }, 2600);
      })();
    }

    select(0);
    if (reduceMotion) return; // stays still: the student taps through the levels
    again.addEventListener("click", play);
    // the climb starts once the box is in view, so nobody misses the first rung
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); play(); }
      }, { threshold: 0.6 });
      io.observe(box);
    } else play();
  }

  var fox = document.querySelector(".fox"), bubble = document.querySelector(".bubble");
  if (fox && bubble) initFox(fox, bubble, window.CLY_TIPS);
  document.querySelectorAll(".levelup").forEach(initLevelUp);
})();
