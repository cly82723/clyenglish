/* CLY English — Part B: one text type at a time, and the CREI labelling drill */
(function () {
  "use strict";

  /* ---------- Picker: buttons choose which text type (or topic) is shown ---------- */
  // Links to a text type (part-b.html#story, or a ladder inside it) still land on it: site.js announces
  // every section it opens with "cly:show", and the picker opens the panel that holds the target.
  function initPicker(box) {
    var panels = Array.prototype.slice.call(box.querySelectorAll(":scope > .pick-panel"));
    var row = document.createElement("ul");
    row.className = "chips picker-row";
    row.setAttribute("aria-label", box.getAttribute("aria-label") || "Choose");
    var buttons = panels.map(function (p, i) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p.getAttribute("data-label");
      b.addEventListener("click", function (e) { select(i, e.detail !== 0); history.replaceState(null, "", "#" + p.id); });
      li.appendChild(b);
      row.appendChild(li);
      return b;
    });
    box.insertBefore(row, panels[0]);

    // a tap fades the new panel in, so it is clear the content below the chips has changed;
    // a key press or a link changes it at once
    // a student flicking through chips quickly sees each panel at once, not a stutter of restarted fades
    var lastSwap = 0;
    function select(i, animate) {
      var now = Date.now();
      if (now - lastSwap < 250) animate = false;
      if (animate) lastSwap = now;
      panels.forEach(function (p, j) {
        p.hidden = j !== i;
        p.classList.remove("swap");
        buttons[j].setAttribute("aria-pressed", String(j === i));
      });
      if (animate) { void panels[i].offsetWidth; panels[i].classList.add("swap"); }
    }
    select(0);

    document.addEventListener("cly:show", function (e) {
      var el = e.detail && document.getElementById(e.detail);
      if (!el) return;
      var i = panels.findIndex(function (p) { return p === el || p.contains(el); });
      if (i >= 0) select(i);
    });
  }

  /* ---------- CREI drill: label each sentence of a jumbled paragraph ---------- */
  var MOVES = { C: "Claim", R: "Reason", E: "Evidence / Example", I: "Impact" };
  var SHORT = { C: "Claim", R: "Reason", E: "Example", I: "Impact" };
  var ORDER = ["C", "R", "E", "I"];

  function initDrill(box) {
    var items = Array.prototype.slice.call(box.querySelectorAll(".drill-items > li"));
    var chosen = items.map(function () { return null; });
    var result = document.createElement("div");
    result.setAttribute("aria-live", "polite");

    items.forEach(function (li, n) {
      var group = document.createElement("div");
      group.className = "letters";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", "Label sentence " + (n + 1));
      group.id = (box.id || "drill") + "-" + n;
      ORDER.forEach(function (k) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "letter";
        b.setAttribute("data-move", k);
        // the move is named under its letter, so nobody has to scroll back up to the key
        b.innerHTML = "<b>" + k + "</b><small>" + SHORT[k] + "</small>";
        b.setAttribute("aria-label", MOVES[k]);
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          chosen[n] = k;
          li.classList.remove("right", "wrong");
          var note = li.querySelector(".verdict");
          if (note) note.remove();
          group.querySelectorAll(".letter").forEach(function (x) {
            x.classList.remove("right", "wrong");
            x.setAttribute("aria-pressed", String(x === b));
          });
          result.textContent = "";
        });
        group.appendChild(b);
      });
      li.appendChild(group);
    });

    var check = document.createElement("button");
    check.type = "button";
    check.className = "btn";
    check.textContent = "Check";
    var again = document.createElement("button");
    again.type = "button";
    again.className = "btn-quiet";
    again.textContent = "Start again";
    var actions = document.createElement("div");
    actions.className = "actions";
    actions.appendChild(check);
    actions.appendChild(again);
    box.appendChild(actions);
    box.appendChild(result);

    check.addEventListener("click", function () {
      var right = 0;
      items.forEach(function (li, n) {
        var picked = li.querySelector(".letter[aria-pressed='true']");
        var old = li.querySelector(".verdict");
        if (old) old.remove();
        if (!chosen[n]) return;
        var ok = chosen[n] === li.getAttribute("data-answer");
        picked.classList.toggle("right", ok);
        picked.classList.toggle("wrong", !ok);
        if (ok) { right++; return; }
        var v = document.createElement("div");
        v.id = "hint-" + (box.id || "drill") + "-" + n;
        picked.setAttribute("aria-describedby", v.id);
        v.className = "verdict hint fresh";
        v.innerHTML = "<strong>Not quite. Have another go.</strong>";
        v.appendChild(document.createTextNode(li.getAttribute("data-hint")));
        li.appendChild(v);
      });
      result.textContent = "";
      if (right < items.length) {
        var missing = chosen.filter(function (c) { return !c; }).length;
        var toFix = items.map(function (li, n) { return chosen[n] && chosen[n] !== li.getAttribute("data-answer") ? n + 1 : 0; }).filter(Boolean);
        var p = document.createElement("p");
        p.className = "count";
        p.textContent = right + " of " + items.length + " right" +
          (toFix.length ? " · look again at sentence " + toFix.join(" and ") : "") +
          (missing ? " · " + missing + " not labelled yet" : "");
        result.appendChild(p);
        return;
      }
      setDone(true);
      // all four right: the paragraph is put back together in CREI order, in its colours
      var done = document.createElement("div");
      done.className = "verdict do fresh";
      done.innerHTML = "<strong>All four right. Here is the paragraph in CREI order:</strong>";
      var para = document.createElement("p");
      // the moves fall into place one after another, Claim to Impact: the order is the lesson
      ORDER.forEach(function (k, n) {
        var li = items.filter(function (x) { return x.getAttribute("data-answer") === k; })[0];
        var s = document.createElement("span");
        s.className = "crei rebuild " + k.toLowerCase();
        s.style.animationDelay = (n * 0.08 + 0.1) + "s";
        s.innerHTML = "<b>" + k + "</b>";
        s.appendChild(document.createTextNode(li.querySelector("p").textContent));
        para.appendChild(s);
        para.appendChild(document.createTextNode(" "));
      });
      done.appendChild(para);
      result.appendChild(done);
    });

    function setDone(done) {
      box.classList.toggle("solved", done);
      check.disabled = done;
      box.querySelectorAll(".letter").forEach(function (x) { x.disabled = done; });
    }

    again.addEventListener("click", function () {
      setDone(false);
      chosen = chosen.map(function () { return null; });
      items.forEach(function (li) {
        var v = li.querySelector(".verdict");
        if (v) v.remove();
        li.querySelectorAll(".letter").forEach(function (x) { x.classList.remove("right", "wrong"); x.setAttribute("aria-pressed", "false"); x.removeAttribute("aria-describedby"); });
      });
      result.textContent = "";
    });
  }

  /* ---------- Drill sets: one set of paragraphs at a time ---------- */
  // The set marks (sets.js) open one set at a time. Answers in a set are kept, so a student who comes
  // back to it sees where they left off; a set is finished when both its paragraphs are solved.
  function initDrillSets(box) {
    var sets = Array.prototype.slice.call(box.querySelectorAll(":scope > .drill-set"));
    if (sets.length < 2 || !window.CLYSets) return;
    window.CLYSets(box, sets[0], {
      name: "crei",
      // each set is two paragraphs on two different topics
      titles: sets.map(function (s) { return "2 paragraphs: " + s.getAttribute("data-title").split(" · ").join(", "); }),
      panels: sets,
      state: function (i) {
        var s = sets[i], drills = s.querySelectorAll("[data-drill]");
        return s.querySelectorAll("[data-drill].solved").length === drills.length ? "done"
          : s.querySelector(".letter[aria-pressed='true']") ? "started" : "";
      }
    });
  }

  document.querySelectorAll("[data-picker]").forEach(initPicker);
  document.querySelectorAll("[data-sets]").forEach(initDrillSets);
  document.querySelectorAll("[data-drill]").forEach(function (box, n) { if (!box.id) box.id = "drill" + (n + 1); initDrill(box); });
})();
