/* CLY English — S.4 grammar: the 12 tenses, proofreading lessons and exercise, and conditionals */
(function () {
  "use strict";

  var h = CLY.h, s = CLY.s, bold = CLY.bold, clear = CLY.clear, normalise = CLY.normalise;
  var G = window.CLY_GRAMMAR;
  var widgets = {};

  // Moves to another part of the page, and to the right tense, conditional or lesson in it.
  var reviewTense = function (name) { widgets.matrix && widgets.matrix.select(name); CLY.go("matrix"); };
  var reviewConditional = function (name) { widgets.condmatrix && widgets.condmatrix.select(name); CLY.go("condmatrix"); };

  // Formulas break only at spaces, never inside "V-ing" or "V3-": a non-breaking hyphen keeps each piece whole.
  var keepHyphens = function (t) { return t.replace(/-/g, "‑"); };

  // Keeps keyboard focus on the same control when a part of the page is redrawn.
  function redraw(container, build) {
    var active = document.activeElement, key = active && container.contains(active) ? active.getAttribute("data-key") : null;
    clear(container);
    build(container);
    if (key) { var again = container.querySelector("[data-key='" + key + "']"); if (again && !again.disabled) again.focus(); }
  }

  function label(x, y, text, cls, anchor) {
    var half = String(text).length * 4.2;
    var cx = anchor ? x : Math.min(Math.max(x, half + 6), 600 - half - 6);
    return s("text", { x: cx, y: y, "text-anchor": anchor || "middle", class: cls || "ink" }, text);
  }
  function arrowDefs(id, cls) {
    return s("marker", { id: id, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto" }, s("path", { d: "M0,0 L10,5 L0,10 z", class: cls }));
  }

  // ---------- The Tense Matrix ----------

  var tenseTimelines = G.tenseTimelines;
  function TenseTimeline(tense, example) {
    var items = tenseTimelines[tense] || [];
    var X = function (at) { return 40 + at * 5.2; }, AXIS = 90;
    var g = items.map(function (it) {
      if (it.type === "point") {
        var y = it.below ? AXIS + 28 : AXIS - 20;
        return s("g", null,
          s("line", { x1: X(it.at), y1: AXIS - 10, x2: X(it.at), y2: AXIS + 10, class: "ink-line", "stroke-width": "3" }),
          s("circle", { cx: X(it.at), cy: AXIS, r: "7", class: "ink" }),
          label(X(it.at), y, it.label, it.below ? "copper" : "ink"));
      }
      if (it.type === "span") return s("g", null,
        s("rect", { x: X(it.from), y: AXIS - 9, width: X(it.to) - X(it.from), height: "18", rx: "9", class: "span" }),
        label((X(it.from) + X(it.to)) / 2, AXIS - 20, it.label));
      if (it.type === "result") return s("g", null,
        s("path", { d: "M" + X(it.from) + "," + AXIS + " Q" + (X(it.from) + X(it.to)) / 2 + "," + (AXIS - 40) + " " + (X(it.to) - 3) + "," + (AXIS - 4), class: "green-line", "stroke-width": "2", "stroke-dasharray": "5 3", "marker-end": "url(#tl-res)" }),
        s("circle", { cx: X(it.from), cy: AXIS, r: "7", class: "ink" }),
        label(X(it.from), AXIS - 44, it.label),
        label((X(it.from) + X(it.to)) / 2 + 10, AXIS + 24, "result still matters now", "green"));
      if (it.type === "repeat") {
        var marks = [];
        for (var a = it.from; a <= it.to; a += 10) marks.push(s("line", { x1: X(a), y1: AXIS - 8, x2: X(a), y2: AXIS + 8, class: "ink-line", "stroke-width": "3", "stroke-linecap": "round" }));
        return s("g", null, marks, label(X(50), AXIS - 20, it.label));
      }
      if (it.type === "ref") return s("g", null,
        s("line", { x1: X(it.at), y1: AXIS - 30, x2: X(it.at), y2: AXIS + 12, class: "soft-line", "stroke-width": "1.5", "stroke-dasharray": "3 3" }),
        label(X(it.at), AXIS + 28, it.label, "copper"));
      return null;
    });
    return h("figure", { class: "figure" },
      h("p", { class: "field-label" }, "Timeline"),
      h("p", null, h("em", null, "“" + example + "”")),
      s("svg", { viewBox: "0 0 600 150", role: "img", "aria-label": "Timeline for " + tense + ": " + example },
        s("defs", null, arrowDefs("tl-arrow", "soft"), arrowDefs("tl-res", "green")),
        s("line", { x1: "20", y1: AXIS, x2: "585", y2: AXIS, class: "axis", "marker-end": "url(#tl-arrow)" }),
        s("text", { x: "24", y: AXIS + 48, class: "soft small" }, "PAST"),
        s("text", { x: "580", y: AXIS + 48, class: "soft small", "text-anchor": "end" }, "FUTURE"),
        s("line", { x1: X(50), y1: AXIS - 14, x2: X(50), y2: AXIS + 14, class: "now" }),
        s("text", { x: X(50), y: AXIS + 48, class: "copper small", "text-anchor": "middle" }, "NOW"),
        g));
  }

  function TenseMatrix(root) {
    var selected = "Present Perfect";
    var table = h("div", { class: "matrix-wrap wide-only" });
    var picker = h("div", { class: "picker phone-only" });
    var detail = h("div", { class: "detail" });

    function drawTable() {
      redraw(table, function (el) {
        el.appendChild(h("table", { class: "matrix" },
          h("thead", null, h("tr", null, h("th", null, h("span", { class: "visually-hidden" }, "Time")), G.ASPECTS.map(function (a) { return h("th", { scope: "col", class: "field-label" }, a); }))),
          h("tbody", null, G.TIMES.map(function (t) {
            return h("tr", null, h("th", { scope: "row" }, t), G.ASPECTS.map(function (a) {
              var name = t + " " + a;
              return h("td", null, h("button", { type: "button", class: "cell", "data-key": name, "aria-pressed": String(name === selected), onclick: function () { select(name); CLY.replay(detail, "swap"); } },
                h("span", { class: "cell-name" }, name), h("small", null, keepHyphens(G.tenseMatrix[name].formula))));
            }));
          }))
        ));
      });
      // phones get the same choice as two short rows: a time, then an aspect
      var time = G.TIMES.filter(function (t) { return selected.indexOf(t + " ") === 0; })[0], aspect = selected.slice(time.length + 1);
      var row = function (lab, items, current, make) {
        return h("div", { role: "group", "aria-label": lab }, h("p", { class: "field-label" }, lab), h("ul", { class: "chips" }, items.map(function (x) {
          return h("li", null, h("button", { type: "button", class: "chip", "data-key": lab + x, "aria-pressed": String(x === current), onclick: function () { select(make(x)); CLY.replay(detail, "swap"); } }, x));
        })));
      };
      redraw(picker, function (el) {
        el.appendChild(row("Time", G.TIMES, time, function (x) { return x + " " + aspect; }));
        el.appendChild(row("Aspect", G.ASPECTS, aspect, function (x) { return time + " " + x; }));
      });
    }
    function drawDetail() {
      var info = G.tenseMatrix[selected];
      clear(detail).appendChild(h("div", null,
        h("div", { class: "detail-head" }, h("h3", null, selected)),
        h("dl", { class: "summary" },
          h("div", null, h("dt", null, "Formula"), h("dd", null, info.formula)),
          h("div", null, h("dt", null, "Keywords"), h("dd", null, info.signals))),
        h("p", null, h("strong", null, "When to use it: "), info.use),
        h("p", { class: "field-label" }, "Examples"),
        h("ul", { class: "marks" }, info.examples.map(function (ex) { return h("li", { class: "do" }, ex); })),
        TenseTimeline(selected, info.examples[0]),
        h("div", { class: "tip" }, h("p", { class: "field-label" }, "Exam tip"), h("p", null, info.tip))
      ));
    }
    function select(name) { selected = name; drawTable(); drawDetail(); }

    root.appendChild(table);
    root.appendChild(picker);
    root.appendChild(detail);
    select(selected);
    return { select: function (name) { select(name); CLY.replay(detail, "swap"); } };
  }

  // ---------- MC quiz (tenses and conditionals) ----------

  var TENSE_KIT = {
    topicOf: function (q) { return q.tense; },
    formula: function (t) { return G.tenseMatrix[t] && G.tenseMatrix[t].formula; },
    genericHint: G.GENERIC_TENSE_HINT,
    where: "the Tense Matrix",
    section: "matrix",
    bigClue: "ask two questions. When does it happen: past, present or future? Is the action finished, still in progress, or going on up to a certain time? Then find that tense in the Tense Matrix.",
    review: reviewTense,
    reviewHeading: "Tenses to review in the Tense Matrix:",
    fullMarks: "Full marks! Now try the tenses cloze to use these tenses in a story."
  };
  var COND_KIT = {
    topicOf: function (q) { return q.conditional; },
    formula: function (c) { var m = G.conditionalMatrix[c]; return m && m.ifPart + ", " + m.mainPart; },
    genericHint: G.GENERIC_COND_HINT,
    where: "the Conditionals Matrix",
    section: "condmatrix",
    bigClue: "ask two questions. Is it real or imaginary? Is it about always, the future, now or the past? Then find that conditional in the Conditionals Matrix.",
    review: reviewConditional,
    reviewHeading: "Conditionals to review in the Conditionals Matrix:",
    fullMarks: "Full marks! Now try Match & change to use the conditionals yourself."
  };

  function reviewLink(topic, where, review) {
    return h("button", { type: "button", class: "link-btn", onclick: function () { review(topic); } }, "Review " + topic + " in " + where);
  }

  function McQuiz(root, questions, kit) {
    // Each answer is marked the moment it's chosen, the way a teacher ticks down the page.
    var answers = {}, wrong = {}, fresh = new CLY.Fresh();
    var solved = function (i) { return answers[i] === questions[i].answer; };
    var count = h("p", { class: "count", "aria-live": "polite" });
    var summary = h("div", { "aria-live": "polite" });
    var boxes = questions.map(function () { return h("div", { class: "question" }); });
    var actions = h("div", { class: "actions" }, h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start again"));

    function choose(i, j) {
      answers[i] = j;
      if (j !== questions[i].answer) (wrong[i] = wrong[i] || []).push(j);
      drawQuestion(i); drawProgress(); drawSummary();
    }
    function drawQuestion(i) {
      var q = questions[i], submitted = i in answers, done = solved(i), topic = kit.topicOf(q);
      redraw(boxes[i], function (el) {
        el.appendChild(h("p", { class: "question-text" }, h("span", { class: "n" }, (i + 1) + "."), q.q));
        el.appendChild(h("div", { class: "choices" }, q.options.map(function (opt, j) {
          var crossed = submitted && wrong[i] && wrong[i].indexOf(j) >= 0;
          var mark = done && j === q.answer ? "right" : crossed ? "crossed" : "";
          var cls = "choice" + (mark ? " " + mark : done ? " faded" : "") + (fresh.is(i + "-" + j, mark) ? " fresh" : "");
          return h("button", { type: "button", class: cls, "data-key": i + "-" + j, disabled: done || crossed, "aria-pressed": String(answers[i] === j), onclick: function () { choose(i, j); } },
            h("b", null, String.fromCharCode(65 + j) + "."), opt);
        })));
        var note = done ? "do" : submitted ? "hint" + (wrong[i] || []).length : "";
        var isNew = fresh.is("v" + i, note) ? " fresh" : "";
        if (done) el.appendChild(h("div", { class: "verdict do" + isNew },
          h("strong", null, wrong[i] ? "Well done, you got there!" : "Correct!"), q.explanation,
          wrong[i] ? h("p", null, reviewLink(topic, kit.where, kit.review)) : null));
        else if (submitted) el.appendChild(h("div", { class: "verdict hint" + isNew },
          h("strong", null, "Not quite. Have another go."), q.hint || kit.genericHint,
          // the bigger clue sends the student to the matrix to find the answer, without naming it
          (wrong[i] || []).length > 1 ? h("p", null, "Bigger clue: " + kit.bigClue + " ",
            h("button", { type: "button", class: "link-btn", onclick: function () { CLY.go(kit.section); } }, "Open " + kit.where)) : null));
      });
    }
    function drawProgress() {
      var n = Object.keys(answers).length;
      var solvedCount = questions.filter(function (q, i) { return solved(i); }).length;
      // the set's title already says how many questions there are, so the count waits for the first answer
      count.hidden = !n;
      count.textContent = !n ? "" : solvedCount + " of " + questions.length + " solved" + (n > solvedCount ? " · " + (n - solvedCount) + " still to fix" : "");
      actions.hidden = !n;
    }
    function drawSummary() {
      clear(summary);
      var solvedCount = questions.filter(function (q, i) { return solved(i); }).length;
      if (solvedCount < questions.length) return;
      var firstTry = questions.filter(function (q, i) { return !wrong[i]; }).length;
      var toReview = questions.filter(function (q, i) { return wrong[i]; }).map(kit.topicOf).filter(function (t, i, a) { return a.indexOf(t) === i; });
      summary.appendChild(h("div", { class: "scoreboard done" },
        h("p", { class: "score" }, "All " + questions.length + " solved."),
        firstTry === questions.length ? h("p", null, kit.fullMarks) : null,
        toReview.length ? [h("p", { class: "field-label" }, kit.reviewHeading), h("ul", { class: "chips" }, toReview.map(function (t) {
          return h("li", null, h("button", { type: "button", class: "chip", onclick: function () { kit.review(t); } }, t));
        }))] : null,
        h("p", { class: "meta" }, "Right first time: " + firstTry + " / " + questions.length)
      ));
    }
    function reset() {
      answers = {}; wrong = {}; fresh = new CLY.Fresh();
      questions.forEach(function (q, i) { drawQuestion(i); });
      drawProgress(); drawSummary();
      CLY.scrollTo(root);
    }

    root.appendChild(count);
    boxes.forEach(function (b) { root.appendChild(b); });
    root.appendChild(summary);
    root.appendChild(actions);
    questions.forEach(function (q, i) { drawQuestion(i); });
    drawProgress();
  }

  // ---------- Cloze passage (tenses) ----------

  function Cloze(root, passage) {
    var blanks = passage.blanks, ids = Object.keys(blanks).map(Number);
    var inputs = {}, crossed = {}, showTenses = false;
    var bank = ids.map(function (id) { return blanks[id].verb; }).concat(passage.distractors)
      .filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
    var tried = function (id) { return !!(inputs[id] || "").trim(); };
    var checks = new CLY.Checks(ids, function (id) { return blanks[id].answers.indexOf(normalise(inputs[id] || "")) >= 0; }, tried);
    var fields = {}, tags = {}, notes = [];
    var results = h("div", { "aria-live": "polite" });

    var chips = h("ul", { class: "chips" }, bank.map(function (v) {
      var b = h("button", { type: "button", class: "chip", "aria-pressed": "false", onclick: function () {
        crossed[v] = !crossed[v];
        b.classList.toggle("used", crossed[v]);
        b.setAttribute("aria-pressed", String(crossed[v]));
      } }, v);
      return h("li", null, b);
    }));

    // Each paragraph is followed by the notes for its own blanks.
    var paras = passage.paragraphs.map(function (parts, pi) {
      var p = h("p", null, parts.map(function (part) {
        if (typeof part !== "number") return part;
        var f = CLY.blank(part, { label: "Blank " + part, oninput: function (e) {
          inputs[part] = e.target.value; checks.clearMark(part); f.mark(null); if (checks.checked) drawResults();
        } });
        tags[part] = h("span", { class: "pos", hidden: true }, "(" + blanks[part].tense + ")");
        f.appendChild(tags[part]);
        fields[part] = f;
        return f;
      }));
      notes[pi] = { ids: parts.filter(function (x) { return typeof x === "number"; }), el: h("ul", { class: "marks para-notes", "aria-live": "polite" }) };
      return [p, notes[pi].el];
    });

    var tenseBtn = h("button", { type: "button", class: "btn-quiet", "aria-pressed": "false", onclick: function () {
      showTenses = !showTenses;
      tenseBtn.setAttribute("aria-pressed", String(showTenses));
      tenseBtn.textContent = showTenses ? "Hide tense hints" : "Show tense hints";
      ids.forEach(function (id) { tags[id].hidden = !showTenses; });
    } }, "Show tense hints");
    var checkBtn = h("button", { type: "button", class: "btn", onclick: function () {
      checks.check();
      ids.forEach(function (id) { fields[id].mark(checks.marks[id]); });
      checkBtn.textContent = "Check again";
      drawResults();
      CLY.scrollTo(results);
    } }, "Check answers");

    function note(id) {
      var b = blanks[id], typed = (inputs[id] || "").trim();
      if (!checks.checked || !typed || checks.marks[id] === true) return null;
      if (!(id in checks.marks)) return h("li", { class: "pending" }, id + ". Changed. Press “Check again” to mark it.");
      return h("li", { class: "hint" },
        h("strong", null, id + ". You wrote: ", h("em", null, typed)),
        h("span", { class: "more" }, b.hint || G.GENERIC_TENSE_HINT),
        checks.tries[id] > 1 && G.tenseMatrix[b.tense] ? h("span", { class: "more" }, "Bigger clue: you need the ", h("strong", null, b.tense), " (" + G.tenseMatrix[b.tense].formula + "). ", reviewLink(b.tense, "the Tense Matrix", reviewTense)) : null);
    }
    function drawResults() {
      notes.forEach(function (n) { clear(n.el); n.ids.forEach(function (id) { var li = note(id); if (li) n.el.appendChild(li); }); });
      clear(results);
      if (!checks.checked) return;
      var right = ids.filter(function (id) { return checks.marks[id]; });
      results.appendChild(CLY.scoreboard({
        fixes: checks.toFix(), untried: checks.untried(),
        label: function (id) { return "blank " + id; },
        done: "Perfect! You used all " + ids.length + " tenses correctly.",
        scoreText: "Score: " + right.length + " / " + ids.length,
        next: function () { var id = checks.toFix()[0]; if (id) { CLY.scrollTo(fields[id]); fields[id].input.focus({ preventScroll: true }); } },
        extra: right.length ? h("details", { class: "got-right" }, h("summary", null, "Explanations for the blanks you got right (" + right.length + ")"),
          h("ul", { class: "marks" }, right.map(function (id) {
            var b = blanks[id];
            return h("li", { class: "do" }, h("strong", null, id + ". " + (inputs[id] || "").trim()), h("span", { class: "meta" }, " (" + b.verb + " → " + b.tense + ")"), h("span", { class: "more" }, b.why));
          }))) : null
      }));
    }
    function reset() {
      inputs = {}; crossed = {}; checks.reset();
      ids.forEach(function (id) { fields[id].input.value = ""; fields[id].mark(null); });
      chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("used"); c.setAttribute("aria-pressed", "false"); });
      checkBtn.textContent = "Check answers";
      drawResults();
      CLY.scrollTo(root);
    }

    root.appendChild(h("div", { class: "tip" },
      h("p", { class: "field-label" }, "Verb bank"),
      chips,
      h("p", null, "Tap a verb to cross it off once you've used it.")));
    root.appendChild(h("div", { class: "passage" }, paras));
    root.appendChild(h("div", { class: "actions" }, checkBtn, tenseBtn, h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start again")));
    root.appendChild(results);
  }

  // ---------- Lesson visuals ----------

  var cap = function (t) { return t[0].toUpperCase() + t.slice(1); };

  function PassiveDiagram() {
    var n = 0, wrap = h("div");
    function draw() {
      var ex = G.PASSIVE_EXAMPLES[n];
      var W = function (text) { return text.length * 8.2 + 28; };
      var row = function (parts) { var x = 10; return parts.map(function (p) { var b = Object.assign({}, p, { x: x, w: W(p.text) }); x += b.w + 12; return b; }); };
      var active = row([{ role: "doer", text: ex.doer }, { role: "action", text: ex.action }, { role: "receiver", text: ex.receiver }].concat(ex.tail ? [{ role: "tail", text: ex.tail }] : []));
      var passive = row([{ role: "receiver", text: cap(ex.receiver) }, { role: "action", text: ex.passive }].concat(ex.tail ? [{ role: "tail", text: ex.tail }] : []).concat([{ role: "doer", text: ex.dropBy ? "(by someone)" : "by " + ex.doer.toLowerCase(), faded: ex.dropBy }]));
      var width = Math.max(600, Math.max.apply(null, [active, passive].map(function (r) { return r[r.length - 1].x + r[r.length - 1].w + 10; })));
      var find = function (r, role) { return r.filter(function (b) { return b.role === role; })[0]; };
      var box = function (b, y) {
        return s("g", { opacity: b.faded ? "0.5" : "1" },
          s("rect", { x: b.x, y: y, width: b.w, height: "34", rx: "10", class: "box box-" + b.role, "stroke-dasharray": b.faded ? "4 3" : null }),
          s("text", { x: b.x + b.w / 2, y: y + 22, "text-anchor": "middle", class: "ink", style: "font-size:14px" }, b.text));
      };
      var arrow = function (role) {
        var a = find(active, role), p = find(passive, role), x1 = a.x + a.w / 2, x2 = p.x + p.w / 2;
        return s("path", { d: "M" + x1 + ",62 C" + x1 + ",98 " + x2 + ",98 " + x2 + ",126", class: role === "action" ? "copper-line" : "soft-line", "stroke-width": "2", "marker-end": "url(#pv-" + (role === "action" ? "c" : "s") + ")" });
      };
      redraw(wrap, function (el) {
        el.appendChild(h("ul", { class: "chips" }, G.PASSIVE_EXAMPLES.map(function (e, i) {
          return h("li", null, h("button", { type: "button", class: "chip", "data-key": "pv" + i, "aria-pressed": String(i === n), onclick: function () { n = i; draw(); } }, e.tense));
        })));
        el.appendChild(h("figure", { class: "figure" }, s("svg", { viewBox: "0 0 " + width + " 178", role: "img", "aria-label": "Active: " + ex.doer + " " + ex.action + " " + ex.receiver + ". Passive: " + cap(ex.receiver) + " " + ex.passive + "." },
          s("defs", null, arrowDefs("pv-c", "copper"), arrowDefs("pv-s", "soft")),
          s("text", { x: "10", y: "14", class: "soft small" }, "ACTIVE"),
          active.map(function (b) { return box(b, 22); }),
          ["doer", "action", "receiver"].map(arrow),
          s("text", { x: "10", y: "176", class: "soft small" }, "PASSIVE"),
          passive.map(function (b) { return box(b, 130); })),
          h("ul", { class: "legend" },
            h("li", null, h("i", { class: "k-doer" }), "doer (who does it)"),
            h("li", null, h("i", { class: "k-action" }), "action: ", h("strong", null, "be + V3"), " in the same tense"),
            h("li", null, h("i", { class: "k-receiver" }), "receiver (what the action is done to)"))));
        if (ex.dropBy) el.appendChild(h("p", null, "“By someone” tells the reader nothing, so we leave it out: ", h("em", null, "My Octopus card has been stolen.")));
      });
    }
    draw();
    return wrap;
  }

  function PassiveTenseTable() {
    return [h("div", { class: "table-wrap stack" }, h("table", null,
      h("thead", null, h("tr", null, h("th", { scope: "col" }, "Tense"), h("th", { scope: "col" }, "Passive form"), h("th", { scope: "col" }, "Example"))),
      h("tbody", null, G.PASSIVE_TENSES.map(function (r) { return h("tr", null, h("th", { scope: "row" }, r[0]), h("td", null, h("span", { class: "formula" }, r[1])), h("td", null, bold(r[2]))); })))),
      h("p", null, "The tense lives in ", h("strong", null, "be"), ". The main verb is always the past participle (V3).")];
  }

  function GerundSlots() {
    var gerund = true, wrap = h("div");
    function draw() {
      redraw(wrap, function (el) {
        el.appendChild(h("ul", { class: "chips" }, [[false, "Fill with a noun"], [true, "Fill with a gerund"]].map(function (o) {
          return h("li", null, h("button", { type: "button", class: "chip", "data-key": String(o[0]), "aria-pressed": String(gerund === o[0]), onclick: function () { gerund = o[0]; draw(); } }, o[1]));
        })));
        el.appendChild(h("ul", { class: "slots" }, G.NOUN_SLOTS.map(function (sl) {
          return h("li", null, h("span", { class: "role" }, sl.role), h("span", null, sl.before, h("span", { class: "slot" + (gerund ? "" : " noun") }, gerund ? sl.gerund : sl.noun), sl.after));
        })));
        el.appendChild(h("p", null, "Both fit the same slot, because a gerund ", h("strong", null, "is a noun made from a verb"), ". Unlike a plain noun, it can still take its own object: ", h("em", null, "playing football"), ", ", h("em", null, "solving problems"), "."));
      });
    }
    draw();
    return wrap;
  }

  function OrderTimeline(first, second) {
    return s("svg", { viewBox: "0 0 300 74", class: "narrow", role: "img", "aria-label": "First: " + first + ". Then: " + second + "." },
      s("line", { x1: "10", y1: "42", x2: "286", y2: "42", class: "axis" }),
      s("path", { d: "M284,37 L292,42 L284,47 z", class: "soft" }),
      [[80, first, "1"], [220, second, "2"]].map(function (p) {
        return s("g", null, s("circle", { cx: p[0], cy: "42", r: "7", class: "copper" }), s("text", { x: p[0], y: "24", "text-anchor": "middle", class: "ink", style: "font-size:13px" }, p[2] + ". " + p[1]));
      }),
      s("text", { x: "10", y: "68", class: "soft", style: "font-size:11px" }, "earlier"),
      s("text", { x: "290", y: "68", class: "soft", "text-anchor": "end", style: "font-size:11px" }, "later"));
  }

  function MeaningPairs() {
    var n = 0, wrap = h("div");
    function draw() {
      var p = G.MEANING_PAIRS[n];
      redraw(wrap, function (el) {
        el.appendChild(h("ul", { class: "chips" }, G.MEANING_PAIRS.map(function (m, i) {
          return h("li", null, h("button", { type: "button", class: "chip", "data-key": m.verb, "aria-pressed": String(i === n), onclick: function () { n = i; draw(); } }, m.verb));
        })));
        el.appendChild(h("div", { class: "pairs" }, [["ing", p.verb + " + V-ing"], ["to", p.verb + " + to-infinitive"]].map(function (k) {
          var side = p[k[0]];
          return h("div", null, h("p", { class: "field-label" }, k[1]), h("p", null, bold(side.s)), h("p", { class: "meaning" }, side.m),
            side.t ? h("div", { class: "figure" }, OrderTimeline(side.t[0], side.t[1])) : null);
        })));
        if (n < 4) el.appendChild(h("p", null, "Pattern: with ", h("strong", null, "V-ing"), " the action usually happens ", h("strong", null, "first"), "; with the ", h("strong", null, "to-infinitive"), " it comes ", h("strong", null, "after"), ". “To” points forward."));
      });
    }
    draw();
    return wrap;
  }

  function VerbPatterns() {
    return h("ul", { class: "patterns" }, G.VERB_PATTERNS.map(function (g) {
      return h("li", null, h("p", { class: "field-label" }, "verb " + g.label),
        h("ul", { class: "chips" }, g.verbs.map(function (v) { return h("li", null, v); })),
        h("p", null, bold(g.example)));
    }));
  }

  var VISUALS = { "passive-diagram": PassiveDiagram, "passive-tenses": PassiveTenseTable, "gerund-slots": GerundSlots, "meaning-pairs": MeaningPairs, "verb-patterns": VerbPatterns };

  // ---------- Lessons: passive voice, gerunds, to-infinitives ----------

  function Lesson(root, lesson) {
    root.appendChild(h("p", { class: "lead" }, lesson.intro));

    root.appendChild(h("h3", null, "Form"));
    root.appendChild(h("div", { class: "table-wrap stack" }, h("table", null,
      h("thead", null, h("tr", null, h("th", { scope: "col" }, "Pattern"), h("th", { scope: "col" }, "Formula"), h("th", { scope: "col" }, "Example"))),
      h("tbody", null, lesson.form.map(function (f) { return h("tr", null, h("th", { scope: "row" }, f.label), h("td", null, h("span", { class: "formula" }, f.formula)), h("td", null, bold(f.example))); })))));
    if (lesson.spelling) root.appendChild(h("div", null, h("p", { class: "field-label" }, "Spelling the -ing form"), h("ul", null, lesson.spelling.map(function (sp) { return h("li", null, sp); }))));

    root.appendChild(h("h3", null, lesson.visualTitle));
    root.appendChild(h("div", null, VISUALS[lesson.visual]()));

    root.appendChild(h("h3", null, "When to use it"));
    root.appendChild(h("ol", { class: "lesson-functions" }, lesson.functions.map(function (f) {
      return h("li", null, h("strong", null, f.title), h("p", null, f.text), h("ul", null, f.examples.map(function (ex) { return h("li", null, bold(ex)); })));
    })));

    if (lesson.extra) {
      root.appendChild(h("h3", null, lesson.extraTitle));
      root.appendChild(h("div", null, VISUALS[lesson.extra]()));
    }
    if (lesson.compare) {
      root.appendChild(h("h3", null, lesson.compare.title));
      root.appendChild(h("p", null, lesson.compare.text));
      root.appendChild(h("div", { class: "compare" }, lesson.compare.rows.map(function (r) {
        return h("div", null, h("p", { class: "field-label" }, r[0]), h("p", null, bold(r[1])), h("p", { class: "note-line" }, r[2]));
      })));
    }

    root.appendChild(h("h3", null, "Common mistakes: spot the error"));
    root.appendChild(h("ul", { class: "spot" }, lesson.mistakes.map(function (m) {
      var btn = h("button", { type: "button", "aria-expanded": "false", onclick: function () {
        var open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        ask.hidden = open; fix.hidden = !open; why.hidden = !open;
      } });
      var ask = h("span", { class: "ask" }, "Can you spot the mistake? Tap to check.");
      var fix = h("span", { class: "fix", hidden: true }, m.right);
      var why = h("span", { class: "why", hidden: true }, m.why);
      btn.appendChild(h("span", { class: "wrong" }, m.wrong));
      btn.appendChild(ask); btn.appendChild(fix); btn.appendChild(why);
      return h("li", null, btn);
    })));

    root.appendChild(h("div", { class: "tip" }, h("p", { class: "field-label" }, "Proofreading tip"), h("p", null, lesson.tip)));
    root.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: function () { CLY.go("proofreading"); } }, "Try the proofreading exercise")));
  }

  // ---------- Proofreading exercise ----------

  var sameWords = function (x, y) { return normalise(x.join(" ")) === normalise(y.join(" ")); };
  // A line is right when the student's one mark turns it into the corrected line, so an equally good fix also counts.
  var isRightLine = function (line, a) { return !!a && sameWords(G.applyMark(line.words, a), line.fixed); };

  function Proofreading(root, passage) {
    var lines = passage.lines, ids = lines.map(function (_, i) { return i; });
    var answers = {}, editing = null, draft = "", showRef = false, fresh = new CLY.Fresh();
    var checks = new CLY.Checks(ids, function (i) { return isRightLine(lines[i], answers[i]); }, function (i) { return i in answers; });
    var list = h("ol", { class: "proof" });
    var count = h("p", { class: "count", "aria-live": "polite" });
    var results = h("div", { "aria-live": "polite" });
    var refBox = h("div", { hidden: true });
    var focusEditor = false;

    function setAnswer(i, a) {
      if (a) answers[i] = a; else delete answers[i];
      checks.clearMark(i);
      editing = null; draft = "";
      drawLines(); if (checks.checked) drawResults();
    }
    function openWord(i, at) {
      if (checks.marks[i] === true) return;
      var a = answers[i];
      editing = { line: i, at: at };
      draft = a && a.at === at && a.word ? a.word : "";
      focusEditor = true;
      drawLines();
    }

    function drawLine(i) {
      var line = lines[i], a = answers[i], locked = checks.marks[i] === true;
      var caret = function (gap) {
        return a && a.type === "insert" && a.at === gap ? h("span", { class: "caret" }, h("b", null, a.word), h("i", { "aria-hidden": "true" }, "^")) : null;
      };
      var words = [];
      line.words.forEach(function (w, at) {
        var mine = a && a.type !== "ok" && a.type !== "insert" && a.at === at;
        var selected = editing && editing.line === i && editing.at === at;
        words.push(caret(at));
        words.push(h("span", { class: "word-wrap" },
          mine && a.type === "replace" ? h("span", { class: "above" }, a.word) : null,
          h("button", { type: "button", class: "word" + (selected ? " editing" : "") + (mine ? (a.type === "delete" ? " deleted" : " changed") : ""), "data-key": i + "-" + at, disabled: locked,
            "aria-label": "Line " + (i + 1) + ", word " + (at + 1) + ": " + w + (mine ? (a.type === "delete" ? " (deleted)" : " (changed to " + a.word + ")") : ""),
            onclick: function () { openWord(i, at); } }, w)), " ");
      });
      words.push(caret(line.words.length));
      var ok = a && a.type === "ok";
      var mark = i in checks.marks ? (checks.marks[i] ? "right" : "wrong") : "";
      var li = h("li", { class: mark + (fresh.is(i, mark) ? " fresh" : "") },
        h("div", { class: "proof-row" },
          h("div", { class: "proof-text" }, words),
          h("button", { type: "button", class: "ok-btn", "data-key": "ok" + i, disabled: locked, "aria-pressed": String(!!ok), onclick: function () { setAnswer(i, ok ? null : { type: "ok" }); } }, "No mistake")));
      // the hint for this line sits right under it
      var hintState = checks.checked && checks.marks[i] === false ? "hint" + checks.tries[i] : "";
      if (hintState) li.appendChild(h("div", { class: "verdict hint" + (fresh.is("v" + i, hintState) ? " fresh" : "") }, h("strong", null, "Not quite."), guidance(i)));
      else fresh.is("v" + i, "");
      if (checks.checked && a && !(i in checks.marks)) li.appendChild(h("p", { class: "meta" }, "Changed. Press “Check again” to mark it."));
      if (editing && editing.line === i) li.appendChild(editor(i));
      else if (a && a.type !== "ok" && !locked) li.appendChild(h("p", { class: "clear" }, h("button", { type: "button", class: "link-btn", "data-key": "clear" + i, onclick: function () { setAnswer(i, null); } }, "Clear my mark")));
      return li;
    }

    function editor(i) {
      var at = editing.at, plain = lines[i].words[at].replace(/[.,!?;:"]/g, "");
      var buttons = [];
      var mk = function (text, act) { var b = h("button", { type: "button", class: "chip", onclick: act }, text); buttons.push(b); return b; };
      var warn = h("p", { class: "warn", hidden: true }, "Type just one word. A correction is always a single word.");
      var typed = function () { return draft.trim(); };
      var valid = function () { return !!typed() && !/\s/.test(typed()); };
      var sync = function () { buttons.slice(0, 3).forEach(function (b) { b.disabled = !valid(); }); warn.hidden = !/\s/.test(typed()); };
      var input = h("input", { "aria-label": "Correction", autocomplete: "off", autocapitalize: "off", spellcheck: "false", placeholder: "one word", value: draft,
        oninput: function (e) { draft = e.target.value; sync(); },
        onkeydown: function (e) {
          if (e.key === "Enter" && valid()) setAnswer(i, { type: "replace", at: at, word: typed() });
          if (e.key === "Escape") { editing = null; drawLines(); }
        } });
      var box = h("div", { class: "editor" },
        h("p", null, "Fix a mistake near ", h("strong", null, "“" + plain + "”"), ". To change it or add a word, type the word first, then choose. To remove “" + plain + "”, just tap Delete."),
        h("div", { class: "row" }, input,
          mk("Change “" + plain + "” to my word", function () { setAnswer(i, { type: "replace", at: at, word: typed() }); }),
          mk("Add before “" + plain + "”", function () { setAnswer(i, { type: "insert", at: at, word: typed() }); }),
          mk("Add after “" + plain + "”", function () { setAnswer(i, { type: "insert", at: at + 1, word: typed() }); }),
          mk("Delete “" + plain + "”", function () { setAnswer(i, { type: "delete", at: at }); }),
          mk("Cancel", function () { editing = null; drawLines(); })),
        warn);
      sync();
      box.input = input;
      return box;
    }

    function drawLines() {
      redraw(list, function (el) { ids.forEach(function (i) { el.appendChild(drawLine(i)); }); });
      count.textContent = "Lines marked: " + Object.keys(answers).length + " / " + lines.length;
      if (focusEditor) { var inp = list.querySelector(".editor input"); if (inp) inp.focus(); focusEditor = false; }
    }

    // What a teacher would say about a line that isn't right yet. The correct word itself is never given.
    function guidance(i) {
      var e = lines[i].error, a = answers[i];
      var bigger = checks.tries[i] > 1 && e ? h("span", { class: "more" }, "Bigger clue: this line tests ", h("strong", null, e.focus), ", and you need to ", h("strong", null, G.CORRECTION_KIND[e.type]), ". ",
        h("button", { type: "button", class: "link-btn", onclick: function () { CLY.go(G.FOCUS_TABS[e.focus]); } }, "Review " + e.focus)) : null;
      if (!a) return ["You haven't marked this line yet. Is there a mistake, or is the line correct?", bigger];
      if (!e) return checks.tries[i] > 1 ? ["This line has ", h("strong", null, "no mistake"), ". Tap “No mistake” to mark it as correct."] : "Are you sure? Read the words around your change again. Was the original really wrong?";
      if (a.type === "ok") return ["Look again: there ", h("strong", null, "is"), " a mistake in this line. " + e.hint, bigger];
      if (a.type === e.type && a.at === e.at) return ["You've found the mistake! But your correction isn't quite right yet. " + e.hint, bigger];
      return [e.hint || "Read the line again, checking each verb form.", bigger];
    }

    function drawResults() {
      clear(results);
      if (!checks.checked) return;
      var right = ids.filter(function (i) { return checks.marks[i]; });
      var toReview = ids.filter(function (i) { return checks.tries[i] > 0 && lines[i].error; }).map(function (i) { return lines[i].error.focus; }).filter(function (f, k, arr) { return arr.indexOf(f) === k; });
      results.appendChild(CLY.scoreboard({
        fixes: checks.toFix(), untried: checks.untried(),
        label: function (i) { return "line " + (i + 1); },
        done: "Perfect proofreading!",
        scoreText: "Score: " + right.length + " / " + lines.length,
        next: function () { var i = checks.toFix()[0]; if (i == null) return; var li = list.children[i]; CLY.scrollTo(li); var w = li.querySelector(".word"); if (w) w.focus({ preventScroll: true }); },
        extra: [
          toReview.length ? [h("p", { class: "field-label" }, "Worth reviewing"), h("ul", { class: "chips" }, toReview.map(function (f) {
            return h("li", null, h("button", { type: "button", class: "chip", onclick: function () { CLY.go(G.FOCUS_TABS[f]); } }, f));
          }))] : null,
          right.length ? h("details", { class: "got-right" }, h("summary", null, "Explanations for the lines you got right (" + right.length + ")"),
            h("ul", { class: "marks" }, right.map(function (i) {
              var e = lines[i].error;
              return h("li", { class: "do" }, h("strong", null, "Line " + (i + 1) + ". "),
                e ? [e.type === "replace" ? [h("s", null, lines[i].words[e.at]), " → ", h("strong", null, answers[i].word)] : e.type === "insert" ? ["add ", h("strong", null, answers[i].word)] : ["delete ", h("s", null, lines[i].words[e.at])],
                  h("span", { class: "meta" }, " · " + e.focus), h("span", { class: "more" }, e.why)] : "No mistake in this line.");
            }))) : null
        ]
      }));
    }

    var refBtn = h("button", { type: "button", class: "btn-quiet", "aria-expanded": "false", onclick: function () {
      showRef = !showRef; refBox.hidden = !showRef;
      refBtn.setAttribute("aria-expanded", String(showRef));
      refBtn.textContent = showRef ? "Hide quick reference" : "Show quick reference";
    } }, "Show quick reference");
    refBox.appendChild(h("div", { class: "compare" }, [
      ["Passive Voice", "passive", ["be + V3 in the right tense", "modal + be + V3", "no passive for happen, occur, arrive, die"]],
      ["Gerunds", "gerunds", ["V-ing as the subject", "after prepositions (in, at, for, by…)", "after enjoy, avoid, keep, mind, suggest", "look forward to / be used to + V-ing"]],
      ["To-infinitives", "infinitives", ["to + V1 (never to + V-ing / V2)", "after decide, hope, manage, want", "remind / tell / ask sb + to V1", "make / let sb + V1 (no “to”)"]]
    ].map(function (r) {
      return h("div", null, h("p", { class: "field-label" }, r[0]), h("ul", null, r[2].map(function (x) { return h("li", null, x); })),
        h("p", null, h("button", { type: "button", class: "link-btn", onclick: function () { CLY.go(r[1]); } }, "Open the lesson")));
    })));

    var checkBtn = h("button", { type: "button", class: "btn", onclick: function () {
      editing = null; checks.check(); checkBtn.textContent = "Check again";
      drawLines(); drawResults(); CLY.scrollTo(results);
    } }, "Check answers");
    function reset() {
      answers = {}; editing = null; draft = ""; checks.reset(); fresh = new CLY.Fresh(); checkBtn.textContent = "Check answers";
      drawLines(); drawResults(); CLY.scrollTo(root);
    }

    // the key is open the first time; after that it folds away, so the lines start near the top
    var seenKey = false;
    try { seenKey = !!localStorage.getItem("cly:proof-key"); localStorage.setItem("cly:proof-key", "1"); } catch (e) { seenKey = false; }
    root.appendChild(h("details", { class: "tip proof-help", open: !seenKey },
      h("summary", { class: "field-label" }, "How to mark a line"),
      h("ul", { class: "proof-key" },
        h("li", null, h("span", { class: "word-wrap" }, h("span", { class: "above" }, "built"), h("span", { class: "word changed" }, "build")), " change a word"),
        h("li", null, "look forward ", h("span", { class: "caret" }, h("b", null, "to"), h("i", null, "^")), " seeing: add a word"),
        h("li", null, "let him ", h("span", { class: "word deleted" }, "to"), " go: delete a word")),
      h("p", null, "Tap a word to change it, delete it or add a missing word next to it. If a line has no mistake, tap “No mistake”."),
      refBtn, refBox));
    root.appendChild(count);
    root.appendChild(list);
    root.appendChild(h("div", { class: "actions" }, checkBtn, h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start again")));
    root.appendChild(results);
    drawLines();
  }

  // ---------- Conditionals ----------

  var NUM = { "Zero Conditional": "0", "First Conditional": "1", "Second Conditional": "2", "Third Conditional": "3" };
  var badge = function (name) { return h("span", { class: "cn", "aria-hidden": "true" }, NUM[name]); };
  var formulaChips = function (name) {
    var c = G.conditionalMatrix[name];
    return h("span", null, h("span", { class: "if-part" }, c.ifPart), ", ", h("span", { class: "main-part" }, c.mainPart));
  };
  // [[…]] is the if-clause verb and {{…}} the main-clause verb.
  var condSentence = function (text) {
    return text.split(/(\[\[.+?\]\]|\{\{.+?\}\})/).map(function (part) {
      if (part.indexOf("[[") === 0) return h("mark", { class: "if-verb" }, part.slice(2, -2));
      if (part.indexOf("{{") === 0) return h("mark", { class: "main-verb" }, part.slice(2, -2));
      return part;
    });
  };

  function ConditionalDiagram(name) {
    var c = G.conditionalMatrix[name], d = c.diagram;
    var X = function (at) { return 40 + at * 5.2; }, AXIS = 150, NOW = X(50);
    var t = function (x, y, text, cls, anchor) { return s("text", { x: x, y: y, "text-anchor": anchor || "middle", class: cls || "ink" }, text); };
    var body;
    if (name === "Zero Conditional") body = s("g", null,
      [8, 33, 58, 83].map(function (a) {
        return s("g", null, s("circle", { cx: X(a), cy: AXIS, r: "6", class: "copper" }),
          s("line", { x1: X(a) + 8, y1: AXIS, x2: X(a + 9) - 9, y2: AXIS, class: "ink-line", "stroke-width": "2.5", "marker-end": "url(#cd-ink)" }),
          s("circle", { cx: X(a + 9), cy: AXIS, r: "6", class: "ink" }));
      }),
      t(X(12), AXIS - 18, d.a, "copper"), t(X(24), AXIS - 38, "→ " + d.b),
      t(300, 40, "Every time, in the past, now and in the future:", "green"),
      t(300, 64, d.a + " → " + d.b + ": always true", "green"));
    else if (name === "First Conditional") body = s("g", null,
      s("circle", { cx: NOW, cy: AXIS, r: "7", class: "ink" }),
      s("path", { d: "M" + NOW + "," + AXIS + " C" + X(56) + "," + (AXIS - 10) + " " + X(56) + ",55 " + X(64) + ",55", class: "ink-line", "stroke-width": "3", "marker-end": "url(#cd-ink)" }),
      s("path", { d: "M" + NOW + "," + AXIS + " C" + X(56) + "," + (AXIS - 4) + " " + X(56) + ",112 " + X(64) + ",112", class: "soft-line", "stroke-width": "2", "stroke-dasharray": "5 4", "marker-end": "url(#cd-soft)" }),
      t(X(66), 48, "If " + d.a, "copper", "start"), t(X(66), 68, "→ " + d.b, "ink", "start"),
      t(X(66), 108, "If " + d.c, "soft", "start"), t(X(66), 128, "→ " + d.d, "soft", "start"),
      t(NOW - 14, 40, "Both futures can really happen.", "green", "end"),
      t(NOW - 14, 60, "The if-clause is one real possibility.", "green", "end"));
    else if (name === "Second Conditional") body = s("g", null,
      s("rect", { x: X(24), y: "14", width: X(78) - X(24), height: "78", rx: "22", class: "dream" }),
      t(300, 36, "IMAGINARY WORLD (not true now)", "copper small"),
      t(300, 60, "If I " + d.a, "copper"), t(300, 80, "→ I " + d.b),
      s("line", { x1: NOW, y1: "92", x2: NOW, y2: AXIS - 10, class: "copper-line", "stroke-width": "1.5", "stroke-dasharray": "3 3" }),
      s("circle", { cx: NOW, cy: AXIS, r: "7", class: "ink" }),
      t(NOW + 14, AXIS - 14, d.real, "red", "start"));
    else body = s("g", null,
      s("line", { x1: X(16), y1: AXIS, x2: NOW, y2: AXIS, class: "ink-line", "stroke-width": "5" }),
      s("circle", { cx: X(16), cy: AXIS, r: "7", class: "ink" }),
      t(X(33), AXIS + 20, d.real),
      s("path", { d: "M" + X(16) + "," + AXIS + " C" + X(18) + ",70 " + X(26) + ",62 " + X(40) + ",62", class: "copper-line", "stroke-width": "2.5", "stroke-dasharray": "6 4", "marker-end": "url(#cd-copper)" }),
      t(X(42), 48, "If I had " + d.a, "copper", "start"), t(X(42), 68, "→ I " + d.b, "ink", "start"),
      t(NOW + 24, 100, "Too late to change the past", "red", "start"));
    return h("figure", { class: "figure" },
      h("p", { class: "field-label" }, "Picture it"),
      h("p", null, h("em", null, "“" + c.examples[0] + "”")),
      s("svg", { viewBox: "0 0 640 190", role: "img", "aria-label": "Diagram for the " + name + ": " + c.meaning },
        s("defs", null, arrowDefs("cd-ink", "ink"), arrowDefs("cd-soft", "soft"), arrowDefs("cd-copper", "copper")),
        s("line", { x1: "20", y1: AXIS, x2: "585", y2: AXIS, class: "axis", "marker-end": "url(#cd-soft)" }),
        s("text", { x: "24", y: AXIS + 34, class: "soft small" }, "PAST"),
        s("text", { x: "580", y: AXIS + 34, class: "soft small", "text-anchor": "end" }, "FUTURE"),
        s("line", { x1: NOW, y1: AXIS - 8, x2: NOW, y2: AXIS + 12, class: "now" }),
        s("text", { x: NOW, y: AXIS + 34, class: "copper small", "text-anchor": "middle" }, "NOW"),
        body));
  }

  function ConditionalsMatrix(root) {
    var selected = "First Conditional", idea = 0;
    var table = h("div", { class: "matrix-wrap wide-only" }), meter = h("div", { class: "reality" }), detail = h("div", { class: "detail" }), ladder = h("div");

    function drawTable() {
      redraw(table, function (el) {
        el.appendChild(h("table", { class: "matrix cond" },
          h("thead", null, h("tr", null, h("th", null, h("span", { class: "field-label" }, "Reality / Time")), G.COND_TIMES.map(function (t) { return h("th", { scope: "col", class: "field-label" }, t); }))),
          h("tbody", null, G.REALITY.map(function (r) {
            return h("tr", null, h("th", { scope: "row" }, r, h("small", { class: "field-label", style: "display:block;margin:2px 0 0" }, r === "Real" ? "true or possible" : "imaginary")),
              G.COND_TIMES.map(function (t) {
                var cell = G.COND_CELLS[r + "-" + t];
                if (!G.conditionalMatrix[cell]) return h("td", null, h("div", { class: "cell-empty" }, cell));
                return h("td", null, h("button", { type: "button", class: "cell has-badge", "data-key": cell, "aria-pressed": String(cell === selected), onclick: function () { select(cell); } },
                  badge(cell), h("span", { class: "cell-name" }, cell), h("small", null, keepHyphens(G.conditionalMatrix[cell].ifPart + ", " + G.conditionalMatrix[cell].mainPart))));
              }));
          }))));
      });
    }
    function drawMeter() {
      redraw(meter, function (el) {
        el.appendChild(h("p", { class: "field-label" }, "How real is it?"));
        el.appendChild(h("div", { class: "reality-axis" }, G.CONDITIONALS.map(function (c) {
          return h("button", { type: "button", "data-key": "m" + c, "aria-pressed": String(c === selected), onclick: function () { select(c); } },
            h("span", { class: "cn", "aria-hidden": "true" }, NUM[c]), h("span", null, G.conditionalMatrix[c].short), h("span", null, G.conditionalMatrix[c].reality.split(": ")[1]));
        })));
        el.appendChild(h("div", { class: "reality-ends", "aria-hidden": "true" }, h("span", null, "100% real"), h("span", null, "Impossible")));
        // on phones the matrix is hidden, so its two empty cells are explained here instead
        el.appendChild(h("details", { class: "got-right phone-only" }, h("summary", null, "Why only four conditionals?"),
          h("ul", null, Object.keys(G.COND_CELLS).filter(function (k) { return !G.conditionalMatrix[G.COND_CELLS[k]]; }).map(function (k) {
            return h("li", null, h("strong", null, k.replace("-", " · ") + ": "), G.COND_CELLS[k]);
          }))));
      });
    }
    function drawDetail() {
      var info = G.conditionalMatrix[selected], idx = G.CONDITIONALS.indexOf(selected);
      redraw(detail, function (el) {
        el.appendChild(h("div", { class: "detail-head" }, badge(selected),
          h("div", null, h("h3", null, selected), h("p", null, info.meaning)),
          h("div", { class: "steps" },
            h("button", { type: "button", class: "step-btn prev", "data-key": "prev", "aria-label": "Previous conditional", disabled: idx === 0, onclick: function () { select(G.CONDITIONALS[idx - 1]); } }),
            h("button", { type: "button", class: "step-btn next", "data-key": "next", "aria-label": "Next conditional", disabled: idx === G.CONDITIONALS.length - 1, onclick: function () { select(G.CONDITIONALS[idx + 1]); } }))));
        el.appendChild(h("div", { class: "clauses" },
          h("div", { class: "if" }, h("p", { class: "field-label" }, "If-clause (condition)"), h("p", null, info.ifPart)),
          h("div", { class: "main" }, h("p", { class: "field-label" }, "Main clause (result)"), h("p", null, info.mainPart))));
        el.appendChild(h("dl", { class: "summary" },
          h("div", null, h("dt", null, "Time · Reality"), h("dd", null, info.time + " · " + info.reality)),
          h("div", null, h("dt", null, "Keywords"), h("dd", null, info.signals))));
        el.appendChild(h("p", null, h("strong", null, "When to use it: "), info.use));
        el.appendChild(ConditionalDiagram(selected));
        el.appendChild(h("p", { class: "field-label" }, "Examples"));
        el.appendChild(h("ul", { class: "marks" }, info.examples.map(function (ex) { return h("li", { class: "do" }, ex); })));
        el.appendChild(h("div", { class: "tip" }, h("p", { class: "field-label" }, "Exam tip"), h("p", null, info.tip)));
        el.appendChild(h("p", null, "The clauses can swap places. Use a comma only when the if-clause comes first: ", h("em", null, "If it rains, we'll stay in."), " / ", h("em", null, "We'll stay in if it rains.")));
      });
    }
    function drawLadder() {
      redraw(ladder, function (el) {
        el.appendChild(h("h3", null, "One idea, four conditionals"));
        el.appendChild(h("p", null, "Watch the verbs step back in time as the situation becomes less real. ", h("mark", { class: "if-verb" }, "Highlighted"), " = if-clause verb, ", h("mark", { class: "main-verb" }, "underlined"), " = main-clause verb."));
        el.appendChild(h("ul", { class: "chips" }, G.COND_IDEAS.map(function (it, i) {
          return h("li", null, h("button", { type: "button", class: "chip", "data-key": "idea" + i, "aria-pressed": String(i === idea), onclick: function () { idea = i; drawLadder(); } }, it.label));
        })));
        var rows = [];
        G.CONDITIONALS.forEach(function (c, i) {
          var row = G.COND_IDEAS[idea].rows[i];
          if (i >= 2) rows.push(h("li", { class: "stepback" }, "Step back: " + (i === 2 ? "make it imaginary (present → past, will → would)" : "move it into the past (past → had + V3, would → would have + V3)")));
          else if (i === 1) rows.push(h("li", { class: "stepback", "aria-hidden": "true" }, " "));
          rows.push(h("li", null, h("button", { type: "button", onclick: function () { select(c); CLY.scrollTo(detail); } },
            badge(c),
            h("span", null, h("span", { class: "head" }, G.conditionalMatrix[c].short, formulaChips(c)),
              h("span", { style: "display:block" }, condSentence(row[0])),
              h("span", { class: "meaning", style: "display:block" }, row[1])))));
        });
        el.appendChild(h("ol", { class: "cond-ladder" }, rows));
        el.appendChild(h("p", null, "From First to Second to Third, every verb moves one step back: ", h("strong", null, "rains → rained → had rained"), " and ", h("strong", null, "will be → would be → would have been"), "."));
      });
    }
    function show(name) { selected = name; drawTable(); drawMeter(); drawDetail(); }
    function select(name) { show(name); CLY.replay(detail, "swap"); }

    root.appendChild(table); root.appendChild(meter); root.appendChild(detail); root.appendChild(ladder);
    show(selected); drawLadder();
    return { select: select };
  }

  // ---------- Match & Change ----------

  // Turns contractions into full forms, so "wouldn't have" and "would not have" are marked the same.
  var fullForms = function (t) { return normalise(t).replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not").replace(/n't\b/g, " not").replace(/'ll\b/g, " will").replace(/'d\b/g, " would"); };
  var sameAnswer = function (input, answers) { return !!(input && input.trim()) && answers.some(function (a) { return fullForms(a) === fullForms(input); }); };

  function ConditionalMatch(root, set) {
    var order = set.groups.map(function (g) { return { sentences: CLY.shuffled(g.items.length), meanings: CLY.shuffled(g.items.length) }; });
    var picks = {}, inputs = {}, marks = {}, tries = {}, checked = false, fresh = new CLY.Fresh();
    var matchKeys = [], itemBoxes = {}, transformBoxes = {}, fields = {};
    set.groups.forEach(function (g, gi) { g.items.forEach(function (_, i) { matchKeys.push("m" + gi + "-" + i); }); });
    var transformKeys = set.transforms.map(function (_, ti) { return "t" + ti; });
    var allKeys = matchKeys.concat(transformKeys);
    var blankRight = function (ti, bi) { return sameAnswer(inputs["t" + ti + "-" + bi], set.transforms[ti].blanks[bi]); };
    var isRight = function (key) {
      if (key[0] === "m") return picks[key] === Number(key.split("-")[1]);
      var ti = Number(key.slice(1));
      return set.transforms[ti].blanks.every(function (_, bi) { return blankRight(ti, bi); });
    };
    var conditionalOf = function (key) {
      if (key[0] === "t") return set.transforms[Number(key.slice(1))].conditional;
      var p = key.slice(1).split("-").map(Number);
      return set.groups[p[0]].items[p[1]].conditional;
    };
    var count = h("p", { class: "count", "aria-live": "polite" });
    var results = h("div", { "aria-live": "polite" });

    // Only a note that is new (or has a new hint) draws in; the rest stay still when the page redraws.
    function noteClass(key, state) {
      return fresh.is("v" + key, checked && key in marks ? state : "") ? " fresh" : "";
    }
    function guidance(key, firstHint) {
      if (!checked || marks[key] !== false) return null;
      var c = conditionalOf(key);
      return h("div", { class: "verdict hint" + noteClass(key, "hint" + tries[key]) }, h("strong", null, "Not quite. Have another go."), firstHint,
        tries[key] > 1 ? h("p", null, "Bigger clue: this is the ", h("strong", null, c), " (" + COND_KIT.formula(c) + "): " + G.conditionalMatrix[c].meaning.toLowerCase() + " ",
          h("button", { type: "button", class: "link-btn", onclick: function () { reviewConditional(c); } }, "Review the " + c + " in the Conditionals Matrix")) : null);
    }
    function praise(key, why) {
      if (!(checked && marks[key])) return null;
      return h("div", { class: "verdict do" + noteClass(key, "do") }, h("strong", null, tries[key] ? "Well done, you got there!" : "Correct!"), h("span", { class: "meta" }, "(" + conditionalOf(key) + ") "), why);
    }
    function drawCount() {
      var answered = matchKeys.filter(function (k) { return k in picks; }).length +
        set.transforms.filter(function (t, ti) { return t.blanks.every(function (_, bi) { return (inputs["t" + ti + "-" + bi] || "").trim(); }); }).length;
      count.textContent = answered + " of " + allKeys.length + " answered";
    }

    function drawItem(gi, i, n) {
      var key = "m" + gi + "-" + i, g = set.groups[gi], letters = order[gi].meanings, done = checked && marks[key];
      redraw(itemBoxes[key], function (el) {
        el.appendChild(h("p", { class: "question-text" }, h("span", { class: "n" }, (n + 1) + "."), g.items[i].sentence));
        el.appendChild(h("div", { class: "letters", role: "group", "aria-label": "Meaning for sentence " + (n + 1) },
          h("span", { class: "field-label" }, "Meaning"),
          letters.map(function (mi, li) {
            var on = picks[key] === mi;
            var cls = "letter" + (on && done ? " right" : on && checked && marks[key] === false ? " wrong" : "");
            return h("button", { type: "button", class: cls, "data-key": key + "-" + mi, disabled: done, "aria-pressed": String(on), "aria-label": "Meaning " + String.fromCharCode(65 + li) + ": " + g.items[mi].meaning, onclick: function () {
              picks[key] = mi; delete marks[key]; drawItem(gi, i, n); drawCount();
            } }, String.fromCharCode(65 + li));
          }),
          checked && !(key in marks) && key in picks ? h("span", { class: "meta" }, "Changed. Press “Check again”.") : null));
        // the chosen meaning is written out under the sentence, so nobody has to scroll back to the list
        if (key in picks) el.appendChild(h("p", { class: "chosen" }, h("b", null, String.fromCharCode(65 + letters.indexOf(picks[key])) + ":"), " " + g.items[picks[key]].meaning));
        var gd = guidance(key, "Look at the verb in the if-clause: present, past or past perfect? Then ask: is it real or imaginary, and is it about always, the future, now or the past?");
        if (gd) el.appendChild(gd);
        var pr = praise(key, G.conditionalMatrix[g.items[i].conditional].meaning);
        if (pr) el.appendChild(pr);
      });
    }
    function drawTransformFeedback(ti) {
      var key = "t" + ti, t = set.transforms[ti], box = transformBoxes[key];
      clear(box.feedback);
      if (checked && !(key in marks) && tried(key)) box.feedback.appendChild(h("p", { class: "meta" }, "Changed. Press “Check again” to mark it."));
      var gd = guidance(key, t.hint || G.GENERIC_COND_HINT); if (gd) box.feedback.appendChild(gd);
      var pr = praise(key, t.why); if (pr) box.feedback.appendChild(pr);
      t.blanks.forEach(function (_, bi) {
        var f = fields[key + "-" + bi];
        f.mark(checked && key in marks ? blankRight(ti, bi) : null);
        if (checked && marks[key] === true) f.input.readOnly = true;
      });
    }
    function drawAll() {
      set.groups.forEach(function (g, gi) { order[gi].sentences.forEach(function (i, n) { drawItem(gi, i, n); }); });
      set.transforms.forEach(function (_, ti) { drawTransformFeedback(ti); });
      drawCount(); drawResults();
    }
    // A Part A sentence is tried once a meaning is picked; a Part B sentence once anything is typed in it.
    var tried = function (k) {
      if (k[0] === "m") return k in picks;
      var ti = Number(k.slice(1));
      return set.transforms[ti].blanks.some(function (_, bi) { return (inputs["t" + ti + "-" + bi] || "").trim(); });
    };
    var labelOf = function (k) {
      if (k[0] === "t") return "Part B " + (Number(k.slice(1)) + 1);
      var p = k.slice(1).split("-").map(Number);
      return set.groups[p[0]].scene.trim() + ", sentence " + (order[p[0]].sentences.indexOf(p[1]) + 1);
    };
    function drawResults() {
      clear(results);
      if (!checked) return;
      var fixes = allKeys.filter(function (k) { return marks[k] === false; });
      var right = allKeys.filter(function (k) { return marks[k]; }).length;
      var toReview = allKeys.filter(function (k) { return tries[k]; }).map(conditionalOf).filter(function (c, i, a) { return a.indexOf(c) === i; });
      results.appendChild(CLY.scoreboard({
        fixes: fixes, untried: allKeys.filter(function (k) { return !tried(k); }),
        label: labelOf,
        done: "Perfect! You can read and use all four conditionals.",
        scoreText: "Score: " + right + " / " + allKeys.length,
        next: function () {
          var k = fixes[0]; if (!k) return;
          var el = k[0] === "m" ? itemBoxes[k] : fields[k + "-0"];
          CLY.scrollTo(el);
          var target = k[0] === "m" ? el.querySelector(".letter") : el.input;
          if (target) target.focus({ preventScroll: true });
        },
        extra: toReview.length ? [h("p", { class: "field-label" }, "Worth reviewing in the Conditionals Matrix"), h("ul", { class: "chips" }, toReview.map(function (c) {
          return h("li", null, h("button", { type: "button", class: "chip", onclick: function () { reviewConditional(c); } }, c));
        }))] : null
      }));
    }
    function check() {
      allKeys.forEach(function (k) {
        if (!tried(k)) { delete marks[k]; return; }
        var ok = isRight(k); marks[k] = ok; tries[k] = (tries[k] || 0) + (ok ? 0 : 1);
      });
      checked = true; checkBtn.textContent = "Check again";
      drawAll(); CLY.scrollTo(results);
    }
    function reset() {
      picks = {}; inputs = {}; marks = {}; tries = {}; checked = false; fresh = new CLY.Fresh(); checkBtn.textContent = "Check answers";
      Object.keys(fields).forEach(function (k) { fields[k].input.value = ""; fields[k].input.readOnly = false; });
      drawAll(); CLY.scrollTo(root);
    }

    root.appendChild(count);
    root.appendChild(h("h3", null, "Part A: match the sentence to its meaning"));
    set.groups.forEach(function (g, gi) {
      root.appendChild(h("h4", { class: "scene" }, g.scene.trim()));
      root.appendChild(h("ol", { class: "meanings" }, order[gi].meanings.map(function (mi, li) {
        return h("li", null, h("b", null, String.fromCharCode(65 + li)), g.items[mi].meaning);
      })));
      order[gi].sentences.forEach(function (i) {
        var key = "m" + gi + "-" + i;
        itemBoxes[key] = h("div", { class: "question" });
        root.appendChild(itemBoxes[key]);
      });
    });
    root.appendChild(h("h3", null, "Part B: change the verbs to fit the situation"));
    set.transforms.forEach(function (t, ti) {
      var key = "t" + ti, parts = t.sentence.split("___");
      var sentence = h("p", null, parts.map(function (p, bi) {
        if (bi === parts.length - 1) return p;
        var id = key + "-" + bi;
        var f = CLY.blank(bi + 1, { label: "Sentence " + (ti + 1) + ", blank " + (bi + 1), oninput: function (e) {
          inputs[id] = e.target.value; delete marks[key]; drawTransformFeedback(ti); drawCount();
        } });
        fields[id] = f;
        return [p, f];
      }));
      var feedback = h("div");
      transformBoxes[key] = { feedback: feedback };
      root.appendChild(h("div", { class: "transform" },
        h("p", { class: "context" }, h("span", { class: "n", style: "font-style:normal;font-family:var(--font-display);color:var(--copper);margin-right:8px" }, (ti + 1) + "."), t.context),
        sentence, feedback));
    });
    var checkBtn = h("button", { type: "button", class: "btn", onclick: check }, "Check answers");
    root.appendChild(h("div", { class: "actions" }, checkBtn, h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start again")));
    root.appendChild(results);
    drawAll();
  }

  // ---------- Sets: every exercise has five ----------

  // Five squares above the exercise, one per set (sets.js). Each set is drawn the first time it opens
  // and then kept, so a student can switch between sets without losing any answers.
  function Sets(root, name, sets, titleOf, render) {
    if (sets.length < 2 || !window.CLYSets) { render(root, sets[0]); return; }
    var bodies = [];
    var started = function (body) {
      var typed = Array.prototype.some.call(body.querySelectorAll("input"), function (i) { return !!i.value.trim(); });
      // the proofreading key shows example marks too, so only marks outside it count as answers
      var marks = body.querySelectorAll(".choice.right, .choice.crossed, .letter[aria-pressed='true'], .word.changed, .word.deleted, .caret, .ok-btn[aria-pressed='true']");
      return typed || Array.prototype.some.call(marks, function (m) { return !m.closest(".proof-key"); });
    };
    window.CLYSets(root, null, {
      name: "grammar:" + name,
      titles: sets.map(titleOf),
      panels: function (i) {
        var body = bodies[i] = h("div", { class: "set-panel" });
        root.appendChild(body);
        render(body, sets[i]);
        return body;
      },
      state: function (i) {
        var body = bodies[i];
        return body.querySelector(".scoreboard.done") ? "done" : started(body) ? "started" : "";
      }
    });
  }

  // extra sets are written plainly in grammar-sets.js; proofreading lines are parsed the same way as set 1
  var S = window.CLY_GRAMMAR_SETS || {};
  var more = function (k) { return S[k] || []; };
  var proofPassage = function (p) {
    return { title: p.title, textType: p.textType, lines: p.lines.map(function (l) {
      var r = G.parseProofLine(l[0]);
      return { words: r.words, fixed: r.fixed, error: r.error && Object.assign({}, r.error, { focus: l[1], why: l[2], hint: l[3] }) };
    }) };
  };
  var howMany = function (q) { return q.length + " questions"; };
  var titled = function (set) { return set.title; };

  // ---------- Mount ----------

  var mount = {
    matrix: function (el) { widgets.matrix = TenseMatrix(el); },
    practice: function (el) { Sets(el, "practice", [G.practiceQuestions].concat(more("practice")), howMany, function (b, q) { McQuiz(b, q, TENSE_KIT); }); },
    cloze: function (el) { Sets(el, "cloze", [G.defaultCloze].concat(more("cloze")), titled, Cloze); },
    passive: function (el) { Lesson(el, G.LESSONS.passive); },
    gerunds: function (el) { Lesson(el, G.LESSONS.gerunds); },
    infinitives: function (el) { Lesson(el, G.LESSONS.infinitives); },
    proofreading: function (el) { Sets(el, "proofreading", [G.defaultProofreading].concat(more("proofreading").map(proofPassage)), titled, Proofreading); },
    condmatrix: function (el) { widgets.condmatrix = ConditionalsMatrix(el); },
    condquiz: function (el) { Sets(el, "condquiz", [G.condQuizQuestions].concat(more("condquiz")), howMany, function (b, q) { McQuiz(b, q, COND_KIT); }); },
    condmatch: function (el) { Sets(el, "condmatch", [G.defaultCondMatch].concat(more("condmatch")), titled, ConditionalMatch); }
  };
  document.querySelectorAll("[data-grammar]").forEach(function (el) {
    var fn = mount[el.getAttribute("data-grammar")];
    if (fn) fn(el);
  });
})();
