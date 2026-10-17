---
name: visual-kit
description: >
  Explain things visually with visual-kit: a no-install set of files (visual-kit.js,
  visual-kit.css, viewer.html) that turns a block list into cards, charts, timelines,
  quizzes, flashcards and multi-section lessons, opened by double-clicking an HTML file.
  Trigger for any request to explain, teach or summarise something visually or
  interactively: "teach me X", "make a lesson on Y", "explain Z with a diagram/chart/quiz",
  "make flashcards", "a visual summary of...", "send me a quick explainer", or when a
  user pastes back "Copy my answers" JSON for feedback. Works in any folder or project.
  The heavier React app in the repo's app/ folder is only for users who ask for it.
---

# visual-kit

The kit is bundled with this skill, in the `lite/` folder next to this SKILL.md. Plain
files, no Node, works from `file://`. The block list, props and customisation hooks are
all in `lite/KIT.md` (about 4 KB). Read that one file, and never read `visual-kit.js`,
which wastes context.

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

- **Quick answer or message**: one HTML file with a `<script class="vk" type="application/json">`
  block list: usually 2–6 blocks (a callout, one chart or timeline, maybe one quiz question).
  Don't add practice just because the kit has it.
- **Big topic**: `lesson.js` (outline) plus one small `sections/NN-name.js` per section, opened
  through `viewer.html`. Write one section per step, and re-read only the outline, not earlier
  sections. This is what keeps long lessons cheap. Per section, a good shape is: explain
  (`explainer` plus one visual) → practise (2–3 different ask blocks) → remember (`flashcards`)
  → check (`quiz`, with `explain` on every question).
- Anything the blocks don't cover: write your own HTML and CSS around them, add a `html` block, or
  register a custom block (`VK.blocks.name = (props, ctx) => element`), as described in KIT.md.

## 3. Choosing blocks

- Prefer ask blocks where the user *produces* an answer (`shortAnswer`, `cloze`, `order`,
  `match`, `sort`, `explainBack`) over ones where they only recognise it (`quiz`).
- Charts and stats need real, checkable numbers. If the subject has none (most language,
  history and abstract topics), leave them out. Never invent numbers.
- Match the medium: code goes in `code` fields, everything else in plain text. Write in UK English.

## 4. Check before handing over

There's no build step, so check by eye on the data:
- Every block has a known `type` (unknown ones show a red error card in the browser).
- Quiz `answer` is an index into `options`; `sort` `cat` is an index into `categories`;
  `order` `items` are in the CORRECT order; JSON has no trailing commas.
- Tell the user the file to open (double-click `.html`, or `viewer.html` for lessons). Lessons with
  `.js` sections work from `file://`; `.json` sections need `python3 -m http.server`.

## 5. Review answers

Users click **Copy my answers** and paste JSON back: `{page, results:{<blockId>:{type, attempts:[{score,
total, items:[{prompt, answer, expected, correct, needsReview?}]}]}}}`. Judge `needsReview` items
yourself, say specifically what was right or wrong, and if they struggled, write a small follow-up
section or message on the weak spot instead of just explaining again.

## 6. Heavy app (only on request)

The repo (github.com/mluev/visual-kit) also has `app/`, the original React/Vite version: board
files with Zod validation, a dev server that saves results to disk and streams AI reviews live. It
needs a checkout and `npm install`, and isn't part of this skill. Only if the user has it and asks,
follow `app/CLAUDE.md` and `app/KIT.md` (generated; never read `app/src/kit/`).

## Guardrails

- Never read `visual-kit.js` or `app/src/kit/` for block info; KIT.md is the source.
- Never invent numbers for charts or stats.
- Never rename a block `id` after the user has answered it: saved answers are keyed by id.
- Write user-facing text in UK English, and dates as DD/MM/YYYY.
