/* CLY English Weekly Challenge: the weekly quests, under "This week" on the league page.
   Three quests a week, marked by the league (apps-script/Actions.gs): fixing last week's mistakes, and two of the
   proofreading sprint, words of the week and the level-up ladder. Every third quest passed earns a shield, which keeps the
   streak alive through one missed week. Quests never change a score, a place or league points.
   A wrong answer is marked and gets a hint, never the answer. With an older web app (no quests yet) nothing shows. */
(function () {
  "use strict";
  var h = CLY.h, clear = CLY.clear;
  var plural = function (n, word) { return n + " " + word + (n === 1 ? "" : "s"); };
  var two = function (n) { return (n < 10 ? "0" : "") + n; };
  var clock = function (ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ":" + two(s % 60); };
  var TICK_MS = 1000;
  var LOW_MS = 60 * 1000;   // the sprint clock turns red in its last minute
  var PASS_PAUSE_MS = 1600; // "Quest done" stays this long before the list shows the quest as done

  var ABOUT = {
    fix: "Your wrong answers from last week's challenge, to put right.",
    hardest: "Nothing of your own to fix, so here are the items most students got wrong last week.",
    sprint: "Eight lines, five mistakes, five minutes. Type each wrong line out, corrected.",
    words: "This week's words of the day, in a new paragraph. Spell each one exactly.",
    ladder: "Climb from Level 3: pick the better rewrite, then say why it is better."
  };

  // The whole section. It asks the league for this week's quests; any error (an older web app) leaves it hidden.
  function section(league) {
    var box = h("section", { class: "quests", "aria-labelledby": "quests-head", hidden: true });
    function load() {
      league.call("quests").then(draw, function () { box.hidden = true; });
    }
    function draw(d) {
      clear(box);
      if (!d.quests || !d.quests.length) { box.hidden = true; return; }
      box.hidden = false;
      box.appendChild(h("h2", { id: "quests-head" }, "This week's quests"));
      box.appendChild(shieldLine(d));
      box.appendChild(h("ol", { class: "quest-list" }, d.quests.map(function (q) { return card(league, q, load); })));
      box.appendChild(h("p", { class: "meta" }, "Quests never change your score or your place. They earn shields, and points for your class."));
    }
    load();
    return box;
  }

  function shieldLine(d) {
    var passed = d.quests.filter(function (q) { return q.passed; }).length;
    var full = d.shields >= d.maxShields;
    return h("div", { class: "shield-line" },
      h("p", null, h("strong", null, passed + " of " + d.quests.length + " done this week."), " ",
        "Shields: ", h("strong", null, d.shields + " of " + d.maxShields), ". ",
        full ? "You hold the most you can." : plural(d.toNext, "more quest") + " for the next."),
      h("p", { class: "meta" }, "A shield keeps your streak going if you miss a week's challenge. It is used by itself."));
  }

  // One quest: what it is, how far the student has got, and the quest itself once opened.
  function card(league, q, reload) {
    var body = h("div", { class: "quest-body" });
    var status = q.passed ? h("span", { class: "quest-status done" }, "Done")
      : h("span", { class: "quest-status" }, q.tries ? "Tried " + (q.tries === 1 ? "once" : q.tries + " times") : "Not started");
    var open = q.passed ? null : h("button", { type: "button", class: "btn-quiet", onclick: function () {
      open.hidden = true;
      clear(body).appendChild(form(league, q, reload));
      var first = body.querySelector("input, button");
      if (first) first.focus({ preventScroll: true });
    } }, q.tries ? "Try again" : "Start");
    return h("li", { class: "quest" + (q.passed ? " passed" : "") },
      h("div", { class: "quest-head" },
        h("div", null, h("h3", null, q.title), h("p", { class: "quest-about" }, ABOUT[q.kind === "fix" && q.quest && !q.quest.own ? "hardest" : q.kind] || "")), status),
      open, body);
  }

  function form(league, q, done) {
    if (q.kind === "fix") return fixForm(league, q, done);
    if (q.kind === "sprint") return sprintForm(league, q, done);
    if (q.kind === "words") return wordsForm(league, q, done);
    return ladderForm(league, q, done);
  }

  // The verdict under a quest. A pass reloads the list, so the card shows Done and the shield count moves.
  function verdict(area, r, wrongText) {
    clear(area).appendChild(r.passed
      ? h("div", { class: "verdict do fresh", role: "status" }, h("strong", null, "Quest done."), "That counts towards your next shield.")
      : h("div", { class: "verdict hint fresh", role: "status" }, h("strong", null, "Not yet. Have another go."), wrongText));
  }

  function checkButton(label, onclick) { return h("div", { class: "actions" }, h("button", { type: "button", class: "btn", onclick: onclick }, label)); }

  function send(league, kind, answers, area, button, after) {
    button.disabled = true;
    league.call("questAnswer", { kind: kind, answers: answers }).then(function (r) {
      button.disabled = false;
      after(r);
    }, function (err) {
      button.disabled = false;
      clear(area).appendChild(h("p", { class: "not-counted", role: "status" }, err.message));
    });
  }

  var stillWrong = function (n, thing) { return n === 1 ? "1 " + thing + " is still wrong. It is marked." : n + " " + thing + "s are still wrong. They are marked."; };
  var field = function (label, extra) {
    return h("input", Object.assign({ type: "text", class: "fix-input", autocomplete: "off", autocapitalize: "off", spellcheck: "false", "aria-label": label }, extra));
  };

  // ---------- Fix last week's mistakes ----------

  function fixForm(league, q, done) {
    var d = q.quest, answers = {}, area = h("div", { "aria-live": "polite" }), rows = {};
    var cloze = d.format === "cloze";
    var items = h("ol", { class: "fix-items" }, d.items.map(function (it) {
      var input = field(cloze ? "Blank " + it.id : "Line " + (Number(it.id) + 1) + ", corrected",
        { value: cloze ? "" : it.text, oninput: function (e) { answers[it.id] = e.target.value; } });
      if (!cloze) answers[it.id] = it.text;
      var hint = h("p", { class: "fix-hint", hidden: true });
      rows[it.id] = { input: input, hint: hint };
      var text = cloze ? it.text.split("[" + it.id + "]") : null;
      return h("li", null,
        cloze ? h("p", { class: "fix-line" }, text[0], h("span", { class: "gap-wrap" }, input), text[1]) : [h("p", { class: "fix-line" }, it.text), input],
        it.yours ? h("p", { class: "meta" }, "Last week you wrote: ", h("em", null, it.yours)) : null, hint);
    }));
    var button, check = checkButton("Check", function () {
      send(league, "fix", answers, area, button, function (r) {
        Object.keys(rows).forEach(function (id) {
          var wrong = (r.wrong || []).indexOf(id) >= 0, hint = wrong && r.hints && r.hints[id];
          rows[id].input.setAttribute("aria-invalid", wrong ? "true" : "false");
          rows[id].input.classList.toggle("wrong", wrong);
          rows[id].hint.hidden = !hint;
          rows[id].hint.textContent = hint || "";
        });
        verdict(area, r, stillWrong((r.wrong || []).length, cloze ? "blank" : "line") + (r.tries < 2 ? " After your second try, each one gets a hint." : ""));
        if (r.passed) setTimeout(done, PASS_PAUSE_MS);
      });
    });
    button = check.querySelector("button");
    return h("div", null,
      cloze && d.bank && d.bank.length ? h("p", { class: "fix-bank" }, h("span", { class: "field-label" }, "Verbs"), " ", d.bank.join(" · ")) : null,
      h("p", null, cloze ? "Write each verb in the right form." : "Type each line out, corrected. One word in it is wrong, missing or extra."),
      items, check, area);
  }

  // ---------- Proofreading sprint ----------

  function sprintForm(league, q, done) {
    var wrap = h("div"), area = h("div", { "aria-live": "polite" });
    var go = h("button", { type: "button", class: "btn", onclick: start }, "Start the " + q.quest.minutes + " minutes");
    wrap.appendChild(h("p", null, "The clock starts when you press Start. Leave correct lines as they are: changing one fails the sprint. " +
      "Fix four of the five mistakes to pass. A new try gets a new passage."));
    wrap.appendChild(h("div", { class: "actions" }, go));
    wrap.appendChild(area);
    function start() {
      go.disabled = true;
      league.call("questStart", { kind: "sprint" }).then(function (p) {
        if (p.passed) return done();
        clear(wrap);
        var answers = {}, endsAt = Date.now() + p.remainingMs, timer = null;
        var left = h("span", { class: "sprint-clock", role: "timer", "aria-label": "Time left" }, clock(p.remainingMs));
        var lines = h("ol", { class: "sprint-lines" }, p.lines.map(function (text, i) {
          return h("li", null, field("Line " + (i + 1), { value: text, oninput: function (e) { answers[i] = e.target.value; } }));
        }));
        var button, check = checkButton("Hand in", finish);
        button = check.querySelector("button");
        wrap.appendChild(h("p", { class: "sprint-head" }, h("strong", null, p.title), left));
        wrap.appendChild(lines);
        wrap.appendChild(check);
        wrap.appendChild(area);
        timer = setInterval(function () {
          var ms = endsAt - Date.now();
          left.textContent = clock(ms);
          left.classList.toggle("low", ms < LOW_MS);
          if (ms <= 0) finish();
        }, TICK_MS);
        function finish() {
          clearInterval(timer);
          if (button.disabled || button.hidden) return;
          lines.querySelectorAll("input").forEach(function (x) { x.readOnly = true; });
          send(league, "sprint", answers, area, button, function (r) {
            button.hidden = true;
            verdict(area, r, (r.timeUp ? "Time was up. " : "") + "You fixed " + r.found + " of " + r.errors + "." +
              (r.changedRight ? " You changed " + plural(r.changedRight, "line") + " that " + (r.changedRight === 1 ? "was" : "were") + " already right." : "") +
              " Your next try is a new passage.");
            if (r.passed) return setTimeout(done, PASS_PAUSE_MS);
            area.appendChild(h("div", { class: "actions" }, h("button", { type: "button", class: "btn-quiet", onclick: function () { done(); } }, "Back to the quests")));
          });
        }
      }, function (err) { go.disabled = false; clear(area).appendChild(h("p", { class: "not-counted", role: "status" }, err.message)); });
    }
    return wrap;
  }

  // ---------- Words of the week ----------

  function wordsForm(league, q, done) {
    var d = q.quest, answers = {}, inputs = {}, area = h("div", { "aria-live": "polite" });
    var text = h("div", { class: "words-text" }, d.paragraphs.map(function (parts) {
      return h("p", null, parts.map(function (part) {
        if (typeof part !== "number") return part;
        var gap = d.gaps[part];
        var input = h("input", { type: "text", class: "word-gap", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
          "aria-label": "Gap " + part + ", starts with " + gap.first, oninput: function (e) { answers[part] = e.target.value; } });
        inputs[part] = input;
        return h("span", { class: "gap-wrap" }, h("b", { "aria-hidden": "true" }, gap.first), input);
      }));
    }));
    var button, check = checkButton("Check", function () {
      send(league, "words", answers, area, button, function (r) {
        Object.keys(inputs).forEach(function (id) {
          var wrong = (r.wrong || []).indexOf(String(id)) >= 0;
          inputs[id].classList.toggle("wrong", wrong);
          inputs[id].setAttribute("aria-invalid", wrong ? "true" : "false");
        });
        verdict(area, r, r.score + " of " + r.outOf + " right. The wrong ones are marked: check the word and its spelling.");
        if (r.passed) setTimeout(done, PASS_PAUSE_MS);
      });
    });
    button = check.querySelector("button");
    return h("div", null, h("p", null, "The first letter is given: type the rest of the word. Five of six right passes."), text, check, area);
  }

  // ---------- Level-up ladder ----------

  function ladderForm(league, q, done) {
    var d = q.quest, answers = {}, area = h("div", { "aria-live": "polite" }), sets = [];
    var radios = function (name, options, onpick) {
      return options.map(function (o, i) {
        return h("label", { class: "ladder-choice" }, h("input", { type: "radio", name: name, value: String(i), onchange: function () { onpick(i); } }), h("span", null, o));
      });
    };
    var rungs = d.rungs.map(function (r, n) {
      answers[n] = {};
      var fs = h("fieldset", { class: "rung" },
        h("legend", null, "Up to Level " + r.to),
        h("p", { class: "field-label" }, "The better rewrite"),
        radios("quest-rung" + n, r.options, function (i) { answers[n].pick = i; }),
        h("p", { class: "field-label" }, "Why is it better?"),
        radios("quest-why" + n, r.reasons, function (i) { answers[n].reason = i; }));
      sets.push(fs);
      return fs;
    });
    var button, check = checkButton("Check", function () {
      send(league, "ladder", answers, area, button, function (r) {
        var notes = (r.rungs || []).map(function (x, n) {
          sets[n].classList.toggle("wrong", !(x.rewrite && x.reason));
          return x.rewrite && x.reason ? null : "Level " + d.rungs[n].to + ": " + (!x.rewrite ? "look again at the rewrite" : "right rewrite, but look again at why");
        }).filter(Boolean);
        verdict(area, r, notes.join(". ") + ".");
        if (r.passed) setTimeout(done, PASS_PAUSE_MS);
      });
    });
    button = check.querySelector("button");
    return h("div", null, h("p", { class: "ladder-start" }, h("span", { class: "lv" }, "3"), " ", d.start), rungs, check, area);
  }

  window.CLY_QUESTS = { section: section };
})();
