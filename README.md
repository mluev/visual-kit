# visual-kit

Turn any AI answer into a clean visual page: charts, timelines, comparisons, trees, drawn diagrams and whole multi-section lessons. Quizzes and flashcards are there too, but only when you ask for them. Two files, no Node, no build. Works from any folder by double-clicking an HTML file.

## Install (pick one)

**1. As an AI skill** (Claude Code, Cursor, Codex and others, via [skills.sh](https://skills.sh)):
```
npx skills add mluev/visual-kit
```
The skill bundles the kit. Ask your AI "teach me X as a visual lesson" and it copies the files it needs into your project.

**2. Copy the files into a project:**
```
npx visual-kit init            # creates ./visual-kit/ (js, css, viewer, KIT.md, examples)
```
Node is only needed for this one command. Using the kit needs none.

**3. No install at all (CDN):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/visual-kit@0.1/dist/visual-kit.css">
<script src="https://cdn.jsdelivr.net/npm/visual-kit@0.1/dist/visual-kit.js"></script>
```

**4. By hand:** copy `visual-kit.js` and `visual-kit.css` from [`skills/visual-kit/lite/`](skills/visual-kit/lite).

## Use

```html
<script class="vk" type="application/json">[
  {"type":"callout","kind":"key","body":"Interest earns interest."},
  {"type":"lineChart","title":"£1,000 at 5%","series":[{"name":"Compound","points":[[0,1000],[5,1276],[10,1629]]}],"xLabel":"years"}
]</script>
```
Your AI reads [`KIT.md`](skills/visual-kit/lite/KIT.md) (about 4 KB: every block, theming, custom blocks) and writes pages like this one. Big topics become a `lesson.js` plus small section files, opened through `viewer.html`. Answers stay in the browser; "Copy my answers" lets you paste them back to the AI for feedback.

## Repo layout

| Path | What |
|---|---|
| `skills/visual-kit/` | The skill (`SKILL.md`) with the kit bundled in `lite/`. **Single source of truth.** |
| `bin/`, `scripts/`, `package.json` | The npm package. `dist/` is generated from the skill's `lite/` on `npm pack`. |
| `app/` | The original React/Vite version (needs Node). Not part of the skill or the npm package. |

## Releasing (maintainers)

```
npm test                         # builds dist/, runs the CLI into a temp folder
npm version patch                # bumps package.json
npm publish                      # runs prepack, publishes dist/ + bin/
git push --follow-tags           # skills.sh installs straight from the GitHub repo
```
Update the `@0.1` in the CDN snippets above when the minor version changes.

## Licence

MIT
