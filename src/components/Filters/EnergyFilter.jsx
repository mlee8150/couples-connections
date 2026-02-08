import { energyLabels } from '../../data/games';

function EnergyFilter({ value, onChange }) {
  const levels = [1, 2, 3];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium" style={{ color: '#ff91af' }}>Energy Level</label>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => onChange(value === level ? null : level)}
            className="flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: value === level ? '#ff91af' : '#FBFAF2',
              color: value === level ? 'white' : '#666',
              border: value === level ? '2px solid #ff91af' : '2px solid #fbcce7',
              boxShadow: value === level ? '0 4px 6px -1px rgba(255, 145, 175, 0.3)' : 'none'
            }}
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
