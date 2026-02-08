import { useNavigate } from 'react-router-dom';
import { energyLabels, prepLabels } from '../../data/games';

function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(game.path)}
      className="backdrop-blur-sm rounded-3xl shadow-md p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      style={{ backgroundColor: '#ffecf2', border: '1px solid #fbcce7' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm"
        style={{ backgroundColor: '#fbcce7' }}
      >
        <span className="text-3xl">{game.icon}</span>
      </div>

      <h3 className="text-xl font-bold text-warm-800 text-center mb-2 font-heading">
        {game.title}
      </h3>

      <p className="text-warm-600 text-center text-sm mb-4">
        {game.description}
      </p>

      <div className="flex justify-center gap-2">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#fbcce7', color: '#ff91af' }}
        >
          {energyLabels[game.energyLevel].label}
        </span>
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: '#ff91af' }}
        >
          {prepLabels[game.prepLevel].label}
        </span>
      </div>
    </div>
  );
}

export default GameCard;
