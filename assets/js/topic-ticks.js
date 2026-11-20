/* CLY English: S.3 grammar. A topic row gets a tick once its closing question is answered, and the top of the page
   counts them. Kept on this device only (opener.js writes cly:s3-done); no sign-in, no points. */
(function () {
  "use strict";
  var KEY = "cly:s3-done";
  var rows = Array.prototype.slice.call(document.querySelectorAll("details.row[data-topic]"));
  var count = document.querySelector("[data-topics-done]");

  function done() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function draw() {
    var d = done(), n = 0;
    rows.forEach(function (row) {
      var finished = d.indexOf(row.getAttribute("data-topic")) >= 0;
      if (finished) n++;
      row.classList.toggle("is-done", finished);
      var head = row.querySelector(".row-head"), note = head.querySelector(".row-done");
      if (finished && !note) {
        note = document.createElement("span");
        note.className = "row-done";
        note.textContent = "Done";
        head.appendChild(note);
      } else if (!finished && note) {
        note.remove();
      }
    });
    if (count) {
      count.textContent = n + " of " + rows.length + " topics done";
      count.hidden = false;
    }
  }
  document.addEventListener("cly:step-done", draw);
  window.addEventListener("pageshow", draw);
  draw();
})();
