/* CLY English: S.3 grammar hub. Each topic's tick is drawn by partb-hub.js from cly:s3-done (opener.js writes it when a
   topic's closing question is answered); this counts them at the top of the page. Kept on this device only; no sign-in,
   no points. */
(function () {
  "use strict";
  var KEY = "cly:s3-done";
  var rows = Array.prototype.slice.call(document.querySelectorAll("[data-step-link]"));
  var count = document.querySelector("[data-topics-done]");
  if (!count || !rows.length) return;

  function draw() {
    var done = [];
    try { done = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { done = []; }
    var n = rows.filter(function (row) { return done.indexOf(row.getAttribute("data-step-link")) >= 0; }).length;
    count.textContent = n + " of " + rows.length + " topics done";
    count.hidden = false;
  }
  window.addEventListener("pageshow", draw);
  draw();
})();
