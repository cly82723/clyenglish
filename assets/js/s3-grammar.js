/* CLY English — S.3 grammar: the lesson diagrams and the consolidation rewrites.
   Loaded before grammar.js, which draws the diagrams inside its lessons and mounts the rewrites. */
(function () {
  "use strict";

  var h = CLY.h, s = CLY.s, clear = CLY.clear;
  var judge = window.CLY_REWRITE_CHECK.judge, wholeSentence = window.CLY_REWRITE_CHECK.wholeSentence;

  // ---------- Diagrams ----------

  // Past perfect: two past events on one line; "had" goes on the earlier one.
  function PastPerfectTimeline() {
    var AXIS = 74;
    var point = function (x, n, event, form, cls) {
      return s("g", null,
        s("circle", { cx: x, cy: AXIS, r: "8", class: cls }),
        s("text", { x: x, y: AXIS - 34, "text-anchor": "middle", class: "ink" }, n + ". " + event),
        s("text", { x: x, y: AXIS - 16, "text-anchor": "middle", class: cls + " small-plain" }, form));
    };
    return h("figure", { class: "figure" },
      h("p", null, h("em", null, "“When I got to the station, the last train had left.”")),
      s("svg", { viewBox: "0 0 360 120", class: "narrow", role: "img", "aria-label": "Timeline. First, the last train left: had left, the past perfect. Second, I got to the station: got, the past simple. Both are before now." },
        s("line", { x1: "10", y1: AXIS, x2: "344", y2: AXIS, class: "axis" }),
        s("path", { d: "M342,68 L352,74 L342,80 z", class: "soft" }),
        point(95, "1", "the train left", "had left", "copper"),
        point(225, "2", "I got there", "got", "ink"),
        s("line", { x1: "318", y1: AXIS - 14, x2: "318", y2: AXIS + 14, class: "now" }),
        s("text", { x: "318", y: AXIS + 34, "text-anchor": "middle", class: "copper small" }, "now"),
        s("text", { x: "12", y: AXIS + 34, class: "soft small" }, "earlier")),
      h("p", { class: "dg-caption" }, "Step back to the ", h("strong", null, "earlier"), " event: ", h("strong", null, "had + V3"), ". The later event stays in the past simple."));
  }

  // One participle phrase: who does the action, and the test that proves it.
  // flow: who does what to whom; the subject of the sentence is the green chip
  var PARTICIPLE = {
    present: { label: "Present participle (V-ing)", sentence: ["Wanting to save money", ", he walked to school."], flow: [["he", true], "wanted", ["to save money", false]], test: "He wanted to save money. ✔", rule: "The subject does the action." },
    past: { label: "Past participle (V3)", sentence: ["Frightened by the dog", ", the boy ran away."], flow: [["the dog", false], "frightened", ["the boy", true]], test: "The boy was frightened. ✔", rule: "The action is done to the subject, or the subject feels it." }
  };
  function participleCard(kind) {
    var p = PARTICIPLE[kind], f = p.flow;
    var chip = function (c) { return h("span", { class: "dg-chip" + (c[1] ? " dg-subject" : "") }, c[0], c[1] ? h("small", { class: "dg-tag" }, "subject") : null); };
    return h("div", { class: "dg-who dg-" + kind },
      h("p", { class: "field-label" }, p.label),
      h("p", { class: "dg-sentence" }, h("span", { class: "dg-phrase" }, p.sentence[0]), p.sentence[1]),
      h("p", { class: "dg-flow", "aria-label": f[0][0] + " " + f[1] + " " + f[2][0] + "; the subject is " + (f[0][1] ? f[0][0] : f[2][0]) },
        chip(f[0]), h("span", { class: "dg-arrow" }, f[1], h("span", { "aria-hidden": "true" }, " →")), chip(f[2])),
      h("p", { class: "dg-test" }, h("span", { class: "field-label" }, "Test"), " ", p.test),
      h("p", { class: "note-line" }, p.rule));
  }
  var toCompare = function () {
    return h("p", null, h("button", { type: "button", class: "link-btn", onclick: function () { CLY.go("participle-consolidation"); } }, "Compare the two kinds side by side"));
  };
  function PresentParticiple() { return [h("div", { class: "figure dg-single" }, participleCard("present")), toCompare()]; }
  function PastParticiple() { return [h("div", { class: "figure dg-single" }, participleCard("past")), toCompare()]; }
  function ParticipleCompare() {
    return h("div", { class: "figure" },
      h("div", { class: "pairs" }, participleCard("present"), participleCard("past")),
      h("p", { class: "dg-caption" }, "Ask: can you say ", h("strong", null, "subject + was + V3"), "? Then use the past participle. If the subject did it, use the present participle. Feelings: the person who ", h("strong", null, "feels"), " it takes V3 (", h("em", null, "bored"), "); the thing that ", h("strong", null, "causes"), " it takes V-ing (", h("em", null, "boring"), ")."));
  }

  // Reported statements: each tense takes one step back; time and place words move with it.
  var STEPS = [
    ["Present → past", [["am / is / are", "was / were"], ["do / does", "did"], ["is doing", "was doing"]]],
    ["Past and present perfect → past perfect", [["did", "had done"], ["has done", "had done"]]],
    ["Modals", [["will", "would"], ["can", "could"], ["may", "might"], ["must", "had to / must"]]]
  ];
  var TIME_WORDS = [["today", "that day"], ["tomorrow", "the next day"], ["yesterday", "the day before"], ["next week", "the following week"], ["last week", "the week before"], ["this", "that"], ["here", "there"], ["now", "then"]];
  var swap = function (r) { return h("li", null, h("span", { class: "dg-chip" }, r[0]), h("span", { class: "dg-arrow", "aria-label": "becomes" }, "→"), h("span", { class: "dg-chip dg-action" }, r[1])); };
  function Backshift() {
    return h("div", { class: "figure" },
      h("div", { class: "dg-steps" }, STEPS.map(function (st, i) {
        return h("div", { class: "dg-step dg-step-" + i }, h("p", { class: "field-label" }, st[0]), h("ul", { class: "dg-swaps" }, st[1].map(swap)));
      })),
      h("p", { class: "field-label" }, "Time and place words"),
      h("ul", { class: "dg-swaps dg-swaps-wide" }, TIME_WORDS.map(swap)),
      h("p", { class: "dg-caption" }, "Still true, or reported on the same day? You can stay where you are: ", h("em", null, "She said she lives in Tai Po."), " Time words move only if that day has passed."));
  }

  // Reported questions: the helper verb drops out and the subject moves in front of the verb.
  var ORDER = [
    { direct: [["Where", "wh"], ["did", "helper"], ["people", "subject"], ["hide", "verb"], ["?", "end"]], reported: [["where", "wh"], ["people", "subject"], ["had hidden", "verb"], [".", "end"]] },
    { direct: [["Do", "helper"], ["you", "subject"], ["like", "verb"], ["sushi", "rest"], ["?", "end"]], reported: [["if / whether", "wh"], ["I", "subject"], ["liked", "verb"], ["sushi", "rest"], [".", "end"]] }
  ];
  var tiles = function (row, dropHelper) {
    return h("p", { class: "dg-tiles" }, row.map(function (t) {
      return h(t[1] === "helper" && dropHelper ? "s" : "span", { class: "dg-tile dg-" + t[1] }, t[0]);
    }));
  };
  function QuestionOrder() {
    return h("div", { class: "figure" },
      ORDER.map(function (o) {
        return h("div", { class: "dg-order" },
          h("p", { class: "field-label" }, "Direct question"), tiles(o.direct, true),
          h("p", { class: "field-label" }, "Reported question"), tiles([["He asked", "lead"]].concat(o.reported)));
      }),
      h("ul", { class: "legend" },
        h("li", null, h("i", { class: "dg-key dg-helper" }), "do / does / did: drop it"),
        h("li", null, h("i", { class: "dg-key dg-subject" }), "subject: moves before the verb"),
        h("li", null, h("i", { class: "dg-key dg-verb" }), "verb: one step back")),
      h("p", { class: "dg-caption" }, "A reported question is a statement: subject, then verb, and a full stop."));
  }

  // Linking words by job, and the grammar that follows each one.
  var LINKERS = [
    ["Add", "", "as well as, in addition to", "Moreover, Furthermore, In addition"],
    ["Contrast", "although, even though, while", "despite, in spite of", "However, On the other hand"],
    ["Cause", "because, since, as", "because of, due to", ""],
    ["Result", "so", "", "As a result, Therefore"],
    ["Purpose", "so that", "in order to / so as to + verb", ""],
    ["Condition", "if, unless, as long as, in case", "", ""],
    ["Example", "", "such as, including", "For example, For instance"],
    ["Conclude", "", "", "All in all, Overall, In conclusion"]
  ];
  var LINKER_COLS = ["+ clause (subject + verb)", "+ noun, V-ing or verb (no subject)", "Starts a new sentence, with a comma"];
  function LinkingChart() {
    // on a phone the table stacks, so each cell carries its column name and empty cells drop out
    var cell = function (t, i) {
      return t ? h("td", null, h("span", { class: "dg-col", "aria-hidden": "true" }, LINKER_COLS[i]), t)
        : h("td", { class: "dg-empty" }, h("span", { class: "dg-none", "aria-label": "none" }, "–"));
    };
    return h("div", { class: "table-wrap stack dg-linkers" }, h("table", null,
      h("thead", null, h("tr", null, h("th", { scope: "col" }, "Job"), LINKER_COLS.map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, LINKERS.map(function (r) { return h("tr", null, h("th", { scope: "row" }, r[0]), cell(r[1], 0), cell(r[2], 1), cell(r[3], 2)); }))));
  }

  window.CLY_S3_VISUALS = {
    "past-perfect-timeline": PastPerfectTimeline,
    "present-participle": PresentParticiple,
    "past-participle": PastParticiple,
    "participle-compare": ParticipleCompare,
    "backshift": Backshift,
    "question-order": QuestionOrder,
    "linking-chart": LinkingChart
  };

  // ---------- Consolidation: sentence rewrites ----------

  var KINDS = [["present", "Present participle (V-ing)"], ["past", "Past participle (V3)"]];

  // set: one exercise from s3-consolidation-data.js. Each item is checked on its own: a miss gives the hint,
  // a second miss shows the model answer, and a right answer that slips on capitals or punctuation gets a reminder.
  function Rewrite(root, set, store) {
    var ids = Object.keys(set.items).map(Number);
    var saved = (store && store.get()) || {};
    var typed = saved.typed || {}, tries = saved.tries || {}, done = saved.done || {}, firstTry = saved.firstTry || {};
    var kind = saved.kind || {}, kindWrong = saved.kindWrong || {};
    var boxes = {}, summary = h("div", { "aria-live": "polite" }), fresh = new CLY.Fresh();
    // set.whole: the student types the whole new sentence instead of only the missing part
    var marking = function (id) { return set.whole ? wholeSentence(set.items[id]) : set.items[id]; };
    var save = function () { if (store) store.set({ typed: typed, tries: tries, done: done, firstTry: firstTry, kind: kind, kindWrong: kindWrong }); };
    // the student's words begin the sentence, so a phone keyboard should start with a capital
    var startsSentence = function (id) { return set.whole || !set.items[id].frame.split("___")[0].trim(); };

    // After a right answer the cursor moves on to the next item still to do, so a phone needs no scrolling.
    function focusNext(id) {
      var rest = ids.filter(function (n) { return n > id && !done[n]; }).concat(ids.filter(function (n) { return n < id && !done[n]; }));
      if (!rest.length) return;
      var target = boxes[rest[0]].querySelector("input, .choice:not([disabled])");
      if (target) target.focus();
    }
    function check(id) {
      if (done[id] || !(typed[id] || "").trim()) return;
      var r = judge(typed[id], marking(id));
      if (r.ok) { done[id] = true; if (!tries[id]) firstTry[id] = true; }
      else tries[id] = (tries[id] || 0) + 1;
      save(); draw(id); drawSummary();
      // a miss redraws the box, so the cursor goes back into it for the next try
      if (r.ok) focusNext(id); else boxes[id].querySelector("input").focus();
    }
    function pick(id, k) {
      if (k === set.items[id].kind) kind[id] = k;
      else (kindWrong[id] = kindWrong[id] || []).push(k);
      save(); draw(id);
      var next = boxes[id].querySelector("input, .choice:not([disabled])");
      if (next) next.focus();
    }
    var verdict = function (id, state, kids) {
      return h("div", { class: "verdict " + (state === "do" ? "do" : "hint") + (fresh.is("v" + id, state) ? " fresh" : "") }, kids);
    };

    function draw(id) {
      var it = set.items[id], parts = it.frame.split("___");
      var needsKind = it.kind && !kind[id] && !done[id];
      clear(boxes[id]);
      boxes[id].appendChild(h("p", { class: "question-text" }, h("span", { class: "n" }, id + "."), it.original));
      if (it.kind) boxes[id].appendChild(h("div", { class: "choices dg-kinds" }, KINDS.map(function (k) {
        var right = (kind[id] || (done[id] && it.kind)) === k[0], crossed = (kindWrong[id] || []).indexOf(k[0]) >= 0;
        return h("button", { type: "button", class: "choice" + (right ? " right" : crossed ? " crossed" : ""), disabled: right || crossed || !needsKind, "aria-pressed": String(right), onclick: function () { pick(id, k[0]); } }, k[1]);
      })));
      if (needsKind) {
        if ((kindWrong[id] || []).length) boxes[id].appendChild(verdict(id, "kind", [h("strong", null, "Look again."), "Does the subject after the comma do the action, or is it done to them (or do they feel it)?"]));
        return;
      }

      var r = done[id] ? judge(typed[id], marking(id)) : null;
      // the gap shows what is typed as it is typed; once right, it shows the correct version
      var gap = h("span", { class: "rw-gap" + (done[id] ? " right" : tries[id] ? " wrong" : ""), "aria-hidden": "true" }, done[id] ? r.model : (typed[id] || "").trim() || "______");
      var input = h("input", { type: "text", autocomplete: "off", autocapitalize: startsSentence(id) ? "sentences" : "off", spellcheck: "false", value: typed[id] || "", readonly: done[id] || null,
        placeholder: set.whole ? "Type the whole new sentence…" : "Type the missing part…",
        "aria-label": set.whole ? "Rewrite " + id + ": the whole sentence" : "Rewrite " + id + ": " + it.frame.replace("___", "blank"),
        oninput: function (e) { typed[id] = e.target.value; gap.textContent = e.target.value.trim() || "______"; save(); },
        onkeydown: function (e) { if (e.key === "Enter") { e.preventDefault(); check(id); } } });
      gap.addEventListener("click", function () { if (!done[id]) input.focus(); });
      if (!set.whole) boxes[id].appendChild(h("p", { class: "rw-frame" }, parts[0], gap, parts[1] || ""));
      else if (done[id]) boxes[id].appendChild(h("p", { class: "rw-frame" }, gap));
      boxes[id].appendChild(h("div", { class: "rw-row" }, input, done[id] ? null : h("button", { type: "button", class: "btn", onclick: function () { check(id); } }, "Check")));
      if (done[id]) {
        var copied = tries[id] > 1;
        boxes[id].appendChild(verdict(id, "do", [h("strong", null, copied ? "Done. Try this one again later." : tries[id] ? "Well done, you got there!" : "Correct!"), it.why,
          r.reminders.length ? [h("p", { class: "rw-fix-title" }, r.reminders.length > 1 ? "Small things to fix:" : "One thing to fix:"),
            h("ul", { class: "rw-reminders" }, r.reminders.map(function (n) { return h("li", null, n); }))] : null]));
      } else if (tries[id]) {
        var model = judge("", marking(id)).model;
        boxes[id].appendChild(verdict(id, "hint" + tries[id], [h("strong", null, "Not quite. Have another go."), it.hint,
          tries[id] > 1 ? h("p", null, "Model answer: ", h("strong", null, model), " Type it in to finish this one.") : null]));
      } else fresh.is("v" + id, "");
    }

    function drawSummary() {
      clear(summary);
      if (ids.some(function (id) { return !done[id]; })) return;
      var first = ids.filter(function (id) { return firstTry[id]; }).length;
      summary.appendChild(h("div", { class: "scoreboard done" },
        h("p", { class: "score" }, "All " + ids.length + " done."),
        first === ids.length ? h("p", null, "Every one right first time. Well done!") : null,
        h("p", { class: "meta" }, "Right first time: " + first + " / " + ids.length)));
    }
    function reset() {
      typed = {}; tries = {}; done = {}; firstTry = {}; kind = {}; kindWrong = {}; fresh = new CLY.Fresh();
      if (store) store.clear();
      ids.forEach(draw); drawSummary();
      CLY.scrollTo(root);
    }

    var passage = set.paragraphs.map(function (parts) {
      return h(set.list ? "li" : "p", null, parts.map(function (part) {
        return typeof part === "number" ? h("u", { class: "rw-source" }, h("sup", null, part), " ", set.items[part].original) : part;
      }));
    });
    // inside a set switcher the title is already shown above the squares
    root.appendChild(h("p", { class: "tagline" }, root.closest(".set-panel") ? set.textType : set.textType + ": " + set.title));
    root.appendChild(h("p", null, set.task));
    // when it was said and when it is reported decide what changes, so the situation gets its own box
    if (set.situation) root.appendChild(h("dl", { class: "rw-situation" }, set.situation.map(function (s) { return h("div", null, h("dt", null, s[0]), h("dd", null, s[1])); })));
    root.appendChild(set.list ? h("ul", { class: "passage rw-quotes" }, passage) : h("div", { class: "passage" }, passage));
    var list = h("div", { class: "rw-items" }, ids.map(function (id) { boxes[id] = h("div", { class: "question" }); return boxes[id]; }));
    root.appendChild(list);
    ids.forEach(draw);
    root.appendChild(summary);
    root.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start again")));
    drawSummary();
  }

  window.CLY_S3_REWRITE = Rewrite;
})();
