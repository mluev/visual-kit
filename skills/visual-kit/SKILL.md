---
name: visual-kit
description: >
  Explain things visually with visual-kit: a no-install set of files (visual-kit.js,
  visual-kit.css, viewer.html) that turns a block list into flows, steps, timelines,
  comparison tables, trees, charts and multi-section lessons, opened by double-clicking an
  HTML file. Trigger for any request to explain, teach or summarise something visually or
  interactively: "explain X", "teach me Y", "make a lesson on Z", "a visual summary of...",
  "send me a quick explainer", or when a user asks for a quiz or flashcards, or pastes back
  "Copy my answers" JSON for feedback. Works in any folder or project.
  The heavier React app in the repo's app/ folder is only for users who ask for it.
---

# visual-kit

The kit is bundled in `lite/`, next to this file: plain files, no Node, works from `file://`.
Everything about the blocks is in `lite/KIT.md`. Read that, not `visual-kit.js`.

## Principles

- **Understanding first.** The goal is that the reader gets it. Choose whatever form makes the idea
  clearest: a short answer or a full lesson, a few blocks or many.
- **Visuals and words work together.** Let the shape of the idea pick the block (a process is a
  `flow`, a history a `timeline`, a contrast a `compare`, a hierarchy a `tree`...). Then say in words
  what each part is and why it matters. A diagram nobody can read, and a wall of text, both fail.
- **Be concrete.** Real examples beat abstractions. Explain the *why*, not only the *what*. Define
  jargon in plain words when it first appears. Let a beginner follow without another source.
- **Vary the form.** Don't repeat one pattern. Use the blocks that suit this topic and this reader.
- **Exercises are the user's call.** `quiz`, `flashcards`, `cloze`, `shortAnswer`, `match`, `order`,
  `sort`, `explainBack` and `reveal` appear only when the user asks for practice, a quiz, flashcards
  or a test. Never as a bonus or an ending. You may mention in one line in chat that practice is
  available.
- **Don't hand-draw.** Layout blocks can't overlap; hand-written SVG coordinates can, and you can't
  see the result. Use an `html` block with SVG only when no block can say it, and keep it simple.
- **Numbers must be honest.** Real, or clearly labelled illustrative when only the shape matters.

## Using the kit

1. **Find or install it.** Use `visual-kit.js` if the project already has it. Otherwise copy
   `visual-kit.js` and `visual-kit.css` from this skill's `lite/` folder next to the page, plus
   `viewer.html` for multi-section lessons. That's the whole install. (`npx visual-kit init` does the
   same, or link the CDN: `https://cdn.jsdelivr.net/npm/visual-kit@0.1/dist/visual-kit.js` and `.css`.)
   Never rewrite the kit from memory.
2. **Size it to the question.** One HTML file with a `<script class="vk" type="application/json">`
   block list for a quick answer. For a big topic, a `lesson.js` outline plus one small
   `sections/NN-name.js` per section, opened via `viewer.html`. Write one section at a time so a
   large lesson never fills your context.
3. **Look at `lite/examples/explain-llm.html` once** to see the standard of clarity and depth. Match
   the standard, not the topic or the structure.
4. **Extend freely.** Mix in your own HTML and CSS, theme with the `--vk-*` variables, or register a
   custom block (`VK.blocks.name = (props, ctx) => element`). KIT.md shows how.
5. **Check before handing over.** Block types are all known (unknown ones show a red card). JSON is
   valid. Everything is explained. Nothing was added that the user didn't ask for. Tell the user which
   file to open (`.html`, or `viewer.html` for lessons). Lessons with `.js` sections work from
   `file://`; `.json` sections need `python3 -m http.server`.

## When the user asks for practice or sends answers

Add exactly what was asked. Prefer questions where the user produces the answer, and explain each
answer. If they paste back **Copy my answers** JSON, judge any `needsReview` items yourself, say
specifically what was right or wrong, and offer a follow-up in chat. Write it only if they say yes.

## Heavy app (only on request)

The repo also has `app/`, the original React/Vite version (needs a checkout and `npm install`). Only
if the user has it and asks, follow `app/CLAUDE.md`. It isn't part of this skill.

## Guardrails

- No exercises the user didn't ask for. No text-only pages. No visuals without explanation.
- Don't read `visual-kit.js` or `app/src/kit/`; KIT.md is the source.
- Don't rename a block `id` once the user has answered it (saved answers are keyed by it).
- UK English; dates as DD/MM/YYYY.
