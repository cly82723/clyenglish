/* CLY English — small helpers shared by the grammar and vocab exercises */
(function () {
  "use strict";

  var SVG = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function append(el, kids) {
    kids.forEach(function (k) {
      if (k == null || k === false) return;
      if (Array.isArray(k)) return append(el, k);
      el.appendChild(typeof k === "object" ? k : document.createTextNode(String(k)));
    });
    return el;
  }

  function set(el, props) {
    Object.keys(props || {}).forEach(function (key) {
      var v = props[key];
      if (v == null || v === false) return;
      if (key === "class") el.setAttribute("class", v);
      else if (key.slice(0, 2) === "on") el.addEventListener(key.slice(2), v);
      else if (key === "value") el.value = v;
      else el.setAttribute(key, v === true ? "" : v);
    });
    return el;
  }

  // h("p", { class: "x", onclick: fn }, "text", child, [more])
  function h(tag, props) {
    return append(set(document.createElement(tag), props), [].slice.call(arguments, 2));
  }
  function s(tag, props) {
    return append(set(document.createElementNS(SVG, tag), props), [].slice.call(arguments, 2));
  }

  // "**word**" in teaching text is set in bold.
  function bold(text) {
    return String(text).split(/\*\*(.+?)\*\*/).map(function (part, i) { return i % 2 ? h("strong", null, part) : part; });
  }

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

  // Opens another section of the page through its index link, so the URL, focus and pager stay in step.
  function go(id) {
    var link = document.querySelector(".index a[href='#" + id + "']");
    if (link) link.click();
  }

  function scrollTo(el) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  var normalise = function (s) { return s.toLowerCase().replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim(); };

  var shuffled = function (n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  };

  // Marks for typed blanks: "Check" marks every item the student has tried; an untried item stays unmarked,
  // like a teacher who only marks what's written. Editing an item clears its mark; each wrong check counts as a try,
  // so hints can get stronger without ever giving the answer away.
  function Checks(ids, isCorrect, isTried) {
    this.ids = ids; this.isCorrect = isCorrect; this.isTried = isTried;
    this.marks = {}; this.tries = {}; this.checked = false;
  }
  Checks.prototype.check = function () {
    var self = this;
    this.ids.forEach(function (id) {
      if (!self.isTried(id)) { delete self.marks[id]; return; }
      var ok = self.isCorrect(id);
      self.marks[id] = ok;
      self.tries[id] = (self.tries[id] || 0) + (ok ? 0 : 1);
    });
    this.checked = true;
  };
  Checks.prototype.clearMark = function (id) { delete this.marks[id]; };
  Checks.prototype.reset = function () { this.marks = {}; this.tries = {}; this.checked = false; };
  Checks.prototype.score = function () { var m = this.marks; return this.ids.filter(function (id) { return m[id]; }).length; };
  Checks.prototype.toFix = function () { var m = this.marks; return this.ids.filter(function (id) { return m[id] === false; }); };
  Checks.prototype.untried = function () { var self = this; return this.ids.filter(function (id) { return !self.isTried(id); }); };

  // The result after a check leads with what to do next, then the score.
  // fixes: ids still wrong; untried: ids not tried yet; label(id) names one ("blank 4", "line 9"); next(): focus the first to fix.
  function scoreboard(o) {
    var fixes = o.fixes, untried = o.untried;
    var lead = !fixes.length && !untried.length ? o.done
      : fixes.length ? fixes.length + " to fix: " + fixes.map(o.label).join(", ")
      : "Nothing to fix so far.";
    return h("div", { class: "scoreboard" },
      h("p", { class: "score" }, lead),
      fixes.length ? h("p", null, "Read the hint under each one, change your answer, then press “Check again”.") : null,
      untried.length ? h("p", null, untried.length + " not tried yet" + (untried.length <= 5 ? ": " + untried.map(o.label).join(", ") : "") + ".") : null,
      h("p", { class: "meta" }, o.scoreText),
      fixes.length ? h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: o.next }, "Go to the first one to fix")) : null,
      o.extra || null
    );
  }

  // Remembers which marks are already on the page, so a redraw only animates the ones that are new.
  function Fresh() { this.seen = {}; }
  Fresh.prototype.is = function (id, state) {
    if (!state) { delete this.seen[id]; return false; }
    if (this.seen[id] === state) return false;
    this.seen[id] = state;
    return true;
  };

  // Restarts a one-off CSS animation class on an element that stays in the page.
  function replay(el, cls) {
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  }

  // A blank in a passage: optional given first letter, an input, and room for a tick or cross.
  function blank(n, opts) {
    var input = h("input", {
      type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
      "aria-label": opts.label, oninput: opts.oninput
    });
    var wrap = h("span", { class: "blank" }, h("sup", null, n), opts.given ? h("span", { class: "given", "aria-hidden": "true" }, opts.given) : null, input);
    wrap.input = input;
    wrap.mark = function (state) {
      wrap.classList.toggle("right", state === true);
      wrap.classList.toggle("wrong", state === false);
      input.readOnly = state === true;
    };
    return wrap;
  }

  window.CLY = { h: h, s: s, bold: bold, clear: clear, go: go, scrollTo: scrollTo, normalise: normalise, shuffled: shuffled, Checks: Checks, scoreboard: scoreboard, Fresh: Fresh, replay: replay, blank: blank, reduceMotion: reduceMotion };
})();
