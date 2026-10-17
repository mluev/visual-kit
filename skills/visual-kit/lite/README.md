# visual-kit

Turn any AI answer into a clean visual page: charts, timelines, comparisons, trees, drawn diagrams, whole multi-section lessons. Quizzes and flashcards are there too, but only when you ask for them. No Node, no install, no build.

## Install
From npm: `npx visual-kit init` (copies everything below into `./visual-kit/`). Or copy these by hand into any folder or project:

- `visual-kit.js`
- `visual-kit.css`
- `viewer.html` (only for multi-section lessons)
- `KIT.md` (the AI reads this; tell your AI "use visual-kit, see KIT.md")

That's it. Ask your AI for a visual explanation; it writes an HTML file; double-click to open.

Lessons split across several `.js` files work by double-click too. Only `.json` section files need a local server (`python3 -m http.server`).

## Try it
Open `examples/index.html`: an explanation, a lesson with practice, slides, a plan, a cheat sheet and a catalogue of every block.

Answers are kept in your browser only. "Copy my answers" lets you paste them back to the AI for feedback.
