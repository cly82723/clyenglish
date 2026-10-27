---
name: CLY English
description: English practice for Hong Kong secondary students, from S.1 vocab to HKDSE Paper 2, set as pages in the student's own exercise book on a sunny picnic day.
colors:
  cover: "#d6ecf7"
  cover-ink: "#1d2a3a"
  leaf: "#1f7a45"
  leaf-deep: "#17603a"
  fox: "#f2711c"
  ink: "#1d2a3a"
  ink-soft: "#4a5a6a"
  sky: "#1a64c4"
  paper: "#ffffff"
  chest: "#e8f5ec"
  rule: "#e2ebe5"
  rule-strong: "#cfdcd4"
  rule-dash: "#d6e2da"
  edge: "#bfcfc5"
  ring: "#7d8f86"
  margin-rule: "#f39a5e"
  highlight: "#ffc98f"
  do: "#1e7b3c"
  avoid: "#c0362c"
  crei-claim-tint: "#dce8f7"
  crei-reason-tint: "#dcefe2"
  crei-evidence: "#b4500f"
  crei-evidence-tint: "#ffe4c8"
  crei-impact: "#6b4596"
  crei-impact-tint: "#ece4f4"
  quote-paper: "#fff1e3"
  rewrite-paper: "#f6faff"
typography:
  brand:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  display-home:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.4rem + 3vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  section-display:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 2.6vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.8vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  label:
    fontFamily: "Bricolage Grotesque, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  hairline: "4px"
  sm: "6px"
  square: "8px"
  tab: "10px 10px 0 0"
  md: "12px"
  lg: "14px"
  pill: "999px"
spacing:
  column-top: "40px"
  section: "64px"
  touch: "44px"
  sheet-max: "1160px"
  hub-max: "1040px"
  index-column: "230px"
  measure: "68ch"
  gutter: "clamp(16px, 4vw, 56px)"
components:
  tab:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.tab}"
    padding: "16px 22px 15px"
  tab-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "20px 22px 15px"
  form-strip-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 16px"
  form-strip-link-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
  index-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 12px"
  index-link-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
  contents-toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "52px"
    padding: "6px 14px"
  label-panel:
    backgroundColor: "{colors.chest}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
    width: "560px"
  level-mark:
    textColor: "{colors.sky}"
    rounded: "{rounded.pill}"
    height: "2.4em"
  level-mark-selected:
    backgroundColor: "{colors.fox}"
    textColor: "{colors.ink}"
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
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "{spacing.touch}"
    padding: "7px 14px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  button-quiet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "11px 20px"
  button-quiet-hover:
    backgroundColor: "{colors.chest}"
  versions-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 20px 18px"
  task-box:
    backgroundColor: "{colors.chest}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
  sample-quote:
    backgroundColor: "{colors.quote-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 18px"
  script:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "22px 24px"
  script-rewrite:
    backgroundColor: "{colors.rewrite-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "22px 24px"
  tip-bubble:
    backgroundColor: "{colors.chest}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px 20px 18px"
---

# Design System: CLY English

## Overview

**Creative North Star: "The Student's Own Exercise Book"**

Every page is a sheet in a Hong Kong exercise book. The cover is a bright picture of a sunny day out, under a soft white veil, with leaf-green tabs hanging from it: one tab per form (S.1 · S.2 · S.3 for the junior track, S.4 · S.5 & S.6 for the senior track). White writing paper sits on that cover. A double margin rule separates the contents from the page. A label panel (Subject / Words / Aim) titles each guide like the label on a real exercise book. Nothing looks like a tutoring site: there is no hero band, no call-to-action strip and no card grid. Structure comes from the book itself: cover, tabs, margin line, label panel, ruled lines and a teacher's marks.

Reading comes first. Body type is set for students who read English as a second language: Atkinson Hyperlegible at 17px with a 1.65 line height, a 68ch measure, a 14px floor for anything meant to be read, and WCAG AA contrast everywhere, including navy on the picture cover. Bricolage Grotesque carries the voice: headings, labels, tabs and level marks. Colour comes from a picnic day: sky blue, leaf green and mint, with the logo's fox orange as the one warm accent, on deep navy ink. State is never shown by colour alone; it is shown with a mark (tick, cross, circle, strike-through, a letter, or the highlighter).

