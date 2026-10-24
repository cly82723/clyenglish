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
  rule-strong: "#e3c9b3"
  rule-dash: "#e6d3c3"
  edge: "#d9bfa9"
  ring: "#a8897a"
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
  display-home:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1rem + 5.4vw, 6.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.045em"
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
  square: "8px"
  tab: "10px 10px 0 0"
  md: "12px"
  lg: "14px"
  pill: "999px"
spacing:
  ruling: "32px"
  column-top: "40px"
  section: "64px"
  side-column: "320px"
  touch: "44px"
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
  tab-phone:
    backgroundColor: "{colors.cover-deep}"
    textColor: "{colors.cover-ink}"
    rounded: "{rounded.square}"
    height: "{spacing.touch}"
    padding: "6px 4px"
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
  task-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    height: "{spacing.touch}"
    padding: "0 14px"
  task-link-hover:
    backgroundColor: "{colors.chest}"
  level-mark:
    textColor: "{colors.copper}"
    rounded: "{rounded.pill}"
    height: "2.4em"
  level-mark-resting:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
  level-mark-selected:
    backgroundColor: "{colors.cover}"
    textColor: "{colors.cover-ink}"
    rounded: "{rounded.pill}"
  form-mark:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    height: "2.4em"
  ladder:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  ladder-head:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "14px 20px"
  route-row:
    textColor: "{colors.ink}"
    padding: "18px 4px"
  route-row-hover:
    backgroundColor: "{colors.chest}"
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

Every page is a sheet in a Hong Kong exercise book. A fox-copper card cover holds the masthead and the tabs. White writing paper sits on that cover. A double margin rule separates the contents index from the page. CLY's corrections are written in the margin on faint warm ruling, beside the part of the page they are about. Nothing on the page looks like a tutoring site: there is no hero, no call-to-action band and no card grid. Structure comes from the book itself: cover, tabs, margin line, label panel, ruled lines and a teacher's marks.

Reading comes first. Body type is set for students who read English as a second language: Atkinson Hyperlegible at 17px with a 1.65 line height, a measure capped at 68ch, and WCAG AA contrast everywhere, including cream on the cover. Bricolage Grotesque carries the voice: headings, labels, tabs and level marks. Colour comes from the logo: copper, cream and charcoal. State is never shown by colour alone. It is shown with a mark (tick, cross, circle, strike-through or highlighter).

**Key Characteristics:**
- Copper card cover framing a white paper sheet (the page lifts off the cover with one soft shadow).
- Exercise-book double margin rule (5px double) between the index and the page.
- A label panel (Subject / Belongs to / Aim, or Words / Aim) titles every guide.
- Circled level marks and a level ladder are the one axis that matters (Level 2 to 5**).
- Marks show state: tick = do, cross = avoid, strike-through = the weaker version.
- Highlighter used sparingly: at most one swipe in view per section, on the line that moves your level.
- CLY's margin notes sit beside the section they are about, never in a long empty column.

## Colors

Logo colours on paper: one warm copper family, charcoal ink, cream panels, a ladder of warm greys for lines, and a green and red reserved for marking.

### Primary
- **Card Cover Copper** (cover): Page background behind the sheet, the masthead and back cover, the selected level mark, and the browser theme colour. It is deeper than the contract's #c8642c, in the same hue, because cream text on #c8642c is only about 3.9:1 and fails AA. On this value cream text reaches about 4.7:1.
- **Cover Shadow Side** (cover-deep): Inactive tabs hanging from the cover.
- **Margin Copper** (copper): Ink colour for links on paper, margin-note headings, small uppercase labels, table header text, task-chooser part names and level marks at rest on paper.

### Secondary
- **Exercise-Book Margin Line** (margin-rule): Used only for the margin rule: 5px double at desktop, a 2px single rule under the sticky index on phones.
- **Highlighter Peach** (highlight): Highlighter swipes and text selection.

### Neutral
- **Charcoal Ink** (ink): All text on paper, the 2px outlines of panels, ladders, tables and tasks, the current index item, and the ladder head bar.
- **Faded Ink** (ink-soft): Secondary text, struck-through weaker versions, the numbers of unreached ladder levels.
- **Writing Paper** (paper): The sheet itself and the value cells of the label panel.
- **Fox Chest Cream** (chest): Label-panel field column, task boxes, table headers, hover fill.
- **Cover Cream** (cover-ink): All text on the cover.

