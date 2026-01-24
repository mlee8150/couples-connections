import { useNavigate } from 'react-router-dom';
import { energyLabels, prepLabels } from '../../data/games';

function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(game.path)}
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 mx-auto`}>
        <span className="text-3xl">{game.icon}</span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 text-center mb-2 font-heading">
        {game.title}
      </h3>

      <p className="text-gray-600 text-center text-sm mb-4">
        {game.description}
      </p>

      <div className="flex justify-center gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
          {energyLabels[game.energyLevel].label}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
          {prepLabels[game.prepLevel].label}
        </span>
      </div>
    </div>
  );
}

export default GameCard;
