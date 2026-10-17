# visual-kit: AI cheat sheet

Visual blocks (charts, timelines, tables, trees, diagrams...) from plain data. No Node, no build. Read only this file; never read `visual-kit.js`.

**Two rules.** (1) Explain clearly with visuals and words together: the right block for the idea, with explanation in words. (2) Never add exercises (the **Ask** blocks) unless the user asked for practice, a quiz, flashcards or a test. "Explain", "teach me" and "make a lesson" mean explanations only.

## Use it

**Small message**: write one HTML file, put a block list in a `<script class="vk">`, and the user opens it:
```html
<link rel="stylesheet" href="visual-kit.css"><script src="visual-kit.js"></script>
<script class="vk" type="application/json">[
  {"type":"callout","kind":"key","body":"Interest earns interest."},
  {"type":"lineChart","title":"£1,000 at 5%","series":[{"name":"Compound","points":[[0,1000],[5,1276],[10,1629]]},{"name":"Simple","points":[[0,1000],[5,1250],[10,1500]]}],"xLabel":"years"},
  {"type":"compare","columns":["Simple","Compound"],"rows":[{"label":"Interest on","values":["Original amount","Balance so far"]}]}
]</script>
```
(`visual-kit.css`/`.js` sit next to the file, or use a relative path to them.)

**Big lesson**: write `lesson.js` plus one small file per section, and the user opens `viewer.html` (or `viewer.html?lesson=path/lesson.js`). Write sections one at a time so you never hold the whole lesson in context. Works from `file://`.
```js
// lesson.js
VK.lesson({ title: "WW1", sections: [
  { id: "intro", title: "Intro", blocks: [ {"type":"explainer","title":"…","body":"…"} ] },
  { id: "alliances", title: "Alliances", file: "sections/01.js" } ] });
// sections/01.js
VK.section([ {"type":"timeline","events":[{"date":"1914","title":"War"}]} ]);
```

## Blocks
Every block is `{ "type", ...props }`. Props every block accepts: `title` (heading in the card), `label` (the small coloured pill above the title), `caption` (a tinted note under the block, with an accent bar on its left: use it to say *what to notice*), `id` (stable key for saved answers and ticks; automatic if omitted), `span:"full"`. Text props take light markdown: blank line = paragraph, `- ` bullets, `` `code` ``, `**bold**`, `*italic*`, `[link](url)`.

Pick by the shape of the idea (process → `flow`, walkthrough → `steps`, layers → `layers`, parts or types → `cards`, over time → `timeline`, compared → `compare`, hierarchy → `tree`, numbers → charts or `stats`, takeaway → `callout`), then explain in words: a `body` on each step or item and a `caption` on a visual. Prefer these layout blocks to hand-drawn SVG, which tends to overlap.

Each entry: what it is and how it looks, what it suits, then its props. `?` = optional.

### Explain a process or sequence
- **`flow`**: numbered boxes in a row joined by arrows, each with a bold title, an optional grey monospace example value (`show`) and a sentence or two (`body`). Four steps or fewer sit side by side; more than four, and phones, stack vertically. `highlight` outlines one step in the accent colour; `loop` adds a dashed bar underneath with a ↻ note. Suits pipelines, cause and effect chains, life cycles. `steps:[{title, body?, show?}], highlight?: index, loop?: text`
- **`steps`**: the same numbered boxes always stacked vertically with ↓ between them, so there is room for longer text. Suits worked examples, instructions, walkthroughs where each step needs explaining. `steps:[{title, body?, show?}]`
- **`timeline`**: a vertical list on a thin rail; each event has an accent-coloured date, a bold title and its text beneath (visible by default). Suits history, phases, schedules, versions. `events:[{date, title, body?}], collapse?` (`collapse:true` turns each into click-to-expand)

### Show structure
- **`layers`**: full-width horizontal bands stacked top to bottom, title on the left and description on the right, each band slightly deeper in colour than the one above. Suits stacks and architectures: network layers, a software stack, levels of anything. `items:[{title, body}]`
- **`cards`**: a grid of small bordered cards with an accent top edge, each with an optional pill (`tag`), a bold title and short text. Columns fit the width, or fix them with `columns`. Equal-weight things with no order: parts, types, options, reasons, risks. `items:[{title, body?, tag?}], columns?`
- **`tree`**: an indented outline with ▸/▾ triangles, each node a label with an optional grey note; fully open by default. Suits hierarchies, taxonomies, folder structures, breakdowns of a whole into parts. `root:{label, note?, children?[]}, collapse?`

### Compare and summarise
- **`compare`**: a table with a bold row-label column and grey column headings, which scrolls sideways on narrow screens. Suits A against B, options for a decision, myth against fact, specifications. `columns[], rows:[{label, values[]}], note?`
- **`callout`**: a tinted card with a small label and a short text. `kind` sets colour and default label: `key` and `note` and `tip` teal, `warning` red ("Watch out"), `success` green. Suits the one-line answer at the top, a takeaway, a warning, a tip. `kind?: note|tip|warning|success|key, body`
- **`stats`**: a row of tiles, each with a large figure, a small label, an optional note and a green ▲ or red ▼ trend marker. Suits a few headline numbers. `items:[{label, value, note?, trend?: up|down|flat}]`
- **`explainer`**: a plain card: pill, headline, paragraphs, optional code and numbered key points (01, 02…). The text-only fallback; use it to frame a topic, not to carry the explanation. `body?, code?, points?[]`

