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
    <div className="min-h-screen" style={{ backgroundColor: '#FBFAF2' }}>
      {/* Header */}
      <header className="text-white py-10 px-4 shadow-lg" style={{ background: 'linear-gradient(to bottom right, #ff91af, #fbcce7)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart size="lg" className="text-white/90" />
            <h1 className="text-3xl md:text-4xl font-bold font-heading tracking-wide">
              Couples Connections
            </h1>
            <Heart size="lg" className="text-white/90" />
          </div>
          <p className="text-lg font-light" style={{ color: '#ffecf2' }}>
            Strengthen your bond, one game at a time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="backdrop-blur-sm rounded-3xl shadow-md p-6 mb-8 border" style={{ backgroundColor: '#ffecf2', borderColor: '#fbcce7' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-warm-800">Find Your Activity</h2>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setEnergyFilter(null);
                  setPrepFilter(null);
                }}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: '#ff91af' }}
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
          <h2 className="text-xl font-semibold text-warm-800 mb-4 text-center">
            Choose a Game
          </h2>
          <GameCarousel games={filteredGames} />
        </div>

        {/* Info Section */}
        <div className="backdrop-blur-sm rounded-3xl shadow-md p-6 border" style={{ backgroundColor: '#ffecf2', borderColor: '#fbcce7' }}>
          <h3 className="text-lg font-semibold text-warm-800 mb-4">How It Works</h3>
          <div className="space-y-4 text-warm-600">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: '#ff91af' }}>1</span>
              <p>Choose a game that matches your mood and available time</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: '#ff91af' }}>2</span>
              <p>Create a room and share the code with your partner</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: '#ff91af' }}>3</span>
              <p>Play together and see each other's answers in real-time!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm" style={{ color: '#ff91af' }}>
        <p>Made with <Heart size="sm" className="inline" style={{ color: '#ff91af' }} /> for long-distance couples</p>
      </footer>
    </div>
  );
}

export default Home;
