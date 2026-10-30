/* CLY English Weekly Challenge: the two papers (cloze and proofreading) as answer sheets, and the marked review.
   Unlike the practice exercises in grammar.js there is no "Check": answers are only marked by the league.
   Answer shapes match apps-script/Logic.gs: cloze { "3": "had drunk" }, proofreading { "4": { type, at, word } }. */
(function () {
  "use strict";
  var h = CLY.h, G = window.CLY_GRAMMAR;
  var S = window.CLY_CHALLENGE;
  var plural = function (n, word) { return n + " " + word + (n === 1 ? "" : "s"); };

  // ---------- Cloze ----------

  function clozeSheet(ch, answers, changed) {
    var crossed = {};
    var blanks = ch.paragraphs.reduce(function (n, parts) { return n + parts.filter(function (p) { return typeof p === "number"; }).length; }, 0);
    function boxItem(v, cls) {
      var b = h("button", { type: "button", class: cls, "aria-pressed": "false", onclick: function () {
        crossed[v] = !crossed[v];
        b.classList.toggle("used", crossed[v]);
        b.setAttribute("aria-pressed", String(crossed[v]));
      } }, v);
      return h("li", null, b);
    }
    function wordGroup(name, items) {
      return items && items.length ? h("div", { class: "word-group" }, h("p", { class: "word-group-name" }, name),
        h("ul", { class: "word-cells" }, items.map(function (v) { return boxItem(v, "word-cell"); }))) : null;
    }
    var bank = S.wordTable
      ? h("div", { class: "word-table" }, wordGroup("Verbs", ch.bank), wordGroup("Names and phrases", ch.phrases))
      : h("ul", { class: "chips" }, ch.bank.map(function (v) { return boxItem(v, "chip"); }));
    var passage = h("div", { class: "passage" }, ch.paragraphs.map(function (parts) {
      return h("p", null, parts.map(function (part) {
        if (typeof part !== "number") return part;
        var f = CLY.blank(part, { label: "Blank " + part, oninput: function (e) { answers[part] = e.target.value; changed(); } });
        f.input.id = f.input.name = "blank-" + part;
        if (answers[part]) f.input.value = answers[part];
        return f;
      }));
    }));
    return {
      el: [h("div", { class: "tip" },
        h("p", { class: "field-label" }, S.boxLabel), bank,
        h("p", null, S.boxHelp)), passage],
      progress: function () { return (blanks - empty()) + " / " + blanks + " filled"; },
      handInNote: function () { var n = empty(); return n ? n + (n === 1 ? " blank is" : " blanks are") + " still empty." : "Every blank is filled."; }
    };
    function empty() {
      return ch.paragraphs.reduce(function (n, parts) {
        return n + parts.filter(function (p) { return typeof p === "number" && !String(answers[p] || "").trim(); }).length;
      }, 0);
    }
  }

  // ---------- Proofreading ----------

  // One mark per line, made the same way as in the practice proofreading: tap a word, then change, add or delete.
  function proofSheet(ch, answers, changed) {
    var lines = ch.lines, editing = null, draft = "", cursor = {};
    var list = h("ol", { class: "proof" });
    var cursorAt = function (i) { return Math.min(cursor[i] || 0, lines[i].length - 1); };
    var wordButton = function (i, at) { return list.querySelector("[data-key='" + i + "-" + at + "']"); };

    function moveTo(i, at) {
      if (i < 0 || i >= lines.length) return;
      at = Math.max(0, Math.min(at, lines[i].length - 1));
      var old = wordButton(i, cursorAt(i));
      if (old) old.setAttribute("tabindex", "-1");
      cursor[i] = at;
      var b = wordButton(i, at);
      b.setAttribute("tabindex", "0"); b.focus();
    }
    function wordKeys(e, i, at) {
      var to = { ArrowRight: [i, at + 1], ArrowLeft: [i, at - 1], ArrowDown: [i + 1, at], ArrowUp: [i - 1, at], Home: [i, 0], End: [i, Infinity] }[e.key];
      if (!to) return;
      e.preventDefault();
      moveTo(to[0], to[1]);
    }

    function setAnswer(i, a) {
      if (a) answers[i] = a; else delete answers[i];
      var at = editing ? editing.at : 0;
      editing = null; draft = "";
      changed();
      draw(i);
      cursor[i] = Math.min(at, lines[i].length - 1);
      moveTo(i, cursor[i]);
    }
    function openWord(i, at) {
      var was = editing && editing.line;
      var a = answers[i];
      editing = { line: i, at: at };
      draft = a && a.at === at && a.word ? a.word : "";
      if (was != null && was !== i) draw(was);
      draw(i);
      list.children[i].querySelector(".editor input").focus();
    }

    function lineEl(i) {
      var a = answers[i], words = [];
      var caret = function (gap) {
        return a && a.type === "insert" && a.at === gap ? h("span", { class: "caret" }, h("b", null, a.word), h("i", { "aria-hidden": "true" }, "^")) : null;
      };
      lines[i].forEach(function (w, at) {
        var mine = a && a.type !== "insert" && a.at === at;
        var open = editing && editing.line === i && editing.at === at;
        words.push(caret(at));
        words.push(h("span", { class: "word-wrap" },
          mine && a.type === "replace" ? h("span", { class: "above" }, a.word) : null,
          h("button", { type: "button", class: "word" + (open ? " editing" : "") + (mine ? (a.type === "delete" ? " deleted" : " changed") : ""),
            "data-key": i + "-" + at, tabindex: at === cursorAt(i) ? "0" : "-1",
            "aria-label": "Line " + (i + 1) + ", word " + (at + 1) + ": " + w + (mine ? (a.type === "delete" ? " (deleted)" : " (changed to " + a.word + ")") : ""),
            onkeydown: function (e) { wordKeys(e, i, at); }, onclick: function () { openWord(i, at); } }, w)), " ");
      });
      words.push(caret(lines[i].length));
      // "No mistake" is a mark of its own; the server scores it the same as a line left alone
      var ok = a && a.type === "ok";
      var li = h("li", { role: "group", "aria-label": "Line " + (i + 1) }, h("div", { class: "proof-row" }, h("div", { class: "proof-text" }, words),
        h("button", { type: "button", class: "ok-btn", "data-key": "ok" + i, "aria-pressed": String(!!ok), onclick: function () { toggleOk(i); } }, "No mistake")));
      if (editing && editing.line === i) li.appendChild(editor(i));
      else if (a && !ok) li.appendChild(h("p", { class: "clear" }, h("button", { type: "button", class: "link-btn", onclick: function () { setAnswer(i, null); } }, "Clear my mark")));
      return li;
    }
    function toggleOk(i) {
      if (answers[i] && answers[i].type === "ok") delete answers[i]; else answers[i] = { type: "ok" };
      if (editing && editing.line === i) { editing = null; draft = ""; }
      changed();
      draw(i);
      list.querySelector("[data-key='ok" + i + "']").focus();
    }

    function editor(i) {
      var at = editing.at, plain = lines[i][at].replace(/[.,!?;:"]/g, "");
      var mk = function (text, act) { return h("button", { type: "button", class: "chip", onclick: act }, text); };
      var warn = h("p", { class: "warn", role: "alert" });
      var typed = function () { return draft.trim(); };
      var valid = function () { return !!typed() && !/\s/.test(typed()); };
      var sync = function () { warn.textContent = /\s/.test(typed()) ? "Type just one word. A correction is always a single word." : ""; };
      // Change and Add always respond: with no word typed yet, they say so and put the cursor in the box.
      var withWord = function (make) {
        return function () {
          if (valid()) return setAnswer(i, make(typed()));
          warn.textContent = typed() ? "Type just one word. A correction is always a single word." : "Type the word first, then choose.";
          input.focus();
        };
      };
      var close = function () { editing = null; draw(i); moveTo(i, at); };
      var input = h("input", { "aria-label": "Correction", autocomplete: "off", autocapitalize: "off", spellcheck: "false", placeholder: "one word", value: draft,
        oninput: function (e) { draft = e.target.value; sync(); },
        onkeydown: function (e) {
          if (e.key === "Enter" && valid()) setAnswer(i, { type: "replace", at: at, word: typed() });
          if (e.key === "Escape") close();
        } });
      var box = h("div", { class: "editor" },
        h("p", null, "Type a word, then choose what to do. To remove ", h("strong", null, "“" + plain + "”"), ", tap Delete."),
        h("div", { class: "row" }, input,
          mk("Change “" + plain + "” to my word", withWord(function (w) { return { type: "replace", at: at, word: w }; })),
          mk("Add before “" + plain + "”", withWord(function (w) { return { type: "insert", at: at, word: w }; })),
          mk("Add after “" + plain + "”", withWord(function (w) { return { type: "insert", at: at + 1, word: w }; })),
          mk("Delete “" + plain + "”", function () { setAnswer(i, { type: "delete", at: at }); }),
          mk("Cancel", close)),
        warn);
      sync();
      return box;
    }

    function draw(i) {
      var li = lineEl(i);
      if (list.children[i]) list.replaceChild(li, list.children[i]); else list.appendChild(li);
    }
    lines.forEach(function (_, i) { draw(i); });
    var marked = function () { return Object.keys(answers).length; };

    // The key is open until a student has seen it once here or in the practice proofreading, which shares the note.
    var seenKey = false;
    try { seenKey = !!localStorage.getItem("cly:proof-key"); localStorage.setItem("cly:proof-key", "1"); } catch (e) { seenKey = false; }

    return {
      el: [h("details", { class: "tip proof-help", open: !seenKey },
        h("summary", { class: "field-label" }, "How to mark a line"),
        h("ul", { class: "proof-key" },
          h("li", null, h("span", { class: "word-wrap" }, h("span", { class: "above" }, "built"), h("span", { class: "word changed" }, "build")), " change a word"),
          h("li", null, "look forward ", h("span", { class: "caret" }, h("b", null, "to"), h("i", null, "^")), " seeing: add a word"),
          h("li", null, "let him ", h("span", { class: "word deleted" }, "to"), " go: delete a word")),
        h("p", null, "Tap a word to change it, delete it or add a missing word next to it. If a line has no mistake, tap “No mistake”. Every line needs a mark: a line you leave blank scores nothing.")),
        list],
      progress: function () { return plural(marked(), "line") + " marked"; },
      handInNote: function () {
        var left = lines.length - marked();
        return "You've marked " + marked() + " of " + lines.length + " lines." + (left ? " " + plural(left, "line") + " without a mark: " + (left === 1 ? "it scores" : "they score") + " nothing, even if correct. Tap “No mistake” for a correct line." : "");
      }
    };
  }

  // ---------- The marked review, after the week closes ----------

  var tick = function (ok) { return h("span", { class: "visually-hidden" }, ok ? "Right: " : "Wrong: "); };

  // Each paragraph is followed by why its own blanks are right, so the reason sits next to the mark.
  function clozeReview(ch, answers, right) {
    return h("div", { class: "passage review" }, ch.paragraphs.map(function (parts) {
      var ids = parts.filter(function (p) { return typeof p === "number"; });
      var p = h("p", null, parts.map(function (part) {
        if (typeof part !== "number") return part;
        var ok = right[part], typed = String(answers[part] || "").trim();
        return h("span", { class: "answer " + (ok ? "right" : "wrong") },
          h("sup", null, part), tick(ok),
          typed ? (ok ? h("span", null, typed) : h("s", null, typed)) : h("span", { class: "none" }, "(empty)"),
          ok ? null : h("strong", { class: "fix" }, ch.blanks[part].answers[0]));
      }));
      var notes = ids.length ? h("ul", { class: "marks para-notes" }, ids.map(function (id) {
        var b = ch.blanks[id];
        return h("li", { class: right[id] ? "do" : "avoid" },
          h("strong", null, id + ". " + b.answers[0]), b.verb ? h("span", { class: "meta" }, " (" + b.verb + ")") : null,
          b.why ? h("span", { class: "more" }, b.why) : null);
      })) : null;
      return [p, notes];
    }));
  }

  // The grammar topics of the lines or blanks a student got wrong (only S.3's cloze blanks carry a topic).
  function missedTopics(ch, right) {
    var missed = ch.format === "cloze"
      ? Object.keys(ch.blanks).filter(function (id) { return !right[id] && ch.blanks[id].topic; }).map(function (id) { return ch.blanks[id].topic; })
      : ch.lines.filter(function (l, i) { return !right[i] && l[1]; }).map(function (l) { return l[1]; });
    return missed.filter(function (t, i, all) { return all.indexOf(t) === i; });
  }

  function fixText(line) {
    var e = line.error;
    if (!e) return "No mistake in this line.";
    if (e.type === "replace") return ["Change ", h("s", null, line.words[e.at]), " to ", h("strong", null, e.answers[0]), "."];
    if (e.type === "insert") return ["Add ", h("strong", null, e.answers[0]), " before “" + (line.words[e.at] || "the end") + "”."];
    return ["Delete ", h("s", null, line.words[e.at]), "."];
  }

  function proofReview(ch, answers, right) {
    return h("ol", { class: "proof review" }, ch.lines.map(function (l, i) {
      var line = G.parseProofLine(l[0]), a = answers[i], ok = right[i];
      var mine = a && ["replace", "insert", "delete"].indexOf(a.type) >= 0 ? a : null;
      var words = [];
      line.words.forEach(function (w, at) {
        if (mine && mine.type === "insert" && mine.at === at) words.push(h("span", { class: "caret" }, h("b", null, mine.word), h("i", { "aria-hidden": "true" }, "^")), " ");
        var marked = mine && mine.type !== "insert" && mine.at === at;
        words.push(h("span", { class: "word-wrap" },
          marked && mine.type === "replace" ? h("span", { class: "above" }, mine.word) : null,
          h("span", { class: "word" + (marked ? (mine.type === "delete" ? " deleted" : " changed") : "") }, w)), " ");
      });
      if (mine && mine.type === "insert" && mine.at === line.words.length) words.push(h("span", { class: "caret" }, h("b", null, mine.word), h("i", { "aria-hidden": "true" }, "^")));
      return h("li", { class: ok ? "right" : "wrong", "aria-label": "Line " + (i + 1) + (ok ? ", right" : ", wrong") },
        h("div", { class: "proof-text" }, words),
        h("p", { class: "fix-note" }, tick(ok), fixText(line), l[2] ? h("span", { class: "meta" }, " " + l[2]) : null,
          a ? null : h("span", { class: "meta" }, " You didn't mark this line.")));
    }));
  }

  window.CLY_PAPERS = {
    sheet: function (ch, answers, changed) { return ch.format === "cloze" ? clozeSheet(ch, answers, changed) : proofSheet(ch, answers, changed); },
    review: function (ch, answers, right) { return ch.format === "cloze" ? clozeReview(ch, answers, right) : proofReview(ch, answers, right); },
    missedTopics: missedTopics
  };
})();
