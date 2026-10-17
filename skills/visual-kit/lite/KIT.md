# visual-kit: AI cheat sheet

Visual blocks (cards, charts, quizzes, flashcards...) from plain data. No Node, no build. Read only this file; never read `visual-kit.js`.

## Use it

**Small message**: write one HTML file, put a block list in a `<script class="vk">`, and the user opens it:
```html
<link rel="stylesheet" href="visual-kit.css"><script src="visual-kit.js"></script>
<script class="vk" type="application/json">[
  {"type":"callout","kind":"key","body":"Interest earns interest."},
  {"type":"quiz","q":"2 years at 10% on £100?","options":["£120","£121"],"answer":1,"explain":"£110, then £121."}
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

**Show**
- `explainer` `title, body, code?, points?[]`
- `callout` `kind?: note|tip|warning|success|key, body`
- `stats` `items:[{label, value, note?, trend?: up|down|flat}]`
- `timeline` `events:[{date, title, body?}]`
- `compare` `columns[], rows:[{label, values[]}], note?`
- `tree` `root:{label, note?, children?[]}`
- `barChart` `data: {label:value} | [{label,value}], unit?, highlight?: index|label|-1, note?`
- `lineChart` `series:[{name, points:[[x,y]…], color?}], xLabel?, yMin?, unit?, note?`
- `code` `code` · `image` `src, alt?, caption?` · `html` `html` (raw HTML) · `reveal` `q, a` (click to show answer)
- `group` `blocks[], columns?` (blocks side by side)

**Ask** (graded, saved to the browser; the user can copy answers back to you)
- `quiz` `questions:[{q, options[], answer: index | [indexes], explain?, code?}]`, or one question inline. Always write `explain`.
- `flashcards` `cards:[{front, back, hint?, example?}], shuffle?`
- `cloze` `text` with blanks as `[answer]` or `[answer|alternative]`, `bank?: false`, `mono?`
- `shortAnswer` `questions:[{q, answer: string | string[], hint?, explain?}]` (ignores case, accents, one typo)
- `match` `pairs:[{left, right}]`
- `order` `items[]` (give the CORRECT order; it shuffles), `instruction?, explain?`
- `sort` `categories[], items:[{text, cat: index, why?}]`
- `explainBack` `prompt, keyPoints[]` (user writes, then self-ticks; marked for your review)

Never invent numbers for charts or stats. If a subject has no real quantities, skip them.

## Customise
- Theme: override CSS variables, e.g. `<style>:root{--vk-accent:#d6457a;--vk-radius:8px}</style>`. Dark mode is automatic; force with `<html data-theme="dark">`. Variables: `--vk-page --vk-surface --vk-subtle --vk-ink --vk-ink-2 --vk-ink-3 --vk-line --vk-ok --vk-bad --vk-accent --vk-radius --vk-font`.
- Mix freely with your own HTML and CSS around blocks, or render blocks into any element: `VK.render("#box", [ ...blocks ])`.
- New block in one line: `VK.blocks.note2 = (b, ctx) => { const el = VK.card(b, "Label"); el.append(VK.text(b.body)); return el; }`. Helpers: `VK.h(tag, attrs, ...kids)`, `VK.card`, `VK.text`, `VK.md`. Interactive blocks call `ctx.record({score, total, items:[{prompt, answer, expected, correct}]})`.

## Reviewing answers
The user clicks "Copy my answers" and pastes JSON: `{page, results:{<blockId>:{type, attempts:[{at, score, total, items[]}]}}}`. Items with `needsReview:true` are yours to judge. If they struggle on a topic, write a new small section or message on the weak spot.
