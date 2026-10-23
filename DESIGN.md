---
name: CLY English
description: HKDSE Paper 2 Writing guides, set as a page in the student's own exercise book.
colors:
  cover: "#b5531f"
  cover-deep: "#8c3d15"
  cover-ink: "#fff8f1"
  ink: "#2b2826"
  ink-soft: "#694836"
  copper: "#9a4519"
  paper: "#ffffff"
  chest: "#fbeee2"
  rule: "#efe1d4"
  margin-rule: "#de8a5e"
  highlight: "#fbd3b0"
  do: "#2f6b3a"
  avoid: "#a3321f"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3.2vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.8vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  ui:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  brand:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
rounded:
  sm: "6px"
  tab: "10px 10px 0 0"
  md: "12px"
  lg: "14px"
  pill: "999px"
spacing:
  ruling: "32px"
  column-top: "40px"
  section: "64px"
  sheet-max: "1360px"
  gutter: "clamp(16px, 4vw, 56px)"
components:
  tab:
    backgroundColor: "{colors.cover-deep}"
    textColor: "{colors.cover-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.tab}"
    padding: "16px 22px 15px"
  tab-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "16px 22px 19px"
  index-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 12px"
  index-link-hover:
    backgroundColor: "{colors.chest}"
  index-link-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  label-panel:
    backgroundColor: "{colors.chest}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
    width: "560px"
  level-mark:
    textColor: "{colors.copper}"
    rounded: "{rounded.pill}"
    height: "2.4em"
  level-mark-selected:
    backgroundColor: "{colors.cover}"
    textColor: "{colors.cover-ink}"
    rounded: "{rounded.pill}"
  ladder:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  ladder-head:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "14px 20px"
  task:
    backgroundColor: "{colors.chest}"
    rounded: "{rounded.md}"
    padding: "18px 22px"
  button-reset:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  button-reset-hover:
    backgroundColor: "{colors.chest}"
---

# Design System: CLY English

## Overview

**Creative North Star: "The Student's Own Exercise Book"**

Every page is a sheet in a Hong Kong exercise book. A fox-copper card cover holds the masthead and the tabs. White writing paper sits on that cover. A double margin rule separates the contents index from the page. CLY's corrections are written in the right-hand margin on faint warm ruling. Nothing on the page looks like a tutoring site: there is no hero, no call-to-action band and no card grid. Structure comes from the book itself: cover, tabs, margin line, label panel, ruled lines and a teacher's marks.

Reading comes first. Body type is set for students who read English as a second language: Atkinson Hyperlegible at 17px with a 1.65 line height, a measure capped at 68ch, and WCAG AA contrast everywhere, including cream on the cover. Bricolage Grotesque carries the voice: headings, labels, tabs and level marks. Colour comes from the logo: copper, cream and charcoal. State is never shown by colour alone. It is shown with a mark (tick, cross, circle, strike-through or highlighter).

**Key Characteristics:**
- Copper card cover framing a white paper sheet (the page lifts off the cover with one soft shadow).
- Exercise-book double margin rule (5px double) between the index and the page.
- A label panel (Subject / Belongs to / Aim, or Words / Aim) titles every guide.
- Circled level marks and a level ladder are the one axis that matters (Level 2 to 5**).
- Marks show state: tick = do, cross = avoid, strike-through = the weaker version.
- Highlighter used sparingly: at most one swipe in view per section, on the line that moves your level.

## Colors

Logo colours on paper: one warm copper family, charcoal ink, cream panels, and a green and red reserved for marking.

### Primary
- **Card Cover Copper** (cover): Page background behind the sheet, the masthead and back cover, the selected level mark, and the browser theme colour. It is deeper than the contract's #c8642c, in the same hue, because cream text on #c8642c is only about 3.9:1 and fails AA. On this value cream text reaches about 4.7:1.
- **Cover Shadow Side** (cover-deep): Inactive tabs hanging from the cover.
- **Margin Copper** (copper): Ink colour for links on paper, margin-note headings, small uppercase labels, table header text and level marks at rest.

### Secondary
- **Exercise-Book Margin Line** (margin-rule): Used only for the margin rule: 5px double at desktop, a 2px single rule under the sticky index on phones.
- **Highlighter Peach** (highlight): Highlighter swipes and text selection.

