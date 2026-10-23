/* CLY English — S.1–S.3 vocab revision: a cloze passage per form, with guided hints */
(function () {
  "use strict";

  var h = CLY.h, bold = CLY.bold, clear = CLY.clear;
  var V = window.CLY_VOCAB, normalise = CLY.normalise;

  // "phrasal verb" counts as a verb, "noun/adjective" as either, and so on.
  var baseTypes = function (pos) {
    return pos.split("/").map(function (p) { return p.trim().replace(/^phrasal verb$|^verb phrase$/, "verb").replace(/^noun phrase$/, "noun"); });
  };
  // "a noun", "an adjective"
  var an = function (word) { return (/^[aeiou]/i.test(word) ? "an " : "a ") + word; };
  var samePos = function (a, b) { return baseTypes(a).some(function (t) { return baseTypes(b).indexOf(t) >= 0; }); };

  function VocabCloze(root, grade, passage) {
    var g = V.GRADES.filter(function (x) { return x.id === grade; })[0];
    var units = V.vocabLists[grade].units;
    var allWords = Object.keys(units).reduce(function (a, k) { return a.concat(units[k]); }, []);
    var showPos = grade === "s1"; // S.1 always shows the word class
    var blanks = passage.blanks;
    var ids = Object.keys(blanks).map(Number);
    var changedCount = ids.filter(function (id) { return blanks[id].changed; }).length;
    var inputs = {}, showHints = false, showList = false;

    var info = function (b) {
      if (b.pos && b.meaning) return b;
      var w = allWords.filter(function (w) { return w.word === b.word; })[0] || {};
      return Object.assign({}, w, b);
    };
    // Accept the answer with or without the given first letter typed again.
    var isCorrect = function (id) {
      var v = normalise(inputs[id] || ""), b = blanks[id];
      return !!v && (b.answers.indexOf(v) >= 0 || b.answers.indexOf(normalise(b.letter + v)) >= 0);
    };
    var fullAnswer = function (id) {
      var v = (inputs[id] || "").trim(), b = blanks[id];
      if (!v) return "";
      return v[0].toLowerCase() === b.letter && b.answers.indexOf(normalise(b.letter + v)) < 0 ? v : b.letter + v;
    };
    // If the student wrote a form of the right word (the listed word or one from its Parts of Speech table), that form.
    var wordForm = function (id) {
      var v = normalise(fullAnswer(id));
      if (!v) return null;
      var b = blanks[id];
      var item = allWords.filter(function (w) { return w.word === b.word; })[0];
      var stem = function (form) { return normalise(form).replace(/(es|e|y|s)$/, ""); };
      return [{ form: b.word, pos: b.listedPos || (item && item.pos) }].concat((item && item.family) || [])
        .filter(function (f) { return f.pos && normalise(f.form).split(" ").length === v.split(" ").length && v.indexOf(stem(f.form)) === 0; })
        .sort(function (x, y) { return stem(y.form).length - stem(x.form).length; })[0] || null;
    };
    var tried = function (id) { return !!(inputs[id] || "").trim(); };
    var checks = new CLY.Checks(ids, isCorrect, tried);

    // --- passage: each paragraph is followed by the notes for its own blanks ---
    var fields = {}, posTags = {}, notes = [];
    var para = passage.paragraphs.map(function (parts, pi) {
      var p = h("p", null, parts.map(function (part) {
        if (typeof part !== "number") return part;
        var b = blanks[part];
        var f = CLY.blank(part, {
          given: b.letter, label: "Blank " + part + ", starts with " + b.letter,
          oninput: function (e) { inputs[part] = e.target.value; checks.clearMark(part); f.mark(null); if (checks.checked) renderResults(); }
        });
        posTags[part] = h("span", { class: "pos", hidden: !showPos }, info(b).pos ? "(" + info(b).pos + ")" : "");
        f.appendChild(posTags[part]);
        fields[part] = f;
        return f;
      }));
      notes[pi] = { ids: parts.filter(function (x) { return typeof x === "number"; }), el: h("ul", { class: "marks para-notes", "aria-live": "polite" }) };
      return [p, notes[pi].el];
    });

    var hintBtn = showPos ? null : h("button", { type: "button", class: "btn-quiet", "aria-pressed": "false", onclick: function () {
      showHints = !showHints;
      hintBtn.setAttribute("aria-pressed", String(showHints));
      hintBtn.textContent = showHints ? "Hide parts of speech" : "Show parts of speech";
      ids.forEach(function (id) { posTags[id].hidden = !showHints; });
    } }, "Show parts of speech");

    var listEl = h("div", { hidden: true },
      Object.keys(units).map(function (unit) {
        return [h("h3", null, unit), h("ol", { class: "wordlist" }, units[unit].map(function (w) {
          return h("li", null, h("strong", null, w.word), " ", h("em", null, "(" + w.pos + ")"));
        }))];
      })
    );
    var listBtn = h("button", { type: "button", class: "btn-quiet", "aria-expanded": "false", onclick: function () {
      showList = !showList;
      listEl.hidden = !showList;
      listBtn.setAttribute("aria-expanded", String(showList));
      listBtn.textContent = showList ? "Hide vocabulary list" : "Show vocabulary list";
    } }, "Show vocabulary list");

    var checkBtn = h("button", { type: "button", class: "btn", onclick: function () {
      checks.check();
      ids.forEach(function (id) { fields[id].mark(checks.marks[id]); });
      checkBtn.textContent = "Check again";
      renderResults();
      CLY.scrollTo(results);
    } }, "Check answers");

    var results = h("div", { "aria-live": "polite" });

    // What the teacher writes next to a blank: a hint for a wrong answer, or a nudge to re-check a changed one.
    function note(id) {
      var b = info(blanks[id]);
      if (!checks.checked || !tried(id) || checks.marks[id] === true) return null;
      if (!(id in checks.marks)) return h("li", { class: "pending" }, "(" + id + ") Changed. Press “Check again” to mark it.");
      var form = wordForm(id);
      if (form) return h("li", { class: "hint" },
        h("strong", null, "(" + id + ") You wrote: ", h("em", null, fullAnswer(id))),
        b.pos && !samePos(form.pos, b.pos)
          ? h("span", { class: "more" }, "You've chosen the right word, but you need to ", h("strong", null, "change the part of speech"), ". You've written " + an(form.pos) + ", but the words around this blank need " + an(b.pos).split(" ")[0] + " ", h("strong", null, b.pos), ".", b.formNote ? h("span", { class: "more" }, b.formNote) : null)
          : h("span", { class: "more" }, "You've chosen the right word and the right part of speech. Now check its form: does it need a different tense, a plural, or an -ing ending?")
      );
      return h("li", { class: "hint" },
        h("strong", null, "(" + id + ") You wrote: ", h("em", null, fullAnswer(id))),
        b.clue ? h("span", { class: "more" }, "Read the passage again: " + b.clue) : null,
        checks.tries[id] > 1 ? h("span", { class: "more" },
          "Bigger clue: you need ", b.pos ? [an(b.pos).split(" ")[0] + " ", h("strong", null, b.pos)] : "a word", " from the list",
          b.changed ? ", in a different part of speech from the one on the list" : "",
          b.meaning ? ". The word on the list means “" + b.meaning + "”." : ".",
          b.changed && b.formNote ? h("span", { class: "more" }, b.formNote) : null
        ) : null
      );
    }
    function rightItem(id) {
      var b = info(blanks[id]);
      return h("li", { class: "do" },
        h("strong", null, "(" + id + ") " + fullAnswer(id)),
        normalise(b.word) !== b.answers[0] ? h("span", { class: "meta" }, " from ", h("em", null, b.word), b.changed ? ", " + b.listedPos : "") : null,
        b.pos ? h("span", { class: "meta" }, " · " + b.pos) : null,
        b.changed ? h("span", { class: "meta" }, " · part of speech changed") : null,
        b.meaning ? h("span", { class: "more" }, "Meaning: " + b.meaning) : null,
        b.changed && b.formNote ? h("span", { class: "more" }, b.formNote) : null
      );
    }

    function renderResults() {
      notes.forEach(function (n) { clear(n.el); n.ids.forEach(function (id) { var li = note(id); if (li) n.el.appendChild(li); }); });
      clear(results);
      if (!checks.checked) return;
      var right = ids.filter(function (id) { return checks.marks[id]; });
      results.appendChild(CLY.scoreboard({
        fixes: checks.toFix(), untried: checks.untried(),
        label: function (id) { return "blank " + id; },
        done: "Perfect! You know the words on your " + g.source + ".",
        scoreText: "Score: " + right.length + " / " + ids.length,
        next: function () { var id = checks.toFix()[0]; if (id) { CLY.scrollTo(fields[id]); fields[id].input.focus({ preventScroll: true }); } },
        extra: right.length ? h("details", { class: "got-right" }, h("summary", null, "Meanings of the words you got right (" + right.length + ")"), h("ul", { class: "marks" }, right.map(rightItem))) : null
      }));
    }

    function reset() {
      inputs = {}; checks.reset();
      ids.forEach(function (id) { fields[id].input.value = ""; fields[id].mark(null); });
      checkBtn.textContent = "Check answers";
      renderResults();
      CLY.scrollTo(root);
    }

    root.appendChild(h("div", { class: "tip" },
      h("p", { class: "field-label" }, "Instructions"),
      h("p", null, "Fill in each blank using ", h("strong", null, "one"), " appropriate word or phrase from the ", h("strong", null, g.source), ". Change the form if necessary. The first letter of the word or phrase is given."),
      changedCount ? h("p", null, h("strong", null, changedCount), " of the blanks need a ", h("strong", null, "different part of speech"), " from the one on the list (check the Parts of Speech tables on your worksheet). Look at the words around each blank to decide.") : null
    ));
    root.appendChild(h("div", { class: "passage" }, h("h3", null, passage.title), para));
    root.appendChild(h("div", { class: "actions" }, checkBtn, hintBtn, listBtn, h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start again")));
    root.appendChild(listEl);
    root.appendChild(results);
    // Unfinished work: something typed that isn't all marked right yet.
    return { unfinished: function () { return ids.some(function (id) { return tried(id) && checks.marks[id] !== true; }); } };
  }

  // Each form has several passages; "Try another passage" moves to the next one, and the page remembers which
  // passage this browser was on.
  function VocabSection(root, grade) {
    var passages = [V.VOCAB_FALLBACK[grade]].concat((V.EXTRA && V.EXTRA[grade]) || []);
    var key = "cly:vocab-passage:" + grade, n = 0, current = null;
    try { n = Math.min(Number(localStorage.getItem(key)) || 0, passages.length - 1); } catch (e) { n = 0; }
    var count = h("p", { class: "count", "aria-live": "polite" });
    var nextBtn = h("button", { type: "button", class: "btn-quiet", onclick: function () {
      if (current && current.unfinished() && !window.confirm("Start another passage? Your answers in this one will be cleared.")) return;
      show((n + 1) % passages.length, true);
    } }, "Try another passage");
    var body = h("div");

    function show(i, focus) {
      n = i;
      try { localStorage.setItem(key, String(n)); } catch (e) { /* storage blocked: just don't remember it */ }
      count.textContent = "Passage " + (n + 1) + " of " + passages.length + ": " + passages[n].title;
      clear(body);
      current = VocabCloze(body, grade, passages[n]);
      if (focus) { CLY.scrollTo(root); var first = body.querySelector(".blank input"); if (first) first.focus({ preventScroll: true }); }
    }

    if (passages.length > 1) root.appendChild(h("div", { class: "passage-switch" }, count, nextBtn));
    root.appendChild(body);
    show(n, false);
  }

  document.querySelectorAll("[data-vocab]").forEach(function (el) { VocabSection(el, el.getAttribute("data-vocab")); });
})();
