/* CLY English: small multiple-choice try-its for the Paper 3 pages, and a Hear it button that reads a passage
   aloud with the built-in voice of the browser (no audio files, nothing is sent anywhere). */
(function () {
  "use strict";

  document.querySelectorAll("[data-tryit]").forEach(function (box) {
    var questions = Array.prototype.slice.call(box.querySelectorAll("[data-q]"));
    var score = box.querySelector(".tryit-score");
    var firstTry = 0, answered = 0;

    function say() {
      if (!score) return;
      score.textContent = answered === questions.length
        ? "You got " + firstTry + " of " + questions.length + " right on the first try."
        : answered + " of " + questions.length + " done";
    }

    questions.forEach(function (q) {
      var options = Array.prototype.slice.call(q.querySelectorAll(".tryit-opt"));
      var why = q.querySelector(".tryit-why"), hint = q.querySelector(".tryit-hint");
      var wrong = 0;
      options.forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.hasAttribute("data-ok")) {
            b.classList.add("is-right");
            options.forEach(function (o) { o.disabled = true; });
            if (why) why.hidden = false;
            if (hint) hint.hidden = true;
            q.classList.add("is-done");
            answered += 1;
            if (!wrong) firstTry += 1;
            say();
          } else {
            wrong += 1;
            b.disabled = true;
            b.classList.add("is-wrong");
            if (hint) hint.hidden = false;
          }
        });
      });
    });
    say();
  });

  var synth = window.speechSynthesis;
  document.querySelectorAll("[data-speak]").forEach(function (btn) {
    if (!synth || !window.SpeechSynthesisUtterance) { btn.hidden = true; return; }
    var target = document.querySelector(btn.getAttribute("data-speak"));
    var playing = false;
    btn.addEventListener("click", function () {
      if (playing) { synth.cancel(); return; }
      var lines = Array.prototype.map.call(target.querySelectorAll("[data-say]"), function (el) { return el.textContent; });
      var voice = new window.SpeechSynthesisUtterance(lines.join(" "));
      voice.lang = "en-GB";
      voice.rate = 0.95;
      voice.onend = voice.onerror = function () { playing = false; btn.textContent = "Hear it"; };
      playing = true;
      btn.textContent = "Stop";
      synth.speak(voice);
    });
  });
  window.addEventListener("pagehide", function () { if (synth) synth.cancel(); });
})();