The warm greys are a ladder from faintest to firmest; each has one job:
- **Faint Ruling** (rule): Row dividers, the margin's 32px ruling, and the ladder axis line.
- **Panel Ruling** (rule-strong): The row lines inside the label panel and the outlines of index chips and task-chooser links.
- **Dashed Ruling** (rule-dash): The dashed rule under phrase-bank and word-list items.
- **Pencil Edge** (edge): The 1px outline of answer choices, matrix cells, picker chips and small buttons on the practice pages.
- **Resting Ring** (ring): The ring of a level mark that has not been reached. It is the lightest warm grey that still reaches 3:1 on paper (about 3.2:1), the minimum for a mark the student has to see.

### Marking colours
- **Tick Green** (do): Tick marks and completed checkboxes.
- **Correction Red** (avoid): Cross marks and the strike-through line on weaker versions.

### Named Rules
**The Cover Owns the Copper Rule.** Large copper fields belong to the cover only: masthead, tabs, back cover and the one selected level mark. On paper, copper is ink for small text and marks, not a fill.

**The AA on Cover Rule.** Cream on cover must pass 4.5:1. If the cover colour changes, it changes inside the same hue and must keep that contrast. Never brighten it back to #c8642c for vividness.

**The Named Greys Rule.** Every warm line on paper uses one of the five grey tokens. A new hard-coded grey is either one of them or a new token with its own job.

## Typography

