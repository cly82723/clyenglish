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
    return h("p", null, h("button", { type: "button", class: "link-btn tap", onclick: function () { CLY.go("participle-consolidation"); } }, "Compare the two kinds side by side"));
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
    ["Condition", "if, as long as, in case", "", ""],
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

  // Indefinite pronouns: a row of five shows how many each word means. Round for people, square for things.
  // on: how many are filled. any: all are dashed, because it doesn't matter which. use: where the word goes.
  var CROWD = [
    { people: "everyone / everybody", things: "everything", on: 5, means: "all of them", use: "+ ?", p: "Everyone enjoyed the film.", t: "Everything in the film was great." },
    { people: "someone / somebody", things: "something", on: 1, means: "one, but I don't know which", use: "+ ?", p: "Someone took my seat.", t: "Something is missing." },
    { people: "anyone / anybody", things: "anything", any: true, means: "it doesn't matter which", use: "+ – ?", p: "I don't know anyone here.", t: "There isn't anything to eat." },
    { people: "no one / nobody", things: "nothing", on: 0, means: "zero", use: "–", p: "No one has seen it.", t: "I know nothing about it." },
    { people: "none of my friends", things: "none of the films", on: 0, means: "zero from a group", use: "–", p: "None of my friends came.", t: "None of the films interests me." }
  ];
  var SIGN_NAMES = { "+": "positive", "–": "negative", "?": "question" };
  function PronounCrowd() {
    var kind = "people", wrap = h("div", { class: "figure" });
    function draw() {
      clear(wrap);
      wrap.appendChild(h("ul", { class: "chips" }, [["people", "People"], ["things", "Things"]].map(function (k) {
        return h("li", null, h("button", { type: "button", class: "chip", "aria-pressed": String(kind === k[0]), onclick: function () { kind = k[0]; draw(); wrap.querySelector("[aria-pressed='true']").focus(); } }, k[1]));
      })));
      wrap.appendChild(h("ul", { class: "dg-crowds" }, CROWD.map(function (r) {
        var dots = [0, 1, 2, 3, 4].map(function (i) { return h("i", { class: "dg-dot" + (kind === "things" ? " dg-thing" : "") + (r.any ? " dg-any" : i < r.on ? " dg-on" : "") }); });
        return h("li", null,
          h("span", { class: "dg-dots", "aria-hidden": "true" }, dots),
          h("span", { class: "dg-crowd-word" }, h("strong", null, r[kind]), h("small", null, r.means)),
          h("span", { class: "dg-signs" }, r.use.split(" ").map(function (u) { return h("span", { class: "dg-sign", title: SIGN_NAMES[u] }, h("span", { "aria-hidden": "true" }, u), h("span", { class: "visually-hidden" }, SIGN_NAMES[u])); })),
          h("em", { class: "dg-crowd-eg" }, kind === "people" ? r.p : r.t));
      })));
      wrap.appendChild(h("ul", { class: "legend" }, ["+ positive", "– negative", "? question"].map(function (t) { return h("li", null, t); })));
      wrap.appendChild(h("p", { class: "dg-caption" }, "All of them take a ", h("strong", null, "singular verb"), ": ", h("em", null, "Everyone loves this film.")));
    }
    draw();
    return wrap;
  }

  // Noun phrases: take the phrase out, and see whether the sentence still says who or what.
  var PHRASES = [
    { label: "Defining: it is needed", before: "Tourists visit the Indian palace", phrase: " Taj Mahal", after: " every year.", gone: "Which Indian palace? We can't tell, so the phrase must stay. No commas." },
    { label: "Non-defining: it is extra", before: "The croissant", phrase: ", a famous French pastry,", after: " is my favourite breakfast.", gone: "We still know what is meant, so the phrase was extra. It goes between commas." }
  ];
  function NounPhraseTest() {
    return h("div", { class: "figure" },
      h("div", { class: "pairs" }, PHRASES.map(function (p) {
        var out = false;
        var phrase = h("span", { class: "dg-phrase" }, p.phrase);
        var result = h("p", { class: "note-line", hidden: true }, p.gone);
        var btn = h("button", { type: "button", class: "btn-quiet", "aria-pressed": "false", onclick: function () {
          out = !out;
          phrase.classList.toggle("dg-out", out);
          result.hidden = !out;
          btn.setAttribute("aria-pressed", String(out));
          btn.textContent = out ? "Put it back" : "Take it out";
        } }, "Take it out");
        return h("div", { class: "dg-who" },
          h("p", { class: "field-label" }, p.label),
          h("p", { class: "dg-sentence" }, p.before, phrase, p.after),
          btn, h("div", { "aria-live": "polite" }, result));
      })),
      h("p", { class: "dg-caption" }, "Needed: ", h("strong", null, "no commas"), ". Extra: ", h("strong", null, "a comma on both sides"), "."));
  }

  // Bare infinitives: each group of words leads straight to V1. Some need a person in between.
  var BARE = [
    ["Modal verbs", "can, could, may, might, must, should, will, would", false, "You must leave now."],
    ["Short phrases", "need not, dare not, had better, would rather … than", false, "You had better stop."],
    ["Make it happen", "make, let, have", true, "Mum made me tidy my room."],
    ["Your senses", "see, hear, watch, notice, feel", true, "I heard her sing."]
  ];
  function BareInfinitive() {
    return h("div", { class: "figure" },
      h("p", { class: "dg-tiles" },
        ["to go", "goes", "went", "going"].map(function (w) { return h("s", { class: "dg-tile dg-helper" }, w); }),
        h("span", { class: "dg-tile dg-verb" }, "go")),
      h("ul", { class: "dg-bare" }, BARE.map(function (r) {
        return h("li", null,
          h("p", { class: "field-label" }, r[0]),
          h("p", { class: "dg-flow" },
            h("span", { class: "dg-chip" }, r[1]),
            r[2] ? [h("span", { class: "dg-arrow", "aria-hidden": "true" }, "+"), h("span", { class: "dg-chip dg-subject" }, "someone")] : null,
            h("span", { class: "dg-arrow", "aria-hidden": "true" }, "→"),
            h("span", { class: "dg-chip dg-action" }, "V1")),
          h("p", { class: "note-line" }, r[3]));
      })),
      h("p", { class: "dg-caption" }, "One word can go both ways: ", h("em", null, "help me carry"), " and ", h("em", null, "help me to carry"), " are both correct."));
  }

  // So, so that, so as to: a result really happened (solid box); a purpose is only the aim (dashed box).
  var SO_ROWS = [
    { label: "So: the result", start: "It rained", word: ", so", end: "the match was cancelled.", aim: false, next: "+ subject + verb. It happened." },
    { label: "So that: the aim", start: "I left early", word: "so that", end: "I could catch the bus.", aim: true, next: "+ subject + can / could. It was the plan." },
    { label: "So as to: the aim", start: "I left early", word: "so as to", end: "catch the bus.", aim: true, next: "+ V1 only. It was the plan." }
  ];
  function SoChart() {
    return h("div", { class: "figure" },
      h("ul", { class: "dg-bare" }, SO_ROWS.map(function (r) {
        return h("li", null,
          h("p", { class: "field-label" }, r.label),
          h("p", { class: "dg-flow" },
            h("span", { class: "dg-chip" }, r.start),
            h("span", { class: "dg-arrow" }, r.word, h("span", { "aria-hidden": "true" }, " →")),
            h("span", { class: "dg-chip" + (r.aim ? " dg-aim" : " dg-subject") }, r.end)),
          h("p", { class: "note-line" }, r.next));
      })),
      h("ul", { class: "legend" },
        h("li", null, h("i", { class: "dg-key dg-subject" }), "it really happened"),
        h("li", null, h("i", { class: "dg-key dg-aim" }), "only the aim: it may not have happened")));
  }

  // Must, have to, need to: who says so, then the two very different negatives.
  var WHO_SAYS = [
    ["must", "I feel it myself", "I must call Grandma."],
    ["have to", "A rule or another person says so", "We have to wear a uniform."],
    ["need to", "It is necessary now", "We need to leave now."]
  ];
  var sign = function (allowed) {
    return s("svg", { viewBox: "0 0 44 44", class: "dg-icon " + (allowed ? "dg-icon-ok" : "dg-icon-no"), "aria-hidden": "true" },
      s("circle", { cx: "22", cy: "22", r: "18" }),
      allowed ? s("path", { d: "M13,23 L20,30 L32,15" }) : s("line", { x1: "10", y1: "34", x2: "34", y2: "10" }));
  };
  function MustChart() {
    return h("div", { class: "figure" },
      h("p", { class: "field-label" }, "Positive: who says so?"),
      h("div", { class: "dg-steps" }, WHO_SAYS.map(function (w) {
        return h("div", { class: "dg-step" }, h("p", { class: "dg-who-word" }, w[0]), h("p", { class: "note-line" }, w[1]), h("p", null, h("em", null, w[2])));
      })),
      h("p", { class: "field-label" }, "Negative: one \"not\", two meanings"),
      h("div", { class: "pairs" },
        h("div", { class: "dg-who" }, sign(false), h("p", { class: "dg-who-word dg-no" }, "must not"), h("p", { class: "note-line" }, "Not allowed. Don't do it."), h("p", null, h("em", null, "You must not touch the paintings."))),
        h("div", { class: "dg-who" }, sign(true), h("p", { class: "dg-who-word dg-yes" }, "don't have to / don't need to"), h("p", { class: "note-line" }, "Not necessary. It's your choice."), h("p", null, h("em", null, "You don't have to come.")))),
      h("p", { class: "dg-caption" }, "After ", h("strong", null, "must"), ", use V1 with no \"to\". For the past, use ", h("strong", null, "had to"), "."));
  }

  window.CLY_S3_VISUALS = {
    "pronoun-crowd": PronounCrowd,
    "noun-phrase-test": NounPhraseTest,
    "bare-infinitive": BareInfinitive,
    "so-chart": SoChart,
    "must-chart": MustChart,
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

  // ---------- Practice cloze: the weekly challenge's paper with no clock ----------

  function PracticeCloze(root, set, store) {
    var W = window.CLY_WORD_BOX, saved = (store && store.get()) || {};
    var typed = saved.typed || {}, checked = !!saved.checked, showing = !!saved.showing;
    var ids = Object.keys(set.blanks).map(Number), blanks = ids.map(function (id) { return set.blanks[id]; });
    var names = function (list) { return list.map(function (b) { return b.verb; }); };
    var boxed = blanks.filter(function (b) { return b.verb; });
    var box = W.create({
      bank: names(boxed.filter(function (b) { return !b.commas; })).concat(set.distractors || []).sort(),
      phrases: names(boxed.filter(function (b) { return b.commas; })).concat(set.phraseDistractors || []).sort(),
      commas: blanks.some(function (b) { return b.commas; }),
      open: blanks.filter(function (b) { return !b.verb; }).map(function (b) { return b.topic; }).filter(function (t, i, all) { return all.indexOf(t) === i; })
    }, W.RANGES, "cly:crossed:practice:" + set.title);
    var panel = box.panel(box.table()), wraps = {};
    var score = h("p", { class: "practice-score", "aria-live": "polite" }), filled = h("p");
    var answers = h("div", { class: "practice-answers", "aria-live": "polite" }), actions = h("div", { class: "actions" });
    var save = function () { if (store) store.set({ typed: typed, checked: checked, showing: showing }); };
    var countFilled = function () { filled.textContent = ids.filter(function (id) { return (typed[id] || "").trim(); }).length + " / " + ids.length + " filled"; };

    function check() {
      checked = true;
      var right = ids.filter(function (id) { var ok = W.isRight(set.blanks[id], typed[id]); wraps[id].mark(ok); return ok; }).length;
      score.textContent = right === ids.length ? "All " + ids.length + " right. Well done!" : right + " / " + ids.length + " right. Change the ones with a cross and check again.";
      CLY.replay(score, "fresh");
      save();
      drawActions();
    }
    function drawAnswers() {
      CLY.clear(answers);
      if (!showing) return;
      answers.appendChild(h("ul", { class: "marks" }, ids.map(function (id) {
        var b = set.blanks[id];
        return h("li", { class: W.isRight(b, typed[id]) ? "do" : "avoid" }, h("strong", null, id + ". " + b.answers.join(" / ")), " ", b.why);
      })));
    }
    function drawActions() {
      CLY.clear(actions);
      actions.appendChild(h("button", { type: "button", class: "btn", onclick: check }, "Check my answers"));
      if (checked && !showing) actions.appendChild(h("button", { type: "button", class: "btn-quiet", onclick: function () { showing = true; save(); drawAnswers(); drawActions(); } }, "Show the answers"));
      actions.appendChild(h("button", { type: "button", class: "btn-quiet", onclick: function () {
        if (store) store.clear();
        box.forget();
        CLY.clear(root);
        PracticeCloze(root, set, store);
        CLY.scrollTo(root);
      } }, "Start again"));
    }

    var passage = h("div", { class: "passage" }, set.paragraphs.map(function (parts) {
      return h("p", null, parts.map(function (part) {
        if (typeof part !== "number") return part;
        var f = CLY.blank(part, { label: "Blank " + part, oninput: function (e) {
          typed[part] = e.target.value;
          W.fitBlank(e.target);
          f.mark(null);
          countFilled();
          save();
        } });
        wraps[part] = f;
        f.input.value = typed[part] || "";
        W.fitBlank(f.input);
        W.setUpBlank(f.input, part, ids.length, function () { return passage.querySelectorAll(".blank input"); });
        f.input.addEventListener("focus", function () { panel.focused(f.input); });
        return f;
      }));
    }));

    root.appendChild(h("p", { class: "tagline" }, root.closest(".set-panel") ? set.textType : set.textType + ": " + set.title));
    root.appendChild(h("p", null, "Fill in every blank using the word box. Tapping a word only crosses it off: type your answer in the blank."));
    root.appendChild(W.examples({ commas: blanks.some(function (b) { return b.commas; }), choose: blanks.some(function (b) { return !b.verb; }) }));
    root.appendChild(h("div", { class: "tip" }, h("p", { class: "field-label" }, "Word box"), box.table()));
    root.appendChild(h("div", { class: "practice-sheet" },
      h("div", { class: "practice-bar" }, filled, panel.button, panel.el),
      passage));
    root.appendChild(score);
    root.appendChild(actions);
    root.appendChild(answers);
    countFilled();
    drawActions();
    drawAnswers();
    if (checked) check();
  }

  window.CLY_S3_PRACTICE_SHEET = PracticeCloze;

  // ---------- Each topic is long on a phone, so its top links straight to its parts ----------

  document.querySelectorAll("#main > section").forEach(function (section) {
    var parts = section.querySelectorAll(":scope > .part[id]");
    if (parts.length < 2) return;
    section.querySelector("h2").insertAdjacentElement("afterend", h("nav", { class: "topic-jumps", "aria-label": "In this topic" },
      Array.prototype.map.call(parts, function (part) {
        var title = part.querySelector(":scope > h3");
        return h("a", { href: "#" + part.id }, title ? title.textContent : "Rules");
      })));
  });
})();