The level is the one axis that matters. Comparisons climb Level 3 → Level 5 → Level 5**; the circled level mark, the level ladder and the three-level "versions" box carry that climb through every page. Real candidates' scripts and CLY's own rewrites are always told apart at a glance.

**Key Characteristics:**
- A bright picture cover framing a white paper sheet; the sheet lifts off the cover with one soft shadow.
- Form tabs hang from the cover; the open tab carries a fox-orange top edge.
- An exercise-book double margin rule (5px double) between the contents and the page.
- Circled level marks, the level ladder and the versions box carry Level 3 → 5 → 5** everywhere.
- Marks show state: tick = do, cross = avoid, strike-through = the weaker version, a letter for each CREI move.
- One highlighter swipe in view per section, on the line that moves your level.
- Real exam scripts and CLY's rewrites never look alike.

## Colors

Picnic day: sky blue, leaf green and mint on white paper, deep navy ink, the logo's fox orange as the one warm accent, green and red reserved for marking, and four soft tints reserved for the CREI moves. Every colour that carries text or a mark passes WCAG AA where it is used.

### Primary
- **Leaf Green** (leaf): The form tabs hanging from the cover, with white labels (5.3:1); the scrollbar and the browser theme colour. Hover deepens to **Deep Leaf** (leaf-deep).
- **Sky Ink** (sky): Links on paper, field labels, table header text, step names in the contents, the "Claim" mark, corrections on proofreading lines, and level marks at rest. It reaches 5.1:1 even on mint.
- **Fox Orange** (fox): The selected level mark (navy number, 4.95:1), the ladder's climb line, and the 4px top edge of the open cover tab.

### Secondary
- **Exercise-Book Margin Line** (margin-rule): The margin rule only: 5px double at desktop, a 2px single rule under the contents on phones.
- **Orange Highlighter** (highlight): Highlighter swipes, text selection, the "Tap me" hint under the fox, the "From a real script" tag and the "CLY's rewrite" tag.
- **Pale Sky** (cover): The cover behind its picture, shown while the picture loads.

### Neutral
- **Deep Navy** (ink): All text on paper; the 1px rules above lists, tables and question sets; the outline of real exam scripts; the current contents item; the ladder head bar; the "Real exam script" tag; the main button.
- **Slate** (ink-soft): Secondary text, struck-through weaker versions, the small grey page title on tabbed pages, unreached ladder levels.
- **Writing Paper** (paper): The sheet itself, value cells of the label panel, tab labels.
- **Mint** (chest): The S.5/S.6 strip, label-panel field column, task boxes, table headers, tip bubble, para notes, analysis "next step" boxes, hover fill.
- **Cover Navy** (cover-ink): All text on the cover, over the picture.

The cool greys are a ladder from faintest to firmest; each has one job:
- **Faint Ruling** (rule): Row dividers and the ladder axis line.
- **Panel Ruling** (rule-strong): Row lines inside the label panel, and the outlines of contents chips, directory links and strip links.
- **Dashed Ruling** (rule-dash): Under phrase-bank and word-list items, and above CLY's note in a versions box.
- **Pencil Edge** (edge): The 1px outline of boxes (label panel, ladders, task boxes, tables, versions box, cards), answer choices, matrix cells and picker chips.
- **Resting Ring** (ring): The ring of an unreached level mark (about 3.4:1 on paper).

### Marking colours
- **Tick Green** (do): Tick marks, completed checkboxes, correct drill labels, and the "Reason" mark.
- **Correction Red** (avoid): Cross marks, strike-throughs on weaker versions, and the wavy underline under errors in real scripts.

### CREI colours
A marking set for the four moves of a body paragraph, used nowhere else. Each move is a soft tint behind the sentence plus a solid letter badge with a white letter:
- **Claim:** Pale Sky Tint (crei-claim-tint) with a Sky Ink badge.
- **Reason:** Pale Leaf Tint (crei-reason-tint) with a Tick Green badge.
- **Evidence / Example:** Apricot Tint (crei-evidence-tint) with a Burnt Orange badge (crei-evidence).
- **Impact:** Lilac Tint (crei-impact-tint) with a Plum badge (crei-impact).

### Source papers
- **Quote Paper** (quote-paper): The warm background of a line quoted from a sample answer.
- **Rewrite Paper** (rewrite-paper): The faint blue background of CLY's rewrites, inside a dashed sky outline.

