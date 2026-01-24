function ProgressBar({ current, total, showLabel = true }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Progress</span>
          <span>{current} of {total}</span>
        </div>
      )}
      <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
