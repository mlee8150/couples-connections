import { useState, useMemo } from 'react';
import { GameCarousel } from '../components/Carousel';
import { EnergyFilter, PrepFilter } from '../components/Filters';
import { games } from '../data/games';
import { Heart } from '../components/shared';

function Home() {
  const [energyFilter, setEnergyFilter] = useState(null);
  const [prepFilter, setPrepFilter] = useState(null);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (energyFilter !== null && game.energyLevel !== energyFilter) {
        return false;
      }
      if (prepFilter !== null && game.prepLevel !== prepFilter) {
        return false;
      }
      return true;
    });
  }, [energyFilter, prepFilter]);

  const hasActiveFilters = energyFilter !== null || prepFilter !== null;

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 to-pink-500 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size="lg" className="text-white" />
            <h1 className="text-3xl md:text-4xl font-bold font-heading">
              Couples Connections
            </h1>
            <Heart size="lg" className="text-white" />
          </div>
          <p className="text-pink-100 text-lg">
            Strengthen your bond, one game at a time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Find Your Activity</h2>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setEnergyFilter(null);
                  setPrepFilter(null);
                }}
                className="text-sm text-pink-500 hover:text-pink-600 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="space-y-4">
            <EnergyFilter value={energyFilter} onChange={setEnergyFilter} />
            <PrepFilter value={prepFilter} onChange={setPrepFilter} />
          </div>
        </div>

        {/* Game Carousel */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Choose a Game
          </h2>
          <GameCarousel games={filteredGames} />
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center font-bold">1</span>
              <p>Choose a game that matches your mood and available time</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center font-bold">2</span>
              <p>Create a room and share the code with your partner</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center font-bold">3</span>
              <p>Play together and see each other's answers in real-time!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Made with <Heart size="sm" className="inline" /> for long-distance couples</p>
      </footer>
    </div>
  );
}

export default Home;
