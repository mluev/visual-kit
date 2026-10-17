import { z } from 'zod';
import { defineContract, named } from '@/kit/contract';

export const SlideBlock = named(
  'SlideBlock',
  z.object({
    type: z.string().describe('Any block type from this kit, e.g. "Callout", "Stats", "Quiz"'),
    id: z.string().optional().describe('Needed only for blocks that save results (practice blocks). Must be unique on the board'),
    props: z.record(z.string(), z.unknown()).default({}).describe('That block\'s props, exactly as in its own entry in this file'),
  }),
);

export const Slide = named(
  'Slide',
  z.object({
    title: z.string().optional().describe('Heading above the slide content'),
    layout: z.enum(['center', 'stack', 'columns', 'columns-3']).default('center').describe('center: one block centred (narrow). stack: blocks one under another. columns: two side by side. columns-3: three side by side. Columns become a single column on narrow screens'),
    blocks: z.array(SlideBlock).min(1).describe('Blocks shown on this slide'),
  }),
);

export const slides = defineContract({
  type: 'Slides',
  category: 'layout',
  tone: 'violet',
  pill: 'Slides',
  purpose: 'A full-screen window with a title, progress and Back / Next buttons. Each slide holds one or more kit blocks, so it can be a walkthrough, a set of steps or a mini-lesson.',
  whenToUse: 'Several blocks that should be seen in order, one screen at a time (a guided explanation, "step 1 / 2 / 3", a lesson that ends with a check). For a single visual that steps through states use Stepper instead.',
  results: 'Nothing itself. Nested blocks that have an `id` save their own results as usual.',
  notes: ['Shows a launch card; the button opens the full-screen window.', '← → keys move between slides, Esc closes.', 'Reopening resumes on the slide you left.', 'Nested block ids must be unique on the board (the board check does not look inside Slides).'],
  schema: z.object({
    title: z.string().describe('Shown on the launch card and in the window header'),
    description: z.string().optional().describe('One line on the launch card'),
    startLabel: z.string().default('Start').describe('Launch button text'),
    slides: z.array(Slide).min(1).max(20),
  }),
  snippet: {
    title: 'How append works',
    slides: [
      { title: 'The idea', blocks: [{ type: 'Callout', props: { kind: 'key', body: '`append` returns a new slice header. Always keep the result.' } }] },
      {
        title: 'In numbers',
        layout: 'columns',
        blocks: [
          { type: 'Stats', props: { items: [{ label: 'Header size', value: '24 B' }] } },
          { type: 'Callout', props: { kind: 'tip', body: 'Pre-size with `make([]T, 0, n)` when you know `n`.' } },
        ],
      },
    ],
  },
  examples: {
    demo: {
      note: 'Three slides: centred, two columns, then a closing takeaway',
      props: {
        title: 'World War I in three steps',
        description: 'A quick walkthrough: cause, scale, outcome.',
        slides: [
          { title: 'Why it started', blocks: [{ type: 'Callout', props: { kind: 'note', title: 'The spark', body: 'The assassination of Archduke Franz Ferdinand on 28 June 1914 set alliances in motion across Europe.' } }] },
          {
            title: 'The scale',
            layout: 'columns',
            blocks: [
              { type: 'Stats', props: { title: 'In numbers', items: [{ label: 'Began', value: 1914 }, { label: 'Countries', value: 32 }] } },
              { type: 'Callout', props: { kind: 'tip', body: 'Remember it as a chain: **alliances** turned a local crisis into a continental war.' } },
            ],
          },
          { title: 'The outcome', blocks: [{ type: 'Callout', props: { kind: 'success', title: 'Done', body: 'Four empires dissolved and borders were redrawn.' } }] },
        ],
      },
    },
    stack: { note: 'layout: "stack" with a custom button label', props: { title: 'Checklist', startLabel: 'Open checklist', slides: [{ layout: 'stack', blocks: [{ type: 'Callout', props: { body: 'First, read the question.' } }, { type: 'Callout', props: { kind: 'tip', body: 'Then say the rule out loud.' } }] }] } },
  },
});
