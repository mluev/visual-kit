---
name: visual-kit
description: >
  Explain things visually with visual-kit: a no-install set of files (visual-kit.js,
  visual-kit.css, viewer.html) that turns a block list into cards, charts, timelines,
  comparison tables, trees, diagrams and multi-section lessons, opened by double-clicking an
  HTML file. Trigger for any request to explain, teach or summarise something visually or
  interactively: "explain X", "teach me Y", "make a lesson on Z", "a visual summary of...",
  "send me a quick explainer", or when a user asks for a quiz or flashcards, or pastes back
  "Copy my answers" JSON for feedback. Works in any folder or project.
  The heavier React app in the repo's app/ folder is only for users who ask for it.
---

# visual-kit

The kit is bundled with this skill, in the `lite/` folder next to this SKILL.md. Plain
files, no Node, works from `file://`. The block list, props and customisation hooks are
all in `lite/KIT.md` (about 4 KB). Read that one file, and never read `visual-kit.js`,
which wastes context.

## Two rules that override everything below

1. **Explain visually, not in prose.** A page made only of text blocks is a failed page.
   Show the idea: a diagram, chart, timeline, comparison, tree or step-by-step, with text only
   as short captions around it. See section 3.
2. **Never add exercises the user didn't ask for.** Explaining is the default job. `quiz`,
   `flashcards`, `cloze`, `shortAnswer`, `match`, `order`, `sort`, `explainBack` and `reveal`
   appear **only** when the user asks for practice, a quiz, flashcards, a test or similar
   ("quiz me", "make flashcards", "test me on this", "add practice"). Not for "explain",
   "teach me", "make a lesson" or "summarise". Don't add them as a bonus, a check-in or an
   ending, and don't offer them unprompted inside the page. If you think practice would help,
   you may say so in one line in chat, and let the user decide.

## 1. Find or install the kit

1. Look for `visual-kit.js` in the user's project (current folder, then `visual-kit/` or
   `vendor/visual-kit/`). If found, use that copy.
2. Otherwise copy `visual-kit.js` and `visual-kit.css` from this skill's `lite/` folder next to
   where you'll write the page. Add `viewer.html` only for multi-section lessons. Copying
   those files is the whole install. (`npx visual-kit init` does the same, and
   `https://cdn.jsdelivr.net/npm/visual-kit@0.1/dist/visual-kit.js` and `.css` work if the
   user is online and prefers no copies.)
3. Never rewrite the kit from memory. If `lite/` is missing, tell the user to reinstall the skill.

## 2. Pick the size

- **Quick answer**: one HTML file with a `<script class="vk" type="application/json">` block
  list, usually 3–6 blocks, mostly visual.
- **Big topic or "teach me / lesson"**: `lesson.js` (outline) plus one small
  `sections/NN-name.js` per section, opened through `viewer.html`. Write one section per step
  and re-read only the outline, not earlier sections. That keeps long lessons cheap. A section
  is an explanation made of visual blocks. It is not an explanation followed by exercises.
- Anything the blocks don't cover: write your own HTML and CSS around them, or register a custom
  block (`VK.blocks.name = (props, ctx) => element`), as described in KIT.md.

## 3. Use the visual blocks to their full potential

Before writing, ask of each point: *what is the shape of this idea?* Then pick the block:

| The idea is... | Use |
|---|---|
| a sequence, history, process over time | `timeline` |
| two or more things compared | `compare` (table), or `group` with side-by-side cards |
| parts of a whole, hierarchy, categories, taxonomy | `tree` |
| numbers across categories | `barChart` |
| a trend or relationship over a range | `lineChart` |
| headline facts, key figures | `stats` |
| one key takeaway, warning or tip | `callout` |
| a mechanism, flow, anatomy, map, or anything with spatial layout | an `html` block containing an inline `<svg>` diagram you draw (boxes, arrows, labels) |
| a picture the user supplied or that exists | `image` |
| an exact snippet, formula or command | `code` |

Rules of thumb:
- **Lead with the visual.** Open with the diagram, timeline or chart, then one short `explainer`
  or `callout` to name the idea. Never open with paragraphs.
- **At least two different visual blocks** in any answer longer than a single callout, and in each
  lesson section. Mix types: don't use three bar charts, and don't use only `callout`s.
- **One `explainer` at most per section**, 2–3 short paragraphs or `points`. If a paragraph
  explains a sequence, make it a `timeline`. If it contrasts things, make it a `compare`. If it
  lists parts, make it a `tree`. Use `group` to put related visuals side by side.
- **Draw it** whenever the blocks don't fit the idea: an inline SVG in an `html` block beats a
  paragraph describing a shape. Keep to the kit's CSS variables (`var(--vk-accent)`, `var(--vk-ink)`,
  `var(--vk-line)`) so it follows the theme and dark mode.
- Charts and stats need real, checkable numbers. If the subject has none (most language, history
  and abstract topics), use `timeline`, `compare`, `tree` or a drawn diagram instead. Never invent numbers.
- Match the medium: code goes in `code` fields, everything else in plain text. Write in UK English.

## 4. Check before handing over

There's no build step, so check the data by eye:
- Every block has a known `type` (unknown ones show a red error card in the browser).
- JSON has no trailing commas. `sort` `cat` is an index into `categories`, `order` `items` are in the
  CORRECT order, and quiz `answer` is an index into `options`, if the user asked for those.
- Reread your block list: is there any exercise block the user didn't ask for? Remove it. Is there a
  stretch of text that has a visual shape? Replace it.
- Tell the user the file to open (double-click `.html`, or `viewer.html` for lessons). Lessons with
  `.js` sections work from `file://`; `.json` sections need `python3 -m http.server`.

## 5. When the user does ask for practice

Then use the ask blocks, well: prefer ones where the user *produces* an answer (`shortAnswer`, `cloze`,
`order`, `match`, `sort`, `explainBack`) over `quiz`, and always write `explain` on quiz questions. Add
only what was asked, in the amount asked.

If the user pastes back **Copy my answers** JSON, `{page, results:{<blockId>:{type, attempts:[{score,
total, items:[{prompt, answer, expected, correct, needsReview?}]}]}}}`, judge `needsReview` items yourself
and say specifically what was right or wrong. Offer a follow-up on the weak spot in chat, and write it
only if they say yes.

## 6. Heavy app (only on request)

The repo (github.com/mluev/visual-kit) also has `app/`, the original React/Vite version: board
files with Zod validation, a dev server that saves results to disk and streams AI reviews live. It
needs a checkout and `npm install`, and isn't part of this skill. Only if the user has it and asks,
follow `app/CLAUDE.md` and `app/KIT.md` (generated; never read `app/src/kit/`).

## Guardrails

- Never add `quiz`, `flashcards` or any other ask block unless the user asked for practice.
- Never ship a text-only page.
- Never read `visual-kit.js` or `app/src/kit/` for block info; KIT.md is the source.
- Never invent numbers for charts or stats.
- Never rename a block `id` after the user has answered it: saved answers are keyed by id.
- Write user-facing text in UK English, and dates as DD/MM/YYYY.