### Named Rules
**The One Warm Accent Rule.** Fox orange is the only warm accent on the page besides the highlighter, the margin line and the CREI Evidence mark. It marks the level the student has chosen and the open tab; it is never a fill for panels, buttons or tabs.

**The CREI Only Rule.** The four CREI colours mean Claim, Reason, Evidence and Impact and nothing else. A CREI tint never appears without its letter badge.

**The Named Greys Rule.** Every cool line on paper uses one of the five grey tokens. A new hard-coded grey is either one of them or a new token with its own job.

**The AA on Cover Rule.** Navy on the picture cover must pass 4.5:1 on every pixel. Each cover picture is lifted so its darkest point keeps that, measured after compression.

## Typography

**Display Font:** Bricolage Grotesque (with Segoe UI, system-ui)
**Body Font:** Atkinson Hyperlegible (with Segoe UI, system-ui)

**Character:** Bricolage gives the book a confident, slightly hand-made voice in headings and marks. Atkinson Hyperlegible was chosen for ESL legibility because its letterforms are hard to confuse; its slashed zero is intentional.

### Hierarchy
- **Brand** (800, 1.9rem, 1): "CLY English" on the cover (1.35rem below 760px).
- **Display, home** (700, clamp 2.2rem to 3.6rem, 1.1, -0.04em): "CLY English" at the top of the home page, with its line of explanation under it as a separate paragraph.
- **Section display** (700, clamp 2.2rem to 3.6rem, 1.1, -0.035em): The heading of the open section on a tabbed page ("Tenses", "CREI paragraphs"). On tabbed pages this, not the page title, is the biggest thing on the sheet.
- **Page title** (700, 1.6rem, slate): The page's h1 on tabbed pages ("S.4 Grammar", "Part B: the long task"), set small and grey above the section heading.
- **Headline** (700, clamp 1.9rem to 2.6rem, 1.1): "Pick your form" on the home page and other non-tabbed headings.
- **Title** (700, 1.25rem): Sub-headings in the column; 1.6rem for a topic's parts and the closing heading on home.
- **Lead** (400, 1.25rem, 1.55): A section's opening line, ladder example lines, the climbing sentence on home.
- **Body** (400, 1.0625rem, 1.65): All reading text, max 68ch. Paragraphs and list items use `text-wrap: pretty`; headings use `balance`.
- **UI** (600, 1rem, 1.3): Tabs, contents links, strip links, chips, buttons, pager.
- **Label** (700, 0.875rem): Field names. Uppercase with 0.06–0.08em tracking only in the label panel, table headers and summary keys; everywhere else labels are sentence case (contents step names, matrix headings).

### Named Rules
**The Two Voices Rule.** Bricolage speaks (headings, labels, marks, navigation). Atkinson reads (paragraphs, list items, table cells, scripts).

**The 14px Floor Rule.** Nothing meant to be read is set below 0.875rem (14px). Sizes come from a short scale: 14, 16, 17, 20, 26, then the display sizes.

**The Tabular Levels Rule.** Level marks and tables use tabular numerals so "3", "5" and "5**" line up.

**The Spoken Level Rule.** "5**" is written "Level 5**" wherever a level is named, and read aloud as "Level 5 double star".

## Layout

The page is a sheet (max 1160px) centred on the picture cover. Guide and practice pages are a two-column grid: a 230px contents column behind the 5px double margin rule, and the reading column (40px top padding, 68ch sections). Pages with sections show one section at a time, with a Previous / Next pager at its end. A page with no contents column (vocab, whose forms are the cover tabs) uses a single-column sheet narrowed to 1040px, and its cover narrows with it. The home page is a 1040px "hub" sheet: the fox and its tip, a "Continue where you left off" card, the directory, the climbing sentence, and a closing invitation.

The S.5 & S.6 pages add a mint strip across the top of the sheet: "S.5 Part A · Part B · Toolkit" and "S.6 Final reminders".

