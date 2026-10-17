VK.section([
  { type: 'steps', title: 'Worked example: find 15% of £60',
    steps: [
      { title: 'Find 10%', show: '60 ÷ 10 = 6', body: 'Dividing by 10 moves the decimal point one place, so 10% of £60 is £6.' },
      { title: 'Find 5%', show: '6 ÷ 2 = 3', body: '5% is half of 10%, so it is £3.' },
      { title: 'Add the parts', show: '6 + 3 = 9', body: '15% is 10% + 5%, so the answer is **£9**.' } ],
    caption: 'This building-block method works for any percentage you can split into 10%, 5% and 1%.' },
  { type: 'compare', title: 'Two methods', columns: ['Building blocks', 'Multiply by the decimal'],
    rows: [
      { label: 'How', values: ['Find 10%, 5%, 1%, then add', 'Turn 15% into 0.15, then multiply: 0.15 × 60'] },
      { label: 'Best for', values: ['Mental arithmetic', 'A calculator, or awkward percentages like 17.5%'] },
      { label: 'Same answer?', values: ['Yes: £9', 'Yes: £9'] } ] },
  { type: 'shortAnswer', title: 'Try it',
    questions: [
      { q: 'What is 10% of £250?', answer: ['25', '£25'], explain: 'Divide by 10: 250 ÷ 10 = 25.' },
      { q: 'What is 20% of £85?', answer: ['17', '£17'], hint: 'Find 10%, then double it.', explain: '10% is £8.50, and double that is £17.' },
      { q: 'What is 35% of £40?', answer: ['14', '£14'], hint: 'Split it: 30% + 5%.', explain: '10% = 4, so 30% = 12 and 5% = 2. Total 14.' } ] },
  { type: 'cloze', title: 'Fill the gaps', text: 'To find 1% of an amount, divide by [100]. To find 10%, divide by [10]. To find 50%, divide by [2].' }
]);