### Neutral
- **Charcoal Ink** (ink): All text on paper, the 2px outlines of panels, ladders, tables and tasks, the current index item, and the ladder head bar.
- **Faded Ink** (ink-soft): Secondary text, struck-through weaker versions, unselected ladder levels.
- **Writing Paper** (paper): The sheet itself and the value cells of the label panel.
- **Fox Chest Cream** (chest): Label-panel field column, task boxes, table headers, hover fill.
- **Faint Ruling** (rule): Row dividers, the margin's 32px ruling, and the ladder axis line.
- **Cover Cream** (cover-ink): All text on the cover.

### Marking colours
- **Tick Green** (do): Tick marks and completed checkboxes.
- **Correction Red** (avoid): Cross marks and the strike-through line on weaker versions.

### Named Rules
**The Cover Owns the Copper Rule.** Large copper fields belong to the cover only: masthead, tabs, back cover and the one selected level mark. On paper, copper is ink for small text and marks, not a fill.

**The AA on Cover Rule.** Cream on cover must pass 4.5:1. If the cover colour changes, it changes inside the same hue and must keep that contrast. Never brighten it back to #c8642c for vividness.

## Typography

**Display Font:** Bricolage Grotesque (with Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible (with Segoe UI, system-ui)

**Character:** Bricolage gives the book a confident, slightly hand-made voice in headings and marks. Atkinson Hyperlegible was chosen for ESL legibility because its letterforms are hard to confuse. Its slashed zero is intentional; do not swap faces to remove it.

### Hierarchy
- **Brand** (800, 1.9rem, 1): "CLY English" on the cover only (1.55rem below 760px).
- **Display** (700, clamp 2.4rem to 4rem, 1.1, -0.035em): The single page title under the label panel, capped at 16ch.
- **Headline** (700, clamp 1.9rem to 2.6rem, 1.1): Section headings in the reading column.
- **Title** (700, 1.25rem): Sub-headings in the column; 1.6rem for the marking-domain columns.
- **Lead** (400, 1.25rem, 1.55): The opening paragraph and the ladder's example line.
- **Body** (400, 1.0625rem, 1.65): All reading text, max 68ch.
- **UI** (500–600, 1rem, 1.3): Tabs, index links, pager, ladder head.
- **Label** (700, 0.875rem, 0.06–0.08em, uppercase, copper): Field names: label-panel keys, table headers, summary keys, the index heading and margin headings.

### Named Rules
**The Two Voices Rule.** Bricolage speaks (headings, labels, marks, navigation). Atkinson reads (paragraphs, list items, table cells). Do not set long reading text in Bricolage, except for margin notes, which are CLY's handwriting.

**The Tabular Levels Rule.** Level marks and tables use tabular numerals so "3", "5" and "5**" line up.

## Layout

The page is a sheet (max 1360px) centred on the copper cover. At desktop the sheet is a three-column grid: a 230px index column, the flexible reading column, and a 280px margin column. The index is separated by the 5px double margin rule, and its list stays sticky. The reading column has 40px top padding, holds sections at 68ch, and leaves 64px between sections. When a page uses subtabs and JavaScript is on, only one section shows at a time.

The right margin is ruled at 32px. Margin headings, notes and before/after pairs sit on that ruling with a 32px line height and 32px gaps, so every line of a note lands on a rule.

Responsive behaviour:
- **≤1100px:** The grid becomes 210px index + column. The margin moves under the column (2px ink top rule, 68ch). The ruling is removed, and notes and pairs relax to a 1.6 line height with 18px gaps.
- **≤760px:** The sheet becomes one column and drops its shadow. The index becomes a sticky, horizontally scrolling strip of bordered chips under a 2px single margin rule. Tabs scroll edge to edge, and route arrows hide.
- **≤420px:** Tabs tighten (3px gap, 8px side padding, 0.84rem). This block must stay after the ≤760px block so it wins.

Gutter: clamp(16px, 4vw, 56px).

## Elevation & Depth

Mostly flat paper. Depth exists only where the book is physically layered: the sheet lifts off the cover, and the logo disc sits on the cover like a sticker. Everything on the paper is flat and separated by ink outlines and ruled lines.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 18px 40px rgb(60 20 0 / 0.28)`): The paper sheet on the cover, at desktop and tablet only.
- **Logo sticker** (`box-shadow: 0 6px 18px rgb(60 20 0 / 0.35)`): The circular logo disc on the cover.

### Named Rules
**The Flat Paper Rule.** Nothing on the paper casts a shadow. Separate things with a 2px ink outline, a 1px ruled line, or cream fill.

## Shapes

Soft, physical stationery shapes. Outlined boxes (label panel, task, table wrapper) use a 2px charcoal outline with 12px corners. The level ladder uses 14px. Tabs are rounded only on top (10px; 8px at ≤420px), so they look like they hang from the cover. Index links and checkboxes use 6px. Anything that is a mark is a full circle or pill: level marks, numbered skeleton steps (36px circles), the logo disc and the reset button. Lines are part of the language: the 5px double margin rule, 1px faint ruling between rows, and a dashed rule under phrase-bank items.

## Components

### Cover tabs
Tabs hang from the bottom of the cover. Inactive tabs use the cover's shadow side with cream text and darken on hover. The active tab is paper-coloured with ink text and joins the sheet. It stands 4px taller through extra top padding, so its label stays on the same baseline as the other tabs.

### Index (subtabs)
An uppercase copper heading over a plain list of Bricolage links. Hover fills cream. Choosing a section turns the new one in from the side the reader moved towards (0.32s, 16px); with reduced motion it fades in over 0.15s instead. The current item is reversed (ink fill, paper text). On phones the index becomes a sticky, scrolling strip of bordered chips.

### Label panel (signature)
Each guide's title block, like the label on an exercise-book cover. It is a two-column grid with a 2px ink outline and 12px corners: copper uppercase field names on cream, and bold values on paper, separated by 1px rules. Max width 560px, followed by the display title.

### Level mark
A circled level number like a teacher's grade: 2px currentColor ring, pill shape, Bricolage 800, tabular numerals, copper at rest. In the margin it shrinks to 26px.

### Level ladder (signature)
One example line rewritten at each level. An ink head bar carries the task and the input hint. Below it, an axis of circled level marks sits on a faint line. The selected mark fills with cover copper, takes cream text and scales to 1.15. A copper line traces the axis from the lowest level up to the selected one (0.5s), and each level it passes takes a copper ring as the line reaches it. The panel rises in (0.45s), and its highlighter swipe draws again. With reduced motion, the line and rings appear instantly. The hint reads "Tap a level" by default and switches to "Click a level or use ← → keys" only under (hover: hover) and (pointer: fine). Without JavaScript, all panels stack with text tags and ruled dividers.

### Marks (do / avoid)
A list with an SVG mask icon in the left gutter: a green tick for do, a red cross for avoid. A weaker version is shown struck through with a 2px red line in faded ink.

### Margin pair
CLY's correction in the margin: the Level 3 line struck through, and the 5** line written in bold underneath, each with a small level mark. A note or pair line that opens with a level mark hangs that mark in a 42px gutter, so wrapped lines align with the text, not under the mark.

### Highlighter swipe
A peach band (12% to 88% of the line height) that draws left to right in 0.9s when it enters view. It is instant when reduced motion is requested.

### Tables, summary, skeleton
Tables sit in a 2px outlined, 12px-cornered wrapper with cream uppercase copper headers over a 2px ink rule. Rows are ranked by weight, with bold Bricolage row headers. The summary strip is a set of key/value columns between two 2px ink rules. The structure skeleton is a numbered list with 36px circled step numbers.

### Routes (home)
Full-width ruled rows: a level mark, a bold title with a faded line under it, and a copper "go" label with an arrow that moves 4px on hover. These are rows, not cards.

### Checklist and reset
Custom 24px checkboxes (2px ink, 6px corners) that fill tick-green with a paper tick when checked. Completed text fades. The reset button is an outlined ink pill that fills cream on hover.

### Focus
3px ink outline with 3px offset and 4px corners. It switches to cream on the cover and back cover.

## Do's and Don'ts

### Do:
- **Do** keep copper fields on the cover and use copper on paper only for small text, labels and marks.
- **Do** keep cream-on-cover at AA or better; #b5531f is the cover.
- **Do** title every guide with the label panel, then the display heading.
- **Do** show state with a mark: circled level, tick for do, cross for avoid, strike-through for the weaker version.
- **Do** keep at most one highlighter swipe in view per section (one per ladder panel), on the line that moves the level.
- **Do** write margin notes on the 32px ruling at desktop, and relax them to a 1.6 line height below 1100px.
- **Do** separate content with 2px ink outlines and ruled lines, not shadows.
- **Do** set reading text in Atkinson Hyperlegible at 68ch or narrower.
- **Do** show the keyboard hint only for fine pointers with hover.

### Don't:
- **Don't** build hero + CTA + card-grid sections; use ruled rows, columns and the label panel.
- **Don't** brighten the cover back to #c8642c.
- **Don't** put shadows on anything on the paper; only the sheet and the logo disc lift.
- **Don't** add more highlighter swipes to a section for emphasis; use bold instead.
- **Don't** signal do/avoid by colour alone; the tick or cross mark is required.
- **Don't** move the ≤420px tab rule above the ≤760px block.