Responsive behaviour:
- **≤1100px:** The contents column narrows to 210px.
- **≤900px:** Multi-column blocks (marking areas, directory tracks) stack.
- **≤760px:** The sheet becomes one column without a shadow. Form tabs share the width, 48px tall. The S.5/S.6 strip becomes one row of four buttons with the form marks hidden. Contents become wrapping chips; long contents (Part B) collapse to a single "Step · Section" button that opens the list. On those pages the label panel shows on the first section only, and elsewhere it becomes one line ("Paper 2 · Part B · About 400 · …"). The home hub drops its shadow and puts the fox beside the name, with the tip bubble below.

Gutter: clamp(16px, 4vw, 56px). Touch targets are at least 44px.

## Elevation & Depth

Mostly flat paper. Depth exists only where the book is physically layered: the sheet lifts off the cover, and the logo disc and the fox sit on the cover like stickers. Everything on the paper is flat and separated by ink outlines, ruled lines, tint or mint.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 18px 40px rgb(16 38 59 / 0.18)`): The paper sheet and the home hub, above 760px only.
- **Sticker** (`box-shadow: 0 6px 18px rgb(16 38 59 / 0.25)`): The logo disc on the cover; the home fox uses a slightly larger version (0 8px 22px, 0.22).
- **Open tab edge** (`box-shadow: inset 0 4px 0 #f2711c`): The open cover tab's fox-orange top edge.

### Cover print
Each page's cover carries a picture like an illustrated exercise-book cover (steps, meadow, great tree, hillside, garden). It keeps its colours under a soft white veil, and any part darker than a relative luminance of 0.42 is lifted, so navy cover text keeps AA after compression. The picture is fixed to the window, so the sheet slides over it like a page over a desk. Prints live in `assets/img/cover/` at 2400px and 1200px.

### Named Rules
**The Flat Paper Rule.** Nothing on the paper casts a shadow. Separate things with a 1px pencil-edge outline, a 1px ink or grey rule, a tint or mint. Lines stay hairline: 2px is kept for focus rings and the picked answer only.

**The Print Stays on the Cover Rule.** Pictures belong to the cover. The paper, where students read, is always plain white.

## Shapes

Soft stationery shapes. Outlined boxes (label panel, versions box, task box, level cards, table wrapper) use a 1px pencil-edge outline with 12px corners; ladders use 14px; real exam scripts keep a 1px navy outline. Numbered step circles use a 1.5px ink ring. Tabs are rounded on top only (10px) so they hang from the cover. Contents links use 6px. Anything that is a level is a full circle or pill: level marks, numbered skeleton steps (36px circles), the logo disc, chips and buttons. A form (S.1–S.6) is a square 8px-cornered label, so it never reads as a level. CREI badges and highlighted collocations use 3–4px corners. CLY's rewrites alone use a dashed outline. Lines are part of the language: the 5px double margin rule, 1px ruling between rows, dashed rules under word lists.

## Components

### Cover tabs
One tab per form in the current track. Inactive tabs are leaf green with white labels and deepen on hover; the open tab is paper with ink text, stands 4px taller and carries a 4px fox-orange top edge. While the page first loads, tabs skip their colour transition, so a tab the script opens never fades in. On phones the tabs share the width.

### S.5 / S.6 strip
A mint band across the top of the sheet on S.5 and S.6 pages: a square form mark, then pill links, the current one reversed to ink. On phones it is one row of four buttons.

### Contents (index)
A sky-ink heading over Bricolage links, grouped under sentence-case step names on long pages (Part B: Step 0 · Choose & plan … Step 4 · Put it together). Hover fills mint; the current item is reversed. Opening a section turns it in from the side the reader moved towards (0.24s, 16px); from the keyboard it changes at once; with reduced motion it fades. On phones, long contents collapse to one bordered button naming the step and section, with a chevron that turns when the list opens.

### Label panel (signature)
Each guide's title block: a two-column grid with a 1px pencil-edge outline and 12px corners, sky-ink field names on mint and bold values on paper. Max width 560px. On phones it becomes one quiet line.

