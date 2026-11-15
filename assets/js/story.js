/* CLY English — the home page scroll story (index.html). The exercise book on the stage is posed once for each
   scene; scrolling moves it from one pose to the next, and the fox stickers drift past at their own speeds.
   Nothing here is needed to use the page: with reduced motion this file does nothing and story.css takes over. */
(function () {
  "use strict";

  var stage = document.querySelector(".stage");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SCENE_STARTS_AT = 0.2;   // a scene counts as reached when its top is this far down the window
  var POINTER_TURN = 5;        // degrees the book leans towards a mouse
  var POINTER_DRIFT = 26;      // pixels the nearest sticker shifts away from a mouse
  var SPIN_PER_PX = 0.03;      // degrees a sticker turns for each pixel it travels

  // The book: one pose for each scene, in order. x in vw, y in vh, turns in degrees, open is the cover on its hinge.
  var WIDE = [
    { x: 0, y: 2, rx: 10, ry: -34, rz: -5, open: 0, s: 1.08 },      // title: closed, three-quarter view
    { x: 2, y: 0, rx: 4, ry: -14, rz: 0, open: -34, s: 1 },         // forms: facing you, cover ajar
    { x: 9, y: 0, rx: 12, ry: 14, rz: 3, open: -152, s: 0.92 },     // league: wide open on its first page
    { x: 1, y: 4, rx: 56, ry: -4, rz: -18, open: 0, s: 0.9 }        // learn: shut, lying on the desk
  ];
  var NARROW = [
    { x: 0, y: 0, rx: 8, ry: -30, rz: -4, open: 0, s: 1.1 },
    { x: -18, y: -6, rx: 4, ry: -12, rz: 0, open: -30, s: 1 },
    { x: -14, y: -6, rx: 10, ry: 20, rz: 2, open: -150, s: 0.9 },
    { x: -20, y: -4, rx: 54, ry: -4, rz: -16, open: 0, s: 0.9 }
  ];
  var KEYS = ["x", "y", "rx", "ry", "rz", "open", "s"];

  var book = stage.querySelector(".book");
  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  var narrow = window.matchMedia("(max-width: 760px)");
  var floaters = Array.prototype.map.call(stage.querySelectorAll(".floater"), function (el) {
    var d = el.dataset, size = Number(d.size);
    el.style.left = d.x + "%";
    el.style.width = "max(" + size + "vw, " + size * 6 + "px)";
    return { el: el, y: Number(d.y), speed: Number(d.speed), spin: Number(d.spin) };
  });

  var starts = [], windowHeight = 0, pointer = { x: 0, y: 0 }, queued = false, shown = "";

  function measure() {
    windowHeight = window.innerHeight;
    starts = scenes.map(function (s, i) { return i === 0 ? 0 : s.offsetTop - windowHeight * SCENE_STARTS_AT; });
  }
  function ease(t) { return t * t * (3 - 2 * t); }

  function draw() {
    queued = false;
    var y = window.scrollY, i = 0;
    while (i < starts.length - 2 && y >= starts[i + 1]) i++;
    var from = starts[i], to = starts[i + 1];
    var t = to > from ? ease(Math.min(1, Math.max(0, (y - from) / (to - from)))) : 0;
    var poses = narrow.matches ? NARROW : WIDE, a = poses[i], b = poses[i + 1] || a;
    KEYS.forEach(function (k) {
      var lean = k === "ry" ? pointer.x * POINTER_TURN : k === "rx" ? -pointer.y * POINTER_TURN : 0;
      book.style.setProperty("--" + k, (a[k] + (b[k] - a[k]) * t + lean).toFixed(3));
    });
    var scene = scenes[t > 0.5 ? i + 1 : i].getAttribute("data-scene");
    if (scene !== shown) { shown = scene; stage.setAttribute("data-scene", scene); }
    floaters.forEach(function (f) {
      var travelled = y * f.speed;
      f.el.style.setProperty("--fy", (f.y / 100 * windowHeight - travelled).toFixed(1));
      f.el.style.setProperty("--fr", (f.spin + travelled * SPIN_PER_PX * (f.spin < 0 ? -1 : 1)).toFixed(2));
      f.el.style.setProperty("--px", (-pointer.x * f.speed * POINTER_DRIFT).toFixed(1));
    });
  }
  function soon() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(draw);
  }
  function remeasure() { measure(); soon(); }

  window.addEventListener("scroll", soon, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  // the sheets change height as their contents arrive (the stickers, the tip), so the scenes are measured again
  if ("ResizeObserver" in window) new ResizeObserver(remeasure).observe(document.querySelector(".story"));

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      pointer = { x: e.clientX / window.innerWidth * 2 - 1, y: e.clientY / window.innerHeight * 2 - 1 };
      soon();
    }, { passive: true });
    // pointing at a form shows its cover on the book, as if picking that book up
    Array.prototype.forEach.call(document.querySelectorAll(".directory li"), function (row) {
      // the form is read from the row's own mark: "S.3" is the s3 book
      var form = row.querySelector(".form-mark").textContent.replace(".", "").toLowerCase();
      function show() { stage.setAttribute("data-form", form); }
      function hide() { stage.removeAttribute("data-form"); }
      row.addEventListener("pointerenter", show);
      row.addEventListener("pointerleave", hide);
      row.addEventListener("focusin", show);
      row.addEventListener("focusout", hide);
    });
  }

  remeasure();
})();
