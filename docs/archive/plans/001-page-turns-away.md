# 001 — Turn the old page away on its spine instead of cross-fading two pages

- **Status**: DONE (2026-11-18, branch book-turns)
- **Commit**: 59c6e2d
- **Severity**: HIGH
- **Category**: Physicality & origin (with Cohesion)
- **Estimated scope**: 2 files (`assets/css/motion.css`, `assets/js/motion.js`), about 25 lines

## Problem

Moving from one page of the site to another uses a cross-document view transition on the white sheet
(`view-transition-name: sheet`). Today both snapshots fade at the same time, so half-way through the turn both
pages are see-through over the cover picture behind them: a double exposure, not a page. Both also tilt only
7–9° on the same left edge, which reads as a wobble, not a leaf being turned.

```css
/* assets/css/motion.css:5-20 — current */
:root {
  --lift: 0 6px 14px rgb(16 38 59 / 0.2);   /* the shadow of something held above the paper */
  --dur-turn: 0.34s;                        /* a page turning */
}

/* ---------- Page turns: moving between pages turns the sheet, the cover behind it cross-fades ---------- */

@view-transition { navigation: auto; }
.sheet { view-transition-name: sheet; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.28s; }
::view-transition-group(sheet) { animation-duration: var(--dur-turn); animation-timing-function: var(--ease-out); }
::view-transition-old(sheet) { animation: leaf-out 0.2s var(--ease-out) both; transform-origin: 0 30vh; }
::view-transition-new(sheet) { animation: leaf-in var(--dur-turn) var(--ease-out) both; transform-origin: 0 30vh; }
@keyframes leaf-out { to { opacity: 0; transform: perspective(1800px) rotateY(-9deg) translateX(-16px); } }
@keyframes leaf-in { from { opacity: 0; transform: perspective(1800px) rotateY(7deg) translateX(16px); } }
@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }
```

Two hidden problems the new version must also handle:

1. The browser's default style for a view transition gives both snapshots `mix-blend-mode: plus-lighter` (that is
   what makes a cross-fade look right). If one opaque page is laid over another with that still on, the colours
   add up and the page flashes white. It must be set back to `normal`.
2. `transform-origin: 0 30vh` is measured from the **top of the sheet**, not the top of the screen. On a long page
   scrolled far down, that hinge point is thousands of pixels above the screen, so the perspective skews badly.
   The hinge height must be the middle of what is on screen.
3. In a cross-document view transition, the `::view-transition-*` pseudo-elements are styled by the **new**
   document. A CSS variable set on the old document's `<html>` never reaches them. So the old page measures where
   its sheet sat on screen (in `pageswap`), leaves the number in `sessionStorage`, and the new page reads it (in
   `pagereveal`) and sets the variable on its own `<html>`.

## Target

A book page: the next page already lies underneath, solid and still. The old page lifts from its right edge,
swings towards the reader around its left edge (the spine), darkens a little as it turns away from the light, and is
edge-on (gone) at the end. No double exposure at any frame.

Values:

- Duration: the existing token `--dur-turn: 0.34s` (unchanged).
- Easing: a new token `--ease-turn: cubic-bezier(0.32, 0.72, 0, 1);` (the iOS drawer curve: quick to start, long
  soft settle, which reads as a sheet with some weight).
- Rotation: `rotateY(0deg)` → `rotateY(-90deg)` (negative = the right edge comes towards the viewer, which is the
  direction a page turns forward). Perspective `2000px`.
- Shade: `filter: brightness(1)` → `brightness(0.8)`.
- Opacity: 1 until 85% of the turn, then 0 at 100% (hides the edge-on sliver at the very end).
- Hinge: `transform-origin: 0 var(--turn-old-y, 30vh)`, where `--turn-old-y` is the middle of the screen measured
  from the old sheet's top, measured by the old page and set on the new page's `<html>` (see Problem, point 3).

```css
/* target: assets/css/motion.css, replacing lines 5-20 shown above */
:root {
  --lift: 0 6px 14px rgb(16 38 59 / 0.2);   /* the shadow of something held above the paper */
  --dur-turn: 0.34s;                        /* a page turning */
  --ease-turn: cubic-bezier(0.32, 0.72, 0, 1);   /* a sheet with some weight: quick to lift, slow to settle */
}

/* ---------- Page turns: the next page lies underneath; the old one turns away on its spine ---------- */

@view-transition { navigation: auto; }
.sheet { view-transition-name: sheet; }
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.28s; }
::view-transition-group(sheet) { animation-duration: var(--dur-turn); animation-timing-function: var(--ease-turn); }
/* two solid pages, one over the other: no adding of colours, which is only right for a cross-fade */
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
@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }
```

```js
/* assets/js/motion.js:11-16 — current */
  // A page turn the browser has to drop (the window resized mid-turn, say) is not an error worth reporting.
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    e.viewTransition.ready.catch(function () { /* the page simply appears, as it did before */ });
    e.viewTransition.finished.catch(function () { /* as above */ });
  });
```

