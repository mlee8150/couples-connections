import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../../contexts/RoomContext';
import { RoomLobby } from '../../Room';
import { Button, ProgressBar } from '../../shared';
import questions from '../../../data/deepTalkQuestions.json';

const CARD_OPTIONS = [5, 10, 15, 20, 25, 30];
const CATEGORIES = [
  { id: 'light', name: 'Light', emoji: '☀️', color: 'bg-yellow-100 border-yellow-400' },
  { id: 'memories', name: 'Memories', emoji: '📸', color: 'bg-blue-100 border-blue-400' },
  { id: 'future', name: 'Future', emoji: '🔮', color: 'bg-purple-100 border-purple-400' },
  { id: 'gratitude', name: 'Gratitude', emoji: '💝', color: 'bg-pink-100 border-pink-400' },
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function distributeCards(totalCards, selectedCategories) {
  const numCategories = selectedCategories.length;
  const baseCount = Math.floor(totalCards / numCategories);
  const remainder = totalCards % numCategories;

  const distribution = {};
  selectedCategories.forEach((cat, index) => {
    distribution[cat] = baseCount + (index < remainder ? 1 : 0);
  });

  return distribution;
}

function DeepTalkDeck() {
  const navigate = useNavigate();
  const {
    isConnected,
    isHost,
    gameState,
    updateGameState,
    roomStatus,
  } = useRoom();

  const [gamePhase, setGamePhase] = useState('lobby'); // lobby, setup, playing, complete
  const [selectedCategories, setSelectedCategories] = useState(['light']);
  const [totalCards, setTotalCards] = useState(10);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [gameCards, setGameCards] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);

  // Initialize game when starting from lobby
  const handleGameStart = () => {
    setGamePhase('setup');
  };

  // Handle category toggle
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // Don't allow removing last category
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  // Start the actual game
  const handleStartDeck = async () => {
    // Distribute cards across categories
    const distribution = distributeCards(totalCards, selectedCategories);

    // Select random questions from each category
    let selectedCards = [];
    for (const [category, count] of Object.entries(distribution)) {
      const categoryQuestions = questions.categories[category];
      const shuffled = shuffleArray(categoryQuestions);
      const selected = shuffled.slice(0, count).map((q) => ({
        ...q,
        category,
      }));
      selectedCards = [...selectedCards, ...selected];
    }

    // Shuffle all selected cards
    selectedCards = shuffleArray(selectedCards);

    if (isHost) {
      await updateGameState({
        cards: selectedCards,
        currentIndex: 0,
        totalCards: selectedCards.length,
        phase: 'playing',
      });
    }

    setGameCards(selectedCards);
    setGamePhase('playing');
  };

  // Sync game state from Firebase
  useEffect(() => {
    if (gameState?.cards && gamePhase === 'playing') {
      setGameCards(gameState.cards);
    }
    if (gameState?.currentIndex !== undefined) {
      setCurrentCardIndex(gameState.currentIndex);
    }
  }, [gameState, gamePhase]);

  // Check room status for non-host
  useEffect(() => {
    if (roomStatus === 'playing' && gamePhase === 'lobby') {
      setGamePhase('setup');
    }
  }, [roomStatus, gamePhase]);

  // Check if game phase changed (play again sync or start sync)
  useEffect(() => {
    if (gameState?.phase === 'setup' && gamePhase === 'complete') {
      // Host triggered play again - sync non-host back to setup
      setGamePhase('setup');
      setCurrentCardIndex(0);
      setGameCards([]);
    }
    if (gameState?.phase === 'playing' && gamePhase === 'setup' && gameState?.cards?.length > 0) {
      // Host started the deck - sync non-host to playing
      setGameCards(gameState.cards);
      setCurrentCardIndex(0);
      setGamePhase('playing');
    }
  }, [gameState?.phase, gameState?.cards, gamePhase]);

  const handleNextCard = async () => {
    const nextIndex = currentCardIndex + 1;

    if (nextIndex >= gameCards.length) {
      setGamePhase('complete');
      return;
    }

    setIsFlipping(true);
    setTimeout(() => {
      setCurrentCardIndex(nextIndex);
      setIsFlipping(false);

      if (isHost) {
        updateGameState({
          currentIndex: nextIndex,
        });
      }
    }, 300);
  };

  const handlePlayAgain = async () => {
    // Reset local state
    setGamePhase('setup');
    setCurrentCardIndex(0);
    setGameCards([]);

    // Update Firebase so both players sync
    if (isHost) {
      await updateGameState({
        currentIndex: 0,
        cards: [],
        phase: 'setup',
      });
    }
  };

  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find((c) => c.id === categoryId);
  };

  // Lobby phase
  if (gamePhase === 'lobby') {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: '#FBFAF2' }}>
        <RoomLobby
          gameId="deep-talk-deck"
          gameName="Deep Talk Deck"
          onGameStart={handleGameStart}
        />
      </div>
    );
  }

  // Setup phase
  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 font-heading" style={{ color: '#ff91af' }}>
            Deep Talk Deck
          </h2>
          <p className="text-center mb-8" style={{ color: '#ff91af' }}>
            Choose your categories and how many cards to draw
          </p>

          {/* Category Selection */}
          <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedCategories.includes(category.id)
                      ? `${category.color} shadow-md`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: selectedCategories.includes(category.id) ? undefined : '#FBFAF2' }}
                >
                  <span className="text-2xl block mb-1">{category.emoji}</span>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: '#ff91af' }}>Select at least one category</p>
          </div>

          {/* Card Count Selection */}
          <div className="rounded-2xl shadow-lg p-6 mb-6" style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Number of Cards</h3>
            <div className="grid grid-cols-3 gap-2">
              {CARD_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() => setTotalCards(count)}
                  className="py-3 rounded-xl font-medium transition-all duration-200"
                  style={{
                    backgroundColor: totalCards === count ? '#ff91af' : '#FBFAF2',
                    color: totalCards === count ? 'white' : '#666',
                    boxShadow: totalCards === count ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button onClick={handleStartDeck} className="w-full" size="lg">
            Draw Cards
          </Button>
        </div>
      </div>
    );
  }

  // Complete phase
  if (gamePhase === 'complete') {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">💕</div>
          <h2 className="text-3xl font-bold mb-4 font-heading" style={{ color: '#ff91af' }}>
            Beautiful Conversation!
          </h2>
          <p className="mb-8" style={{ color: '#ff91af' }}>
            You explored {gameCards.length} topics together. Keep the conversation going!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handlePlayAgain} className="flex-1" size="lg">
              Play Again
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary" className="flex-1" size="lg">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  const currentCard = gameCards[currentCardIndex];

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FBFAF2' }}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4" style={{ borderColor: '#ff91af', borderTopColor: 'transparent' }}></div>
          <p style={{ color: '#ff91af' }}>Loading cards...</p>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(currentCard.category);

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#FBFAF2' }}>
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={currentCardIndex + 1} total={gameCards.length} />
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl shadow-lg overflow-hidden mb-6 transition-all duration-300 ${
            isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-slide-up'
          }`}
          style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
        >
          {/* Category Header */}
          <div className={`px-6 py-3 ${categoryInfo.color} border-b-2`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{categoryInfo.emoji}</span>
              <span className="font-semibold text-gray-700">{categoryInfo.name}</span>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <p className="text-xl font-medium text-gray-800 text-center leading-relaxed">
              {currentCard.question}
            </p>
          </div>
        </div>

        {/* Next Button */}
        <Button onClick={handleNextCard} className="w-full" size="lg">
          {currentCardIndex < gameCards.length - 1 ? 'Next Card' : 'Finish'}
        </Button>

        {/* Card count indicator */}
        <p className="text-center mt-4 text-sm" style={{ color: '#ff91af' }}>
          Card {currentCardIndex + 1} of {gameCards.length}
        </p>
      </div>
    </div>
  );
}

export default DeepTalkDeck;
