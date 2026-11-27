# 003 — Open a step as a page turning, from the side the reader came from

- **Status**: DONE (2026-11-18, branch book-turns)
- **Commit**: 59c6e2d
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens (with Missed opportunities)
- **Estimated scope**: 2 files (`assets/css/guide.css`, `assets/js/site.js`), about 12 lines

## Problem

The guides (Part A, Part B, Text types, Past questions, Toolkit, Final reminders, Cut-offs, S.3 and S.4 grammar,
Self-study) are lists of rows: each row is a `<details class="row">`, and only one is open at a time. Opening a row
drops its body 4px into place while the row above snaps shut. It reads as a dropdown, not as turning to the next page
of a book. It is also the same whether the reader moves forward (Step 2 → Step 3, or the "Next: Step 3" button) or
back (Step 3 → Step 1).

```css
/* assets/css/guide.css:132-134 — current */
@media (prefers-reduced-motion: no-preference) {
  .row[open] > .row-body { animation: note-in 0.24s var(--ease-out); }
}
```

```css
/* assets/css/site.css:981 — the keyframes used today */
@keyframes note-in { from { opacity: 0; transform: translateY(4px); } }
```

The site already has a page turn for moving between sections of one page, with direction, which the rows should
reuse:

```css
/* assets/css/motion.css:24-31 — existing, inside @media (prefers-reduced-motion: no-preference) */
  .js [data-tabs] .column > section.turn-next { animation: page-next 0.3s var(--ease-out); transform-origin: 0 240px; }
  .js [data-tabs] .column > section.turn-prev { animation: page-prev 0.3s var(--ease-out); transform-origin: 100% 240px; }
  @keyframes page-next { from { opacity: 0; transform: perspective(1600px) rotateY(6deg) translateX(14px); } }
  @keyframes page-prev { from { opacity: 0; transform: perspective(1600px) rotateY(-6deg) translateX(-14px); } }
```

Every page with rows already loads `assets/css/motion.css`, so `page-next` and `page-prev` are available.

The rows are opened and closed in `assets/js/site.js`, in `initRows`:

```js
/* assets/js/site.js:374-379 — current */
    rows.forEach(function (row) {
      row.addEventListener("toggle", function () {
        if (!row.open) { if (saved() === row.id) saved(""); return; }
        // browsers without named details: shut the others here
        rows.forEach(function (other) { if (other !== row) other.open = false; });
        saved(row.id);
```

## Target

Opening a row turns its body in like a page: from the right, hinged on its left edge, when the row comes after the
one opened last (or none was open); from the left, hinged on its right edge, when it comes before. Closing stays
instant, so the closing row never competes with the opening one.

- Keyframes: the existing `page-next` / `page-prev` (unchanged).
- Duration `0.3s`, easing `var(--ease-out)` (`cubic-bezier(0.23, 1, 0.32, 1)`), the same as the in-page turn.
- Hinge: `transform-origin: 0 120px` forward, `100% 120px` back (120px: near the top of the row's body, which is
  where the reader is looking just after it opens; the body can be thousands of pixels tall).
- Reduced motion: a plain `fade-in` of `0.15s ease-out` (keyframes already in `site.css:982`), not nothing.

```css
/* target: assets/css/guide.css, replacing lines 132-134 */
/* opening a row turns to it like a page: from the right going on, from the left going back (site.js marks which) */
@media (prefers-reduced-motion: no-preference) {
  .row[open] > .row-body { animation: page-next 0.3s var(--ease-out); transform-origin: 0 120px; }
  .row.turn-prev[open] > .row-body { animation-name: page-prev; transform-origin: 100% 120px; }
}
@media (prefers-reduced-motion: reduce) {
  .row[open] > .row-body { animation: fade-in 0.15s ease-out; }
}
```

```js
/* target: assets/js/site.js, replacing lines 374-379 */
    var lastOpened = -1;   // the row opened most recently: a row after it turns in forward, a row before it turns back
    rows.forEach(function (row, n) {
      row.addEventListener("toggle", function () {
        if (!row.open) { if (saved() === row.id) saved(""); return; }
        row.classList.toggle("turn-prev", n < lastOpened);
        lastOpened = n;
        // browsers without named details: shut the others here
        rows.forEach(function (other) { if (other !== row) other.open = false; });
        saved(row.id);
```

The rest of the `toggle` handler (from `try { localStorage.setItem("cly:last" …` onwards) is unchanged.

## Repo conventions to follow

- `assets/js/site.js` is ES5 in one IIFE: `var`, `function`, no arrow functions. Comments explain the reader's
  experience, as in `site.js:313-315` ("One row is open at a time…").
- Directional turns are already done this way for tabbed pages: `turn-next` / `turn-prev` classes picked in JS,
  keyframes in `motion.css:28-31`. Only `turn-prev` is needed here, because forward is the default.
- Reduced motion keeps a short opacity fade (exemplar: `site.css:991`, `.detail.swap { animation: fade-in 0.18s ease-out; }`).

## Steps

1. In `assets/css/guide.css`, replace lines 132–134 (quoted in Problem) with the CSS target.
2. In `assets/js/site.js`, replace lines 374–379 (quoted in Problem) with the JS target. Only two lines are new
   (`row.classList.toggle(…)` and `lastOpened = n;`), plus `var lastOpened = -1;` above the loop and `n` as the
   second argument of the `forEach` callback.
3. Check that nothing else uses `note-in` for rows: `grep -n "note-in" assets/css/*.css`. Leave `@keyframes note-in`
   in `site.css` in place; other things still use it.

## Boundaries

- Do NOT touch page-to-page turns (`::view-transition-*`, plans 001 and 002), tabbed pages (`[data-tabs]`), the
  ladder, the CREI drill, or the Part B step chip.
- Do NOT animate closing.
- Do NOT change the scrolling in the `toggle` handler (the `scrollIntoView` calls after it). If the turn and the
  scroll fight visibly, report it instead of changing the scroll.
- Do NOT change any HTML.
- If the excerpts above do not match the code, STOP and report the drift.

## Verification

- **Mechanical**: `node --test tests/` → all pass, 0 fail.
  `node -e "new Function(require('fs').readFileSync('assets/js/site.js','utf8'))"` → no error.
- **Feel check** (any modern browser, repo served over HTTP, for example `python -m http.server 8000`; check at
  375px wide first, then 768px):
  - On Part B, open Step 1, then tap "Next: Step 2": Step 2's body turns in from the right, hinged on its left.
  - Then open Step 1 again: it turns in from the left, hinged on its right.
  - On S.4 grammar, open a row near the bottom, then one near the top: the second turns in from the left.
  - The first row opened on a visit, and a row opened from a link (`part-b.html#crei`), turn in from the right.
  - Closing a row is instant; the row being closed never animates.
  - DevTools → Animations at 10%: the turn starts from 0 opacity and a slight 6° tilt and lands flat, with no
    sideways overflow (no horizontal scrollbar appears at 375px during the turn).
  - DevTools → Rendering → `prefers-reduced-motion: reduce`: rows fade in for 0.15s with no tilt or slide.
- **Done when**: every row opens as a page turning from the direction the reader moved, closing is instant, and
  reduced motion gets a short fade.
