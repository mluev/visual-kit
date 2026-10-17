# visual-kit

Turn any AI answer into a clean visual page: cards, charts, timelines, quizzes, flashcards, whole multi-section lessons. No Node, no install, no build.

## Install
Copy these into any folder or project:

- `visual-kit.js`
- `visual-kit.css`
- `viewer.html` (only for multi-section lessons)
- `KIT.md` (the AI reads this; tell your AI "use visual-kit, see KIT.md")

That's it. Ask your AI for a visual explanation; it writes an HTML file; double-click to open.

Lessons split across several `.js` files work by double-click too. Only `.json` section files need a local server (`python3 -m http.server`).

## Try it
Open `examples/message.html` (a small message) or `examples/all-blocks.html` (every block). For the multi-section lesson, open `viewer.html?lesson=examples/lesson/lesson.js` (type that into the address bar after the file path).

Answers are kept in your browser only. "Copy my answers" lets you paste them back to the AI for feedback.
