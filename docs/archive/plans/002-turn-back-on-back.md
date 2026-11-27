# 002 — Turn the page back when the reader goes back

- **Status**: DONE (2026-11-18, branch book-turns)
- **Commit**: 59c6e2d
- **Severity**: HIGH
- **Category**: Physicality & origin (spatial consistency)
- **Estimated scope**: 2 files (`assets/css/motion.css`, `assets/js/motion.js`), about 40 lines

## Problem

Every move between pages turns the page forward, including the browser's Back button and going to an earlier page
in the site's own order (for example Part B → Part A on the S.5 strip). A book turns the other way when you go
back; a page that only ever turns forward stops feeling like a book the first time the reader goes back.

After plan 001, the forward turn in `assets/css/motion.css` is:

```css
/* assets/css/motion.css — after plan 001 */
::view-transition-old(sheet), ::view-transition-new(sheet) { mix-blend-mode: normal; }
::view-transition-new(sheet) { animation: none; }
::view-transition-old(sheet) {
  z-index: 1;   /* the page being turned is on top of the one underneath */
  transform-origin: 0 var(--turn-old-y, 30vh);
  animation: leaf-away var(--dur-turn) var(--ease-turn) both;
}
@keyframes leaf-away {
  0% { transform: perspective(2000px) rotateY(0deg); filter: brightness(1); opacity: 1; }
  85% { opacity: 1; }
  100% { transform: perspective(2000px) rotateY(-90deg); filter: brightness(0.8); opacity: 0; }
}
```

and `assets/js/motion.js` has a `pageswap` listener that stores the hinge height, and a `pagereveal` listener that
reads it into `--turn-old-y` (plan 001, Target).

## Target

Going back is the forward turn played the other way, with the other page moving: the **old** page stays still
underneath, and the **new** page swings in over it from edge-on, around the same left-edge spine, lightening as it
lands flat.

- Duration `var(--dur-turn)` (0.34s); easing `var(--ease-turn)` (`cubic-bezier(0.32, 0.72, 0, 1)`); both exist after 001.
- New page: `rotateY(-90deg)` + `brightness(0.8)` + `opacity: 0` at 0%, `opacity: 1` by 15%, `rotateY(0deg)` +
  `brightness(1)` at 100%. Hinge `transform-origin: 0 var(--turn-new-y, 30vh)`.
- The direction is marked on the new document's root as `data-turn="back"` before the first frame, and removed when
  the turn finishes. With no mark, the forward turn from plan 001 plays (so any browser without the Navigation API
  simply always turns forward, as today).

How "back" is decided, on the new page in `pagereveal`, from `navigation.activation`:

1. A history move (`navigationType === "traverse"`): back when the new entry's `index` is lower than the old
   entry's `index`.
2. Any other move: back when both pages are in the site's reading order and the new page comes earlier.
   The order is the order of the cover tabs and each form's strip:
   `index.html, s3-grammar.html, s3-challenge.html, grammar.html, challenge.html, part-a.html, part-b.html,
   text-types.html, questions.html, toolkit.html, final.html, cutoffs.html, self-study.html`.
   A page not in the list (or a link to another site) turns forward.

```css
/* target: assets/css/motion.css — add directly after the leaf-away keyframes from plan 001 */

/* going back: the page underneath stays still, and the earlier page swings back over it */
html[data-turn="back"]::view-transition-old(sheet) { z-index: 0; animation: none; }
html[data-turn="back"]::view-transition-new(sheet) {
  z-index: 1;
  transform-origin: 0 var(--turn-new-y, 30vh);
  animation: leaf-back var(--dur-turn) var(--ease-turn) both;
}
@keyframes leaf-back {
  0% { transform: perspective(2000px) rotateY(-90deg); filter: brightness(0.8); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: perspective(2000px) rotateY(0deg); filter: brightness(1); opacity: 1; }
}
```

