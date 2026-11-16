/* CLY English — the home page scroll story (index.html).
   The notebook's journey: it starts shut, facing the reader; it opens as the page scrolls, on the word of the day;
   then it shuts and is packed into the bag, out of the way of everything below. Scrolling back up takes it out
   again. Tapping the notebook, or the bag once it is packed, shows the next word.
   Designed for a phone first: there the whole journey happens in the first screen and a half, behind the sheets.
   With reduced motion nothing follows the scroll: the notebook stands still, and a tap simply shows it open. */
(function () {
  "use strict";

  var stage = document.querySelector(".stage");
  if (!stage) return;
  var book = stage.querySelector(".book");
  var bag = document.querySelector("[data-bag]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var narrow = window.matchMedia("(max-width: 760px)");

  var POINTER_TURN = 5;        // degrees the notebook leans towards a mouse
  var POINTER_DRIFT = 26;      // pixels the nearest sticker shifts away from a mouse
  var SPIN_PER_PX = 0.03;      // degrees a sticker turns for each pixel it travels
  var TURN_MS = 700;           // how long the notebook takes to open or shut on a tap
  var SHUTS_AFTER_PX = 140;    // a notebook opened by a tap goes back to its journey once the page has scrolled this far
  var SCENE_STARTS_AT = 0.2;   // a scene counts as reached when its top is this far down the window
  var STAYS_OPEN = 0.32;       // the share of the last stretch the notebook stays open before it is packed
  var SHUT_BY = 0.26;          // ...then it shuts over this share of the packing,
  var MOVES_FROM = 0.26;       // starts towards the bag at this point, in front of the page and see-through,
  var SOLID_FROM = 0.7;        // turns solid again as it nears the bag,
  var LANDS_AT = 0.86;         // reaches the bag's mouth here,
  var FADES_FROM = 0.93;       // and is out of sight inside it from here
  var GHOST = 0.55;            // how visible it is while it crosses the words
  var GHOST_OVER = 0.1;        // the share of the packing it takes to turn see-through
  var BAG_CENTRE_PX = 44;      // the bag sits this far in from the bottom-left corner
  var BAG_MOUTH_PX = 92;       // ...and, grown for the packing, its mouth is this far above the bottom edge
  var AT_MOUTH = 0.24;         // the notebook's size as it reaches the mouth
  var INSIDE = 0.1;            // ...and once it has dropped in

  /* ---------- The word of the day ---------- */

  // One list for each month; a month without one uses the latest earlier list, so there is always a word.
  function wordsFor(date) {
    var all = window.CLY_WORDS || {}, key = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2);
    var keys = Object.keys(all).filter(function (k) { return k <= key && all[k].length; }).sort();
    return keys.length ? all[keys[keys.length - 1]] : [];
  }
  var now = new Date(), words = wordsFor(now), stepped = 0;
  var said = document.querySelector("[data-skill-said]"), button = document.querySelector("[data-skill-button]");
  var page = { word: book.querySelector(".word-word"), eg: book.querySelector(".word-eg"), topic: book.querySelector(".word-topic"), label: book.querySelector(".word-label") };

  function line(label, text) {
    var p = document.createElement("span"), b = document.createElement("strong");
    b.textContent = label;
    p.appendChild(b);
    p.appendChild(document.createTextNode(text));
    return p;
  }
  // today's word is on the page from the start; each tap moves on to the next in the month's list
  function writeWord(spoken) {
    if (!words.length) return;
    var w = words[(now.getDate() - 1 + stepped) % words.length];
    page.label.textContent = stepped ? "Another word" : "Word of the day";
    page.word.textContent = w.word;
    page.eg.textContent = w.strong;
    page.topic.textContent = w.topic;
    if (!said || !spoken) return;
    var link = document.createElement("a");
    link.href = w.href;
    link.textContent = "More " + w.topic + " words";
    said.textContent = "";
    said.appendChild(line((stepped ? "Another word: " : "Word of the day: "), w.word));
    said.appendChild(line("Without it: ", w.weak));
    said.appendChild(line("With it: ", w.strong));
    said.appendChild(link);
    said.hidden = false;
  }
  writeWord(false);

  var shown = false;         // opened by a tap, where it stands
  var fromBag = false;       // ...or taken out of the bag, to the middle of the screen
  var shownAt = 0, turnTimer = null, tapped = false;

  function turn() {
    book.classList.add("turning");
    clearTimeout(turnTimer);
    turnTimer = setTimeout(function () { book.classList.remove("turning"); }, TURN_MS);
  }
  function nextWord() {
    if (tapped) stepped += 1;
    tapped = true;
    writeWord(true);
    if (button) button.textContent = "Next word";
  }
  function putBack() {
    if (!shown) return;
    shown = false;
    fromBag = false;
    stage.classList.remove("front");
    turn();
    soon();
  }
  function show(outOfBag) {
    nextWord();
    if (reduceMotion) { book.classList.add("open"); return; }
    shown = true;
    fromBag = outOfBag;
    shownAt = window.scrollY;
    stage.classList.toggle("front", outOfBag);
    turn();
    soon();
  }
  book.addEventListener("click", function (e) { e.stopPropagation(); show(fromBag); });
  if (button) button.addEventListener("click", function () { show(packed); });
  if (bag) bag.addEventListener("click", function () { show(true); });
  // out of the bag, a tap anywhere else puts it back
  stage.addEventListener("click", putBack);

  var packed = false;
  if (reduceMotion) return;

  /* ---------- The journey: four poses, and the scroll positions they are reached at ---------- */

  // x in vw, y in vh, turns in degrees, open is the cover on its hinge, s is size, o is how visible it is.
  var WIDE = [
    { x: 0, y: 2, rx: 6, ry: 0, rz: 0, open: 0, s: 1.1, o: 1 },         // shut, facing the reader
    { x: 2, y: 0, rx: 6, ry: 10, rz: 0, open: -84, s: 1, o: 1 },        // opening
    { x: 9, y: 0, rx: 10, ry: 14, rz: 2, open: -156, s: 0.95, o: 1 }    // wide open
  ];
  var NARROW = [
    { x: 0, y: 0, rx: 6, ry: 0, rz: 0, open: 0, s: 1, o: 1 },
    { x: 0, y: 0, rx: 6, ry: 8, rz: 0, open: -84, s: 1, o: 1 },
    { x: 0, y: 0, rx: 6, ry: 8, rz: 0, open: -156, s: 1, o: 1 }
  ];
  // On a phone the journey is measured in screens scrolled, so it is over before the sheets take the screen.
  // The last stretch is long enough for the packing to take half a screen of scrolling, so a flick cannot skip it.
  var NARROW_MARKS = [0, 0.28, 0.56, 1.3];
  // Tapped where it stands: it turns to face the reader and opens. A phone has no room for it to grow.
  var TAPPED_WIDE = { x: 9, y: 0, rx: 6, ry: 12, rz: 0, open: -158, s: 1.25, o: 1 };
  var TAPPED_NARROW = { rx: 6, ry: 8, rz: 0, open: -158, o: 1 };
  var KEYS = ["x", "y", "rx", "ry", "rz", "open", "s", "o"];

  var scenes = Array.prototype.slice.call(document.querySelectorAll(".scene"));
  var floaters = Array.prototype.map.call(stage.querySelectorAll(".floater"), function (el) {
    var d = el.dataset;
    return { el: el, x: Number(d.x), y: Number(d.y), px: Number(d.px || d.x), py: Number(d.py || d.y), size: Number(d.size), speed: Number(d.speed), spin: Number(d.spin) };
  });

  var sceneStarts = [], marks = [], away = null, outOfBag = null;
  var width = 0, height = 0, pointer = { x: 0, y: 0 }, queued = false, tint = "";

  function clamp(t) { return Math.min(1, Math.max(0, t)); }
  function ease(t) { return t * t * (3 - 2 * t); }

  function measure() {
    width = window.innerWidth;
    height = window.innerHeight;
    sceneStarts = scenes.map(function (s, i) { return i === 0 ? 0 : s.offsetTop - height * SCENE_STARTS_AT; });
    marks = narrow.matches ? NARROW_MARKS.map(function (m) { return m * height; }) : sceneStarts.slice(0, 4);
    // where the notebook's own centre sits (story.css), and so how far it travels to reach the bag or the middle
    var box = book.offsetParent ? { left: book.offsetLeft + book.offsetWidth / 2, top: book.offsetTop + book.offsetHeight / 2, w: book.offsetWidth } : { left: width * 0.7, top: height * 0.5, w: 200 };
    // "away" is the bag's mouth; from there it drops by "sinks" (in vh) to the bag's middle
    away = { x: (BAG_CENTRE_PX - box.left) / width * 100, y: (height - BAG_MOUTH_PX - box.top) / height * 100, rx: 0, ry: 0, rz: -14, open: 0, s: AT_MOUTH,
      sinks: (BAG_MOUTH_PX - BAG_CENTRE_PX) / height * 100 };
    // out of the bag: open in the middle, sized so that cover and page together stay inside the screen
    var size = Math.min(1.3, (width - 32) / (box.w * 2.05));
    // the open cover lies to the left of the spine, so the notebook itself sits right of centre by about half its width
    outOfBag = { x: (width / 2 + box.w * size * 0.48 - box.left) / width * 100, y: (height * 0.48 - box.top) / height * 100, rx: 6, ry: 0, rz: 0, open: -160, s: size, o: 1 };
    floaters.forEach(function (f) {
      f.el.style.left = (narrow.matches ? f.px : f.x) + "%";
      f.el.style.width = "max(" + f.size + "vw, " + f.size * 6 + "px)";
    });
  }

  function pose(y) {
    var poses = narrow.matches ? NARROW : WIDE, i = 0, out = {};
    while (i < marks.length - 2 && y >= marks[i + 1]) i++;
    var t = marks[i + 1] > marks[i] ? clamp((y - marks[i]) / (marks[i + 1] - marks[i])) : 0;
    if (i < poses.length - 1) {
      KEYS.forEach(function (k) { out[k] = poses[i][k] + (poses[i + 1][k] - poses[i][k]) * ease(t); });
      out.packing = 0;
      return out;
    }
    // the last stretch: it stays open a while, then shuts, travels to the bag and is gone
    var open = poses[poses.length - 1], p = clamp((t - STAYS_OPEN) / (1 - STAYS_OPEN));
    var shut = ease(clamp(p / SHUT_BY)), move = ease(clamp((p - MOVES_FROM) / (LANDS_AT - MOVES_FROM)));
    var drop = ease(clamp((p - LANDS_AT) / (1 - LANDS_AT))), fade = clamp((p - FADES_FROM) / (1 - FADES_FROM));
    // It shuts where it stands, then comes in front of the page see-through, and is solid again by the time it lands.
    // On a phone it shut behind a sheet, so it comes through the paper from nothing; on a wide screen it only thins.
    var from = narrow.matches ? 0 : 1, thin = from + (GHOST - from) * clamp((p - MOVES_FROM) / GHOST_OVER);
    var seen = p < MOVES_FROM ? 1 : thin + (1 - thin) * clamp((p - SOLID_FROM) / (LANDS_AT - SOLID_FROM));
    ["rx", "ry", "rz", "open"].forEach(function (k) { out[k] = open[k] + (away[k] - open[k]) * shut; });
    ["x", "y", "s"].forEach(function (k) { out[k] = open[k] + (away[k] - open[k]) * move; });
    out.y += away.sinks * drop;
    out.s += (INSIDE - AT_MOUTH) * drop;
    out.o = seen * (1 - fade);
    out.packing = p;
    out.inFront = p >= MOVES_FROM && p < 1;
    out.leaving = t;
    return out;
  }

  function draw() {
    queued = false;
    var y = window.scrollY, at = pose(y), held = null;
    if (shown) held = fromBag ? outOfBag : (narrow.matches ? TAPPED_NARROW : TAPPED_WIDE);
    KEYS.forEach(function (k) {
      var lean = held && fromBag ? 0 : k === "ry" ? pointer.x * POINTER_TURN : k === "rx" ? -pointer.y * POINTER_TURN : 0;
      var value = held && k in held ? held[k] : at[k];
      book.style.setProperty("--" + k, (value + lean).toFixed(3));
    });
    // the bag: there once packing begins, large while the notebook goes in, a small button afterwards
    packed = at.packing >= 1;
    var travelling = !!at.inFront && !shown;
    if (bag) {
      bag.hidden = at.packing <= 0;
      bag.classList.toggle("packing", at.packing > 0 && !packed);
      bag.classList.toggle("lid-up", at.packing > 0 && at.packing < FADES_FROM);
      // the notebook lands: the bag takes its weight, once each time it goes in
      bag.classList.toggle("gulp", at.packing >= FADES_FROM);
      // from the moment it reaches the mouth the bag is in front of it, so it sinks behind the bag's front
      bag.classList.toggle("swallows", at.packing >= LANDS_AT && !packed);
    }
    // While it travels the notebook is in front of the page, and taps pass through it. The stickers drifting on
    // the same stage would come forward with it, so they fade out just before it sets off and return afterwards.
    stage.classList.toggle("packing", travelling);
    stage.classList.toggle("quiet", (at.leaving || 0) > STAYS_OPEN / 2 && !packed);
    book.classList.toggle("away", packed && !shown);

    var i = 0;
    while (i < sceneStarts.length - 1 && y >= sceneStarts[i + 1] - height * 0.3) i++;
    var name = scenes[i].getAttribute("data-scene");
    if (name !== tint) { tint = name; stage.setAttribute("data-scene", name); }

    floaters.forEach(function (f) {
      var travelled = y * f.speed, top = (narrow.matches ? f.py : f.y) / 100 * height;
      f.el.style.setProperty("--fy", (top - travelled).toFixed(1));
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

  window.addEventListener("scroll", function () {
    if (shown && Math.abs(window.scrollY - shownAt) > SHUTS_AFTER_PX) putBack();
    soon();
  }, { passive: true });
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  // the sheets change height as their contents arrive (the stickers, the tip), so the scenes are measured again
  if ("ResizeObserver" in window) new ResizeObserver(remeasure).observe(document.querySelector(".story"));
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") putBack(); });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      pointer = { x: e.clientX / width * 2 - 1, y: e.clientY / height * 2 - 1 };
      soon();
    }, { passive: true });
    // pointing at a form shows its cover colour on the notebook, as if picking that book up
    Array.prototype.forEach.call(document.querySelectorAll(".directory li"), function (row) {
      // the form is read from the row's own mark: "S.3" is the s3 book
      var form = row.querySelector(".form-mark").textContent.replace(".", "").toLowerCase();
      function on() { stage.setAttribute("data-form", form); }
      function off() { stage.removeAttribute("data-form"); }
      row.addEventListener("pointerenter", on);
      row.addEventListener("pointerleave", off);
      row.addEventListener("focusin", on);
      row.addEventListener("focusout", off);
    });
  }

  remeasure();
})();
