/* CLY English: the cloze word box, shared by the weekly challenge paper and the S.3 practice cloze.
   Holds the table or chips, the panel that reopens the box over the passage, the worked examples, and the marking of one blank.
   Marking copies markCloze in apps-script/Logic.gs; tests/s3-practice.test.js checks the two agree. */
(function () {
  "use strict";

  // Whole groups the S.3 box shows when a set has blanks on that topic. Students choose the word themselves.
  var RANGES = {
    "Indefinite pronouns": { name: "Indefinite pronouns", words: ["somebody", "someone", "something", "anybody", "anyone", "anything", "everybody", "everyone", "everything", "nobody", "no one", "nothing"] },
    "So, so that, so as to": { name: "So, so that, so as to", words: ["so", "so that", "so as to"] },
    "Must, have to, need to": { name: "Must, have to, need to", words: ["must", "have to", "need to"] },
    "Linking words": { name: "Linking words", words: ["moreover", "furthermore", "in addition", "as well as", "however", "although", "even though", "yet", "on the other hand", "because", "since", "due to", "as a result", "therefore", "for example", "for instance", "such as", "including", "as long as", "provided that", "in case", "in order to", "so as to", "so that", "all in all", "overall", "in conclusion", "to sum up"] }
  };

  var EXAMPLES = {
    verb: ["Yesterday I ____ home late.", "Box: go → went"],
    phrase: ["Tom yam ____ is spicy.", "Box: a Thai soup → , a Thai soup,"],
    noCommas: ["I have many friends. My friend ____ is here.", "Box: Kit → Kit"],
    choose: ["____ called me, but I don't know who.", "Choose: someone"]
  };

  // ---------- Marking one blank ----------

  var NOT_FORMS = { "won't": "will not", "can't": "cannot", "shan't": "shall not" };
  function bothNegatives(answer) {
    var full = answer.replace(/\b(\w+)n't\b/g, function (w, stem) { return NOT_FORMS[w] || stem + " not"; });
    var forms = [answer, full, answer.replace(/n't\b/g, "nt")];
    if (/\bcannot\b/.test(full)) forms.push(full.replace(/\bcannot\b/, "can not"));
    return forms;
  }
  var ignoreCommas = function (s) { return String(s).toLowerCase().replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim(); };
  var keepCommas = function (s) { return String(s).toLowerCase().replace(/，/g, ",").replace(/[’']/g, "'").replace(/[.!?]/g, "").replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ").trim(); };
  function isRight(blank, typed) {
    var clean = blank.commas ? keepCommas : ignoreCommas;
    return [].concat.apply([], blank.answers.map(bothNegatives)).map(clean).indexOf(clean(typed || "")) >= 0;
  }

  // Starts short so sentences stay readable, and grows only as the student types, so a blank's size gives nothing away.
  function fitBlank(input) {
    input.style.width = input.value.length > 12 ? (input.value.length + 3) + "ch" : "";
  }

  // ---------- The box ----------

  // The box can be on the page twice (the list above the passage and the panel), so crossing off updates every copy.
  function create(ch, ranges) {
    var h = CLY.h, crossed = {}, copies = {};
    function item(v, cls) {
      var b = h("button", { type: "button", class: cls, "aria-pressed": String(!!crossed[v]), onclick: function () {
        crossed[v] = !crossed[v];
        copies[v].forEach(function (c) {
          c.classList.toggle("used", crossed[v]);
          c.setAttribute("aria-pressed", String(crossed[v]));
        });
      } }, v);
      (copies[v] = copies[v] || []).push(b);
      return h("li", null, b);
    }
    function group(name, note, list) { return h("div", { class: "word-group" }, h("p", { class: "word-group-name" }, name, " ", h("span", { class: "word-group-note" }, note)), list); }
    function cells(items, cls) { return h("ul", { class: "word-cells" + cls }, items.map(function (v) { return item(v, "word-cell"); })); }

    // Smallest group first, so the groups with few words are in view without scrolling the panel.
    function table() {
      var groups = [];
      if (ch.bank && ch.bank.length) groups.push({ size: ch.bank.length, el: group("Verbs", "use each at most once, in the right form", cells(ch.bank, "")) });
      if (ch.phrases && ch.phrases.length) groups.push({ size: ch.phrases.length, el: group("Names and phrases", ch.commas ? "use each at most once, with commas if needed" : "use each at most once", cells(ch.phrases, " wide")) });
      (ch.open || []).forEach(function (topic) {
        var range = ranges[topic];
        if (!range) return;
        // A group to choose from isn't crossed off, because a word can be used again.
        groups.push({ size: range.words.length, el: group(range.name, "choose the right one; you can use one again",
          h("ul", { class: "word-cells range" }, range.words.map(function (w) { return h("li", null, h("span", { class: "word-cell word-range" }, w)); }))) });
      });
      return h("div", { class: "word-table" }, groups.sort(function (a, b) { return a.size - b.size; }).map(function (g) { return g.el; }));
    }
    function chips() { return h("ul", { class: "chips" }, ch.bank.map(function (v) { return item(v, "chip"); })); }

    // Reopens the box over the passage, and stays open while typing so the student can see the words.
    function panel(body) {
      var el = h("div", { class: "word-panel" }, body), lastBlank = null;
      var view = window.visualViewport;
      var button = h("button", { type: "button", class: "btn-quiet box-toggle", "aria-expanded": "false", onclick: function () { open(!el.classList.contains("open")); } }, "Box");
      function isOpen() { return el.classList.contains("open"); }
      function size() { el.style.maxHeight = Math.max(120, Math.round((view ? view.height : window.innerHeight) * 0.35)) + "px"; }
      // Keeps the blank being typed in just below the open panel.
      function keepInView() {
        if (!lastBlank || !isOpen() || !el.isConnected || !el.offsetParent || !lastBlank.offsetParent) return;
        var below = el.parentNode.getBoundingClientRect().bottom + 12, box = lastBlank.getBoundingClientRect();
        var bottom = view ? view.height : window.innerHeight;
        if (box.top < below || box.bottom > bottom) window.scrollBy(0, box.top - below);
      }
      function open(want) {
        if (want) size();
        el.classList.toggle("open", want);
        button.setAttribute("aria-expanded", String(want));
        button.textContent = want ? "Close" : "Box";
        if (want) keepInView();
      }
      // The on-screen keyboard shrinks the visible page, so the panel is sized again when it opens.
      if (view) view.addEventListener("resize", function () { if (isOpen()) { size(); keepInView(); } });
      return { button: button, el: el, open: open, focused: function (input) { lastBlank = input; keepInView(); } };
    }
    return { table: table, chips: chips, panel: panel };
  }

  // Worked examples; show says which kinds, and all kinds show when the paper isn't known yet.
  function examples(show) {
    var h = CLY.h, rows = [EXAMPLES.verb].concat(show.commas ? [EXAMPLES.phrase, EXAMPLES.noCommas] : [], show.choose ? [EXAMPLES.choose] : []);
    return h("ul", { class: "cloze-examples" }, rows.map(function (r) { return h("li", null, h("span", null, r[0]), h("strong", null, r[1])); }));
  }

  window.CLY_WORD_BOX = { RANGES: RANGES, create: create, examples: examples, isRight: isRight, fitBlank: fitBlank };
})();
