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
  {
    id: 'relationship-mad-libs',
    title: 'Relationship Mad Libs',
    description: 'Build hilarious love stories together by filling in the blanks!',
    energyLevel: 1,
    prepLevel: 1,
    icon: '📝',
    path: '/games/relationship-mad-libs',
    color: 'from-pink-400 to-pink-500',
  },
  {
    id: 'workout-class',
    title: 'Workout Class',
    description: 'Get moving together with curated YouTube workout videos for couples!',
    energyLevel: 3,
    prepLevel: 2,
    icon: '💪',
    path: '/workout-class',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'type-racer',
    title: 'Type Racer',
    description: 'Race your dachshunds by typing! The faster and more accurate you type, the faster your dog runs.',
    energyLevel: 2,
    prepLevel: 1,
    icon: '🐕',
    path: '/games/type-racer',
    color: 'from-pink-400 to-pink-500',
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
