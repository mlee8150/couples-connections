import { useState } from 'react';
import GameCard from './GameCard';

function GameCarousel({ games }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💔</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No games match your filters</h3>
        <p className="text-gray-500">Try adjusting your energy or prep filters to see more games.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Navigation Arrows */}
      {games.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-pink-500 hover:bg-pink-50 transition-colors"
            aria-label="Previous game"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-pink-500 hover:bg-pink-50 transition-colors"
            aria-label="Next game"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Cards Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {games.map((game) => (
            <div key={game.id} className="w-full flex-shrink-0 px-2">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {games.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-pink-500 w-4' : 'bg-pink-200'
              }`}
              aria-label={`Go to game ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GameCarousel;
