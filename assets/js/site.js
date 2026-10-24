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

  /* ---------- Where the student was: home offers "Continue: Part B › Article" ---------- */
  function remember(section) {
    var page = location.pathname.split("/").pop() || "index.html";
    if (page === "index.html") return;
    var h = section.querySelector("h2");
    var label = document.title.split(" · ")[0] + (h ? " › " + h.textContent : "");
    try { localStorage.setItem("cly:last", JSON.stringify({ href: page + "#" + section.id, label: label })); } catch (e) { /* storage blocked: home simply shows no "Continue" */ }
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

    // on a phone, a long contents list collapses to one line that names where you are; tapping it opens the list
    var index = sheet.querySelector(".index[data-collapse]");
    var toggle = null;
    if (index) {
      var list = index.querySelector("ol, ul");
      list.id = list.id || "contents-list";
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "index-toggle";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", list.id);
      index.insertBefore(toggle, list);
      toggle.addEventListener("click", function () {
        var open = index.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }
    function nameToggle(active) {
      if (!toggle || !active) return;
      var g = active.closest("li");
      while (g && !g.classList.contains("index-group")) g = g.previousElementSibling;
      toggle.innerHTML = "<small></small><span></span>";
      toggle.firstChild.textContent = g ? g.textContent : "Contents";
      toggle.lastChild.textContent = active.textContent;
      index.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function pagerLink(sec, word, cls) {
      var a = document.createElement("a");
      a.href = "#" + sec.id;
      a.className = cls;
      var h = sec.querySelector("h2");
      a.innerHTML = "<small>" + word + "</small><span></span>";
      a.querySelector("span").textContent = h ? h.textContent : sec.id;
      return a;
    }

    // an id names a section, or a part inside one (grammar.html#matrix opens Tenses at the Tense Matrix)
    function sectionOf(id) {
      var el = id && document.getElementById(id);
      return el ? sections.filter(function (s) { return s === el || s.contains(el); })[0] : null;
    }
    // the cover's form tabs can point into this page too (vocab.html#s2): they light up with their section
    var coverLinks = Array.prototype.slice.call(document.querySelectorAll(".tabs a[href*='#']")).filter(samePage);
    function samePage(a) { return a.pathname === location.pathname && a.hash.length > 1; }

    // keyboard is true when Enter opened the section: it changes at once, because a key pressed
    // again and again should never wait for an animation (the level ladder works the same way)
    function show(id, scroll, keyboard) {
      // pages with their own pickers (Part B text types) open the panel that holds the target first
      document.dispatchEvent(new CustomEvent("cly:show", { detail: id }));
      var target = sectionOf(id) || sections[0];
      var part = id && id !== target.id ? document.getElementById(id) : null;
      var from = sections.filter(function (s) { return !s.hidden; })[0];
      sections.forEach(function (s) { s.hidden = s !== target; s.classList.remove("turn-next", "turn-prev"); });
      // turn the page from the side the reader moved towards
      if (scroll && !keyboard && from && from !== target) {
        void target.offsetWidth;
        target.classList.add(sections.indexOf(target) > sections.indexOf(from) ? "turn-next" : "turn-prev");
      }
      links.forEach(function (a) {
        if (a.getAttribute("href") === "#" + target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      coverLinks.forEach(function (a) {
        if (a.hash === "#" + target.id) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      var active = links.filter(function (a) { return a.getAttribute("aria-current"); })[0];
      nameToggle(active);
      // the label panel is the page's cover: on a phone it shows on the first section only
      sheet.toggleAttribute("data-later", target !== sections[0]);
      if (active && active.scrollIntoView && window.innerWidth <= 760) {
        active.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
      }
      if (scroll && part) {
        var at = part.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: at, behavior: reduceMotion ? "auto" : "smooth" });
      } else if (scroll) {
        var top = sheet.getBoundingClientRect().top + window.scrollY - 8;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      }
      remember(target);
      swipe(target);
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href*='#']");
      if (!a || !samePage(a)) return;
      var id = a.hash.slice(1);
      if (!sectionOf(id)) return;
      e.preventDefault();
      history.pushState(null, "", "#" + id);
      show(id, true, e.detail === 0);
      var h = document.getElementById(id);
      h = h.matches("h2, h3") ? h : h.querySelector("h2, h3");
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
      // a panel keeps its own id when it has one (part-b.html#sample-story-5 links straight to a script)
      var id = "ladder" + n + "-" + i;
      if (!p.id) p.id = id;
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", id + "-tab");
      var b = document.createElement("button");
      b.type = "button";
      b.id = id + "-tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", p.id);
      b.innerHTML = '<span class="lv"></span><span></span>';
      b.firstChild.textContent = p.getAttribute("data-level");
      b.lastChild.textContent = p.getAttribute("data-name") || "";
      // read "5**" as "5 double star", not "5 star star"
      b.setAttribute("aria-label", "Level " + p.getAttribute("data-level").replace("**", " double star"));
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

    // focus is true for the arrow keys: the level changes at once, because a key pressed again and
    // again should never wait for an animation; a click or tap gets the climb, the rise and the swipe.
    // quiet changes the level at once without moving focus (a link that opens a script directly).
    function select(i, focus, quiet) {
      axis.classList.toggle("instant", !!focus || !!quiet);
      panels.forEach(function (p, j) {
        p.hidden = j !== i;
        buttons[j].setAttribute("aria-selected", j === i ? "true" : "false");
        buttons[j].tabIndex = j === i ? 0 : -1;
        // levels below the chosen one light up as the climb line reaches them
        buttons[j].classList.toggle("passed", j < i);
        buttons[j].querySelector(".lv").style.transitionDelay = j < i && !focus ? (j / i) * 0.15 + "s" : "";
      });
      axis.style.setProperty("--climb", buttons.length > 1 ? i / (buttons.length - 1) : 0);
      var marks = panels[i].querySelectorAll("mark.swipe");
      if (focus || quiet) {
        marks.forEach(function (m) { m.style.transition = "none"; m.classList.add("on"); });
        if (focus) buttons[i].focus();
        return;
      }
      // the highlighter is wiped at once and drawn again, quicker than its first draw: this is a repeat
      marks.forEach(function (m) { m.style.transition = "none"; m.classList.remove("on"); });
      void panels[i].offsetWidth;
      marks.forEach(function (m) { m.style.transition = ""; m.style.transitionDuration = "0.4s"; });
      requestAnimationFrame(function () { swipe(panels[i]); });
    }

    // a ladder of whole scripts ends each one with a step to the next level, so a reader who has
    // scrolled to the bottom of a long script climbs from there instead of hunting for the axis
    if (ladder.classList.contains("script-ladder")) panels.forEach(function (p, i) {
      if (i === panels.length - 1) return;
      var go = document.createElement("button");
      go.type = "button";
      go.className = "btn-quiet ladder-next";
      go.textContent = "Next: " + panels[i + 1].getAttribute("data-name");
      go.addEventListener("click", function (e) {
        select(i + 1, false, e.detail === 0);
        var top = axis.getBoundingClientRect().top;
        if (top < 0) window.scrollTo({ top: top + window.scrollY - 16, behavior: reduceMotion ? "auto" : "smooth" });
        buttons[i + 1].focus({ preventScroll: true });
      });
      p.appendChild(go);
    });
    // a link to one of the panels (or to something inside one) opens that level
    document.addEventListener("cly:show", function (e) {
      var el = e.detail && document.getElementById(e.detail);
      if (!el) return;
      var i = panels.findIndex(function (q) { return q === el || q.contains(el); });
      if (i >= 0) select(i, false, true);
    });

    ladder.insertBefore(axis, panels[0]);
    measure();
    var startIndex = Math.max(0, panels.findIndex(function (p) { return p.getAttribute("data-level") === start; }));
    // the ladders are built after the first section opens, so a link to a level is honoured here too
    var linked = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    var linkedIndex = linked ? panels.findIndex(function (q) { return q === linked || q.contains(linked); }) : -1;
    select(linkedIndex >= 0 ? linkedIndex : startIndex, false, linkedIndex >= 0);
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
      var text = done + " of " + boxes.length + " " + (list.getAttribute("data-count") || "done this week");
      if (out.textContent && out.textContent !== text) { out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump"); }
      out.textContent = text;
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

  // transitions wait until the page has settled, so tabs the script marks as open do not fade in on load
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.remove("preload"); }); });
})();
