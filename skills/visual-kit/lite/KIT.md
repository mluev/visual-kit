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
Every block is `{ "type", ...props }`. Optional on any block: `id` (stable key for saved answers; auto if omitted), `title`, `label` (pill text), `span:"full"` (whole row). Text props take light markdown: blank line = paragraph, `- ` bullets, `` `code` ``, `**bold**`, `*italic*`, `[link](url)`.

**Show** (the default). Let the idea's shape pick the block: process → `flow`, walkthrough → `steps`, layers → `layers`, parts or types → `cards`, over time → `timeline`, compared → `compare`, hierarchy → `tree`, numbers → charts or `stats`, takeaway → `callout`. Then explain in words: a `body` on each step or item, a `caption` (universal prop) on a visual to say what to notice. Be concrete, give the why, define jargon. Prefer these layout blocks to hand-drawn SVG, which tends to overlap; `html` with SVG only when nothing else fits.
- `explainer` `title, body, code?, points?[]`
- `flow` `steps:[{title, body?, show?}], highlight?: index, loop?: text` (≤4 steps in a row, more stack; arrows automatic)
- `steps` `steps:[{title, body?, show?}]` (vertical, numbered; `show` is a monospace example value)
- `layers` `items:[{title, body}]` (top to bottom) · `cards` `items:[{title, body?, tag?}], columns?`
- `callout` `kind?: note|tip|warning|success|key, body`
- `stats` `items:[{label, value, note?, trend?: up|down|flat}]`
- `timeline` `events:[{date, title, body?}], collapse?` (bodies shown; `collapse:true` hides them)
- `compare` `columns[], rows:[{label, values[]}], note?`
- `tree` `root:{label, note?, children?[]}, collapse?` (fully open by default)
- `barChart` `data: {label:value} | [{label,value}], unit?, highlight?: index|label|-1, note?`
- `lineChart` `series:[{name, points:[[x,y]…], color?}], xLabel?, yMin?, unit?, note?`
- `code` `code` · `image` `src, alt?, caption?` · `html` `html` (raw HTML) · `reveal` `q, a` (click to show answer)
- `group` `blocks[], columns?` (blocks side by side)
- `slides` `slides:[{title?, body?, layout?: title|columns, blocks?[]}]` a deck with arrows, keys and fullscreen; slides hold any blocks
- `checklist` `items:[string | {text, note?}]` ticks are remembered in the browser (plans, to-dos)

**Ask**: ONLY when the user asks for practice, a quiz, flashcards or a test. Never add these on your own, even as a bonus or an ending. (Graded, saved in the browser; the user can copy answers back to you.)
- `quiz` `questions:[{q, options[], answer: index | [indexes], explain?, code?}]`, or one question inline. Always write `explain`.
- `flashcards` `cards:[{front, back, hint?, example?}], shuffle?`
- `cloze` `text` with blanks as `[answer]` or `[answer|alternative]`, `bank?: false`, `mono?`
- `shortAnswer` `questions:[{q, answer: string | string[], hint?, explain?}]` (ignores case, accents, one typo)
- `match` `pairs:[{left, right}]`
- `order` `items[]` (give the CORRECT order; it shuffles), `instruction?, explain?`
- `sort` `categories[], items:[{text, cat: index, why?}]`
- `explainBack` `prompt, keyPoints[]` (user writes, then self-ticks; marked for your review)

Charts and stats need real numbers, or numbers labelled "illustrative" in the title when only the shape matters. If a subject has no real quantities, use `timeline`, `compare`, `tree` or a drawn diagram instead.

## Examples
`examples/index.html` links finished pages of different kinds: an explanation, a lesson with practice (via `viewer.html`), slides, a plan and a cheat sheet. Open the kind closest to the request to see the standard of clarity. The topics are illustrations; don't copy them or their structure.

## Customise
- Theme: override CSS variables, e.g. `<style>:root{--vk-accent:#d6457a;--vk-radius:8px}</style>`. Dark mode is automatic; force with `<html data-theme="dark">`. Variables: `--vk-page --vk-surface --vk-subtle --vk-ink --vk-ink-2 --vk-ink-3 --vk-line --vk-ok --vk-bad --vk-accent --vk-radius --vk-font`.
- Mix freely with your own HTML and CSS around blocks, or render blocks into any element: `VK.render("#box", [ ...blocks ])`.
- New block in one line: `VK.blocks.note2 = (b, ctx) => { const el = VK.card(b, "Label"); el.append(VK.text(b.body)); return el; }`. Helpers: `VK.h(tag, attrs, ...kids)`, `VK.card`, `VK.text`, `VK.md`. Interactive blocks call `ctx.record({score, total, items:[{prompt, answer, expected, correct}]})`.

## Reviewing answers
The user clicks "Copy my answers" and pastes JSON: `{page, results:{<blockId>:{type, attempts:[{at, score, total, items[]}]}}}`. Items with `needsReview:true` are yours to judge. If they struggle on a topic, write a new small section or message on the weak spot.
