VK.section([
  { type: 'quiz', title: 'Quick quiz',
    questions: [
      { q: 'A price rises by 10%, then falls by 10%. Compared with the start, it is…',
        options: ['The same', '1% lower', '1% higher', '10% lower'], answer: 1,
        explain: 'Start at £100: +10% gives £110, and 10% of £110 is £11, so you end at £99.' },
      { q: 'Which of these is the same as 35%?', options: ['0.35', '3.5', '0.035', '35'], answer: 0,
        explain: 'Divide the percentage by 100: 35 ÷ 100 = 0.35.' },
      { q: 'A £50 jacket is 30% off, then a further 20% off the sale price. What does it cost?',
        options: ['£25', '£28', '£30', '£35'], answer: 1,
        explain: '30% off leaves £35. 20% of £35 is £7, so the price is £28. It is not 50% off, because the second discount applies to a smaller amount.' } ] },
  { type: 'sort', title: 'Increase or decrease?', categories: ['Increase', 'Decrease'],
    items: [
      { text: '£50 → £60', cat: 0 },
      { text: '£80 → £68', cat: 1 },
      { text: 'Price × 1.15', cat: 0, why: 'Multiplying by more than 1 makes it bigger.' },
      { text: 'Price × 0.9', cat: 1, why: 'Multiplying by less than 1 makes it smaller.' } ] },
  { type: 'match', title: 'Match the shortcut', pairs: [
      { left: '50%', right: 'Halve it' },
      { left: '25%', right: 'Halve it twice' },
      { left: '10%', right: 'Divide by 10' },
      { left: '1%', right: 'Divide by 100' } ] },
  { type: 'explainBack', prompt: 'In your own words: why does a 20% rise followed by a 20% fall not bring you back to where you started?',
    keyPoints: ['Each percentage is measured against a different starting amount', 'The fall is taken from the larger number, so it removes more than the rise added', 'Example: £100 → £120 → £96'] }
]);