```js
/* target: assets/js/motion.js, replacing lines 11-16 shown above */
  // The page turns on its spine level with the middle of the screen, so a long page scrolled far down still turns
  // where the reader is looking. The turn is drawn by the new page, so the old page measures where its sheet sat
  // on screen and leaves the number in sessionStorage for the new page to read.
  var HINGE_KEY = "cly:turn-y";
  function hingeOf() {
    var sheet = document.querySelector(".sheet");
    return sheet ? Math.round(window.innerHeight / 2 - sheet.getBoundingClientRect().top) : null;
  }
  window.addEventListener("pageswap", function (e) {
    if (!e.viewTransition) return;
    var y = hingeOf();
    try { if (y !== null) sessionStorage.setItem(HINGE_KEY, String(y)); } catch (err) { /* no hinge: the 30vh default */ }
  });

  // A page turn the browser has to drop (the window resized mid-turn, say) is not an error worth reporting.
  window.addEventListener("pagereveal", function (e) {
    if (!e.viewTransition) return;
    var y = null;
    try { y = sessionStorage.getItem(HINGE_KEY); sessionStorage.removeItem(HINGE_KEY); } catch (err) { y = null; }
    if (y) document.documentElement.style.setProperty("--turn-old-y", y + "px");
    e.viewTransition.ready.catch(function () { /* the page simply appears, as it did before */ });
    e.viewTransition.finished.catch(function () { /* as above */ });
  });
```

## Repo conventions to follow

- Motion tokens live in `:root` at the top of `assets/css/motion.css` (`--lift`, `--dur-turn`); the strong ease-out
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` is in `assets/css/site.css:46`. Add `--ease-turn` beside `--dur-turn`.
- Comments are plain sentences about the object being drawn ("the old page turns away on its spine"), as in
  `motion.css:1-3`.
- `assets/js/motion.js` is ES5 inside one IIFE, `"use strict"`, returns early when reduced motion is on
  (`motion.js:7-9`). Keep that: `var`, `function`, no arrow functions.
- Exemplar of a page-turn already in this style: `motion.css:28-31` (`page-next` / `page-prev`).

## Steps

1. In `assets/css/motion.css`, replace lines 5–20 (the `:root` block through the reduced-motion `@view-transition`
   line, exactly as quoted in Problem) with the CSS in Target. Delete the `leaf-out` and `leaf-in` keyframes; first
   run `grep -rn "leaf-out\|leaf-in" assets` to confirm nothing else uses them (expected: no other matches).
2. In `assets/js/motion.js`, replace lines 11–16 (quoted in Target) with the target JS: the `HINGE_KEY` constant,
   `hingeOf`, a new `pageswap` listener, and the `pagereveal` listener with three new lines that read the hinge. It
   stays after the reduced-motion early return on line 9, which is correct: with reduced motion there is no page
   turn, and nothing is stored.

## Boundaries

- Do NOT touch the in-page turns (`page-next`, `page-prev`, `motion.css:28-31`), the ladder `card-flip`, stamps,
  stickers or the home page notebook (`story.css`, `story.js`).
- Do NOT add direction (turning back on Back) — that is plan 002, which builds on this one.
- Do NOT change any HTML.
- Do NOT add dependencies.
- If `motion.css:5-20` or `motion.js:11-16` do not match the excerpts above, STOP and report the drift.

## Verification

- **Mechanical**: `node --test tests/` → 129 pass, 0 fail (no test covers this; it must not break others).
  `node -e "new Function(require('fs').readFileSync('assets/js/motion.js','utf8'))"` → no error.
- **Feel check**: serve the repo root over HTTP (for example `python -m http.server 8000`; view transitions do not
  run from `file://`) and open it in Chrome 126 or later. Go from Part A to Part B with the S.5 strip, and from
  Home to S.4.
  - At no frame are two pages visible through each other. The new page is solid underneath from the first frame.
  - The old page's right edge comes towards you and swings left; it does not slide or shrink.
  - The page darkens slightly as it turns; there is no white flash (if there is, `mix-blend-mode: normal` is missing).
  - Scroll far down a long page (Past questions), then move to another page: the hinge is level with the middle of
    the screen, not skewed off the top. In DevTools on the new page, `getComputedStyle(document.documentElement)
    .getPropertyValue("--turn-old-y")` shows a pixel value during the turn.
  - In DevTools → Animations, set playback to 10% and step through: the turn reaches edge-on at the end, and the
    last 15% fades the edge sliver out.
  - In DevTools → Rendering, emulate `prefers-reduced-motion: reduce`: pages change instantly, with no turn.
- **Done when**: navigating between any two pages shows a single solid page turning away over a solid page
  beneath, with no cross-fade, no white flash and no skew on long pages.