**Display Font:** Bricolage Grotesque (with Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible (with Segoe UI, system-ui)

**Character:** Bricolage gives the book a confident, slightly hand-made voice in headings and marks. Atkinson Hyperlegible was chosen for ESL legibility because its letterforms are hard to confuse. Its slashed zero is intentional; do not swap faces to remove it.

### Hierarchy
- **Brand** (800, 1.9rem, 1): "CLY English" on the cover only (1.55rem below 760px).
- **Display** (700, clamp 2.4rem to 4rem, 1.1, -0.035em): The single page title under each guide's label panel, capped at 16ch.
- **Display, home** (700, clamp 2.6rem to 6.25rem, 0.98, -0.045em): The home page's title only. It opens the sheet before anything else, runs the full column width, and reaches about 94px at 1440px.
- **Headline** (700, clamp 1.9rem to 2.6rem, 1.1): Section headings in the reading column.
- **Title** (700, 1.25rem): Sub-headings in the column; 1.6rem for the marking-domain columns and the task chooser's heading.
- **Lead** (400, 1.25rem, 1.55): The opening paragraph and the ladder's example line.
- **Body** (400, 1.0625rem, 1.65): All reading text, max 68ch. Paragraphs, list items and table cells use `text-wrap: pretty`, so no paragraph ends on a single word; headings use `balance`.
- **UI** (500–600, 1rem, 1.3): Tabs, index links, task-chooser links, pager, ladder head.
- **Label** (700, 0.875rem, 0.06–0.08em, uppercase, copper): Field names: label-panel keys, table headers, summary keys, the index heading and margin headings.

### Named Rules
**The Two Voices Rule.** Bricolage speaks (headings, labels, marks, navigation). Atkinson reads (paragraphs, list items, table cells). Do not set long reading text in Bricolage, except for margin notes, which are CLY's handwriting.

**The Tabular Levels Rule.** Level marks and tables use tabular numerals so "3", "5" and "5**" line up.

**The Spoken Level Rule.** "5**" is written as "Level 5**" wherever a level is named (never "Top"), and read aloud as "Level 5 double star".

## Layout

The page is a sheet (max 1360px) centred on the copper cover. On the guide pages the sheet is a three-column grid at desktop: a 230px index column, the flexible reading column, and a 280px margin column. The index is separated by the 5px double margin rule, and its list stays sticky. The reading column has 40px top padding, holds sections at 68ch, and leaves 64px between sections. When a page uses subtabs and JavaScript is on, only one section shows at a time.

The right margin is ruled at 32px. Margin headings, notes and before/after pairs sit on that ruling with a 32px line height and 32px gaps, so every line of a note lands on a rule.

The home page scrolls as one page, so it has no long margin column. Its sheet is two columns (the 230px index and the reading column). The title runs the full column width, then each part of the page is a row: the content on the left at 68ch, and a 320px side column (56px gap) holding the note that belongs to that part. Each note carries its own short stretch of 32px ruling, which ends where the note ends. The ladder's row stacks two notes in its side column, "How to use this book" and then CLY's pair. Only "What the marker reads for" runs the full width, because its three columns fill it. The order is: title and intro (with the task chooser, and the label panel beside it), the ladder, routes, practice, the paper at a glance, the marking areas.

Responsive behaviour:
- **≤1100px:** The guide grid becomes 210px index + column. The margin moves under the column (2px ink top rule, 68ch). On the home page each side note drops under its part with a 2px ink top rule. The ruling is removed, and notes and pairs relax to a 1.6 line height with 18px gaps. Tabs narrow to 16px side padding so all seven fit at tablet width.
- **≤900px:** The home page drops its contents column and becomes one column. The marking areas stack into one column with ruled dividers.
- **≤760px:** The sheet becomes one column and drops its shadow. On the guide pages the index becomes a sticky, horizontally scrolling strip of bordered chips under a 2px single margin rule. Route rows keep only their arrow as the tap cue.
- **≤680px:** The tabs become two rows of three, each at least 44px tall. The Home tab steps aside because the logo already goes home. The row holding the current page always sits against the sheet: the guides (Part A, Part B, Toolkit) by default, and the practice pages (Grammar, Vocab, Self-study) when one of them is open.

Gutter: clamp(16px, 4vw, 56px).

## Elevation & Depth

Mostly flat paper. Depth exists only where the book is physically layered: the sheet lifts off the cover, and the logo disc sits on the cover like a sticker. Everything on the paper is flat and separated by ink outlines and ruled lines.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 18px 40px rgb(60 20 0 / 0.28)`): The paper sheet on the cover, at desktop and tablet only.
- **Logo sticker** (`box-shadow: 0 6px 18px rgb(60 20 0 / 0.35)`): The circular logo disc on the cover.

### Cover print
Each page's cover carries a faint picture, like the illustrated cover of a real exercise book: the home page a flight of steps, Part A and Grammar a meadow, Part B and Vocab a great tree, the Toolkit a hillside above the sea, Self-study a lantern-lit garden at night. The picture is baked into the cover colour itself (grayscale, then multiplied into copper at 32% strength, with the lightest tone held at 93% of the cover), so it reads as copper-on-copper and never brings its own colours onto the page. It is fixed to the window, so the sheet slides over it like a page over a desk. Prints live in `assets/img/cover/` at 2400px (above 900px) and 1200px (below).

### Named Rules
**The Flat Paper Rule.** Nothing on the paper casts a shadow. Separate things with a 2px ink outline, a 1px ruled line, or cream fill.

**The Print Stays on the Cover Rule.** Pictures belong to the cover only. The paper, where students read, is always plain white. A cover print is never lighter than 93% of the cover colour, so cream text on it keeps 4.5:1 or better.

## Shapes

Soft, physical stationery shapes. Outlined boxes (label panel, task, table wrapper) use a 2px charcoal outline with 12px corners. The level ladder uses 14px. Tabs are rounded only on top (10px) so they hang from the cover; on phones they take 8px corners, with the row against the sheet rounded only on top and the other row rounded all round. Index links, checkboxes and task-chooser links use 6px. Anything that is a level mark is a full circle or pill: level marks, numbered skeleton steps (36px circles), the logo disc and the reset button. A form (S.1–S.4) is a square 8px-cornered label, so it never reads as a level. Lines are part of the language: the 5px double margin rule, 1px faint ruling between rows, and a dashed rule under phrase-bank items.

## Components

### Cover tabs
Tabs hang from the bottom of the cover. Inactive tabs use the cover's shadow side with cream text and darken on hover. The active tab is paper-coloured with ink text and joins the sheet. It stands 4px taller through extra top padding, so its label stays on the same baseline as the other tabs. On phones (≤680px) the tabs follow the two-row layout described in Layout.

### Index (subtabs)
An uppercase copper heading over a plain list of Bricolage links. Hover fills cream. Choosing a section turns the new one in from the side the reader moved towards (0.24s, 16px); with reduced motion it fades in over 0.15s instead. The current item is reversed (ink fill, paper text). On phones the guide pages' index becomes a sticky, scrolling strip of bordered chips; the home page has no index below 900px.

### Label panel (signature)
Each guide's title block, like the label on an exercise-book cover. It is a two-column grid with a 2px ink outline and 12px corners: copper uppercase field names on cream, and bold values on paper, separated by 1px panel-ruling lines. Max width 560px, followed by the display title. On the home page it sits in the side column beside the intro instead, because the title comes first there.

### Task chooser (home)
"Open the guide for your task" sits under the intro, above a 2px ink rule. Two rows, each with a copper part name in Bricolage: Part A has one link (the short task), and Part B has one link per text type (Article, Letter to the editor, Speech, Proposal, Report, Story). Each opens that guide directly. The links are 44px-tall bordered tabs with 6px corners and panel-ruling outlines that fill cream on hover. They wrap, and are never a scrolling strip.

### Level mark
A circled level number like a teacher's grade: 2px ring, pill shape, Bricolage 800, tabular numerals, copper at rest on paper. On the ladder axis an unreached level is faded ink inside a resting-ring outline. In the margin it shrinks to 26px.

### Level ladder (signature)
One example line rewritten at each level. An ink head bar carries the task and the input hint. Below it, an axis of circled level marks sits on a faint line, each labelled "Level 2" to "Level 5**". The selected mark fills with cover copper, takes cream text and scales to 1.15. All the level panels share one grid cell, so the ladder always keeps the height of its longest level and the text under it never jumps.

Choosing a level by click or tap is explanatory motion:
- A copper line traces the axis from the lowest level up to the selected one (0.5s).
- Each level it passes takes a copper ring as the line reaches it.
- The panel rises in (0.26s), and its highlighter swipe draws again from empty.

Stepping with the arrow keys (or Home and End) changes the level at once, with no climb, no rise and no redrawn swipe, because a key pressed again and again must never wait for an animation. With reduced motion, the line and rings appear instantly.

Each panel is labelled by its level tab, and screen readers hear "Level 5 double star". The hint reads "Tap a level" by default, and switches to "Click a level or use ← → keys" only under (hover: hover) and (pointer: fine). Without JavaScript, all panels stack with text tags and ruled dividers.

### Marks (do / avoid)
A list with an SVG mask icon in the left gutter: a green tick for do, a red cross for avoid. A weaker version is shown struck through with a 2px red line in faded ink.

### Margin pair
CLY's correction in the margin: the Level 3 line struck through, and the 5** line written in bold underneath, each with a small level mark. A note or pair line that opens with a level mark hangs that mark in a 42px gutter, so wrapped lines align with the text, not under the mark.

### Highlighter swipe
A peach band (12% to 88% of the line height) that draws left to right in 0.9s when it enters view. It is instant when reduced motion is requested.

### Tables, summary, skeleton
Tables sit in a 2px outlined, 12px-cornered wrapper with cream uppercase copper headers over a 2px ink rule. Rows are ranked by weight, with bold Bricolage row headers. The summary strip is a set of key/value columns between two 2px ink rules. The structure skeleton is a numbered list with 36px circled step numbers.

### Routes (home)
Full-width ruled rows under a 2px ink rule:
- **Mark:** every mark in a list takes the same width (3.6em) so the titles start on one edge. Levels use the circled level mark, forms use the square form mark, and a row with no level (self-study) keeps an empty slot of the same width rather than inventing a mark.
- **Text:** a bold title with a faded line under it.
- **Go label:** a copper "go" label with an arrow that moves 4px on hover. On phones only the arrow shows; the words stay in the link's accessible name.
- These are rows, not cards.

### Links
Links on paper are copper and underlined, 1px thick at rest and 2px on hover. A link that leaves the site carries a small out-arrow drawn as an SVG mask.

### Press feedback
Every pressable control gives a little under the finger and springs back: tabs, buttons, chips, matrix cells, task links and proofreading buttons scale to 0.97 on press (160ms, cubic-bezier(0.23, 1, 0.32, 1)), wide answer choices to 0.98, and level marks to 0.94. Hover fills and arrow nudges apply only under (hover: hover), so a tapped control on a phone never keeps a fill that looks like "selected". With reduced motion, presses do not scale.

### Practice pages (Grammar, Vocab)
The S.4 grammar and S.1–S.3 vocab exercises are built from the same parts as the guides; nothing new gets a shadow, a card or an emoji.
- **Form mark:** a form (S.1–S.4) is a square 8px-cornered ink label, so it never reads as a circled level. Conditionals are numbered the same way (0–3).
- **Grouped index:** a long index takes small uppercase faded-ink group headings (12 Tenses, Proofreading, Conditionals), hidden in the phone chip strip.
- **Choices:** 1px pencil-edge outlined options; the picked one gets a 2px ink outline on cream. After checking, a wrong pick is struck through in red with a cross; the right one gets a green outline and a tick.
- **Verdict:** a cream block with a mark in its gutter: tick for solved, a copper question-mark ring for a hint. It sits right under the question or proofreading line it is about; in a passage, notes for a paragraph's blanks sit in a cream block under that paragraph. Hints get stronger on the second try and never give the answer; the MC bigger clue points to the matrix instead of naming the tense or conditional.
- **Marking like a teacher:** an MC answer is marked as soon as it's chosen. "Check" marks only what the student has tried; untried items get no mark at all, never a red cross.
- **Blanks:** written on the line (2px faded-ink underline, cream on focus), green underline and tick when right, red underline and cross when wrong. Passages sit in the 2px ink, 12px-cornered wrapper.
- **Buttons:** the main action is an ink pill; the rest are outlined ink pills. Pickers are pill chips that reverse to ink when selected; a crossed-off chip is struck through in red.
- **Matrices:** tables of 10px-cornered cells that reverse to ink when selected, followed by a detail panel under a 2px ink rule. The conditionals' "How real is it?" axis reuses the ladder axis.
- **Proofreading:** numbered lines like the exam paper, with a tick or cross between the number and the text. Corrections are written above the word in copper; a changed word gets a wavy copper underline, an added word a copper caret, and a deleted word a red strike and slash.
- **Diagrams:** timelines and clause diagrams are drawn in ink, faded ink and copper, with highlighter for spans and green only for "result still matters now". They scroll sideways inside their frame below 520px.
- **Marking motion:** a new tick or cross draws itself in left to right like a pen stroke (clip-path, 0.3s, ease-out). Hint and correct notes slide up 4px (0.22s), and their mark follows 0.1s later. Only new marks animate; a redraw leaves existing marks still. Choosing a tense or conditional fades its detail panel in (0.18s). With reduced motion, marks appear at once and notes fade.
- **Results:** after a check, the result sits under a 2px ink rule and leads with what to do next ("2 to fix: blank 4, blank 9"), with a "Go to the first one to fix" button. Untried items are counted, and the score comes last in faded ink. Explanations for right answers fold away under a copper "Why the … you got right are right" summary. Progress is a plain count ("7 of 15 solved"), not a bar.
- **Phones:** below 760px, the Tense Matrix becomes two chip rows (Time, then Aspect), and the Conditionals Matrix table gives way to the "How real is it?" axis, with the empty cells explained in a fold-out. Lesson tables stack each row so the example sits under the formula.

### Checklist and reset
Custom 24px checkboxes (2px ink, 6px corners) that fill tick-green with a paper tick when checked. The tick draws in left to right like the practice marks (clip-path, 0.3s) and clears faster (0.12s). Completed text fades. The reset button is an outlined ink pill that fills cream on hover.

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
- **Do** put each margin note beside the part it is about, and end its ruling where the note ends.
- **Do** separate content with 2px ink outlines and ruled lines, not shadows.
- **Do** set reading text in Atkinson Hyperlegible at 68ch or narrower.
- **Do** show the keyboard hint only for fine pointers with hover.
- **Do** make every tap target on phones at least 44px tall.
- **Do** give every pressable control a press scale (0.97, or 0.98 for wide rows), and keep hover effects behind (hover: hover).
- **Do** use the five grey tokens (rule, rule-strong, rule-dash, edge, ring) for warm lines on paper.
- **Do** bake any new cover picture into copper the same way (grayscale, 32% strength, lightest tone at 93% of the cover), and check cream contrast on its lightest pixel.

### Don't:
- **Don't** build hero + CTA + card-grid sections; use ruled rows, columns and the label panel.
- **Don't** brighten the cover back to #c8642c.
- **Don't** put shadows on anything on the paper; only the sheet and the logo disc lift.
- **Don't** add more highlighter swipes to a section for emphasis; use bold instead.
- **Don't** signal do/avoid by colour alone; the tick or cross mark is required.
- **Don't** animate a change the student makes with the keyboard; it happens at once.
- **Don't** let a margin column run empty down the page; a note without a part to sit beside is cut.
- **Don't** use a circled level mark for anything that is not a level.
- **Don't** put a picture behind the paper, or a full-colour picture on the cover.
