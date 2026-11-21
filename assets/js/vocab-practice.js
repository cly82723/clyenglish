/* CLY English: S.3 vocab flashcards and quiz. Cards come from data/vocab-cards.js, meanings and word families from
   data/vocab-data.js. Progress stays on this device: no sign-in, no timer, no lives. */
(function () {
  "use strict";

  var h = CLY.h, clear = CLY.clear;
  var LEARNED = "cly:cards:";        // + deck id: the cards marked "Got it"
  var BEST = "cly:quiz-best:";       // + deck id: the best first-try score
  var SETS = "cly:sets-done:vocab-quiz";   // decks whose quiz round has counted as a practice set (stickers.js reads this)
  var ROUND = 10;
  var COUNTS_AT = 6;                 // first-try answers needed for a round to count as a practice set

  function load(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: it lasts for this visit only */ }
  }
  function shuffle(list) { return CLY.shuffled(list.length).map(function (i) { return list[i]; }); }

  // the meaning and word family of each S.3 word, from the revision data
  var info = {};
  var units = window.CLY_VOCAB.vocabLists.s3.units;
  Object.keys(units).forEach(function (u) { units[u].forEach(function (w) { info[w.word] = w; }); });

  var DECKS = window.CLY_CARDS.decks.map(function (d) {
    return {
      id: d.id, title: d.title, kind: d.kind,
      cards: d.cards.map(function (c) {
        var w = info[c.word] || {};
        return Object.assign({}, c, { pos: w.pos || "", meaning: w.meaning || c.does || "", family: w.family || [] });
      })
    };
  });

  // the sentence split around its target words
  function sentenceParts(card) {
    var at = card.sentence.indexOf(card.blank);
    return { before: card.sentence.slice(0, at), after: card.sentence.slice(at + card.blank.length) };
  }

  function picker(root, mode, onPick) {
    clear(root);
    root.appendChild(h("ul", { class: "deck-list" }, DECKS.map(function (d) {
      var meta;
      if (mode === "cards") meta = load(LEARNED + d.id, []).length + " of " + d.cards.length + " learned";
      else { var best = load(BEST + d.id, null); meta = best === null ? "Not tried yet" : "Best " + best + " of " + ROUND; }
      return h("li", null, h("button", { type: "button", class: "deck-btn", onclick: function () { onPick(d); } },
        h("span", { class: "deck-name" }, d.title), h("span", { class: "deck-meta" }, meta)));
    })));
  }

  /* ---------- Flashcards ---------- */

  function Flashcards(root) {
    picker(root, "cards", start);

    function start(deck) {
      var learned = load(LEARNED + deck.id, []);
      var queue = shuffle(deck.cards.filter(function (c) { return learned.indexOf(c.word) < 0; }));
      draw();

      function leave() { picker(root, "cards", start); }
      function reset() { save(LEARNED + deck.id, []); start(deck); }

      function back(card) {
        var rows = [];
        if (deck.kind === "word") {
          rows.push(h("p", { class: "fc-meaning" }, card.meaning));
          if (card.family.length) rows.push(h("p", { class: "fc-line" }, h("b", null, "Word family: "), card.family.map(function (f) { return f.form + " (" + f.pos + ")"; }).join(", ")));
          rows.push(h("p", { class: "fc-line" }, h("b", null, "Goes with: "), card.collocation));
        } else {
          rows.push(h("p", { class: "fc-meaning" }, "What it does: " + card.does));
        }
        var parts = sentenceParts(card);
        rows.push(h("p", { class: "fc-line" }, h("b", null, "Example: "), parts.before, h("strong", null, card.blank), parts.after));
        rows.push(h("p", { class: "fc-line fc-good" }, h("b", null, "Good for: "),
          (card.topics.length ? card.topics.join(", ") + " · " : "") + card.types.join(", ")));
        if (card.note) rows.push(h("p", { class: "fc-note" }, "Informal: keep it out of reports and proposals."));
        return rows;
      }

      function draw() {
        clear(root);
        var total = deck.cards.length, done = load(LEARNED + deck.id, []).length;
        root.appendChild(h("p", { class: "fc-bar" },
          h("button", { type: "button", class: "btn-quiet", onclick: leave }, "All decks"),
          h("span", { "aria-live": "polite" }, deck.title + " · " + done + " of " + total + " learned")));
        if (!queue.length) {
          root.appendChild(h("div", { class: "fc-done" },
            h("h2", null, "You have been through every card."),
            h("p", null, "Test yourself with the quiz, or go round again."),
            h("p", { class: "fc-actions" },
              h("a", { class: "btn", href: "vocab-quiz.html" }, "Take the quiz"),
              h("button", { type: "button", class: "btn-quiet", onclick: reset }, "Start over"))));
          return;
        }
        var card = queue[0], flipped = false;
        var front = h("div", { class: "fc-face fc-front" },
          h("p", { class: "fc-word" }, card.word),
          deck.kind === "word" && card.pos ? h("p", { class: "fc-pos" }, card.pos) : null,
          h("p", { class: "fc-hint" }, "Tap to flip"));
        var rear = h("div", { class: "fc-face fc-back", "aria-hidden": "true" }, back(card));
        var again = h("button", { type: "button", class: "btn-quiet", disabled: true }, "Again");
        var got = h("button", { type: "button", class: "btn", disabled: true }, "Got it");
        var flip = h("button", { type: "button", class: "fc-card", "aria-label": "Flip the card" }, h("div", { class: "fc-inner" }, front, rear));
        flip.addEventListener("click", function () {
          flipped = !flipped;
          flip.classList.toggle("is-flipped", flipped);
          front.setAttribute("aria-hidden", String(flipped));
          rear.setAttribute("aria-hidden", String(!flipped));
          again.disabled = got.disabled = false;
        });
        again.addEventListener("click", function () {
          queue.shift();
          queue.splice(Math.min(3, queue.length), 0, card);   // it comes back a few cards later
          draw();
        });
        got.addEventListener("click", function () {
          var now = load(LEARNED + deck.id, []);
          if (now.indexOf(card.word) < 0) now.push(card.word);
          save(LEARNED + deck.id, now);
          queue.shift();
          draw();
        });
        root.appendChild(flip);
        root.appendChild(h("p", { class: "fc-actions" }, again, got));
        root.appendChild(h("p", { class: "fc-left" }, queue.length + (queue.length === 1 ? " card" : " cards") + " left in this round"));
        flip.focus({ preventScroll: true });
      }
    }
  }

  /* ---------- Quiz ---------- */

  function Quiz(root) {
    picker(root, "quiz", start);

    function start(deck) {
      var round = shuffle(deck.cards).slice(0, ROUND);
      var at = 0, score = 0, missed = [], marks = [];
      ask();

      // ten small marks under the count: filled = right first time, ringed = right after a hint, outlined = this one
      function strip() {
        var firsts = marks.filter(function (m) { return m === "first"; }).length;
        var bar = h("p", { class: "q-strip", role: "img", "aria-label": "Question " + (at + 1) + " of " + round.length + ", " + firsts + " right first time" });
        round.forEach(function (_, i) {
          bar.appendChild(h("span", { class: "q-step" + (marks[i] ? " is-" + marks[i] : "") + (i === at ? " is-now" : "") }));
        });
        return bar;
      }

      function leave() { picker(root, "quiz", start); }

      function ask() {
        clear(root);
        var card = round[at], tries = 0;
        var parts = sentenceParts(card);
        var blank = h("span", { class: "q-blank" }, " ");
        var feedback = h("div", { class: "q-feedback", "aria-live": "polite" });
        var list = h("div", { class: "q-options" });
        shuffle([card.blank].concat(card.distractors)).forEach(function (text) {
          var b = h("button", { type: "button", class: "q-opt" }, text);
          b.addEventListener("click", function () {
            if (text === card.blank) {
              if (!tries) score++; else missed.push(card.word);
              marks[at] = tries ? "hint" : "first";
              blank.textContent = card.blank;
              blank.classList.add("is-filled");
              b.classList.add("is-right");
              list.querySelectorAll("button").forEach(function (o) { o.disabled = true; });
              clear(feedback);
              feedback.appendChild(h("p", { class: "q-ok" }, tries ? "Right this time." : "Right."));
              if (deck.kind === "word") feedback.appendChild(h("p", { class: "q-note" }, h("b", null, "Goes with: "), card.collocation));
              var next = h("button", { type: "button", class: "btn" }, at + 1 < round.length ? "Next question" : "See my score");
              next.addEventListener("click", function () { at++; if (at < round.length) ask(); else finish(); });
              feedback.appendChild(h("p", null, next));
              next.focus();
            } else {
              tries++;
              b.disabled = true;
              b.classList.add("is-wrong");
              clear(feedback);
              feedback.appendChild(h("p", { class: "q-hint" }, h("b", null, "Not quite. "), "Hint: " + (deck.kind === "word" ? card.meaning : "it " + card.does + ".") + " Try another."));
            }
          });
          list.appendChild(b);
        });
        root.appendChild(h("p", { class: "fc-bar" },
          h("button", { type: "button", class: "btn-quiet", onclick: leave }, "All decks"),
          h("span", null, "Question " + (at + 1) + " of " + round.length)));
        root.appendChild(strip());
        root.appendChild(h("p", { class: "q-sentence" }, parts.before, blank, parts.after));
        root.appendChild(list);
        root.appendChild(feedback);
      }

      function finish() {
        clear(root);
        var stars = score === round.length ? 3 : score >= 8 ? 2 : score >= COUNTS_AT ? 1 : 0;
        var best = load(BEST + deck.id, null);
        if (best === null || score > best) save(BEST + deck.id, score);
        // the first good round in a deck counts as a practice set, so it feeds the badges (stickers.js)
        var sets = load(SETS, []);
        if (score >= COUNTS_AT && sets.indexOf(deck.id) < 0) {
          sets.push(deck.id);
          save(SETS, sets);
          document.dispatchEvent(new CustomEvent("cly:set-done", { detail: { name: "vocab-quiz", set: sets.length - 1, bar: null } }));
        }
        var message = score === round.length ? "Full marks on the first try."
          : stars === 2 ? "A strong round."
          : stars === 1 ? "A good start. The cards will help with the ones you missed."
          : "Flip through the cards first, then try a new round.";
        root.appendChild(h("div", { class: "q-done" },
          h("h2", null, "You scored " + score + " out of " + round.length),
          h("p", { class: "q-stars", "aria-label": stars + " out of 3 stars" }, "★".repeat(stars) + "☆".repeat(3 - stars)),
          h("p", null, message),
          missed.length ? h("p", null, h("b", null, "Worth another look: "), missed.join(", ")) : null,
          h("p", { class: "fc-actions" },
            h("button", { type: "button", class: "btn", onclick: function () { start(deck); } }, "Another round"),
            h("a", { class: "btn-quiet", href: "vocab-cards.html" }, "Flashcards"),
            h("button", { type: "button", class: "btn-quiet", onclick: leave }, "All decks"))));
      }
    }
  }

  var cards = document.querySelector("[data-cards]"), quiz = document.querySelector("[data-quiz]");
  if (cards) Flashcards(cards);
  if (quiz) Quiz(quiz);
})();
