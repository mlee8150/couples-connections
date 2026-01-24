import { energyLabels } from '../../data/games';

function EnergyFilter({ value, onChange }) {
  const levels = [1, 2, 3];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Energy Level</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onChange(value === level ? null : level)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              value === level
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-pink-200 hover:border-pink-400'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>{energyLabels[level].label}</span>
              <span className="text-xs opacity-75">{energyLabels[level].description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default EnergyFilter;
