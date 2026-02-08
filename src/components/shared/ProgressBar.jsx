function ProgressBar({ current, total, showLabel = true }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm" style={{ color: '#ff91af' }}>
          <span>Progress</span>
          <span>{current} of {total}</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#fbcce7' }}>
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: '#ff91af' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
