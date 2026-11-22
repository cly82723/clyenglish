/* CLY English: small multiple-choice try-its for the Paper 3 pages, and timestamp buttons that jump a Part B2
   recording (assets/audio) to the part a student picks. */
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

  // A timestamp button jumps its recording to that part and plays it. The recordings load only when asked for,
  // so a jump before the file has loaded waits for it.
  document.querySelectorAll("[data-audio]").forEach(function (btn) {
    var audio = document.getElementById(btn.getAttribute("data-audio"));
    var at = parseFloat(btn.getAttribute("data-t"));
    if (!audio || isNaN(at)) { btn.hidden = true; return; }
    btn.addEventListener("click", function () {
      function go() {
        audio.currentTime = at;
        var started = audio.play();
        if (started && started.catch) started.catch(function () { /* the controls are still there to press */ });
      }
      if (audio.readyState > 0) { go(); return; }
      audio.addEventListener("loadedmetadata", go, { once: true });
      audio.load();
    });
  });
})();