### Level mark and level ladder (signature)
A circled level number like a teacher's grade: 2px ring, Bricolage 800, tabular numerals, sky ink at rest; the selected one fills fox orange with a navy number. The ladder rewrites one line, or one whole script, at each level: an ink head bar, then an axis of circled marks on a faint line.
- Choosing a level by click or tap traces a fox-orange line up the axis (0.5s), lights each level it passes in turn, and brings the panel in (a 0.26s rise for lines; a 0.2s fade for whole scripts, which keep their own heights).
- Arrow keys, Home and End change the level at once. With reduced motion the line and rings appear instantly.
- A ladder of whole scripts ends each script with "Next: Level N"; its CLY 5** mark has a dashed ring.
- Links to a level (part-b.html#sample-story-5) open it directly.

### Versions box
Every section ends with one: a 1px pencil-edge box titled in sky ink, three lines (Level 3 struck through, Level 5, Level 5**) each led by a level mark, then one line of CLY's advice under a dashed rule.

### Pickers (chips)
A row of 44px pill chips choosing one panel at a time (task, topic, text type). The selected chip reverses to ink. A tap fades the new panel up (0.22s); a key press or a link changes it at once.

### CREI marks
A sentence in its CREI tint, led by a square letter badge (C, R, E, I). Used in the CREI key, colour-coded paragraphs, plans and the drill's rebuilt paragraph, which appears move by move, Claim to Impact, 0.12s apart.

### Scripts and rewrites
- **Real exam script:** a 1px ink outline on paper, opened by a dark "Real exam script · HKEAA exemplar" tag. Candidates' mistakes are kept; errors that block meaning take a red wavy underline.
- **CLY's rewrite:** a dashed sky outline on rewrite paper, opened by a highlighter "CLY's rewrite · not an exam script" tag.
- **Analysis:** a ruled list (Content / Organisation / Language) under a 2px ink rule, then a mint "To reach Level N" box.
- **Quoted lines:** quote paper with a level mark, and the source in small slate type.

### Home: fox, continue, directory
- **Fox and tip:** the logo fox (tap to hop, 0.38s; it tilts slightly under a mouse) speaks a tip in a mint bubble: the tip, the wrong line with a cross and the right line with a tick (the changed words underlined in red and green), and "Practise this" plus an "Another tip" button.
- **Continue:** a 1px pencil-edge card naming the last page ("Part B › Story").
- **Directory:** Senior then Junior, each form as a square mark followed by 44px pill links.
- **Climbing sentence:** one sentence stepped Level 2 → 5** by the student, the changed words drawn with the highlighter.

### Practice pages (Grammar, Vocab)
Built from the same parts. Choices are 1px pencil-edge options; the picked one gets a 2px ink outline. A new tick or cross draws itself like a pen stroke (clip-path, 0.3s); hint notes slide up 4px (0.22s). Proofreading lines are numbered like the exam paper. Matrices are tables of 10px-cornered cells that reverse to ink; on phones they become chip pickers.

### Buttons and press feedback
The main action is an ink pill; the rest are 1px outlined ink pills that fill mint on hover. Every pressable control scales to 0.97 on press (0.98 for wide rows; 160ms, cubic-bezier(0.23, 1, 0.32, 1)). Hover effects apply only under (hover: hover). With reduced motion, presses do not scale.

### Focus
A 3px ink outline with 3px offset and 4px corners; navy on the cover too.

## Do's and Don'ts

### Do:
- **Do** compare levels as Level 3 → Level 5 → Level 5**, with circled level marks.
- **Do** keep fox orange for the chosen level, the climb line and the open tab edge.
- **Do** end every section with a versions box and one line of CLY's advice.
- **Do** show state with a mark: tick, cross, strike-through, a CREI letter, or a level mark.
- **Do** label every script: "Real exam script · HKEAA exemplar" or "CLY's rewrite · not an exam script".
- **Do** keep reading text in Atkinson Hyperlegible at 68ch and at least 14px.
- **Do** make every tap target at least 44px.
- **Do** change state at once for keyboard input, and give taps a short motion (0.2–0.5s, cubic-bezier(0.16, 1, 0.3, 1)) with a reduced-motion fade.
- **Do** keep navy-on-cover at AA on every pixel of a cover picture.

### Don't:
- **Don't** build hero + CTA + card-grid sections; use the label panel, ruled rows and the ladder.
- **Don't** put shadows on anything on the paper; only the sheet, the hub and the cover stickers lift.
- **Don't** use a CREI colour for anything but its move, or without its letter.
- **Don't** let CLY's writing look like a real candidate's script.
- **Don't** show more than one highlighter swipe in view per section.
- **Don't** signal right or wrong by colour alone.
- **Don't** use a circled level mark for anything that is not a level, or a square form mark for a level.
- **Don't** put white or light text on the cover picture.
