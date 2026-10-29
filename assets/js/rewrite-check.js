/* CLY English — marks a typed rewrite (the S.3 consolidation exercises).
   An answer pattern lists every correct version: [a|b] is a choice and (x) is optional, so
   "(that) she [was|is] busy." accepts four answers. Marking ignores capitals, punctuation,
   British or American spelling and contractions; capitals and punctuation that differ from the
   model still get a reminder, because the student should learn them, but never a cross. */
(function () {
  "use strict";

  // "[if|whether] she (had) left." → every full answer it stands for, in the order written
  function expand(pattern) {
    var m = pattern.match(/\[([^\[\]]*)\]|\(([^()]*)\)/);
    if (!m) return [pattern.replace(/\s+/g, " ").replace(/\s+([,.?!])/g, "$1").trim()];
    var options = m[1] != null ? m[1].split("|") : [m[2], ""];
    var out = [];
    options.forEach(function (o) {
      expand(pattern.slice(0, m.index) + o + pattern.slice(m.index + m[0].length)).forEach(function (a) {
        if (out.indexOf(a) < 0) out.push(a);
      });
    });
    return out;
  }

  var NOT_FORMS = { "won't": "will not", "can't": "cannot", "shan't": "shall not" };
  var SHORT = { "'ll": " will", "'re": " are", "'ve": " have", "'m": " am" };
  var DOUBLE_L = ["travel", "cancel", "label", "model", "signal", "level", "fuel", "quarrel", "marvel", "dial", "total"];

  // Writes contractions out in full. "'d" can be "had" or "would", and a pronoun's "'s" can be "is" or "has",
  // so each gives both readings; a noun's "'s" (Kelvin's) is left alone.
  var PRONOUN_S = /\b(he|she|it|that|there|what|who|here)'s\b/gi;
  function fullForms(text) {
    var t = text.replace(/[’‘]/g, "'")
      .replace(/\b(\w+)n't\b/gi, function (w, stem) { return NOT_FORMS[w.toLowerCase()] || stem + " not"; })
      .replace(/\bcannot\b/gi, "can not")
      .replace(/('ll|'re|'ve|'m)\b/gi, function (x) { return SHORT[x.toLowerCase()]; });
    var forms = /'d\b/i.test(t) ? [t.replace(/'d\b/gi, " had"), t.replace(/'d\b/gi, " would")] : [t];
    if (!PRONOUN_S.test(t)) return forms;
    return [].concat.apply([], forms.map(function (f) { return [f.replace(PRONOUN_S, "$1 is"), f.replace(PRONOUN_S, "$1 has")]; }));
  }

  // British and American spellings meet in one form; both sides of a comparison go through it.
  function spelling(w) {
    if (DOUBLE_L.some(function (b) { return w.indexOf(b + "l") === 0; })) w = w.replace(/ll/, "l");
    return w
      .replace(/^(\w{2,}[^aeiou\s])is(e|ed|es|ing|ation|ations)$/, "$1iz$2")
      .replace(/ys(e|ed|es|ing)$/, "yz$1")
      .replace(/^(\w{2,})our(s|ed|ing|ite|ites|able)?$/, "$1or$2")
      .replace(/^programme(s|d)?$/, "program$1")
      .replace(/^(cent|theat|met)re(s)?$/, "$1er$2");
  }

  var words = function (text) { return text.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9'\s-]/g, " ").replace(/'/g, "").split(/\s+/).filter(Boolean); };
  var key = function (text) { return words(text).map(spelling).join(" "); };
  var keys = function (text) { return fullForms(text).map(key); };

  // The student may type the words around the gap as well; they are taken off before marking.
  function stripFrame(typed, frame) {
    var parts = frame.split("___"), before = key(parts[0]), after = key(parts[1] || ""), t = key(typed), extra = false;
    if (before && t.indexOf(before + " ") === 0) { t = t.slice(before.length + 1); extra = true; }
    if (after && t.slice(-after.length - 1) === " " + after) { t = t.slice(0, -after.length - 1); extra = true; }
    return { key: t, extra: extra };
  }

  var lastMark = function (t) { var m = t.trim().match(/[,.?!;:]$/); return m ? m[0] : ""; };
  var inner = function (t) { return (t.trim().replace(/[,.?!;:]$/, "").match(/[,;:]/g) || []).join(""); };

  // Capitals and punctuation that differ from the model answer. Each note is one short line.
  function reminders(typed, model) {
    var notes = [];
    var tw = fullForms(typed)[0].split(/\s+/).filter(function (w) { return /\w/.test(w); });
    var mw = fullForms(model)[0].split(/\s+/).filter(function (w) { return /\w/.test(w); });
    var upper = function (w) { var c = w.replace(/^[^A-Za-z]+/, "")[0]; return !!c && c === c.toUpperCase(); };
    if (tw.length && mw.length && upper(tw[0]) !== upper(mw[0])) {
      notes.push(upper(mw[0]) ? "Start with a capital letter: your words begin the sentence." : "No capital letter at the start: the sentence began before the gap.");
    } else if (tw.length === mw.length && tw.some(function (w, i) { return i && upper(w) !== upper(mw[i]); })) {
      notes.push("Check the capital letters against the model answer: " + model);
    }
    var end = lastMark(model), got = lastMark(typed);
    if (end !== got) {
      if (end === "," && !got) notes.push("Remember the comma after the phrase.");
      else if (end === "." && got === "?") notes.push("A reported question ends with a full stop, not a question mark.");
      else if (end === "." && !got) notes.push("Remember the full stop at the end.");
      else notes.push("Check the punctuation at the end: " + model);
    }
    if (inner(typed) !== inner(model)) {
      notes.push(inner(model) && !inner(typed) ? "Remember the comma after the phrase." : "Check the commas against the model answer: " + model);
    }
    return notes;
  }

  // item: { frame: "___ he walked home.", answers: ["Wanting to save money,"] }
  // → { ok, model, reminders: [] }. model is the closest correct answer, for showing after a miss.
  function judge(typed, item) {
    var all = [].concat.apply([], item.answers.map(expand));
    var res = { ok: false, model: all[0], reminders: [] };
    if (!typed || !typed.trim()) return res;
    var tried = fullForms(typed).map(function (f) { return stripFrame(f, item.frame); });
    for (var i = 0; i < all.length; i++) {
      var ks = keys(all[i]);
      var hit = tried.filter(function (t) { return ks.indexOf(t.key) >= 0; })[0];
      if (!hit) continue;
      res.ok = true; res.model = all[i];
      res.reminders = hit.extra ? ["You only need to type the missing part."] : reminders(typed, all[i]);
      return res;
    }
    return res;
  }

  // For a whole-sentence exercise: the answers become the full sentence (the phrase plus the rest of the
  // frame), and there is no given part to take off.
  function wholeSentence(item) {
    var rest = item.frame.split("___")[1] || "";
    return { frame: "___", answers: item.answers.map(function (a) { return a + rest; }) };
  }

  window.CLY_REWRITE_CHECK = { expand: expand, judge: judge, wholeSentence: wholeSentence };
})();
