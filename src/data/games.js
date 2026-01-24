export const games = [
  {
    id: 'would-you-rather',
    title: 'Would You Rather',
    description: 'Choose between two intriguing scenarios and discover how your partner thinks!',
    energyLevel: 1,
    prepLevel: 1,
    icon: '🤔',
    path: '/games/would-you-rather',
    color: 'from-pink-400 to-pink-500',
  },
  {
    id: 'deep-talk-deck',
    title: 'Deep Talk Deck',
    description: 'Draw conversation cards to spark meaningful discussions and deepen your connection.',
    energyLevel: 2,
    prepLevel: 1,
    icon: '💬',
    path: '/games/deep-talk-deck',
    color: 'from-pink-500 to-pink-600',
  },
];

export const energyLabels = {
  1: { label: 'Low Energy', description: 'Relaxed' },
  2: { label: 'Moderate', description: 'Engaged' },
  3: { label: 'High Energy', description: 'Excited' },
};

export const prepLabels = {
  1: { label: 'No Prep', description: 'Instant play' },
  2: { label: 'Minimal', description: '1-2 minutes' },
  3: { label: 'Some Setup', description: '5+ minutes' },
};
