VK.section([
  { type: 'flow', title: 'Percentage change in three moves', highlight: 1,
    steps: [
      { title: 'Find the change', show: 'new − old', body: 'Positive means an increase, negative a decrease.' },
      { title: 'Divide by the old value', show: 'change ÷ old', body: 'The starting amount is always the reference point.' },
      { title: 'Turn it into a percentage', show: '× 100', body: 'Multiply by 100 and add the % sign.' } ],
    caption: 'The most common mistake is dividing by the new value. Always divide by where you started.' },
  { type: 'compare', title: 'The same £10 gap, two different percentages', columns: ['Old', 'New', 'Change'],
    rows: [
      { label: 'Going up', values: ['£40', '£50', '+25%'] },
      { label: 'Going down', values: ['£50', '£40', '−20%'] } ],
    caption: 'Up: 10 ÷ 40 = 0.25. Down: 10 ÷ 50 = 0.20. Each change is measured against its own starting amount, so rises and falls are not symmetrical.' },
  { type: 'order', title: 'Put the method in order',
    items: ['Work out the change: new − old', 'Divide the change by the OLD value', 'Multiply by 100', 'Say whether it is an increase or a decrease'],
    explain: 'The order matters: you need the change before you can divide, and you divide before turning the result into a percentage.' },
  { type: 'shortAnswer', title: 'Try it',
    questions: [
      { q: 'A £80 coat is reduced by 25%. What is the sale price in pounds?', answer: ['60', '£60'], explain: '25% of 80 is 20, and 80 − 20 = 60.' },
      { q: 'A train fare rises from £20 to £23. What is the percentage increase?', answer: ['15', '15%'], explain: 'Change = 3, and 3 ÷ 20 = 0.15, which is 15%.' },
      { q: 'A price falls from £50 to £40. What is the percentage decrease?', answer: ['20', '20%'], explain: 'Change = −10, and 10 ÷ 50 = 0.2, which is 20%.' } ] }
]);
