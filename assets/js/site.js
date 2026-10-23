/* CLY English — subtabs, level ladders, highlighter swipes, checklist */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Highlighter swipe: draws once when it enters view ---------- */
  function swipe(root) {
    var marks = (root || document).querySelectorAll("mark.swipe:not(.on)");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      marks.forEach(function (m) { m.classList.add("on"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    marks.forEach(function (m) { io.observe(m); });
  }

  /* ---------- Subtabs: one section of the page at a time ---------- */
  function initTabs(sheet) {
    var column = sheet.querySelector(".column");
    var sections = Array.prototype.slice.call(column.querySelectorAll(":scope > section[id]"));
    var links = Array.prototype.slice.call(sheet.querySelectorAll(".index a[href^='#']"));
    if (!sections.length) return;

    sections.forEach(function (sec, i) {
      var pager = document.createElement("nav");
      pager.className = "pager";
      pager.setAttribute("aria-label", "Previous and next section");
      var prev = sections[i - 1], next = sections[i + 1];
      if (prev) pager.appendChild(pagerLink(prev, "Previous", "prev"));
      if (next) pager.appendChild(pagerLink(next, "Next", "next"));
      if (prev || next) sec.appendChild(pager);
    });

    function pagerLink(sec, word, cls) {
      var a = document.createElement("a");
      a.href = "#" + sec.id;
      a.className = cls;
      var h = sec.querySelector("h2");
      a.innerHTML = "<small>" + word + "</small><span></span>";
      a.querySelector("span").textContent = h ? h.textContent : sec.id;
      return a;
    }

    function show(id, scroll) {
      var target = sections.filter(function (s) { return s.id === id; })[0] || sections[0];
      var from = sections.filter(function (s) { return !s.hidden; })[0];
      sections.forEach(function (s) { s.hidden = s !== target; s.classList.remove("turn-next", "turn-prev"); });
      // turn the page from the side the reader moved towards
      if (scroll && from && from !== target) {
        void target.offsetWidth;
        target.classList.add(sections.indexOf(target) > sections.indexOf(from) ? "turn-next" : "turn-prev");
      }
      links.forEach(function (a) {
        if (a.getAttribute("href") === "#" + target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      var active = links.filter(function (a) { return a.getAttribute("aria-current"); })[0];
      if (active && active.scrollIntoView && window.innerWidth <= 760) {
        active.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
      }
      if (scroll) {
        var top = sheet.getBoundingClientRect().top + window.scrollY - 8;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      }
      swipe(target);
    }

    sheet.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']");
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (!sections.some(function (s) { return s.id === id; })) return;
      e.preventDefault();
      history.pushState(null, "", "#" + id);
      show(id, true);
      var h = document.getElementById(id).querySelector("h2");
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    });
    window.addEventListener("popstate", function () { show(location.hash.slice(1), true); });
    show(location.hash.slice(1), false);
    // a deep link (part-b.html#story) should land on the page, not mid-section
    if (location.hash) {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      var land = function () {
        window.scrollTo(0, sheet.getBoundingClientRect().top + window.scrollY);
      };
      requestAnimationFrame(land);
      window.addEventListener("load", function () { setTimeout(land, 0); }, { once: true });
    }
  }

  /* ---------- Level ladder: one line, rewritten level by level ---------- */
  function initLadder(ladder, n) {
    var panels = Array.prototype.slice.call(ladder.querySelectorAll(".ladder-panel"));
    var axis = document.createElement("div");
    axis.className = "ladder-axis";
    axis.setAttribute("role", "tablist");
    axis.setAttribute("aria-label", "Choose a level");
    var start = ladder.getAttribute("data-start") || panels[0].getAttribute("data-level");

    var buttons = panels.map(function (p, i) {
      var id = "ladder" + n + "-" + i;
      p.id = id;
      p.setAttribute("role", "tabpanel");
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", id);
      b.innerHTML = '<span class="lv"></span><span></span>';
      b.firstChild.textContent = p.getAttribute("data-level");
      b.lastChild.textContent = p.getAttribute("data-name") || "";
      b.setAttribute("aria-label", "Level " + p.getAttribute("data-level"));
      b.addEventListener("click", function () { select(i, false); });
      axis.appendChild(b);
      return b;
    });

    axis.addEventListener("keydown", function (e) {
      var i = buttons.indexOf(document.activeElement);
      if (i < 0) return;
      var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: buttons.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select((next + buttons.length) % buttons.length, true);
    });

    // the axis line runs from the first circled level to the last
    function measure() {
      var box = axis.getBoundingClientRect();
      if (!box.width) return; // inside a hidden section; re-measured when it shows
      var mark = function (b) { var r = b.querySelector(".lv").getBoundingClientRect(); return r.left + r.width / 2 - box.left; };
      axis.style.setProperty("--c0", mark(buttons[0]) + "px");
      axis.style.setProperty("--c1", box.width - mark(buttons[buttons.length - 1]) + "px");
    }
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(axis);

    function select(i, focus) {
      panels.forEach(function (p, j) {
        p.hidden = j !== i;
        buttons[j].setAttribute("aria-selected", j === i ? "true" : "false");
        buttons[j].tabIndex = j === i ? 0 : -1;
        // levels below the chosen one light up as the climb line reaches them
        buttons[j].classList.toggle("passed", j < i);
        buttons[j].querySelector(".lv").style.transitionDelay = j < i ? (j / i) * 0.3 + "s" : "";
      });
      axis.style.setProperty("--climb", buttons.length > 1 ? i / (buttons.length - 1) : 0);
      panels[i].querySelectorAll("mark.swipe").forEach(function (m) { m.classList.remove("on"); });
      // restart the panel entrance and the highlighter
      panels[i].style.animation = "none"; void panels[i].offsetWidth; panels[i].style.animation = "";
      requestAnimationFrame(function () { swipe(panels[i]); });
      if (focus) buttons[i].focus();
    }

    ladder.insertBefore(axis, panels[0]);
    measure();
    var startIndex = Math.max(0, panels.findIndex(function (p) { return p.getAttribute("data-level") === start; }));
    select(startIndex, false);
  }

  /* ---------- Checklist: remembered in this browser only ---------- */
  function initChecklist(list) {
    var key = "cly:" + list.getAttribute("data-store");
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { saved = {}; }
    var boxes = Array.prototype.slice.call(list.querySelectorAll("input[type=checkbox]"));
    var out = document.querySelector("[data-progress='" + list.getAttribute("data-store") + "']");
    function count() {
      if (!out) return;
      var done = boxes.filter(function (b) { return b.checked; }).length;
      out.textContent = done + " of " + boxes.length + " done this week";
    }
    boxes.forEach(function (b) {
      b.checked = !!saved[b.id];
      b.addEventListener("change", function () {
        saved[b.id] = b.checked;
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) { /* storage blocked: still works for this visit */ }
        count();
      });
    });
    var reset = document.querySelector("[data-reset='" + list.getAttribute("data-store") + "']");
    if (reset) reset.addEventListener("click", function () {
      boxes.forEach(function (b) { b.checked = false; saved[b.id] = false; });
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) {}
      count();
    });
    count();
  }

  document.querySelectorAll("[data-tabs]").forEach(initTabs);
  document.querySelectorAll(".ladder").forEach(initLadder);
  document.querySelectorAll(".checklist[data-store]").forEach(initChecklist);
  swipe(document);
})();