```js
/* target: assets/js/motion.js — add these above the pagereveal listener (after the pageswap listener from 001) */

  // The site's reading order: the cover tabs, then each form's strip. Moving to an earlier page turns back.
  var ORDER = ["index.html", "s3-grammar.html", "s3-challenge.html", "grammar.html", "challenge.html",
    "part-a.html", "part-b.html", "text-types.html", "questions.html", "toolkit.html", "final.html", "cutoffs.html",
    "self-study.html"];
  function pageOf(url) {
    try { return new URL(url, location.href).pathname.split("/").pop() || "index.html"; } catch (err) { return ""; }
  }
  // true when this move should turn the page back: a step back in history, or an earlier page in the reading order
  function turnsBack(activation) {
    if (!activation || !activation.from || !activation.entry) return false;
    if (activation.navigationType === "traverse") return activation.entry.index < activation.from.index;
    var from = ORDER.indexOf(pageOf(activation.from.url)), to = ORDER.indexOf(pageOf(activation.entry.url));
    return from >= 0 && to >= 0 && to < from;
  }
```

```js
/* target: inside the pagereveal listener from plan 001, directly after the line that sets --turn-old-y */
    var root = document.documentElement;
    if (window.navigation && turnsBack(navigation.activation)) {
      root.setAttribute("data-turn", "back");
      var newY = hingeOf();   // where this page's own sheet sits on screen
      if (newY !== null) root.style.setProperty("--turn-new-y", newY + "px");
      var done = function () { root.removeAttribute("data-turn"); };
      e.viewTransition.finished.then(done, done);
    }
```

## Repo conventions to follow

- `assets/js/motion.js` is ES5 inside one IIFE with `"use strict"`: `var`, `function`, no arrow functions, no
  `const`/`let`. Storage and URL calls are wrapped in `try`/`catch` with a short comment saying what happens
  instead (exemplar: `assets/js/site.js:28`, `try { localStorage.setItem(…) } catch (e) { /* storage blocked: … */ }`).
- Motion CSS lives in `assets/css/motion.css`, uses the tokens `--dur-turn` and `--ease-turn` (added by 001), and
  comments describe the object ("the earlier page swings back over it").
- Exemplar of a turn that already knows its direction: `motion.css:28-31`, `page-next` hinged at `0` and
  `page-prev` hinged at `100%`.

## Steps

1. Confirm plan 001 is done: `grep -n "leaf-away\|--ease-turn\|turn-old-y" assets/css/motion.css assets/js/motion.js`
   must show all three. If not, STOP: do 001 first.
2. In `assets/css/motion.css`, add the CSS target directly after the `@keyframes leaf-away { … }` block.
3. In `assets/js/motion.js`, add `ORDER`, `pageOf` and `turnsBack` directly above the `pagereveal` listener.
4. In the same file, inside the `pagereveal` listener, directly after the line
   `if (y) document.documentElement.style.setProperty("--turn-old-y", y + "px");`, add the block from Target.
5. Confirm every page that has `class="sheet"` loads `assets/js/motion.js`:
   `grep -L "assets/js/motion.js" $(grep -l 'class="sheet' *.html)` should print nothing. If it prints pages, report
   them; do not add the script yourself.

## Boundaries

- Do NOT change the forward turn from plan 001.
- Do NOT touch in-page turns (`page-next`/`page-prev`), rows, the ladder, stickers, or the home notebook.
- Do NOT change any HTML.
- Do NOT add dependencies or a polyfill for the Navigation API: without it, pages simply turn forward.
- If the excerpts above do not match the code, STOP and report the drift.

## Verification

- **Mechanical**: `node --test tests/` → all pass, 0 fail.
  `node -e "new Function(require('fs').readFileSync('assets/js/motion.js','utf8'))"` → no error.
- **Feel check** (Chrome 126 or later, repo served over HTTP, for example `python -m http.server 8000`):
  - Part A → Part B on the strip: the page turns forward (plan 001).
  - Then press the browser's Back: Part A swings back in from the left edge over Part B, lightening as it lands.
  - Part B → Part A on the strip (a link, not Back): it also turns back.
  - Home → S.4 turns forward; S.4 → Home turns back.
  - A page not in the order (`vocab.html`, `samples.html`) and the league page's own links turn forward.
  - After any turn, `document.documentElement.getAttribute("data-turn")` is `null` (the mark was cleared).
  - Going back after scrolling down: the swing is hinged near the middle of the screen. If the browser has not yet
    restored the scroll position when the turn starts, the hinge falls back to 30vh; say so in your report rather
    than working around it.
  - In DevTools → Animations at 10%: going back, the old page never moves and the new page is never see-through
    after the first 15%.
  - With `prefers-reduced-motion: reduce` emulated: no turn either way.
- **Done when**: Back and earlier-page moves turn the page back, everything else turns forward, and the
  `data-turn` mark never stays on the page.
