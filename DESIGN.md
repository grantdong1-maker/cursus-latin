# Cursus design system

Single source of truth for the visual language. Keep every new element inside these tokens.

## Palette

Light (default — warm parchment, thematic for a Latin course; kept deliberately, not as a default substitute):

| token | light | dark |
|---|---|---|
| --bg | #f5f1e8 | #0d0f14 |
| --panel | #fdfbf6 | #161a23 |
| --panel2 | #f0eadd | #1d222e |
| --text | #262015 | #ece9e2 |
| --muted | #6b6251 (≥ 4.5:1 on --bg) | #98a0ad |
| --accent | #a87b17 (bronze, text-safe) | #d4a537 |
| --accent2 | #b3402e (oxblood, brand) | same |
| --accent3 | #487474 | #7a9e9f |
| --good / --bad | #2f7d46 / #c23b31 | #62c078 / #d9635b |

Rules: no gradients anywhere (flat fills only), no glows, no glass blur. Gold = emphasis & actions; oxblood = brand mark only; never purple/cyan/neon.

## Type

Fraunces (serif) for Latin, headings and big numerals; Inter for UI and body.

Scale (px): 12 · 13 · 14 · 15 · 16 · 18 · 22 · 26 · 30 · 42.
The `--serif` ladder doubles as the display sizes (30 = vocab face, 42 = drill prompt).
No other sizes. Body base 16px; 12px only for uppercase micro-labels; muted text never below 12px.

## Space & shape

- Radii scale: **6 · 12 · 16 · 999** (999 = pills). Nothing else.
- Panel padding 26px (16px on mobile); page column max 1020px.
- Gaps: 8 / 10 / 14 / 16 / 18. Related items tight, section breaks larger.

## Components

- Cards carry **a border OR a shadow, never both**. Panels/auth/bigcards: border only. Shadow only for true floating layers (glosstip, xp toast).
- No nested filled cards: child lists use transparent fills + borders or dividers.
- Active/selected states: 1px gold border + `--accent-wash` fill. No accent stripes, no inner left borders, no side tabs.
- Icons: none in navigation; text labels only. ✓/✗ only as answer feedback.
- Motion: 0.15–0.25s ease, no bounce/overshoot; the answer pulse (0.4s) is the only decorative motion.
- Exam module: countdown and section clocks use tabular numerals; the unseen text gets no gloss tokens at all (exam conditions forbid a dictionary) and is set as a ruled block, not a card. Mark schemes and question lists are divider-separated rows on the panel — never cards inside cards. Colour is reserved for state: oxblood `.warn` only when the clock or the deadline is close.
- Headings: sentence case, no eyebrow labels, no badges above headlines.

## Copy

- Sentence case; no marketing superlatives; explain, don't slogan.
- Em-dashes sparingly (labels may use one separator dash).

## Case order

The course teaches **NAGDA** — nominative · accusative · genitive · dative · ablative. Every *displayed*
case sequence uses `G.CASE_ORDER` (Full tables rows, Grammar reference columns, Parse case boxes). The
internal array `G.CASES` stays nominative · genitive · dative · accusative · ablative because the literal
paradigm data in `grammar.js` is keyed to it by position; never reorder `G.CASES` without re-keying the data.
Lookups are always by case name, never by index, so a row order change cannot corrupt the answer bank.