### Data
- **`barChart`**: horizontal bars, label on the left and value on the right, scaled to the largest value; the `highlight`ed bar is full colour and the rest are faded (with no highlight they all share the muted colour, so highlight the one that matters). Suits comparing amounts across categories. `data: {label:value} | [{label,value}], unit?, highlight?: index|label|-1, note?`
- **`lineChart`**: SVG lines with dots, light grid, y values on the left, first and last x on the bottom, a legend when there are several series. Suits trends and relationships over a range. `series:[{name, points:[[x,y]…], color?}], xLabel?, yMin?, unit?, note?`
  Charts and stats need real numbers, or numbers labelled "illustrative" in the title when only the shape matters. With no real quantities, use `timeline`, `compare`, `tree` or `steps`.

### Content and layout
- **`code`**: a monospace block with horizontal scroll (no syntax colouring). `code`
- **`image`**: a picture with rounded corners and an optional caption beneath. `src, alt?, caption?`
- **`html`**: your own HTML inside a card, for anything the blocks can't say (an embed, a custom diagram). Scripts don't run. `html`
- **`group`**: not a card: lays other blocks side by side in columns (collapsing to one on narrow screens). `blocks[], columns?`
- **`slides`**: a presentation inside the page: a card with a header (pill, title, "3 / 8", fullscreen button), one slide at a time, and arrows with progress dots below; ←/→ keys work. A slide has an optional large `title`, a large `body` line, and any `blocks`; `layout:"title"` gives a centred cover or closing slide, `"columns"` puts blocks side by side. Suits talks and walkthroughs to present. `slides:[{title?, body?, layout?: title|columns, blocks?[]}]`
- **`checklist`**: a card with "n / m done", a progress bar, and tick rows with an optional grey note under each; ticks are remembered in the browser. Suits plans, to-dos, setup steps. `items:[string | {text, note?}]`

### Ask (exercises)
Only when the user asks for practice, a quiz, flashcards or a test. Never add these on your own, even as a bonus or an ending. Answers are graded in the page and saved in the browser, and the user can copy them back to you.
- **`quiz`**: numbered multiple-choice questions with lettered buttons (A, B, C…). "Check" unlocks once everything is answered, then correct options turn green, wrong picks red, and each `explain` appears; shows a score and "Try again". An `answer` array makes it select-all-that-apply. Always write `explain`. `questions:[{q, options[], answer: index | [indexes], explain?, code?}]` (or one question inline)
- **`flashcards`**: one card at a time; click to flip, then "Again" (comes back later) or "Good"; ends with a summary of what was known first time. `cards:[{front, back, hint?, example?}], shuffle?`
- **`cloze`**: a passage with text boxes where the `[answer]` markers are, plus a word bank of chips that fill the next empty gap. Check marks each gap and shows the right word for wrong ones. `text` with `[answer]` or `[answer|alternative]`, `bank?: false`, `mono?`
- **`shortAnswer`**: questions with a text box each and an optional "Hint" link. Checking says Correct, Almost or the right answer, plus `explain`. It ignores case, accents, £, % and punctuation, accepts one typo in words longer than four letters, and compares numbers exactly (1.5 is not 15), so list alternatives in `answer`. `questions:[{q, answer: string | string[], hint?, explain?}]`
- **`match`**: two columns, terms in order on the left and their matches shuffled on the right; click one of each. Wrong pairs flash red, right ones fade. `pairs:[{left, right}]`
- **`order`**: shuffled rows with ↑/↓ buttons (and drag) to put into sequence; Check marks each row. Give the items in the CORRECT order, it shuffles them. `items[], instruction?, explain?, mono?`
- **`sort`**: items each with category chips to choose from; Check marks them and shows `why` for the wrong ones. `categories[], items:[{text, cat: index, why?}], mono?`
- **`explainBack`**: a text area to write an explanation, then the key points as ticks to self-assess; flagged for you to review. `prompt, keyPoints[]`
- **`reveal`**: a question with a "Show answer" fold-out, ungraded. `q, a`

## Examples
`examples/index.html` links finished pages of different kinds: an explanation, a lesson with practice (via `viewer.html`), slides, a plan and a cheat sheet. Open the kind closest to the request to see the standard of clarity. The topics are illustrations; don't copy them or their structure.

## Customise
- Theme: override CSS variables, e.g. `<style>:root{--vk-accent:#d6457a;--vk-radius:8px}</style>`. Dark mode is automatic; force with `<html data-theme="dark">`. Variables: `--vk-page --vk-surface --vk-subtle --vk-ink --vk-ink-2 --vk-ink-3 --vk-line --vk-ok --vk-bad --vk-accent --vk-radius --vk-font`.
- Mix freely with your own HTML and CSS around blocks, or render blocks into any element: `VK.render("#box", [ ...blocks ])`.
- New block in one line: `VK.blocks.note2 = (b, ctx) => { const el = VK.card(b, "Label"); el.append(VK.text(b.body)); return el; }`. Helpers: `VK.h(tag, attrs, ...kids)`, `VK.card`, `VK.text`, `VK.md`. Interactive blocks call `ctx.record({score, total, items:[{prompt, answer, expected, correct}]})`.

## Reviewing answers
The user clicks "Copy my answers" and pastes JSON: `{page, results:{<blockId>:{type, attempts:[{at, score, total, items[]}]}}}`. Items with `needsReview:true` are yours to judge. If they struggle on a topic, offer a follow-up on the weak spot in chat, and write it only if they say yes.
